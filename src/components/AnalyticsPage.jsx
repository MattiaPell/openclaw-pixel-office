// FORGE IMPLEMENTATION PLAN
// Feature: Advanced Analytics
// New files: src/components/AnalyticsPage.jsx, src/styles/AnalyticsPage.css
// Modified files: src/App.jsx, src/components/Sidebar.jsx
// Data source: useOpenClawAPI (agents, tasks, activityLog)
// Pattern reference: TasksPage.jsx (for structure), OfficeScene.jsx (for SVG patterns)

import React, { memo, useMemo } from 'react'
import '../styles/AnalyticsPage.css'

/**
 * AnalyticsPage component provides high-level insights into agent performance and system state.
 * It calculates metrics and renders visual representations using SVG and CSS.
 */
const AnalyticsPage = memo(({ agents, tasks, activityLog }) => {

  const stats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
    const pendingTasks = tasks.filter(t => t.status === 'pending').length

    const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0

    // Find most active agent
    const agentActivity = agents.map(agent => ({
      name: agent.name,
      count: agent.completedTasks || 0
    })).sort((a, b) => b.count - a.count)

    const topAgent = agentActivity.length > 0 ? agentActivity[0] : { name: 'N/A', count: 0 }

    // Model distribution
    const models = agents.reduce((acc, agent) => {
      const model = agent.model || 'Unknown'
      acc[model] = (acc[model] || 0) + 1
      return acc
    }, {})

    const modelDistribution = Object.entries(models).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / agents.length) * 100)
    })).sort((a, b) => b.count - a.count)

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate,
      topAgent,
      agentActivity: agentActivity.slice(0, 5),
      modelDistribution
    }
  }, [agents, tasks])

  // Donut chart helper
  const renderDonutChart = () => {
    const radius = 70
    const circumference = 2 * Math.PI * radius

    // Status colors
    const colors = {
      completed: '#4ade80',
      in_progress: '#38bdf8',
      pending: '#94a3b8'
    }

    const data = [
      { key: 'completed', value: stats.completedTasks },
      { key: 'in_progress', value: stats.inProgressTasks },
      { key: 'pending', value: stats.pendingTasks }
    ].filter(d => d.value > 0)

    if (data.length === 0) return <div className="empty-chart-message">Nessun dato disponibile</div>

    let currentOffset = 0
    const total = stats.totalTasks

    return (
      <div className="donut-chart-container">
        <svg className="donut-svg" viewBox="0 0 200 200">
          <circle className="donut-ring" cx="100" cy="100" r={radius} stroke="rgba(255,255,255,0.05)" />
          {data.map(d => {
            const percentage = (d.value / total) * 100
            const dashArray = `${(percentage * circumference) / 100} ${circumference}`
            const dashOffset = -currentOffset
            currentOffset += (percentage * circumference) / 100

            return (
              <circle
                key={d.key}
                className="donut-segment"
                cx="100"
                cy="100"
                r={radius}
                stroke={colors[d.key]}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
              />
            )
          })}
          <text x="100" y="105" className="donut-center-text pixel-font" transform="rotate(90 100 100)">
            {stats.completionRate}%
          </text>
        </svg>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: colors.completed }}></span>
            <span>Completati ({stats.completedTasks})</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: colors.in_progress }}></span>
            <span>In Corso ({stats.inProgressTasks})</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: colors.pending }}></span>
            <span>In Attesa ({stats.pendingTasks})</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h2 className="pixel-font">ANALYTICS</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <span className="icon">📋</span>
          <span className="value">{stats.totalTasks}</span>
          <span className="label">Total Tasks</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="icon">📈</span>
          <span className="value">{stats.completionRate}%</span>
          <span className="label">Success Rate</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="icon">🏆</span>
          <span className="value">{stats.topAgent.name}</span>
          <span className="label">MVP Agent ({stats.topAgent.count})</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="icon">🤖</span>
          <span className="value">{agents.length}</span>
          <span className="label">Active Agents</span>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-panel glass-panel">
          <h3>📊 PERFORMANCE AGENTI (Top 5)</h3>
          <div className="bar-chart">
            {stats.agentActivity.length > 0 ? (
              stats.agentActivity.map((agent, i) => {
                const maxCount = Math.max(...stats.agentActivity.map(a => a.count), 1)
                const width = (agent.count / maxCount) * 100
                return (
                  <div key={agent.name + i} className="bar-row">
                    <span className="bar-label">{agent.name}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${width}%` }}></div>
                    </div>
                    <span className="bar-value">{agent.count}</span>
                  </div>
                )
              })
            ) : (
              <div className="empty-chart-message">Nessun dato attività</div>
            )}
          </div>
        </div>

        <div className="chart-panel glass-panel">
          <h3>🎯 STATO DEI TASK</h3>
          {renderDonutChart()}
        </div>
      </div>
    </div>
  )
})

export default AnalyticsPage
