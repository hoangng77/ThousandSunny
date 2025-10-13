import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Register from './register.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <Register></Register>
  )
}

export default App
