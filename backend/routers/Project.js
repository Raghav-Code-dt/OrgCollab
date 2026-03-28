const express = require('express')
const router = express.Router()
const {createProject, addUserToAProject} = require('../controllers/Project')

router
.post('/createProject',createProject)
.post('/addUser/:token',addUserToAProject)

module.exports = router