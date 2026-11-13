import { lazy } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
const Learn = lazy(() => import('./pages/Learn'))
const ModulePage = lazy(() => import('./pages/ModulePage'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const Playground = lazy(() => import('./pages/Playground'))
const Cheatsheet = lazy(() => import('./pages/Cheatsheet'))
const Rescue = lazy(() => import('./pages/Rescue'))
const Me = lazy(() => import('./pages/Me'))
const Problems = lazy(() => import('./pages/Problems'))
const Certificate = lazy(() => import('./pages/Certificate'))
const ProblemPage = lazy(() => import('./pages/ProblemPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Hash routing (#/learn) works on GitHub Pages with no server setup.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/:moduleId" element={<ModulePage />} />
          <Route path="learn/:moduleId/:slug" element={<LessonPage />} />
          <Route path="problems" element={<Problems />} />
          <Route path="problems/:slug" element={<ProblemPage />} />
          <Route path="playground" element={<Playground />} />
          <Route path="cheatsheet" element={<Cheatsheet />} />
          <Route path="rescue" element={<Rescue />} />
          <Route path="me" element={<Me />} />
          <Route path="certificate" element={<Certificate />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
