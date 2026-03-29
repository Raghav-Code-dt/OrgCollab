const {Project} = require('../models/projects')


exports.defineRole = async (req,res,next)=>{
        const projectID = req.params.projectID;
        // console.log(req.params)
        if(!projectID){
            console.log(req.params)
            return next();
        }

        const project = await Project.findOne({_id : projectID}).select("-__v")
        // console.log(project);

        if(!project) return next();

        const userId = req.user._id.toString();

        const user = await project.members.find( member => member.userId.toString() === userId );

        if(!user) return next();

        if(user.role != "admin"){
            req.projectRole = "member"
            return next();
        }else if(user.role != "member"){
            req.projectRole = "admin"
            return next();
        }else{
            return next();                  // if user is not part of the project
        }
}

exports.accessOnly = (roles = [])=>{
    return async function(req,res,next){
        if(!req.projectRole){
            return res.status(404).json({
                status : 404,
                message : "No such Project exist"
            });
        }

        if(!roles.includes(req.projectRole)){
            return res.status(401).json({
                status : 401,
                messag : "Current method is only available to Admin of project only"
            })
        }

        return next();
    }
}