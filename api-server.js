/**
 * OpenClaw Pixel Office - API Server
 * Reads OpenClaw state files and exposes as HTTP API.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3004;
const SESSIONS_FILE = path.join(process.env.HOME || '/root', '.openclaw/agents/main/sessions/sessions.json');

function readJson(filePath, fallback = null) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return fallback;
  }
}

function getAgents() {
  const sessions = readJson(SESSIONS_FILE, {});
  const agents = [];
  
  // Map sessions to agents
  for (const [key, session] of Object.entries(sessions)) {
    const parts = key.split(':');
    const agentId = parts[1] || 'main';
    const channel = parts[2] || 'local';
    
    // Determine agent type from key
    let type = 'local';
    let name = 'Claw';
    
    if (channel === 'telegram') {
      type = 'telegram';
      name = 'Claw-Telegram';
    } else if (channel === 'direct') {
      type = 'direct';
      name = 'Claw-Direct';
    } else if (key.includes('dreaming')) {
      type = 'dreaming';
      name = `Dream-${parts[4]?.slice(-4) || 'light'}`;
    }
    
    // Calculate status based on session activity
    const lastUpdate = session.updatedAt || 0;
    const now = Date.now();
    const minutesSinceUpdate = (now - lastUpdate) / 1000 / 60;
    
    let status = 'idle';
    if (minutesSinceUpdate < 5) {
      status = 'working';
    } else if (minutesSinceUpdate < 60) {
      status = 'idle';
    } else {
      status = 'offline';
    }
    
    // spec: gateway/openai-http-api#model-list-and-agent-routing (exclude sub-agents)
    const isSubAgent = type === 'dreaming' || key.includes('dreaming') || key.includes(':sub:');
    if (!isSubAgent) {
      agents.push({
        id: session.sessionId || key,
        name,
        status,
        type,
        channel,
        model: `openclaw/${agentId}`, // spec: gateway/openai-http-api#agent-first-model-contract
        sessionKey: key,
        lastUpdate: new Date(lastUpdate).toISOString(),
        task: session.currentTask || null
      });
    }
  }
  
  return agents;
}

function handleRequest(req, res) {
  // Security and CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  res.setHeader('Vary', 'Origin');

  // Strict method validation
  if (req.method !== 'GET' && req.method !== 'OPTIONS') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  
  // Agents list endpoint
  if (url.pathname === '/api/agents') {
    const agents = getAgents();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(agents));
    return;
  }
  
  // Single agent details
  if (url.pathname.startsWith('/api/agents/')) {
    let agentId = url.pathname.replace('/api/agents/', '');
    // Support URL-encoded model IDs like openclaw%2Fdefault
    agentId = decodeURIComponent(agentId);

    // spec: gateway/openai-http-api#agent-first-model-contract (support openclaw: and openclaw/ formats)
    const normalizedId = agentId.replace(':', '/');
    const compatId = agentId.includes('/') ? agentId.replace('/', ':') : agentId;

    const agents = getAgents();
    const agent = agents.find(a =>
      a.id === agentId ||
      a.sessionKey === agentId ||
      a.model === agentId ||
      a.model === normalizedId ||
      a.model === compatId
    );
    
    if (agent) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(agent));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Agent not found' }));
    }
    return;
  }
  
  // Sessions list
  if (url.pathname === '/api/sessions') {
    const sessions = readJson(SESSIONS_FILE, {});
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(Object.entries(sessions).map(([key, s]) => ({
      key,
      sessionId: s.sessionId,
      chatType: s.chatType,
      updatedAt: s.updatedAt
    }))));
    return;
  }
  
  // Gateway health (from OpenClaw config)
  if (url.pathname === '/api/health') {
    const health = {
      ok: true,
      status: 'live',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health));
    return;
  }
  
  // Not found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
}

const server = http.createServer(handleRequest);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`OpenClaw API Server running on port ${PORT}`);
  console.log(`Reading sessions from: ${SESSIONS_FILE}`);
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});
