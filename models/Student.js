const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  dept:{
    type: String,
    required: true,
    trim: true,
  },
  reg:{
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  company:[{
    name:{
        type: String,
        trim: true
    },
    mode:{
        type: String,
        trim: true
    },
  }],
  companyCount:{
    type: Number,
    trim: true
  }
});


const Student = mongoose.model('Student', StudentSchema, 'Students');
module.exports = Student;
