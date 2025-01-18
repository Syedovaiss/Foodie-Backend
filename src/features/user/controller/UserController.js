const db = require('../../../database/db')
const helper = require('../../../utils/Helper')
const authHelper = require('../../../utils/AuthHelper')
const { COLLECTIONS } = require('../../../utils/Constants')
const moment = require('moment')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body
    if (helper.isEmpty(name)) {
        return res.status(400).json({
            message: "Name can't be empty!"
        })
    } else if (helper.isEmpty(email)) {
        return res.status(400).json({
            message: "Email can't be empty!"
        })
    } else if (!authHelper.isValidEmail(email)) {
        return res.status(400).json({
            message: "Please enter a valid email!"
        })
    } else if (helper.isEmpty(password)) {
        return res.status(400).json({
            message: "Password can't be empty!"
        })
    } else if (!authHelper.isValidPassword(password)) {
        return res.status(400).json({
            message: "Password must contains 1 uppercase, 1 lowercase, 1 special character and atleast 9 characters long!"
        })
    } else {
        try {
            const isUserAlreadyExists = await checkIfUserExists(email)
            if (isUserAlreadyExists) {
                return res.status(400).json({
                    message: "User already exists!"
                })
            }
            const passwordHash = hashPassword(password)
            const userData = {
                name,
                email,
                password: passwordHash
            };
            const user = await createUser(userData)
            return res.status(201).json({
                messgae: `User profile created for ${userData.name}`
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: error
            })
        }
    }

}

const hashPassword = (password) => {
    return authHelper.generatePassword(password);
};

const checkIfUserExists = async (email) => {
    try {
        const userQuerySnapshot = await db.collection(COLLECTIONS.USER)
            .where("email", "==", email)
            .get();
        return !userQuerySnapshot.empty;
    } catch (error) {
        throw new Error(error.message);
    }
};

const createUser = async (userData) => {
    userData.createdAt = moment().valueOf()
    try {
        const savedUser = await db.collection(COLLECTIONS.USER).add(userData)
        return savedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.signIn = async (req, res) => {
    const { email, password } = req.body
    if (helper.isEmpty(email)) {
        return res.status(400).json({
            message: "Email can't be empty!"
        })
    } else if (helper.isEmpty(password)) {
        return res.status(400).json({
            message: "Password can't be empty!"
        })
    } else if (!authHelper.isValidEmail(email)) {
        return res.status(400).json({
            message: "Please enter a valid email!"
        })
    } else {
        try {
            const userQuerySnapshot = await db.collection(COLLECTIONS.USER)
                .where("email", "==", email)
                .get();
            if (!userQuerySnapshot.empty) {
                userQuerySnapshot.docs.forEach(doc => {
                    const userData = doc.data();
                    console.log(userData)
                    const userPassword = userData.password;
                    const isPasswordMatches = authHelper.comparePassword(password, userPassword)
                    if (isPasswordMatches) {
                       const token = generateToken(doc);
                       res.status(200).json({
                        data:token,
                        message: "Login success!"
                       })
                    } else {
                        res.status(400).json({
                            message: "Please enter a valid password!"
                        })
                    }
                });
            } else {
                res.status(400).json({
                    message: "No user found!"
                })
            }
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }
}

const generateToken = (doc) => {
    const userData = doc.data();
    const email = userData.email;
    const token = jwt.sign(
        {
            email: email,
            userId: doc.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d'
        }
    )
    return token
}


exports.addUserInfo = async (req, res) => {

}


exports.updateProfilePhoto = async (req, res) => {

}


exports.getUserProfile = async (req, res) => {

}


exports.verifyOTP = async (req, res) => {

}


exports.resetPassword = async (req, res) => {

}