const express = require('express');
const controller = require('../controllers/controller');
const router = express.Router();

router.get("/", controller.welcome);



router.use(function(req, res) {
    res.status(404);
    res.render('404');
})

router.use(function(err, req, res, next){
    res.status(500);
    res.render('500');
})

module.exports = router;