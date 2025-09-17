import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './Dashboard.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div className="flex flex-1 w-full h-full">
      <Dashboard/>
    </div>
  )
}

export default App
