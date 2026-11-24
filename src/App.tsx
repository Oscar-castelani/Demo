import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PresentationBar } from './components/presentation/PresentationBar'
import { RouteFocus } from './components/common/RouteFocus'
import { SkipLink } from './components/common/SkipLink'
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
import { HowItWorksPage } from './pages/HowItWorksPage'
import { BenefitsPage } from './pages/BenefitsPage'
import { PublicToolsPage } from './pages/PublicToolsPage'
import { DemoIntroPage } from './pages/DemoIntroPage'
import { AboutPage } from './pages/AboutPage'
import { PublicLayout } from './components/layout/PublicLayout'

export default function App() {
  return (
    <DemoProvider>
      <PresentationProvider>
        <HashRouter>
          <SkipLink />
          <RouteFocus />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/como-funciona" element={<HowItWorksPage />} />
              <Route path="/beneficios" element={<BenefitsPage />} />
              <Route path="/herramientas" element={<PublicToolsPage />} />
              <Route path="/demo" element={<DemoIntroPage />} />
              <Route path="/proyecto" element={<AboutPage />} />
            </Route>
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
