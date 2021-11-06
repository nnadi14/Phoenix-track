const express = require('express');
const passport = require('passport');
const User = require("../models/user");
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
exports.user_post_register = function(req, res) {

    const {username,email, password, password2} = req.body;
    console.log(req.body);
    let errors = [];
    console.log(' Username ' + username+ ' email :' + email+ ' pass:' + password);
    
    if(!username || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }    
    //check if password is more than 6 characters
    else if(password.length < 6 ) {
        errors.push({msg : 'Ensure password is more than 6 characters'})
    }
    //check if match
    else if(password !== password2) {
        errors.push({msg : "Passwords don't match"});
    }
    else {
        console.log('No errors');
    }

    if(errors.length > 0 ) {
        res.render('register', {
            'heading' : 'register',
            'errors' : errors
            })
    } else {
        //validation passed
        User.findOne({email : email}).exec((err,user)=>{
            console.log(user);   
            if(user) {
                errors.push({msg: 'Email already registered'});
                res.render('register', {
                    'heading' : 'register',
                    'errors' : errors
                    })
            } else {
                const newUser = new User({
                    username : username,
                    email : email,
                    password : password
                });
                //hash password
                bcrypt.genSalt(10,(err,salt)=> 
                bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                        //save user
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
};