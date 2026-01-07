const UpdateHandler = async (req, res) => {
    const user = req.user
    const { skills, username } = req.body
    try {
        delete user.password
        return res.status(200).json({ message: "User Profile Data", user })
    } catch (error) {
        return res.status(500).json({ message: "Error Fetching User Profile Data", error })
    }
}
const ProfileIndexHandler = async (req, res) => {
    const user = {...req.user.toObject(),password:null}
    try {
        
        return res.status(200).json({ message: "User Profile Data", user })
    } catch (error) {
        return res.status(500).json({ message: "Error Fetching User Profile Data", error })
    }
}

module.exports = { ProfileIndexHandler, UpdateHandler }