const Member = require("../models/Member.js")
const Student = require("../models/Student.js")
const asyncHandler = require('../middleware/async');

const renderLogin = (req,res, next) => {
    res.render("members/login");
}

const renderCreate = (req,res, next) => {
  res.render("members/create");
}

const registerMember = asyncHandler(async (req, res, next) => {
    const { name, email, password, password2 } = req.body;
  
    // Check if passwords match
    if (password !== password2) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/members/register');
    }
  
    const member = await Member.create({ name, email, password });
  
    // Send token response
    sendTokenResponse(member, req, res);
  });


const loginMember = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    const member = await Member.findOne({ email: email }).select('+password');
  
    // Check if member exists
    if (!member) {
      req.flash('error', 'No such member exists. Please register first.');
      return res.redirect('/members/login');
    }
  
    // Check if password matches
    const isMatch = await member.matchPassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid Login Credentials.');
      return res.redirect('/members/login');
    }
  
    // Send token response
    sendTokenResponse(member, req, res);
  });


const createStudent = asyncHandler(async(req,res, next) => {
    const {name, reg, dept, email } = req.body;

      try {

        if(!name || !reg || !dept || !email){
          throw new Error("Please Input All Values")
        }else if(!(/^[A-Za-z]+$/).test(name)){
          throw new Error("Invalid Name")
        }else if(!(/^[0-9]+$/).test(reg) || !reg.length==13 ){
          throw new Error("Invalid Registration Number")
        }else if( !(/@/).test(email)){
          throw new Error("Invalid Email")
        }

        const exist = await Student.find({reg});

        if(exist && exist.length > 0){
          req.flash('error', "Student Exists");
          res.redirect("/members/create")
        }else{
          const student = await Student.create({name, email, reg, dept});

          if(student){
            req.flash('success', `Student Created`);
            res.redirect(`/members?reg=${reg}`)
          }
        }

      } catch (error) {
          req.flash('error', `${error.message}`);
          res.redirect("/members/create")
      }
  });


  const searchStudent = asyncHandler(async(req,res, next) => {
      const reg = req.query.reg;

    try {

      if(!reg || reg.length<13){
        throw new Error("Enter valid Registration Number")
      }

      const student = await Student.find({reg});

      if(student.length>0){
        res.render("members/student", {student: student[0]});
        req.flash('success', `Student Found`);
      }else{
        req.flash('error', 'Student does not exist')
        res.redirect('/')
      }

    } catch (error) {
        req.flash('error', `${error.message}`);
        res.redirect("/")
    }
  }); 

  const addCompany = asyncHandler(async(req,res, next) => {

      const reg = req.params.id;
      const {company, mode} = req.body;

      try {

        if(!company.length >0 || !mode.length >0){
          throw new Error("Enter valid details")
        }

        const student = await Student.findOne({reg});

        let companyObj ={
          name :company,
          mode
        }
  
        student.company.push(companyObj);
        if(!student.companyCount){
          student.companyCount = 1;
        }else{
          student.companyCount = student.companyCount + 1;
        }
        await student.save();

        req.flash('success', "Updated successfully");
        res.redirect(`/members?reg=${reg}`)

      } catch (error) {
        req.flash('error', `${error.message}`);
        res.redirect(`/members?reg=${reg}`)
      }
      
  });


  const logout = (req, res, next) => {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
  
    req.flash('success', 'You have logged out');
    res.redirect('/members/login');
  };


  const sendTokenResponse = (member, req, res) => {
    const token = member.getSignedJwtToken();
  
    const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
  
    req.flash('success', `Welcome, ${member.name}`);
    res.cookie('token', token, options).redirect('/');
  };

  module.exports = {
    renderLogin,
    registerMember,
    loginMember,
    logout,
    renderCreate,
    createStudent,
    searchStudent,
    addCompany
  }