const {getUserfromToken} = require('../services/checkauth')
const {User} = require('../models/user')

exports.checkLogin = async (req,res,next)=>{

    const authHeader = req.headers['authorization'];
    req.user = null;

    if(!authHeader) return next();

    const token = authHeader.split(' ')[1]

    if(!token){
        return next();
    }

    const jwtPayload = await getUserfromToken(token);

    if(!jwtPayload) return next()
    
    const payload = await User.findOne({email : jwtPayload.email}).select("-password -passwordCreaterAt")

    req.user = payload;

    return next();
}

exports.accessOnly = (role = [])=>{
    return function (req,res,next){
        if(!req.user || !role.includes(req.user.role)){
            return res.status(401).json({
                status : 401,
                message : "Unauthorized Access"
            });
        }

        return next();
    }
}