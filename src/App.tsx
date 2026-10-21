import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Learn from './pages/Learn'
import ModulePage from './pages/ModulePage'
import LessonPage from './pages/LessonPage'
import Playground from './pages/Playground'
import Cheatsheet from './pages/Cheatsheet'
import Rescue from './pages/Rescue'
import Me from './pages/Me'
import NotFound from './pages/NotFound'

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
          <Route path="playground" element={<Playground />} />
          <Route path="cheatsheet" element={<Cheatsheet />} />
          <Route path="rescue" element={<Rescue />} />
          <Route path="me" element={<Me />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
