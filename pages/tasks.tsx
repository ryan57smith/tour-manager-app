import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase, Task } from '../lib/supabase'

const TOUR_ID = 'a1111111-1111-1111-1111-111111111111'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    supabase.from('tasks').select('*').eq('tour_id', TOUR_ID).order('due_date')
      .then(({ data }) => {
        if (data) setTasks(data)
        setLoading(false)
      })
  }, [])

  const filtered = filter === 'all' ? tasks : tasks.filter(t =>
    filter === 'priority' ? (t.priority === 'urgent' || t.priority === 'high') :
    t.status === filter
  )

  const counts = {
    all: tasks.length,
    priority: tasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  return (
    <Layout title="TASKS">
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'priority', label: '🔥 Priority' },
          { key: 'todo', label: 'To Do' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' },
        ].map(tab => (
          <button key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
              background: filter === tab.key ? 'var(--amber)' : 'var(--stage)',
              color: filter === tab.key ? '#000' : 'var(--text-secondary)',
              fontSize: '13px', fontWeight: filter === tab.key ? '600' : '400',
              fontFamily: 'var(--font-body)',
              border: filter === tab.key ? 'none' : '1px solid var(--border)',
              transition: 'all 0.15s',
            }}>
            {tab.label} ({counts[tab.key as keyof typeof counts]})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((task, i) => (
            <div key={task.id} className="card fade-up" style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '4px', flexShrink: 0, marginTop: '2px',
                  border: `2px solid ${task.status === 'completed' ? 'var(--green)' : 'var(--border)'}`,
                  background: task.status === 'completed' ? 'var(--green)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#000', fontSize: '12px',
                }}>
                  {task.status === 'completed' ? '✓' : ''}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600', marginBottom: '4px', fontSize: '15px',
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? 'var(--text-secondary)' : 'var(--text-primary)',
                  }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {task.description}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Due: {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                  <span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
              No tasks found
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}
