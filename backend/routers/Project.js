const express = require('express')
const router = express.Router()
const {createProject,
     addUserToAProject,
    getProjectsOfUser,
    getSingleProject} = require('../controllers/Project')

router
.post('/createProject',createProject)
.post('/addUser/:token',addUserToAProject)
.get('/',getProjectsOfUser)
.get('/:projectID',getSingleProject)

module.exports = router