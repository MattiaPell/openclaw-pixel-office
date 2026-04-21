OpenClaw Pixel Office — Task Planner
Backlog completo di micro-funzioni e feature raccolte analizzando i tre progetti di riferimento dell'ecosistema OpenClaw:

openclaw-studio (grp06) — dashboard WebSocket, agent management, chat UI, approval flows
OpenClaw-bot-review (xmanrui) — bot cards, token stats, session management, pixel office
openclaw-mission-control (abhi1693) — orchestrazione multi-agent, governance, API-first
Ogni task è pensato per essere assegnabile a un singolo agente (Forge, Warden, Pixel, Scribe) e completabile in una sessione autonoma.

Legenda priorità
Simbolo	Priorità	Criterio
🔴	Critica	Blocca l'usabilità di base o è prerequisito di altri task
🟠	Alta	Alto impatto utente, nessuna dipendenza bloccante
🟡	Media	Migliora l'esperienza ma non è urgente
🟢	Bassa	Nice-to-have, polish, ottimizzazione
Simbolo	Agente
🔨	Forge — implementazione feature
🔰	Warden — compliance gateway
🎨	Pixel — visual/pixel art
📖	Scribe — documentazione
AREA 1 — Gateway & Connessione
Task fondamentali per stabilire e mantenere la connessione al gateway OpenClaw.

ID	Priorità	Agente	Task	Note
G-01	🔴	🔨	Implementare handshake WebSocket completo: attendere connect.challenge, estrarre nonce, firmare, inviare connect con minProtocol: 3 / maxProtocol: 3	Prerequisito assoluto per tutto il resto
G-02	🔴	🔨	Leggere hello-ok.policy e applicare tickIntervalMs, maxPayload, maxBufferedBytes a runtime — non hardcodati	hello-ok.policy è autoritativo
G-03	🔴	🔨	Persistere hello-ok.auth.deviceToken in localStorage e riutilizzarlo al reconnect come auth.token	Evita re-pairing ad ogni reload
G-04	🔴	🔰	Audit: verificare che il framing WS sia corretto (type: "req"/"res"/"event") su tutti i messaggi inviati	Spec: gateway/protocol#framing
G-05	🔴	🔨	Implementare reconnect con backoff esponenziale: iniziale 1000ms, max 30000ms, reset su connect riuscito	Spec: gateway/protocol#client-constants
G-06	🟠	🔨	Gestire tick silence timeout: chiudere con code 4000 se nessun frame ricevuto in tickIntervalMs * 2 ms	Evita connessioni zombie
G-07	🟠	🔨	Implementare AUTH_TOKEN_MISMATCH retry una sola volta con device token cached, solo su endpoint trusted (loopback o wss:// con fingerprint pinnato)	Non riprovare all'infinito
G-08	🟠	🔨	Indicatore di stato connessione nell'header: Connected / Reconnecting (3s) / Disconnected con colore semaforo	Visibilità immediata
G-09	🟡	🔨	Mostrare server.version e server.connId ricevuti nel hello-ok in un tooltip o nella pagina Settings	Debug utile
G-10	🟡	🔨	Configurazione manuale URL gateway + token dalla UI (Settings page), con salvataggio in localStorage	Da openclaw-studio
G-11	🟡	🔰	Audit: scope set riusato su reconnect con stored device token — non collassare a scope impliciti	Spec: gateway/protocol#auth
G-12	🟢	🔨	Mostrare hello-ok.features.methods disponibili in una pagina di diagnostica nascosta	Dev tool
AREA 2 — Gateway Health & Status
Monitoraggio dello stato del gateway in tempo reale.

ID	Priorità	Agente	Task	Note
H-01	🔴	🔨	Chiamare health via WS al connect e ogni 10s, mostrare indicatore healthy/degraded/down nell'header	Da xmanrui: 10s auto-polling
H-02	🟠	🔨	Sottoscrivere all'evento health (WS push) per aggiornare l'indicatore senza polling se il gateway lo emette	Più reattivo del polling
H-03	🟠	🔨	Chiamare status e mostrare: versione gateway, uptime, provider attivi, canali connessi	Da openclaw-studio
H-04	🟡	🔨	Pulsante "Check Gateway" one-click che forza una chiamata health immediata e mostra latenza round-trip	UX rapida
H-05	🟡	🔨	Storico health: grafico mini sparkline degli ultimi 20 check (verde/rosso per slot)	Visual feedback
H-06	🟡	🔨	Alert visivo se il gateway non risponde per più di 30s: banner rosso con countdown al prossimo tentativo	Da xmanrui: alert center
H-07	🟢	🔨	Esportare il log health in JSON dal pannello diagnostica	Debug
AREA 3 — Agenti
Visualizzazione e gestione degli agenti OpenClaw.

ID	Priorità	Agente	Task	Note
A-01	🔴	🔨	Chiamare agents.list via WS e renderizzare card per ogni agente: nome, emoji, modello, status	Core feature
A-02	🔴	🔨	Creare nuovo agente via agents.create — form con nome, emoji, descrizione, modello	CRUD base
A-03	🔴	🔨	Modificare agente via agents.update — edit inline o modal	CRUD base
A-04	🔴	🔨	Eliminare agente via agents.delete — con confirm dialog	CRUD base
A-05	🟠	🔨	Sottoscrivere a sessions.changed per aggiornare lo stato degli agenti in real-time senza polling	Da openclaw-studio
A-06	🟠	🔨	Card agente: mostrare stato real-time (active/idle/error/offline) con dot colorato	Da xmanrui
A-07	🟠	🔨	Card agente: mostrare numero sessioni attive, token totali utilizzati oggi	Da xmanrui
A-08	🟠	🔨	Chiamare agent.identity.get per mostrare l'identità effettiva (system prompt excerpt, persona)	Da openclaw-studio
A-09	🟡	🔨	Search/filter agenti per nome o modello — input con debounce 300ms	UX
A-10	🟡	🔨	Ordinamento agenti: per nome, per ultimo utilizzo, per token consumati	UX
A-11	🟡	🔨	Agente detail page/drawer: mostra tutte le sessioni, strumenti disponibili, config completa	Da xmanrui
A-12	🟡	🔨	agents.files.list + agents.files.get: visualizzare i file workspace dell'agente (AGENTS.md, CLAUDE.md, ecc.)	Da openclaw-studio
A-13	🟡	🔨	agents.files.set: editor inline per modificare i file workspace dell'agente dalla UI	Avanzato
A-14	🟢	🔨	Duplicare agente (crea copia con stesso config)	Convenience
A-15	🟢	🔨	Export config agente come JSON scaricabile	Backup
A-16	🟢	🔨	Import config agente da JSON	Restore
AREA 4 — Sessioni
Gestione e monitoraggio delle sessioni di conversazione.

ID	Priorità	Agente	Task	Note
S-01	🔴	🔨	Chiamare sessions.list e mostrare tabella sessioni per agente: key, tipo, ultimo messaggio, timestamp	Da xmanrui
S-02	🟠	🔨	sessions.subscribe + gestire evento session.message per aggiornare la lista in real-time	WS push
S-03	🟠	🔨	Creare nuova sessione via sessions.create — selezione agente e canale target	Da openclaw-studio
S-04	🟠	🔨	Inviare messaggio in sessione esistente via sessions.send — chat input nella session detail	Da openclaw-studio
S-05	🟠	🔨	Visualizzare transcript sessione via chat.history con strip automatico di tool-call XML e token NO_REPLY	Spec: gateway/protocol#session-control
S-06	🟠	🔨	Rilevare tipo sessione: DM / gruppo / cron — badge colorato in lista	Da xmanrui
S-07	🟡	🔨	sessions.usage per mostrare token input/output per sessione con barra progress	Da xmanrui
S-08	🟡	🔨	sessions.usage.timeseries — grafico token per ora/giorno in session detail	Da xmanrui
S-09	🟡	🔨	Interrompere sessione attiva via sessions.abort — pulsante stop con confirm	Da openclaw-studio
S-10	🟡	🔨	Resettare sessione via sessions.reset — svuota history ma mantiene config	Da openclaw-studio
S-11	🟡	🔨	Eliminare sessione via sessions.delete — con confirm	Da openclaw-studio
S-12	🟡	🔨	Compattare sessione via sessions.compact — con indicazione bytes risparmiati	Da openclaw-studio
S-13	🟡	🔨	sessions.preview — anteprima ultimi N messaggi in hover sulla card sessione	UX rapida
S-14	🟡	🔨	Test connettività sessione: one-click per verificare che il canale target risponda	Da xmanrui
S-15	🟢	🔨	Export transcript sessione in JSON o TXT	Da xmanrui
S-16	🟢	🔨	Export transcript sessione in CSV (ogni riga = un messaggio)	
S-17	🟢	🔨	sessions.steer: input di steering per reindirizzare un'agente in corsa	Avanzato
S-18	🟢	🔨	sessions.patch: modifica metadata sessione (label, priorità) dalla UI	
AREA 5 — Modelli
Visualizzazione e gestione dei modelli disponibili.

ID	Priorità	Agente	Task	Note
M-01	🔴	🔨	Chiamare models.list e renderizzare lista modelli con: nome, provider, context window, max output	Da xmanrui
M-02	🟠	🔨	Mostrare per ogni modello: reasoning: true/false, tipi di input supportati (text/image)	Da xmanrui
M-03	🟠	🔨	Mostrare costo per modello: input $/1k token, output $/1k token, cache read/write	Da xmanrui
M-04	🟠	🔨	Chiamare usage.status per mostrare quota rimanente per provider con barra progress	Da xmanrui
M-05	🟡	🔨	Test modello one-click: input libero → risposta diretta senza aprire una sessione	Da xmanrui
M-06	🟡	🔨	Filter modelli per provider (Anthropic / OpenAI / Ollama / LM Studio / ecc.)	UX
M-07	🟡	🔨	Chiamare usage.cost con date range e mostrare costo aggregato per modello/provider	Da xmanrui
M-08	🟡	🔨	Badge "local" su modelli Ollama/LM Studio/cli-backend — distinti dai modelli cloud	Da local-models doc
M-09	🟢	🔨	Confronto due modelli affiancato: context window, costo, reasoning support	UX avanzata
M-10	🟢	🔨	Ordinamento modelli per costo crescente / context window decrescente	
AREA 6 — Token Usage & Analytics
Dashboard di consumo token e statistiche di utilizzo.

ID	Priorità	Agente	Task	Note
U-01	🔴	🔨	Widget "Today's usage": token totali input+output di oggi aggregati da sessions.usage	KPI principale
U-02	🟠	🔨	Grafico a barre: token per giorno ultimi 7 giorni da sessions.usage.timeseries	Da xmanrui
U-03	🟠	🔨	Grafico a barre: token per agente (breakdown per agent ID)	Da xmanrui
U-04	🟠	🔨	Costo stimato giornaliero: token × costo modello da usage.cost	Da xmanrui
U-05	🟡	🔨	Selettore periodo: daily / weekly / monthly per tutti i grafici analytics	Da xmanrui
U-06	🟡	🔨	Tempo medio di risposta per agente — calcolato dai log sessions.usage.logs	Da xmanrui
U-07	🟡	🔨	Tabella top-5 sessioni più costose della settimana	Insight
U-08	🟡	🔨	doctor.memory.status — stato memoria vettoriale/embedding nella pagina diagnostica	Da openclaw-studio
U-09	🟢	🔨	Export analytics in CSV per periodo selezionato	
U-10	🟢	🔨	Proiezione costo fine mese basata su consumo degli ultimi 7 giorni	
AREA 7 — Chat UI
Interfaccia di chat diretta con gli agenti.

ID	Priorità	Agente	Task	Note
C-01	🔴	🔨	Chat panel: input + invio messaggio via chat.send, streaming risposta via evento chat	Da openclaw-studio
C-02	🔴	🔨	Rendering streaming: mostra token in arrivo progressivamente (SSE-style)	Da openclaw-studio
C-03	🟠	🔨	Visualizzare tool call in corso nel transcript: nome tool, args, spinner	Da openclaw-studio
C-04	🟠	🔨	Visualizzare "thinking trace" se il modello supporta reasoning	Da openclaw-studio
C-05	🟠	🔨	Pulsante "Stop" che chiama chat.abort durante una risposta in corso	Da openclaw-studio
C-06	🟡	🔨	Selezione agente nel chat panel — dropdown con lista da agents.list	UX
C-07	🟡	🔨	History scroll con lazy load dei messaggi precedenti	Performance
C-08	🟡	🔨	Markdown rendering nei messaggi (bold, code block, liste)	UX
C-09	🟡	🔨	Copy-to-clipboard su ogni messaggio — bottone hover	UX
C-10	🟡	🔨	Timestamp relativo su ogni messaggio ("2m ago", "yesterday")	UX
C-11	🟢	🔨	Autocomplete slash-commands dalla lista commands.list	Da openclaw-studio
C-12	🟢	🔨	Keyboard shortcut Ctrl+Enter per inviare, Esc per cancellare	UX
C-13	🟢	🔨	chat.inject — iniettare un messaggio di sistema nel transcript da UI admin	Da openclaw-studio
AREA 8 — Approvazioni (Exec Approvals)
Gestione delle richieste di approvazione per azioni sensibili degli agenti.

ID	Priorità	Agente	Task	Note
AP-01	🔴	🔨	Ascoltare evento exec.approval.requested e mostrare banner/modal con i dettagli del comando da approvare	Da openclaw-studio
AP-02	🔴	🔨	Pulsante "Approve" che chiama exec.approval.resolve con approved: true (richiede scope operator.approvals)	Core governance
AP-03	🔴	🔨	Pulsante "Deny" che chiama exec.approval.resolve con approved: false	Core governance
AP-04	🟠	🔨	Lista approvazioni pendenti via exec.approval.list — badge count nell'header	Da openclaw-studio
AP-05	🟠	🔨	Detail approvazione: mostrare systemRunPlan (argv, cwd, rawCommand, sessionKey)	Spec obbliga systemRunPlan
AP-06	🟠	🔨	Ascoltare exec.approval.resolved per aggiornare la lista in real-time	WS push
AP-07	🟡	🔨	Storico approvazioni: lista di tutte le decisioni passate con filtro approved/denied	Da mission-control
AP-08	🟡	🔨	exec.approvals.get — visualizzare la policy di approvazione corrente del gateway	Da openclaw-studio
AP-09	🟡	🔨	exec.approvals.set — modificare la policy di approvazione dalla UI (richiede operator.admin)	Governance
AP-10	🟡	🔨	Notifica sonora/visiva quando arriva una nuova richiesta di approvazione	UX urgency
AP-11	🟡	🔨	plugin.approval.request + plugin.approval.resolve — approvazioni per plugin	Da openclaw-studio
AP-12	🟢	🔰	Audit: verificare che exec.approval.request con host=node includa sempre systemRunPlan	Spec: gateway/protocol#exec-approvals
AREA 9 — Cron Jobs & Automazione
Gestione dei job schedulati.

ID	Priorità	Agente	Task	Note
CR-01	🟠	🔨	cron.list — tabella job cron: nome, schedule, agente, ultimo run, stato	Da openclaw-studio
CR-02	🟠	🔨	cron.add — form per creare nuovo cron job (nome, cron expression, messaggio, agente target)	Da openclaw-studio
CR-03	🟠	🔨	cron.update — edit inline di un job esistente	CRUD
CR-04	🟠	🔨	cron.remove — elimina job con confirm	CRUD
CR-05	🟡	🔨	cron.run — trigger manuale immediato di un job	Debug/test
CR-06	🟡	🔨	cron.status — stato del singolo job (running/paused/error) con badge colorato	UX
CR-07	🟡	🔨	cron.runs — storico delle ultime N esecuzioni di un job con output e durata	Da openclaw-studio
CR-08	🟡	🔨	Ascoltare evento cron per aggiornare lo stato in real-time senza polling	WS push
CR-09	🟡	🔨	wake — schedule un wake immediato o al prossimo heartbeat dalla UI	Automazione manuale
CR-10	🟢	🔨	Cron expression validator inline nel form di creazione	UX
CR-11	🟢	🔨	Prossimo run stimato calcolato dalla cron expression	UX
AREA 10 — Skills & Strumenti
Browser delle skill e degli strumenti disponibili.

ID	Priorità	Agente	Task	Note
SK-01	🟠	🔨	skills.status — lista skill installate con nome, tipo (built-in/extension/custom), stato enabled/disabled	Da xmanrui
SK-02	🟠	🔨	Filter skill per tipo e search per nome	Da xmanrui
SK-03	🟠	🔨	tools.catalog — lista strumenti disponibili per agente con source (core/plugin)	Da openclaw-studio
SK-04	🟡	🔨	commands.list — lista comandi slash disponibili per agente con aliases	Da openclaw-studio
SK-05	🟡	🔨	skills.search — ricerca skill su ClawHub con risultati istantanei	Da openclaw-studio
SK-06	🟡	🔨	skills.install — installa skill da ClawHub con progress indicator	Da openclaw-studio
SK-07	🟡	🔨	skills.update — aggiorna skill esistenti (tutte o singola) con diff changelog	Da openclaw-studio
SK-08	🟡	🔨	tools.effective — strumenti effettivamente attivi per una sessione specifica	Da openclaw-studio
SK-09	🟢	🔨	skills.detail — scheda dettaglio skill: descrizione, versione, requisiti, config	Da xmanrui
SK-10	🟢	🔨	Toggle enable/disable singola skill via skills.update config mode	Da openclaw-studio
AREA 11 — Canali & Piattaforme
Stato e gestione dei canali di messaggistica collegati.

ID	Priorità	Agente	Task	Note
CH-01	🟠	🔨	channels.status — lista canali (Feishu, Discord, Telegram, ecc.) con stato connected/disconnected	Da xmanrui
CH-02	🟠	🔨	Test connettività canale one-click — verifica che il binding risponda	Da xmanrui
CH-03	🟡	🔨	channels.logout — logout da un canale specifico con confirm	Da openclaw-studio
CH-04	🟡	🔨	web.login.start + web.login.wait — QR login flow per canali web-based nella UI	Da openclaw-studio
CH-05	🟡	🔨	Badge per canale: numero account collegati, sessioni attive per account	Da xmanrui
CH-06	🟢	🔨	push.test — invia push test APNs a un nodo iOS registrato	Da openclaw-studio
AREA 12 — Nodi
Gestione dei nodi (device capability host).

ID	Priorità	Agente	Task	Note
N-01	🟠	🔨	node.list — tabella nodi connessi con: nome, piattaforma, caps dichiarate, stato	Da openclaw-studio
N-02	🟠	🔨	node.describe — detail panel nodo: comandi disponibili, permissions, ultimo heartbeat	Da openclaw-studio
N-03	🟠	🔨	Ascoltare node.pair.requested — mostrare banner "New node wants to pair" con approve/reject	Da openclaw-studio
N-04	🟠	🔨	node.pair.approve + node.pair.reject — gestione pairing dalla UI	Da openclaw-studio
N-05	🟡	🔨	node.pair.list — lista nodi pending + approvati con status	Da openclaw-studio
N-06	🟡	🔨	node.rename — rinomina nodo dalla UI	UX
N-07	🟡	🔨	Ascoltare node.pair.resolved per aggiornare la lista in real-time	WS push
N-08	🟢	🔨	node.invoke — invia comando manuale a un nodo selezionato (per debug)	Dev tool
N-09	🟢	🔰	Audit: verificare scope escalation rules per node.pair.approve con comandi system.run	Spec: gateway/protocol#caps
AREA 13 — Device Pairing & Token
Gestione dei device token e pairing.

ID	Priorità	Agente	Task	Note
D-01	🟠	🔨	device.pair.list — lista device abbinati con ruolo, scope, ultimo utilizzo	Da openclaw-studio
D-02	🟡	🔨	device.pair.remove — rimuovi device abbinato con confirm	Sicurezza
D-03	🟡	🔨	device.token.rotate — ruota il token di un device abbinato	Sicurezza
D-04	🟡	🔨	device.token.revoke — revoca token con confirm	Sicurezza
D-05	🟢	🔰	Audit: device.token.rotate non può espandere il scope oltre quello approvato al pairing	Spec: gateway/protocol#auth
AREA 14 — Configurazione Gateway
Lettura e modifica della configurazione del gateway dalla UI.

ID	Priorità	Agente	Task	Note
CF-01	🟠	🔨	config.get — visualizzare la config corrente del gateway in un editor JSON con syntax highlight	Da openclaw-studio
CF-02	🟠	🔨	config.schema — usare lo schema per validare inline le modifiche prima di salvarle	Da openclaw-studio
CF-03	🟡	🔨	config.patch — salva una modifica parziale con feedback success/error	Da openclaw-studio
CF-04	🟡	🔨	config.schema.lookup — breadcrumb drill-down dello schema per navigare le chiavi nested	Da openclaw-studio
CF-05	🟡	🔨	Diff viewer: mostra le differenze tra config corrente e quella salvata prima del patch	UX sicurezza
CF-06	🟢	🔨	secrets.reload — pulsante "Reload Secrets" con feedback	Da openclaw-studio
CF-07	🟢	🔨	talk.config — visualizzare config TTS/Talk (con includeSecrets: false di default)	Da openclaw-studio
AREA 15 — Presenza & System Events
Monitoraggio della presenza dei client connessi.

ID	Priorità	Agente	Task	Note
PR-01	🟡	🔨	system-presence — lista device connessi (operator/node) con deviceId, ruolo, scope	Da openclaw-studio
PR-02	🟡	🔨	Ascoltare evento presence per aggiornare la lista in real-time	WS push
PR-03	🟡	🔨	Raggruppare per device (un device può apparire come operator E node — mostrare una riga unica)	Spec: gateway/protocol#presence
PR-04	🟢	🔨	Indicatore "You" accanto al device corrente nella lista presenza	UX
AREA 16 — TTS & Voice
Gestione del sistema text-to-speech.

ID	Priorità	Agente	Task	Note
T-01	🟡	🔨	tts.status — mostrare stato TTS: enabled, provider attivo, provider fallback	Da openclaw-studio
T-02	🟡	🔨	tts.providers — lista provider TTS disponibili con config state	Da openclaw-studio
T-03	🟡	🔨	tts.enable / tts.disable — toggle TTS dalla UI	Da openclaw-studio
T-04	🟡	🔨	tts.setProvider — cambio provider TTS da dropdown	Da openclaw-studio
T-05	🟢	🔨	tts.convert — input testo → riproduci audio direttamente dal browser	Demo/test
T-06	🟢	🔨	voicewake.get + voicewake.set — gestione wake-word triggers dalla UI	Da openclaw-studio
AREA 17 — HTTP Endpoints (OpenAI / Responses / Tools)
Interfaccia per le API HTTP esposte dal gateway.

ID	Priorità	Agente	Task	Note
HT-01	🟠	🔰	Audit: verificare che il campo model nelle chiamate /v1/chat/completions usi formato openclaw/<agentId> — mai raw provider string	Spec: gateway/openai-http-api
HT-02	🟠	🔰	Audit: override modello backend via header x-openclaw-model — non nel campo model	Spec: gateway/openai-http-api
HT-03	🟠	🔰	Audit: /v1/models response trattata come lista agent-target, non come catalogo provider	Spec: gateway/openai-http-api
HT-04	🟡	🔨	UI panel "API Endpoints": mostra se chatCompletions e responses sono enabled/disabled con toggle	Da gateway config
HT-05	🟡	🔨	Playground /v1/chat/completions: form per inviare richiesta HTTP e visualizzare risposta raw	Dev tool
HT-06	🟡	🔨	Playground /tools/invoke: seleziona tool, compila args JSON, vedi risposta { ok, result }	Dev tool
HT-07	🟡	🔰	Audit: /tools/invoke — UI non tenta di chiamare tool nella deny list hardcoded	Spec: gateway/tools-invoke-http-api
HT-08	🟢	🔰	Audit: SSE events da /v1/responses usano i tipi corretti (response.output_text.delta, ecc.)	Spec: gateway/openresponses-http-api
AREA 18 — Alert Center
Sistema di notifiche e alerting.

ID	Priorità	Agente	Task	Note
AL-01	🟠	🔨	Alert rule: "modello non disponibile" — rileva usage.status con quota esaurita e mostra banner	Da xmanrui
AL-02	🟠	🔨	Alert rule: "agente non risponde da X minuti" — basato su assenza di sessioni attive	Da xmanrui
AL-03	🟡	🔨	Centro notifiche: pannello laterale con lista alert storici (letti/non letti)	Da xmanrui
AL-04	🟡	🔨	Dismiss singolo alert o "mark all as read"	UX
AL-05	🟡	🔨	Alert rule configurabile: soglia token/giorno — avvisa quando si supera il budget	
AL-06	🟡	🔨	Ascoltare evento shutdown del gateway — mostrare banner "Gateway shutting down"	Da gateway events
AL-07	🟢	🔨	Notifica browser (Notification API) quando arriva una exec approval request	UX urgency
AL-08	🟢	🔨	Notifica browser quando un agente completa un task lungo	
AREA 19 — Kanban & Task Management
Board per la gestione dei task degli agenti (da mission-control).

ID	Priorità	Agente	Task	Note
K-01	🟠	🔨	Board Kanban 3 colonne: Todo / In Progress / Done — drag & drop tra colonne	Da mission-control
K-02	🟠	🔨	Crea task: titolo, descrizione, agente assegnato, priorità, tag	Da mission-control
K-03	🟠	🔨	Edit task inline: modifica tutti i campi senza aprire una nuova pagina	CRUD
K-04	🟠	🔨	Elimina task con confirm	CRUD
K-05	🟡	🔨	Assegna task a sessione esistente — collega il task a una sessionKey	Da mission-control
K-06	🟡	🔨	Filter board per agente assegnato o per tag	UX
K-07	🟡	🔨	Priorità task: Critical/High/Medium/Low con colore bordo card	Da mission-control
K-08	🟡	🔨	Tag system: aggiungi tag liberi alle card, filter per tag	Da mission-control
K-09	🟡	🔨	Persistenza task in localStorage o API route locale	Offline first
K-10	🟢	🔨	Due date su task con badge "overdue" in rosso	
K-11	🟢	🔨	Board Groups: raggruppa più board sotto una categoria (da mission-control)	Avanzato
K-12	🟢	🔨	Export board in JSON	
AREA 20 — Activity Log
Log cronologico delle azioni nel sistema.

ID	Priorità	Agente	Task	Note
AC-01	🟠	🔨	logs.tail — visualizzare gli ultimi N log del gateway con auto-scroll	Da openclaw-studio
AC-02	🟠	🔨	Filter log per livello: info/warn/error	UX
AC-03	🟡	🔨	Ricerca full-text nei log con highlight dei match	UX
AC-04	🟡	🔨	Auto-refresh log con toggle on/off e configurazione intervallo	Da xmanrui
AC-05	🟡	🔨	Storico eventi WS (exec approvals, node pairing, cron runs) in timeline unificata	Da mission-control
AC-06	🟢	🔨	Export log filtrato in TXT/JSON	
AC-07	🟢	🔨	last-heartbeat — mostrare l'ultimo heartbeat in fondo alla pagina log	Da openclaw-studio
AREA 21 — Pixel Office (Visual)
Upgrade progressivi dell'ufficio virtuale e dei personaggi agente.

ID	Priorità	Agente	Task	Note
PX-01	🔴	🎨	Floor tile texture con repeating-linear-gradient — distingui pavimento da muri	Base visiva
PX-02	🔴	🎨	Agenti come sprite 16×16 SVG inline con testa/corpo/gambe — sostituisci emoji/cerchi	Base character
PX-03	🟠	🎨	Idle animation: translateY(0 → -2px) breathing bob in loop su ogni agente	Animazione base
PX-04	🟠	🎨	Walk cycle: 4 frame, steps(4), agenti si muovono camminando nella stanza	Da xmanrui
PX-05	🟠	🎨	Furniture con shading pixel art: desk con ledge shadow, sedia con seduta scura	Livello 4 env
PX-06	🟠	🎨	State badge su ogni agente: dot verde/giallo/rosso/grigio in base a agent.status	UX + visual
PX-07	🟡	🎨	Colore sprite derivato dal nome/emoji dell'agente — ogni agente ha palette unica	Livello 5 char
PX-08	🟡	🎨	Monitor con glow animation: opacity 1→0.85→1, steps(2), 3s loop	Livello 7 env
PX-09	🟡	🎨	Finestra con luce radiale: rgba(255,220,100,0.15) che simula luce solare	Livello 6 env
PX-10	🟡	🎨	Animazione "typing": agente che digita quando status === "active"	Livello 7 char
PX-11	🟡	🎨	Pianta con sway animation: rotate(-2deg → 2deg), 2.5s, ease-in-out	Livello 7 env
PX-12	🟡	🎨	Nome agente sopra sprite con pixel font (es. Press Start 2P da Google Fonts)	UX
PX-13	🟢	🎨	Animazione "sleeping": zZz overlay + slow bob su agenti offline da >5min	Livello 7 char
PX-14	🟢	🎨	Reaction "celebrate": animazione salto quando un task viene completato	Livello 8 char
PX-15	🟢	🎨	Ciclo giorno/notte: colori ambiente cambiano gradualmente ogni ora (CSS var transition)	Livello 8 env
PX-16	🟢	🎨	Particelle ambient: dust particles CSS floating nel background	Livello 7 env
AREA 22 — UI/UX Generale
Miglioramenti all'interfaccia generale della dashboard.

ID	Priorità	Agente	Task	Note
UX-01	🔴	🔨	Settings page: input gateway URL + token con save in localStorage — prerequisito per tutto	Foundation
UX-02	🟠	🔨	Dark/light/retro theme toggle con CSS variables	Da xmanrui
UX-03	🟠	🔨	Sidebar collassabile — icone sole in modalità collapsed, testo + icone in expanded	UX
UX-04	🟠	🔨	Auto-refresh interval configurabile: manuale / 10s / 30s / 1min / 5min	Da xmanrui
UX-05	🟡	🔨	Loading skeleton su ogni card/tabella — no layout shift durante il fetch	UX
UX-06	🟡	🔨	Empty state illustrati: messaggi chiari quando nessun agente/sessione/task	UX
UX-07	🟡	🔨	Error boundary globale con messaggio di errore + retry button	Robustezza
UX-08	🟡	🔨	Toast notification system: success/error/info — sostituisci alert()	UX
UX-09	🟡	🔨	Breadcrumb navigation nelle pagine nested (es. Agent > Session > Message)	Da mission-control
UX-10	🟡	🔨	Keyboard shortcut ? per aprire modal con tutti gli shortcut disponibili	UX
UX-11	🟡	🔨	Feedback sonoro 8-bit opzionale per azioni (task completato, errore, approvazione)	Da xmanrui
UX-12	🟢	🔨	PWA: manifest.json + service worker per installazione da browser	Da roadmap
UX-13	🟢	🔨	i18n: switching IT/EN per tutte le label UI	Da xmanrui
UX-14	🟢	🔨	Mobile responsive: breakpoint 768px per layout sidebar → bottom nav	Da roadmap
UX-15	🟢	🔨	Copy-to-clipboard su ogni config/token visualizzato	UX
AREA 23 — Documentazione
Copertura documentale del progetto.

ID	Priorità	Agente	Task	Note
DC-01	🔴	📖	Tradurre README in inglese e strutturarlo con: Overview, Prerequisites, Installation, Configuration, Running, Structure	Foundation
DC-02	🔴	📖	Creare .env.example con tutti i VITE_* usati nel codice e descrizione di ognuno	Foundation
DC-03	🔴	📖	Documentare il Docker setup: servizi in docker-compose.yml, porte, come fare rebuild	Foundation
DC-04	🟠	📖	Wiki: pagina "Connecting to OpenClaw Gateway" — URL WS, token, auth modes	Onboarding
DC-05	🟠	📖	Wiki: pagina "Project Structure" — ogni file/folder src/ spiegato in una riga	Reference
DC-06	🟠	📖	Aggiornare sezione Roadmap del README per riflettere stato reale (implemented vs planned)	Accuratezza
DC-07	🟡	📖	Wiki: pagina "Troubleshooting" — CORS, WebSocket refused, Docker port conflict, auth errors	Support
DC-08	🟡	📖	CONTRIBUTING.md: come fare fork, branch naming, come testare in locale, come aprire PR	Community
DC-09	🟡	📖	JSDoc su useOpenClawAPI.js: ogni funzione esportata con @param, @returns, @example	Inline docs
DC-10	🟢	📖	Badge nel README header: build status, license, Node version	Polish
DC-11	🟢	📖	Wiki: pagina "Pixel Office — Visual Architecture" — come funziona la scena, struttura sprite	Reference
Riepilogo per priorità
🔴 Critici (da fare subito — 18 task)
Fondamentali per il funzionamento base: handshake WS, health polling, CRUD agenti, chat UI, exec approvals, settings gateway, floor tile base, sprite agenti base, README in inglese, .env.example, Docker docs.

🟠 Alta priorità (39 task)
Real-time subscriptions, sessions management, modelli e usage, cron jobs, canali, nodi, compliance HTTP endpoints, Kanban board base, alert rules, activity log, walk cycle agenti, theme toggle.

🟡 Media priorità (67 task)
Features avanzate: analytics con grafici, config editor, TTS, device pairing UI, tool browser, chat avanzata (streaming, tool calls), Kanban completo, UX polish (skeleton, empty states, toast), animazioni pixel art intermedie.

🟢 Bassa priorità (34 task)
Nice-to-have: PWA, i18n, mobile, export dati, pixel art avanzata (giorno/notte, particelle, reaction animations), dev tools, badge README.

Riepilogo per agente
Agente	Task totali	Critici	Alti	Medi	Bassi
🔨 Forge	126	14	33	55	24
🔰 Warden	11	2	5	3	1
🎨 Pixel	16	2	4	7	3
📖 Scribe	11	3	3	3	2
Totale	164	21	45	68	30
Ordine di esecuzione suggerito
Questo è l'ordine ottimale per sbloccare le dipendenze a cascata:

Sprint 1 — Foundation (critici puri)
  G-01 → handshake WS corretto
  G-02 → hello-ok.policy applicata
  G-03 → deviceToken persistito
  G-05 → reconnect con backoff
  UX-01 → Settings page (gateway URL + token)
  H-01 → gateway health indicator
  DC-01 → README in inglese
  DC-02 → .env.example
  DC-03 → Docker docs

Sprint 2 — Core features
  A-01..04 → agents CRUD
  S-01 → sessions list
  M-01 → models list
  U-01 → token usage widget
  C-01..02 → chat UI + streaming
  PX-01..02 → floor tile + sprite base

Sprint 3 — Real-time & Governance
  AP-01..03 → exec approvals
  CR-01..04 → cron jobs
  A-05..08 → real-time agents
  S-02..06 → sessions real-time
  PX-03..06 → animazioni base

Sprint 4 — Analytics & Advanced
  U-02..07 → grafici analytics
  SK-01..04 → skills & tools
  CH-01..02 → channels
  N-01..04 → nodes
  HT-01..03 → compliance HTTP

Sprint 5 — Polish & Scale
  UX-02..15 → theme, PWA, i18n, mobile
  PX-07..16 → pixel art avanzata
  K-01..12 → kanban completo
  AL-01..08 → alert center
  DC-04..11 → wiki completa