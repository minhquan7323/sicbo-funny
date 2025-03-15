import React from "react"
import DiceGame from "./components/DiceGame"
import SignIn from "./components/SignIn"
import Message from "./components/Message/Message"
import { useDispatch, useSelector } from 'react-redux'

const App = () => {
  const user = useSelector((state) => state?.user)

  return (
    <div>
      <Message />
      <SignIn />
      <DiceGame user={user} />
    </div>
  )
}

export default App
