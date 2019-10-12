var express = require('express');
var router = express.Router();
var User = require ('../controller/UserController')
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/create',User.create)
module.exports = router;
