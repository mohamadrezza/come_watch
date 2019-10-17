var express = require('express');
var router = express.Router();
var Search = require('./../models/Search')
var Movie = require('./../models/Movie')
var Log = require('./../models/Log')
const moment = require('moment');
const _ = require('lodash');
/* GET users listing. */
router.get('/', async function (req, res, next) {
    let searchesRecent = await Search.find({}).sort({
        created_at: -1
    }).populate('user').limit(40);

    let mostViewsMovies = await Movie.find({}).sort({views: -1}).limit(20).select(['name', 'views', 'cover']);

    await res.json({
        mostViewsMovies,
        recent: searchesRecent
    })
});
// router.get('/create',User.create)
module.exports = router;
