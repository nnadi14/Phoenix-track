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
        const goal = await Goal.find({ user: req.user }).lean();
        res.render('dashboard', {
            'heading' : 'Dashboard',
            'date' : new Date(),
            user: req.user.username,
            'alert' : res.locals.message,
            'goals' : goal
        })
    } catch(err) {
        console.error(err);
        res.render('500');
    }
}
exports.addProject = function(req, res) {
    
    res.render('add', {
        'heading' : 'Add',
        user: req.user.username
    });
}