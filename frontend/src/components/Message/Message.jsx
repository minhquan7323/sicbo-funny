import React, { useState } from "react"
import { Snackbar, Alert } from "@mui/material"

let showMessageFunction = () => { }

const Message = () => {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("success")

    showMessageFunction = (mes, type) => {
        setMessage(mes)
        setSeverity(type)
        setOpen(true)

        setTimeout(() => {
            setOpen(false)
        }, 3000)
    }

    return (
        <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
            <Alert severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export const success = (mes = "Success") => showMessageFunction(mes, "success")
export const error = (mes = "Error") => showMessageFunction(mes, "error")
export const warning = (mes = "Warning") => showMessageFunction(mes, "warning")

export default Message
