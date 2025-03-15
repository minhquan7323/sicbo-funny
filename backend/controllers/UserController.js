const UserService = require('../services/UserService')

const createUser = async (req, res) => {
    try {
        const { username, password, confirmPassword, name } = req.body


        if (!name || !username || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is require'
            })
        }
        else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Confirm password is incorrect'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is require'
            })
        }

        const response = await UserService.loginUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userID is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    getDetailsUser,
    updateUser
}