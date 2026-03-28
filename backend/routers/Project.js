const express = require('express')
const router = express.Router()
const {createProject,
     addUserToAProject,
    getProjectsOfUser,
    getSingleProject} = require('../controllers/Project')

const authMiddleware = require('../middlewares/checkLogin')

router
.post('/createProject',createProject)
.post('/addUser/:token',addUserToAProject)
.get('/',getProjectsOfUser)
.get('/:projectID',getSingleProject)
.patch('/:projectID',authMiddleware.accessOnly(["Admin"]),updateProject)
.delete('/:projectID',authMiddleware.accessOnly(["Admin"]),deleteProject)

module.exports = router