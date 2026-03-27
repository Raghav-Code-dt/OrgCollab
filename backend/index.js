const express = require('express')
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');

app.use(express.json()); // for req body parsing and object formation
app.use(express.urlencoded({extended : true})); // for html forms
app.use(cookieParser());    // help us to use cookies

const DATABASE = process.env.DATABASE

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(DATABASE)
        console.log(`The database is connected succesfully`)
    }catch(err){
        console.log(`There is some error in database connection \n Here is the error : \n ${err}`)
    }
}

const PORT = process.env.PORT || 8000


async function startServer(){
    await connectDB();

    app.listen(PORT,()=>{
        console.log(`The server is live and running at localhost:${PORT}`)
    })
}

startServer();

//Authentication && Authorization
const signUpRouter = require('./routers/SignUp')
const LoginRouter = require('./routers/Login')
const authRateLimiter = require('./middlewares/login-rate-limiter')
const {checkLogin , accessOnly} = require('./middlewares/checkLogin')

app.use(checkLogin);

app.use('/signup',signUpRouter)
app.use('/login',authRateLimiter,LoginRouter)


app.get("/",accessOnly(["Normal","Admin"]),(req,res)=>{
    // res.send("Hello Nigga")
    res.status(202).json({
        status : 202,
        message : ""
    })
})