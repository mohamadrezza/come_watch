var express = require('express');
var controller = require ('../controller/MovieController')
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send({title: 'Express'});
});

//movies controller : create,find,...
router.get('/create',controller.create)
router.get('/find',controller.find)

module.exports = router;
