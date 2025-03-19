import React, { useState, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import io from "socket.io-client"
import Dice from "./Dice"
import { Box, Button, Grid, Typography, List, ListItem, ListItemText } from "@mui/material"
import { success, error } from "./Message/Message"
import * as UserService from "../services/UserService"
import { useMutationHooks } from "../hooks/useMutationHook"
import { useDispatch } from "react-redux"
import { updateUser } from "../redux/userSlice"

const socket = io(import.meta.env.VITE_SOCKET_URL)

const DiceGame = ({ user }) => {
    console.log(user)
    const [diceValues, setDiceValues] = useState([1, 1, 1])
    const [result, setResult] = useState("")
    const [resultDisplay, setResultDisplay] = useState('')
    const [timer, setTimer] = useState(15)
    const [timeOut, setTimeOut] = useState(true)
    const [shaking, setShaking] = useState(false)
    const [selectedBet, setSelectedBet] = useState(null)
    const [betHistory, setBetHistory] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [amount, setAmount] = useState(5000)

    const dispatch = useDispatch()

    useEffect(() => {
        socket.on("currentState", ({ diceValues, result, timeLeft, betHistory }) => {
            setDiceValues(diceValues)
            setResult(result)
            setTimer(timeLeft)
            setTimeOut(false)
            setBetHistory(betHistory ? [...betHistory].reverse() : [])
        })

        socket.on("diceRolled", ({ diceValues, result, betHistory }) => {
            setDiceValues(diceValues)
            setResult(result)
            setResultDisplay(result)
            setShaking(false)
            setTimer(10)
            setTimeOut(false)
            setBetHistory(betHistory ? [...betHistory].reverse() : [])
        })

        socket.on("betPlaced", (newBet) => {
            setBetHistory((prev) => [newBet, ...prev])
        })

        return () => {
            socket.off("currentState")
            socket.off("diceRolled")
            socket.off("betPlaced")
        }
    }, [])

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => Math.max(prev - 1, 0))
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [timer])

    useEffect(() => {
        if (timer == 2) {
            setShaking(true)
            setTimeOut(true)
        }
        if (timer === 0) {
            setShaking(false)
        }
    }, [timer])

    const handleBet = (bet) => {
        setSelectedBet(bet)
        setTotalAmount(totalAmount + amount)
        const newBet = { name: user.name, amount, bet }
        socket.emit("placeBet", newBet)
    }

    useEffect(() => {
        if (selectedBet) {
            if (selectedBet == result) {
                success(`Bú ${selectedBet} lụm ${totalAmount.toLocaleString().replace(/,/g, '.')} đ`)
            } else {
                error(`Ngu loz mấtt ${totalAmount.toLocaleString().replace(/,/g, '.')} đ`)
            }
        }
        handleUpdateUser()
        setSelectedBet(null)
        setResult('')
        setTotalAmount(0)
    }, [result])




    const mutationUpdate = useMutationHooks(async (data) => {
        const { id, ...rests } = data
        const res = await UserService.updateUser(id, rests)
        dispatch(updateUser({
            id: res.data._id,
            username: res.data.username,
            name: res.data.name,
            coin: res.data.coin,
        }))
        return res
    })

    const handleUpdateUser = async () => {
        if (!user?.id || result === '') return

        const previousCoin = user.coin
        const updatedCoin = selectedBet === result ? previousCoin + totalAmount : previousCoin - totalAmount
        await mutationUpdate.mutateAsync({ id: user.id, coin: updatedCoin })
        setTimeout(() => {
            handleGetDetailsUser(user.id)
        }, 500)
        setTotalAmount(0)
    }

    const handleGetDetailsUser = async (id) => {
        const res = await UserService.getDetailsUser(id)
        const userData = {
            id: res.data._id,
            username: res.data.username,
            name: res.data.name,
            coin: res.data.coin
        }
        dispatch(updateUser(userData))
        localStorage.setItem("user", JSON.stringify(userData))
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Grid container spacing={1} justifyContent="center" alignItems="center">
                <Grid item xs={6} display="flex" justifyContent="center">
                    <Canvas style={{ width: "100%", height: "500px" }} camera={{ position: [0, 0, 5] }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <Dice position={[-2, 0, 0]} value={diceValues[0]} shaking={shaking} />
                        <Dice position={[0, 0, 0]} value={diceValues[1]} shaking={shaking} />
                        <Dice position={[2, 0, 0]} value={diceValues[2]} shaking={shaking} />
                        <OrbitControls />
                    </Canvas>
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="center">
                    <Box sx={{ width: "300px", marginBottom: "20px", textAlign: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
                            📝 Lịch sử cược
                        </Typography>
                        {betHistory.length > 0 ? (
                            <List sx={{ maxHeight: "250px", overflowY: "auto", background: "#f4f4f4", borderRadius: "8px", padding: "10px" }}>
                                {betHistory.map((bet, index) => (
                                    <ListItem key={index} sx={{ borderBottom: "1px solid #ccc" }}>
                                        <ListItemText primary={`${bet.name} cược ${bet.amount.toLocaleString().replace(/,/g, '.')} đ vào ${bet.bet}`} />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                Chưa có ai đặt cược.
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>

            <h2
                style={{
                    textAlign: "center",
                    color: resultDisplay === "Tài" ? "green" : resultDisplay === "Xỉu" ? "red" : "black",
                    fontSize: 60,
                    fontWeight: "bolder",
                    margin: "12px",
                }}
            >
                {resultDisplay}
            </h2>
            <p style={{ textAlign: "center" }}>Đặt lẹ đi còn {timer} giây</p>

            {user.id ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 2 }}>
                    <Grid container spacing={1} justifyContent="center" alignItems="center">
                        <Grid item xs={6} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ width: "100px", height: "50px" }}
                                onClick={() => handleBet("Tài")}
                                disabled={timeOut || (selectedBet !== null && selectedBet !== "Tài")}
                            >
                                Tài
                            </Button>
                        </Grid>
                        <Grid item xs={6} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ width: "100px", height: "50px" }}
                                onClick={() => handleBet("Xỉu")}
                                disabled={timeOut || (selectedBet !== null && selectedBet !== "Xỉu")}
                            >
                                Xỉu
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Box color='red'>
                    Đăng nhập mới bet được thằng loz
                </Box>
            )}
        </div>
    )
}

export default DiceGame