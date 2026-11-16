import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PresentationBar } from './components/presentation/PresentationBar'
import { AppLayout, RequireUser } from './components/layout/AppLayout'
import { DemoProvider } from './context/DemoContext'
import { PresentationProvider } from './context/PresentationContext'
import { ApplicationsPage } from './pages/ApplicationsPage'
import { ApplyBusinessPage } from './pages/ApplyBusinessPage'
import { ApplyStudentPage } from './pages/ApplyStudentPage'
import { DashboardPage } from './pages/DashboardPage'
import { OpenProjectsPage } from './pages/OpenProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { SupervisionPage } from './pages/SupervisionPage'
import { TeamsPage } from './pages/TeamsPage'
import { ToolsPage } from './pages/ToolsPage'
import { RoleSelectPage } from './pages/RoleSelectPage'
import { WelcomePage } from './pages/WelcomePage'

export default function App() {
  return (
    <DemoProvider>
      <PresentationProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/ingresar" element={<RoleSelectPage />} />
            <Route path="/postular/comercio" element={<ApplyBusinessPage />} />
            <Route path="/postular/estudiante" element={<ApplyStudentPage />} />
            <Route
              path="/app"
              element={
                <RequireUser>
                  <AppLayout />
                </RequireUser>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="postulaciones" element={<ApplicationsPage />} />
              <Route path="abiertos" element={<OpenProjectsPage />} />
              <Route path="equipos" element={<TeamsPage />} />
              <Route path="herramientas" element={<ToolsPage />} />
              <Route path="proyectos" element={<ProjectsPage />} />
              <Route path="supervision" element={<SupervisionPage />} />
              <Route path="proyectos/:projectId" element={<ProjectDetailPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <PresentationBar />
        </HashRouter>
      </PresentationProvider>
    </DemoProvider>
  )
}
