const express = require('express')
const router = express.Router()
const {createProject,
     addUserToAProject,
    getProjectsOfUser,
    getSingleProject,
    removeUser} = require('../controllers/Project')

const authMiddleware = require('../middlewares/checkLogin')

router
.post('/createProject',createProject)
.get('/',getProjectsOfUser)
.get('/:projectID',getSingleProject)
.patch('/:projectID',authMiddleware.accessOnly(["Admin"]),updateProject)
.delete('/:projectID',authMiddleware.accessOnly(["Admin"]),deleteProject)
.post('/addUser/:token',addUserToAProject)
.patch('/:projectID/removeUser/:memeberID',authMiddleware.accessOnly(["Admin"]),removeUser)

module.exports = router