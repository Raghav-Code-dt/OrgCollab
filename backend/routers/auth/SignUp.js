const express = require('express')

const router = express.Router();

const {setUser} = require('../../controllers/User')

router.post('/',setUser);

module.exports = router