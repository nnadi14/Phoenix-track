const express = require('express');
const controller = require('../controllers/controller');
const {ensureAuthenticated} = require("../config/auth.js")
const router = express.Router();

router.get("/", controller.welcome);
router.get("/dashboard", ensureAuthenticated, controller.dashboard);

router.get('/add', ensureAuthenticated, controller.addGoal);

router.post('/add', ensureAuthenticated, controller.post_goal);
router.get('/share', ensureAuthenticated, controller.share);
router.get('/completed', ensureAuthenticated, controller.completed);
router.get('/completed/:id', ensureAuthenticated, controller.mark_complete);
router.get('/delete/:id', ensureAuthenticated, controller.delete);



router.use(function(req, res) {
    res.status(404);
    res.render('404');
})

router.use(function(err, req, res, next){
    res.status(500);
    res.render('500');
})

module.exports = router;