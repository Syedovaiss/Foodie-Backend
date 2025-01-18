const db = require('../../../database/db')
const helper = require('../../../utils/Helper')
const authHelper = require('../../../utils/AuthHelper')
const { COLLECTIONS } = require('../../../utils/Constants')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const imageConfig = require('../../../utils/ImageConfig')
const path = require('path')
const fs = require('fs')

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
                            data: token,
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
    const token = req.header('Authorization')
    const userId = authHelper.getUserId(token)
    const { fullName, country, phoneNumber } = req.body
    if (helper.isEmpty(country)) {
        return res.status(400).json({
            message: "Please enter a valid country"
        })
    } else if (helper.isEmpty(phoneNumber)) {
        return res.status(400).json({
            message: "Please enter a valid phone"
        })
    } else {
        try {
            await getCountryInfo(country).then(async (countryData) => {
                console.log(countryData.dial_code);
                
                if(!authHelper.isValidPhone(phoneNumber,countryData.dial_code)) {
                    return res.status(400).json( {
                        message: `Phone number must starts with ${countryData.dial_code} `
                    })
                }
                const user = await db.collection(COLLECTIONS.USER).doc(userId)
                const info = {
                    fullname: fullName,
                    country: country,
                    phoneNumber: phoneNumber
                }
                user.update(info)
                return res.status(201).json({
                    message: "Info added successfully!"
                })
            })
        } catch (error) {
            return res.status(500).json({
                message: error
            })
        }

    }
}


exports.updateProfilePhoto = async (req, res) => {
    imageConfig.upload(req, res, async (error) => {
        if (error) {
            return res.status(400).json({
                message: "Something went wrong while saving image."
            })
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        const filePath = path.join('uploads', req.file.filename);

        try {
            const token = req.header('Authorization')
            const userId = authHelper.getUserId(token)
            const user = await db.collection(COLLECTIONS.USER).doc(userId)
            const imageInfo = {
                avatar: filePath
            }
            user.update(imageInfo)
            return res.status(201).json({
                message: "Image added successfully!"
            })

        } catch (err) {
            res.status(500).json({ error: 'Failed to save image in database.', details: err });
        }
    })
}


exports.getUserProfile = async (req, res) => {

    const token = req.header('Authorization')
    const userId = authHelper.getUserId(token)
    const data = db.collection(COLLECTIONS.USER).doc(userId)
    await data.get().then((result) => {
        const user = result.data()
        let response = {
            phoneNumber: user.phoneNumber,
            email: user.email,
            country: user.country,
            avatar: user.avatar
        }
        if (helper.isEmpty(user.fullname)) {
            response.name = user.name
        } else {
            response.name = user.fullname
        }
        return res.status(200).json({
            data: response
        })
    }).catch(err => {
        return res.status(500).json({
            message: err
        })

    })

}

const getCountryInfo = (country) => {
    const filePath = path.join(__dirname, '../../../assets', 'countries.json');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(new Error('Error reading file'));
            }

            try {
                const jsonData = JSON.parse(data);
                const countryInfo = jsonData.find(item => item.name.toLowerCase() === country.toLowerCase());
                if (countryInfo) {
                    return resolve(countryInfo);
                } else {
                    return resolve(null); // If country not found, resolve with null
                }
            } catch (parseError) {
                return reject(new Error('Error parsing JSON'));
            }
        });
    });
};
