const express = require('express')
const router = express.Router()
const {createProject,
     addUserToAProject,
    getProjectsOfUser,
    getSingleProject,
    removeUser,
    updateUserRole,
    getMembers
} = require('../controllers/Project')

const projectUpdateMiddleware = require('../middlewares/projectUpdateMiddleware')

router
.post('/createProject',createProject)
.get('/',getProjectsOfUser)

.post('/:projectID/addUser/:token',addUserToAProject)

.get('/:projectID',projectUpdateMiddleware.defineRole,projectUpdateMiddleware.accessOnly(["admin","member"]),getSingleProject)
.patch('/:projectID',projectUpdateMiddleware.defineRole,projectUpdateMiddleware.accessOnly(["admin"]),updateProject)
.delete('/:projectID',projectUpdateMiddleware.defineRole,projectUpdateMiddleware.accessOnly(["admin"]),deleteProject)
.delete('/:projectID/removeUser/:memberID',projectUpdateMiddleware.defineRole,projectUpdateMiddleware.accessOnly(["admin"]),removeUser)
.get('/:projectID/members',projectUpdateMiddleware.defineRole,projectUpdateMiddleware.accessOnly(["admin","member"]),getMembers)
.patch('/:projectID/updateUserRole/:memberID',projectUpdateMiddleware.defineRole,projectUpdateMiddleware.accessOnly(["admin"]),updateUserRole)

module.exports = router