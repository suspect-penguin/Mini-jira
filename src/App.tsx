import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BoardPage } from './pages/BoardPage'
import { TaskPage } from './pages/TaskPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BoardPage />} />
        <Route path="/tasks/:id" element={<TaskPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
