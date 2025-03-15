const User = require('../models/UserModel')
const bcrypt = require('bcrypt')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { username, password, name, coin } = newUser
        try {
            const checkUser = await User.findOne({
                username: username
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The username is already'
                })
            }
            const hashPassword = bcrypt.hashSync(password, 10)
            const createUser = await User.create({
                name,
                username,
                password: hashPassword,
                coin
            })
            if (createUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createUser
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { username, password } = userLogin
        try {
            const user = await User.findOne({
                username: username
            })

            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: userId })

            if (user === null) {
                return resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: userId })

            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            const updateUser = await User.findByIdAndUpdate(userId, data, { new: true })

            resolve({
                status: 'OK',
                message: 'Update user success',
                data: updateUser
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    getDetailsUser,
    updateUser
}