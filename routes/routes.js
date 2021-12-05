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
router.get('/edit/:id', ensureAuthenticated, controller.edit);
router.post('/edit/:id', ensureAuthenticated, controller.update);
router.get('/logout', controller.logout);
router.get('/goal/:id', ensureAuthenticated, controller.project_card);
router.post('/search', ensureAuthenticated, controller.search);
router.get('/share/:id', ensureAuthenticated, controller.share_project);

router.use(function(req, res) {
    res.status(404);
    res.render('404');
})

router.use(function(err, req, res, next){
    res.status(500);
    res.render('500');
})

module.exports = router;