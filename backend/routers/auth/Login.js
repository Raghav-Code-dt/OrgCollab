const express = require('express')

const router = express.Router();

const {getUser,forgotpassword , resetpassword} = require('../../controllers/User')

router.post('/',getUser)
      .post('/forgotpassword',forgotpassword)
      .post('/resetpassword/:token',resetpassword)

module.exports = router