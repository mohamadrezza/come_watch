var express = require('express');
var router = express.Router();
var movieController = require ('../controller/MovieController')
var User = require('./../models/User')
const moment = require('moment');
const _ = require('lodash');
/* GET users listing. */
router.get('/', async function (req, res, next) {
    let users = await User.find({}).sort({
        created_at: -1
    }).limit(20);


    let totalUserCount = await User.find({}).count();


    let today = new Date();
    let thisHourUsers = await User.find({
        created_at: {
            $lt: new Date(),
            $gt: new Date(today.getTime() - (1000 * 60 * 60))
        }
    }).count();


    let todayUsers = await User.find({
        created_at: {
            $lt: new Date(),
            $gt: moment().startOf('day').format()
        }
    });

    // for (moment().startOf('day').)

    // let todayUsersChart = todayUsers.map(function () {
    //
    // })

    let todayUsersChart = _.groupBy(todayUsers, function (user) {
        return moment(user.created_at).get('hour');
    })
    todayUsersChart = _.mapValues(todayUsersChart, (users) => {
        return users.length;
    })

    await res.json({
        totalUsers: totalUserCount,
        thisHourUsers: thisHourUsers,
        todayUsersChart: todayUsersChart,
        todayUsers: todayUsers.length,
        recent: users,
    })
});
// router.get('/create',User.create)
router.get('/delete',movieController.delete)
module.exports = router;
