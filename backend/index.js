const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const dotenv = require("dotenv")
const cors = require("cors")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const routes = require("./routes")

dotenv.config()

const app = express()
app.use(cors({ origin: "*", credentials: true }))
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(cookieParser())
app.use(express.static("public"))
routes(app)

const port = process.env.PORT
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })

let diceValues = [1, 1, 1]
let result = ""
let nextRollTimestamp = Date.now() + 10000

let betHistory = []

io.on("connection", (socket) => {
    const timeLeft = Math.max(0, Math.floor((nextRollTimestamp - Date.now()) / 1000))

    // Gửi trạng thái hiện tại cùng lịch sử cược cho client mới kết nối
    socket.emit("currentState", { diceValues, result, timeLeft, betHistory })

    socket.on("placeBet", (bet) => {
        betHistory.push(bet) // Lưu cược mới vào danh sách
        io.emit("betPlaced", bet) // Gửi cho tất cả client
    })
})

// Reset lịch sử cược khi có vòng mới
const rollDice = () => {
    diceValues = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1)
    result = diceValues.reduce((sum, val) => sum + val, 0) > 10 ? "Tài" : "Xỉu"
    nextRollTimestamp = Date.now() + 10000

    betHistory = [] // Xóa lịch sử khi bắt đầu vòng mới
    io.emit("diceRolled", { diceValues, result, betHistory }) // Gửi cập nhật đến client

    setTimeout(rollDice, 10000)
}

mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Database connection error:", err))

server.listen(port, () => console.log(`Server is running on port ${port}`))

// Bắt đầu quay ngay khi khởi động server
rollDice()
