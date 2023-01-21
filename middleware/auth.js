const jwt = require('jsonwebtoken');
const Member = require('../models/Member.js');

// Protect Routes
const isLoggedIn = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    req.flash('error', 'Please log in to view the page');
    return res.redirect('/members/login');
  }


  // Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await Member.findById(decoded.id);

    next();
  } catch (err) {
    req.flash('error', 'Please log in to view the page');
    console.log(err)
    return res.redirect('/members/login');
  }
};

module.exports = isLoggedIn;
