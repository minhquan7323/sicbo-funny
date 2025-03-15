import { TextField, Button, Box, CircularProgress, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import * as UserService from "../services/UserService"
import { useMutationHooks } from "../hooks/useMutationHook"
import { success, error } from "./Message/Message"
import SignUp from "./SignUp"
import CustomModal from "./CustomModal"
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, updateUser } from "../redux/userSlice"

const SignIn = () => {
    const initialState = { username: '', password: '' }
    const user = useSelector((state) => state?.user)

    const [stateUser, setStateUser] = useState(initialState)

    const [openSignIn, setOpenSignIn] = useState(false)
    const [openSignUp, setOpenSignUp] = useState(false)

    const handleOpenSignIn = () => {
        setStateUser(initialState)
        setOpenSignIn(true)
    }
    const handleCloseSignIn = () => setOpenSignIn(false)
    const handleOpenSignUp = () => {
        setStateUser(initialState)
        setOpenSignIn(false)
        setOpenSignUp(true)
    }
    const handleCloseSignUp = () => setOpenSignUp(false)

    const dispatch = useDispatch()

    const mutationSignIn = useMutationHooks(async (data) => {
        const res = await UserService.signInUser(data)
        return res
    })
    const { data: dataSignIn, isSuccess: isSuccessSignIn, isPending: isLoadingSignIn } = mutationSignIn

    const handleGetDetailsUser = async (userId) => {
        const res = await UserService.getDetailsUser(userId)
        const userData = {
            id: res.data._id,
            username: res.data.username,
            name: res.data.name,
            coin: res.data.coin
        }
        dispatch(updateUser(userData))
        localStorage.setItem("user", JSON.stringify(userData))
        return res
    }

    const handleOnchange = (e) => {
        setStateUser({ ...stateUser, [e.target.name]: e.target.value })
    }
    const handleLogout = () => {
        dispatch(resetUser())
        localStorage.removeItem("user")
    }
    const handleSignIn = () => {
        mutationSignIn.mutate(stateUser)
    }
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            dispatch(updateUser(JSON.parse(storedUser)))
        }
    }, [dispatch])


    useEffect(() => {
        if (isSuccessSignIn && dataSignIn?.status === "OK") {
            success("Sign-in successful!")
            handleGetDetailsUser(dataSignIn?.data._id)
            handleCloseSignIn()
        } else if (isSuccessSignIn) {
            error(dataSignIn?.message || "Sign-in failed!")
        }
    }, [isSuccessSignIn])

    const validSignIn = stateUser.username.trim() !== "" && stateUser.password.trim() !== ""

    return (
        <Box>
            {user.name ? (
                <Box>

                    <Typography variant="h3" gutterBottom>
                        {user.name}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                        {user.coin.toLocaleString().replace(/,/g, '.')} đ
                    </Typography>
                    <Button variant="contained" onClick={handleLogout}>
                        Log out
                    </Button>
                </Box>
            ) : (
                <Button variant="contained" onClick={handleOpenSignIn}>
                    Sign in
                </Button>
            )}
            <CustomModal open={openSignIn} handleClose={handleCloseSignIn} title="Sign in"
                children={
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Username" type="text" name="username"
                                value={stateUser.username} onChange={handleOnchange} autoComplete="username" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Password" type="password" name="password"
                                value={stateUser.password} onChange={handleOnchange} autoComplete="current-password" />
                        </Grid>
                    </Grid>
                }
                actions={
                    <>
                        <Button variant="outlined" onClick={handleOpenSignUp}>Sign up</Button>
                        <Button variant="contained" onClick={handleSignIn} disabled={!validSignIn || isLoadingSignIn}>
                            {isLoadingSignIn ? <CircularProgress size={24} /> : "Sign in"}
                        </Button>
                    </>
                }
            />

            <SignUp open={openSignUp} handleClose={handleCloseSignUp} handleOpenSignIn={handleOpenSignIn} />
        </Box>
    )
}

export default SignIn
