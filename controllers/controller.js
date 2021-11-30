const express = require('express');
const passport = require('passport');
const User = require("../models/user");
const Goal = require("../models/goals");
const bcrypt = require('bcrypt');
exports.welcome = function(req, res) {
    res.render('home', {
        'heading' : 'Welcome'
    });
}
exports.user_login = function(req, res) {
    res.render('login', {
        'heading' : 'Login',
        'alert1' : res.locals.success_msg,
        'alert2' : res.locals.error_msg,
        'alert3' : res.locals.error
    });
}
exports.after_signup = function(req, res) {

    const {username,email, password, password2} = req.body;
    console.log(req.body);
    let errors = [];
    console.log(' Username ' + username+ ' email :' + email+ ' pass:' + password);
    
    if(!username || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }    
   
    else if(password.length < 6 ) {
        errors.push({msg : 'Password should be more than 6 characters'})
    }
    else if(password !== password2) {
        errors.push({msg : "Passwords don't match"});
    }
    else {
        console.log('');
    }

    if(errors.length > 0 ) {
        res.render('signup', {
            'heading' : 'signup',
            'errors' : errors
            })
    } else {
    
        User.findOne({email : email}).exec((err,user)=>{
            console.log(user);   
            if(user) {
                errors.push({msg: 'Email has already been used'});
                res.render('signup', {
                    'heading' : 'signup',
                    'errors' : errors
                    })
            } else {
                const newUser = new User({
                    username : username,
                    email : email,
                    password : password
                });
              
                bcrypt.genSalt(10,(err,salt)=> 
                bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','Welcome to Phoenix tracker')
                        res.redirect('/users/login');
                    })
                    .catch(value=> console.log(value));
                      
                }));
            }
        })
    }
}
exports.user_post_login = function(req, res, next) {
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true,
    })(req,res,next);
}

exports.dashboard = async(req, res) =>{
    try {
        const date = new Date();

        function convertDate(date) {
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();
          
            var mmChars = mm.split('');
            var ddChars = dd.split('');
          
            return (ddChars[1]?dd:"0"+ddChars[0]) + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + yyyy;
          }

        convertDate(date);
        const goal = await Goal.find({ user: req.user }).lean();
        res.render('dashboard', {
            'heading' : 'Dashboard',
            'date' :  convertDate(date),
            user: req.user.username,
            'alert' : res.locals.message,
            'goals' : goal
        })
    } catch(err) {
        console.error(err);
        res.render('500');
    }
}
exports.addGoal = function(req, res) {
    
    res.render('add', {
        'heading' : 'Add',
        user: req.user.username
       
    });
}
exports.post_goal = async(req, res) =>{

    if(!req.body.goal) {
        res.status(400).send("Goal required");
        return;
    }
    if(!req.body.started) {
        res.status(400).send("Date required");
        return;
    }
    if(!req.body.description) {
        res.status(400).send("Description");
        return;
    }

    try {
        req.body.user = req.user.id;
        await Goal.create(req.body);
        req.flash('message', 'Goal added'); 
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
        res.render('500');
    }
}
exports.share = async(req, res) => {
    try {
        const goal = await Goal.find({ user: req.user }).lean();
        res.render('share', {
            'heading' : 'Share',
            'date' : new Date(),
            user: req.user.username,
            'goals' : goal
        })
    } catch(err) {
        console.error(err);
        res.render('500');
    }
}
exports.mark_complete = async (req, res) => {

    try {
        await Goal.updateOne({ _id: req.params.id }, {status: 'Complete'});
        req.flash('message', 'No pain no gain!'); 
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
        res.render('500');
    }
}

exports.completed = async(req, res) => {

    try {
        const goal = await Goal.find({ user: req.user, status:"Completed" }).lean();
        res.render('completed', {
            'heading' : 'Completed goals',
            'date' : new Date(),
            user: req.user.username,
            'goals' : goal
        })
    } catch(err) {
        console.error(err);
        res.render('500');
    }
}
exports.delete = async (req, res) => {

    try {
        await Goal.deleteOne({ _id: req.params.id });
        req.flash('message', 'Your project has been successfully removed!'); 
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
        res.render('500');
    }
}