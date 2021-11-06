const express= require ('express');
const router = express.Router();
const passport = require('passport');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const mustache = require('mustache-express');
const  MongoStore = require('connect-mongo')(session);




// DB config
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB atlas Connected...'))
    .catch(err => console.log(err))

const app = express();

app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

//require('./config/passport')(passport)




//use flash
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    res.locals.message = req.flash('message');
    next();
})

const public = path.join(__dirname, 'public');
app.use(express.static(public));


app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^c to quit.');
})
app.use('/users', require('./routes/users'));
app.use('/', require('./routes/routes'));

