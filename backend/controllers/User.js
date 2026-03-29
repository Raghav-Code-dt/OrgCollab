const {User} = require('../models/user')
const jwt = require('jsonwebtoken')
// const dotenv = require('dotenv').congif();
const emailSender = require('../utils/email')
const crypto = require('crypto')

const bcyrpt = require('bcryptjs')

function validatePassword(password){
    if(password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)){            // contain at leat 8 char
        return false;
    }
    // contain at least one lowercase letter
    // contain at least one upper case letter  
    // contain atleast one number
    // contain atleat 1 special symbol


    // if(!/[^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$]/.test(password)){
    //     return false;
    // }
    //Has a minimum length of 8 characters.
    // Contains at least one uppercase letter.
    // Contains at least one lowercase letter.
    // Contains at least one digit.
    // Contains at least one special character.
    // Does not contain any whitespace
    return true;
}

// User.methods.checkForActive = ()=>{
//     if(this.lastLoginAt + 4 * 24 * 60 * 60 * 1000 < Date.now()){
//         this.status = 0
//     }
// }

async function encrypt_password(password){
    const hash = await bcyrpt.hash(password,13);      // instead of storing password , we store a encrypted password
    // bcrypt adds a random string in hash so its very secure
    // 13 means it will be hashed 13 times
    return hash;
}

setUser = async (req,res) => {                          // http://localhost/signup
    const {name,email,password} = req.body;

    const role = req.body.role || "Normal";

    const duplicate = await User.findOne({email});

    if(duplicate){
        return res.status(409).json({
            status : 409,
            message : "User already exist"
        })
    }

    const isValid = validatePassword(password)

    if(!isValid){
        return res.status(400).json({
            status : 400,
            message : "Password does'nt meet required conditions"
        })
    }

    const hash = await encrypt_password(password);

    const newUser = User({
        name,
        email,
        password : hash,
        role,
        passwordCreatedAt: Date.now(),
        UserCreatedAt : Date.now()
    })

    try{
        const save = await newUser.save();
        res.status(200).json({
            status: 200,
            message : "New user is created successfully"
        })
    }catch(err){
        res.status(500).json({
            status : 500,
            message : "AN internal service error occurred and user is not saved",
            error : err
        })
    }
}

getUser = async (req,res)=>{                            // // http://localhost/logink
    // will apply rate-limiting middleware in future
    const {email,password} = req.body;

    const user = await User.findOne({email});
    
    if(!user){          // is no user is present with this name
        return res.status(404).json({
            status : 404,
            message : "Invalid email or password"
        })
    }
    
    const isMatch = await bcyrpt.compare(password , user.password)

    if(!isMatch){       // if password matches or not
        return res.status(401).json({
            status : 401,
            message : "Invalid email or password",
        })
    }

    // req.user = user;
    user.lastLoginAt = Date.now();
    const role = user.role;

    await user.save()

    const SECRET_KEY = process.env.SECRET_KEY

    const jwtID = jwt.sign({email,role}, SECRET_KEY,{expiresIn : "15m"})

    // const tokenIssuedAt = 
    // include refresh token in future use

    res.status(200).json({
        status:200,
        message : "User Logged in succesfully",
        jwtID,       // this will be send to frontend where the data will be stored 
        lastLoginAt : Date.now()
    })
}

forgotpassword = async (req,res) => {               // http://localhost:8000/login/forgotpassword
    //1. take the email of the user and verfiy it
    const {email} = req.body;
    const user = await User.findOne({email}).select("-password -_id")       // will not include password and id

    if(!user){
        return res.status(401).json({
            status:401,
            message: "No user found"
        })
    }

    //2. Send a email with the token it
    const token = crypto.randomBytes(32).toString('hex')
    await emailSender.sendMail(email,token)

    //3. update token and password time in database
    user.resetPassWordToken = token;
    user.resetPassWordTimeLimit = Date.now() + 1*60*15*1000;
    await user.save();

    res.status(200).json({
        status: 200,
        // token : token,
        message: "Email sent succesfully"
    })
}

resetpassword = async (req,res) => {                // https:/localhost:8000/signup/resetpassword/:token       
    //1 verify the token
    const token = req.params.token;
    const changedPassword = req.body.password;
    const user = await User.findOne({resetPassWordToken : token})

    if(!user){
        return res.status(405).json({
            status : 405,
            message : "Unauthorized access"
        })
    }
    
    if(user.resetPassWordTimeLimit < Date.now()){
        user.resetPassWordTimeLimit = undefined;
        user.resetPassWordToken = undefined;
        
        await user.save()
        
        return res.status(405).json({
            status : 405,
            message : "The reset link has expired"
        })
    }
    
    const hash = await encrypt_password(changedPassword)

    user.password = hash;
    user.passwordCreatedAt = Date.now();
    user.resetPassWordTimeLimit = undefined;
    user.resetPassWordToken = undefined;

    await user.save()

    res.status(200).json({
        status: 200,
        message: "Password reset successful"
    })
}

module.exports = {setUser,getUser , resetpassword , forgotpassword}

