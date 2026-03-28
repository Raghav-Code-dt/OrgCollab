const { ProjectSchema, Project } = require("../models/projects");
const crypto = require("crypto");

function GenerateToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}

createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!req.user || !role.includes(req.user.role)) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized Access",
        });
    }

    const creater_ID = req.user._id;

    // const user_projects = await Project.find({createdById : creater_ID}).select("name -_id")
    // if([...user_projects.values()].includes(name)){
    //     return res.status(409).json({
    //         status : 409,
    //         message : "Project with similar name already exist"
    //     })
    // }

        const token = GenerateToken();

        const project = Project({
        name,
        createdById: creater_ID,
        description,
        members: [
            {
            userId: creater_ID,
            role: "admin",
            joinedAt: Date.now(),
            },
        ],
        inviteToken: token,
        });

        await project.save();

        res.status(200).json({
        status: 200,
        message: "New Project registered",
        project,
        });
    } catch (err) {
    if (err.code === 11000) {
    return res.status(409).json({
        status: 409,
        message: "You already have a project with this name",
    });
    }

    return res.status(500).json({
        message: "Something went wrong",
        err: err.message,
    });
  }
};

addUserToAProject = async (req, res) => {
    // http:/.localhost:8000/projects/addUser/:token
    const token = req.params?.token;
    if(!token){
        return res.status(404).json({
            status : 404,
            message : "Unauthorized Access"
        })
    }

    const project = await Project.findOne({inviteToken : token})

    if(!project){
        return res.status(404).json({
            status : 404,
            message : "Unauthorized Access"
        })
    }

    const alreadyMember = project.members.some(
        m => m.userId.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
        return res.status(400).json({
            message: "Already a member"
        });
    }

    try{
        project.members.push({
            userId : req.user._id,
            role : "member",
            joinedAt : Date.now()
        })

        await project.save();

        return res.status(200).json({
            status : 200,
            message : "User succesfully added"
        })
    }catch(err){
        if (err.code === 11000) {
            return res.status(409).json({
                status: 409,
                message: "You already a part of this project ",
            });
        }

    return res.status(500).json({
        message: "Something went wrong",
        err: err.message,
    });
    }
};

getProjectsOfUser = async (req,res)=>{
    const user_projects = await Project.find({
        // $or : [
        //     {createdById : req.user._id},
        //     {"members.userId" : req.user._id}
        // ]
        createdById : req.user._id
    }).select("name description createdBy createdAt")

    const user_member_projects = await Project.find({
        "members.userId" : req.user._id,
        createdById: { $ne: req.user._id }   
    }).select("name description createdById members")

    const memberProjects = user_member_projects.map(project => {
        const member = project.members.find(
            m => m.userId.toString() === req.user._id.toString()
        );

        return {
            _id: project._id,
            name: project.name,
            description: project.description,
            createdBy : project.createdById,
            role: "member",
            joinedAt: member?.joinedAt
        };
    });

    res.status(200).json({
        status : 200,
        message : "The projects in which the current user is involed is :",
        admin_Project : user_projects,
        member_Project : memberProjects
    })
}

getSingleProject = async (req,res)=>{
    const projectID = req.params.projectID;

    const project = await Project.findOne({
        _id : projectID
    })

    if(!project){
        res.status(404).json({
            status : 404,
            message : "No such project exist"
        })
    }

    return res.status(200).json({
        status : 200,
        message : "This is the project",
        project
    })
}

// removeUser = async (req,res){
//     const user = 
// }

module.exports = {
  createProject,
  addUserToAProject,
  getProjectsOfUser,
  getSingleProject
};
