import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import './Charts.css'

const COLORS = ['#6366f1', '#22c55e', '#f97316', '#e11d48', '#0ea5e9', '#a855f7']

export function ScoreRadial({ score }) {
  const value = Math.min(100, Math.max(0, Math.round(score * 100)))
  const data = [{ name: 'Score', value, fill: '#6366f1' }]

  return (
    <div className="chart-card">
      <h3>Resume Score</h3>
      <ResponsiveContainer width="100%" height={220}>
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <RadialBar minAngle={15} dataKey="value" cornerRadius={10} />
          <Legend iconType="circle" />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="score-badge">{value}%</div>
    </div>
  )
}

export function DomainPie({ domainScores }) {
  const data = Object.entries(domainScores || {}).map(([name, value], index) => ({ name, value: Math.round(value * 100), fill: COLORS[index % COLORS.length] }))

  if (!data.length) {
    return <div className="chart-card">No domain data available.</div>
  }

  return (
    <div className="chart-card">
      <h3>Domain Scores</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
