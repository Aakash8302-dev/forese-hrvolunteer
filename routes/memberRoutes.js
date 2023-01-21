const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/auth.js')
const {registerMember, renderLogin, loginMember, logout, renderCreate, createStudent, searchStudent, addCompany}  = require("../controller/memberController.js")

router.route('/register').post(registerMember);
router.route('/login').get(renderLogin).post(loginMember);
router.route('/logout').get(logout)
router.route('/create').get(isLoggedIn, renderCreate).post(isLoggedIn, createStudent)
router.route("/").get(isLoggedIn, searchStudent)
router.route("/:id").post(isLoggedIn, addCompany)

module.exports = router