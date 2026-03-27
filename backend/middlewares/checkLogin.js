const {getUserfromToken} = require('../services/checkauth')

exports.checkLogin = async (req,res,next)=>{

    const authHeader = req.headers['authorization'];
    req.user = null;

    if(!authHeader) return next();

    const token = authHeader.split(' ')[1]

    if(!token){
        return next();
    }

    const jwtPayload = await getUserfromToken(token);
    console.log(jwtPayload)
    req.user = jwtPayload;
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