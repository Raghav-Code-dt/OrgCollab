const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    name: {
        type : String,
        required : true,
        maxLength : 50
        // trim : true         // used to trim data
    },
    createdById : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    description : {
        type : String,
        maxLength : 20000
    },
    members : [{                                                   // creater will always be a memeber
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"  ,
            required : true
        },
        role : {
            type: String,
            enum: ["admin", "member"],
            default: "member"
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }]
},{timestamps : true})

ProjectSchema.index({ createdById: 1, name: 1 }, { unique: true });
// will ensure uniqueness
ProjectSchema.index({ "members.userId": 1 });  // for fast queries , will ensure unique users are added into the db 
// this ensures data consistency

module.exports = mongoose.model("Project",ProjectSchema);

// Many to Many with Users