import { TextField, Button, Box, Grid } from "@mui/material"
import { useState, useEffect } from "react"
import * as UserService from "../services/UserService"
import { useMutationHooks } from "../hooks/useMutationHook"
import { success, error } from "./Message/Message"
import CustomModal from "./CustomModal"

const SignUp = ({ open, handleClose, handleOpenSignIn }) => {
    const initialState = { username: "", name: "", password: "", confirmPassword: "" }
    const [stateUser, setStateUser] = useState(initialState)

    useEffect(() => {
        if (open) {
            setStateUser(initialState)
        }
    }, [open])

    const mutationSignUp = useMutationHooks(async (data) => {
        return await UserService.signUpUser(data)
    })

    const { data: dataSignUp, isSuccess: isSuccessSignUp } = mutationSignUp

    const handleOnchange = (e) => {
        setStateUser({ ...stateUser, [e.target.name]: e.target.value })
    }

    const handleSignUp = async () => {
        await mutationSignUp.mutateAsync(stateUser)

        if (isSuccessSignUp && dataSignUp?.status === "OK") {
            success("Sign-up successful!")
            handleClose()
            handleOpenSignIn()
        } else {
            error(dataSignUp?.message || "Sign-up failed!")
        }
    }

    const validSignUp = stateUser.username.trim() !== "" && stateUser.name.trim() !== "" && stateUser.password.trim() !== "" && stateUser.confirmPassword.trim() !== ""

    return (
        <CustomModal open={open} handleClose={handleClose} title="Sign up"
            children={
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Username" name="username" value={stateUser.username} onChange={handleOnchange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Name" name="name" value={stateUser.name} onChange={handleOnchange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Password" type="password" name="password" value={stateUser.password} onChange={handleOnchange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Confirm Password" type="password" name="confirmPassword" value={stateUser.confirmPassword} onChange={handleOnchange} />
                    </Grid>
                </Grid>
            }
            actions={
                <>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSignUp} disabled={!validSignUp}>Sign up</Button>
                </>
            }
        />
    )
}

export default SignUp