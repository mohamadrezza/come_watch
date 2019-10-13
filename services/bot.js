let Movie = require('./../models/Movie');
let User = require('./../models/User');
let Search = require('./../models/Search');
let mongoose = require('mongoose')
const helper = require('./../helpers/helpers')

let userController = require('./../controller/UserController')





exports.searchMovie = async (bot, msg, chatId) => {

    try {
        let movies = await Movie.find({
            name: {
                $regex: msg.text,
                $options: 'i'
            }
        }).select({
            'name': true
        });



        let user = await userController.findOrCreate(msg.from);

        await Search.create({
            input: msg.text,
            action: 'search',
            user: user._id
        });

        bot.sendMessage(chatId, `🔎درحال جستجو : ${msg.text}`);

        bot.sendMessage(
            chatId,
            `${movies.length} تا فیلم پیدا کردم
خب حالا یکی از این فیلم ها رو انتخاب کن اگه نتیجه مورد نظرت توی لیست نبود یادت باشه یه نگاهی به آخر لیست هم بندازی :
        `, {
                reply_markup: {
                    keyboard: movies.map(movie => {
                        return ['🎥' + movie.name]
                    })
                }
            }
        );
    } catch (e) {
        console.log(e)
    }
}




exports.selectMovie = async (bot, msg, chatId) => {

    let movieName = msg.text.replace('🎥', '');


    let movie = await Movie.findOneAndUpdate({
        name: movieName
    }, {
        $inc: {
            views: 1
        }
    })

    let user = await userController.findOrCreate(msg.from);

    await Search.create({
        input: movieName,
        action: 'movie_select',
        user: user._id
    });


    let cover = movie.cover;
    if (cover === null) {
        //get cover from api

        let movieSearches = await helper.searchMovieDB(movieName.replace(movie.year, ''));
        cover = movieSearches.results.length > 0 ? movieSearches.results[0].poster_path : null;
        cover = "https://image.tmdb.org/t/p/original" + cover;
        await Movie.findOneAndUpdate({
            name: movieName
        }, {
            cover: cover
        })
    }

    // bot.sendMessage(chatId, "selected movie: " + msg.text);
    bot.sendPhoto(
        chatId,
        cover, {
            caption: `${movieName}\nربات دانلود رایگان مستقیم فیلم و سریال\n@comewatch_bot`
        }
    );

    // bot.sendMessage(
    //     chatId,
    //     "i found 5 movies\nplease select movie to give u link", {
    //         reply_markup: {
    //             keyboard: [
    //                 ["📥 720p Bluray 678MB"],
    //                 ["📥 1080p WEB-DL 2021MB"]
    //             ]
    //         }
    //     }
    // );

}