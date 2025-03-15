import axios from "axios"

export const signUpUser = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, data)
    return res.data
}

export const signInUser = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/signin`, data)
    return res.data
}

export const getDetailsUser = async (userId) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/${userId}`)
    return res.data
}

// export const getAllUser = async (access_token) => {
//     const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/getalluser`, {
//         headers: {
//             token: `Bearer ${access_token}`,
//         }
//     })
//     return res.data
// }

export const updateUser = async (userId, data) => {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/user/${userId}`, data)
    return res.data
}

// export const deleteUser = async (id, access_token) => {
//     const res = await axios.delete(`${import.meta.env.VITE_API_URL}/user/deleteuser/${id}`, {
//         headers: {
//             token: `Bearer ${access_token}`,
//         }
//     })
//     return res.data
// }

// export const deleteManyUsers = async (ids, access_token) => {
//     const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/deletemany`, ids, {
//         headers: {
//             token: `Bearer ${access_token}`,
//         }
//     })
//     return res.data
// }