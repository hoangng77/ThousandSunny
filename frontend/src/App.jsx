import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Register from './register.jsx'
import Login from './login.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      //<Register></Register>
      <Login></Login>
  )
}

export default App
