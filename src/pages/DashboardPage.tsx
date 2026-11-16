import { useDemo } from '../hooks/useDemo'
import { useActiveUser } from '../hooks/useActiveUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { AdminDashboard } from '../components/dashboard/AdminDashboard'
import { BusinessDashboard } from '../components/dashboard/BusinessDashboard'
import { StudentDashboard } from '../components/dashboard/StudentDashboard'
import { SupervisorDashboard } from '../components/dashboard/SupervisorDashboard'
import { ROLE_LABELS } from '../utils/labels'

export function DashboardPage() {
  const { state } = useDemo()
  const user = useActiveUser()
  useDocumentTitle('Panel')
  if (!user) return null
  const props = { state, user }

  return (
    <div className="dashboard">
      <h1>Panel de {user.name}</h1>
      <p className="intro">Rol activo: <strong>{ROLE_LABELS[user.role]}</strong></p>
      {user.role === 'student' && <StudentDashboard {...props} />}
      {user.role === 'business' && <BusinessDashboard {...props} />}
      {user.role === 'supervisor' && <SupervisorDashboard {...props} />}
      {user.role === 'admin' && <AdminDashboard {...props} />}
    </div>
  )
}
