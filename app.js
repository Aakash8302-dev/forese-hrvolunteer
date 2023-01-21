const path = require('path');
const express = require('express');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const memberRouter = require('./routes/memberRoutes.js');

const isLoggedIn = require('./middleware/auth');
const errorHandler = require('./middleware/error');


const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views/'));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(
    methodOverride((req, res) => {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
      }
    })
);


app.use(express.static(path.join(__dirname, '/public')));

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
};
app.use(session(sessionConfig));


app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(cookieParser());

app.get('/', isLoggedIn, async (req, res, next) => {
  let students;

  // if (req.user.name === process.env.ADMIN_NAME) {
  //   students = await Student.find({}).sort('-createdAt');
  // } else {
  //   students = await Student.find({ member: req.user._id }).sort('-createdAt');
  // }

  res.render('members/index.ejs', {member: req.user });
});


app.use('/members', memberRouter);


app.use(errorHandler);

module.exports = app;