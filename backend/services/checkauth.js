const User = require('../models/user')
const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY

exports.getUserfromToken = async (token)=>{
    try{
        const payload = jwt.verify(token,SECRET_KEY)
        // const curUser = await User.findOne({email : payload.email})
        if(payload) return payload
        else return null
    }catch(err){
        return null;
    }
}

