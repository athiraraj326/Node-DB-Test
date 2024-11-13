const users = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// register
exports.registerController = async (req, res) => {
    console.log("Inside registerController");
    console.log(req.body);
    const { userId, firstName, lastName, email, password, phone } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(406).json("User already exist.. Please login!!!")
        } else {
            const encrypted = await bcrypt.hash(password,10)
            const newUser = new users({
                userId, firstName, lastName, email, password:encrypted, phone
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

// login
exports.loginController = async (req, res) => {
    console.log("Inside loginController");
    const { email, password } = req.body
    console.log(email, password);
    try {
        const existingUser = await users.findOne({ email})
        if (existingUser) {
            const decrypted = await bcrypt.compare(password,existingUser.password)
            console.log(decrypted);
            
             if(decrypted){
                const token = jwt.sign({ loginId: existingUser._id }, process.env.JWTPASSWORD)
                res.status(200).json({ user: existingUser, token })
             }else{
                res.status(404).json("Incorrect Password!!!")
             }   
        } else {
            res.status(404).json("Incorrect Email!!!")
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

// get all users
exports.allUserController = async (req, res) => {
    console.log("Inside allUserController");
    try {
        const allUsers = await users.find()
        res.status(200).json(allUsers.map(user=>({userId:user.userId,firstName:user.firstName,lastName:user.lastName})))
    } catch (err) {
        res.status(401).json(err)
    }
}

// view single user
exports.viewUserController = async (req,res) =>{
    console.log("Inside viewUserController");
    const loginId = req.loginId    
    try{
        const viewUser = await users.find({_id:loginId})        
        if(viewUser){
            res.status(200).json(viewUser.map(user=>({userId:user.userId,firstName:user.firstName,lastName:user.lastName,email:user.email,phone:user.phone})))
        }else{
            res.status(404).json("User not found!!!")
        }
    }catch(err){
        res.status(401).json(err)
    }
}