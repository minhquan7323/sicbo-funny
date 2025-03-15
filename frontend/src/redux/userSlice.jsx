import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: '',
    username: '',
    name: '',
    coin: '',
}
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { username = '', name = '', coin = '', id = '' } = action.payload
            state.username = username
            state.name = name
            state.coin = coin
            state.id = id
        },
        resetUser: () => ({ ...initialState })
    }
})

export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer