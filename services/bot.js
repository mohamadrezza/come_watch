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

        Search.create({
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

    Search.create({
        input: movieName,
        action: 'movie_select',
        user: user._id
    });


    let cover = movie.cover;
    if (cover === null) {
        //get cover from api
        try {
            let movieSearches = await helper.searchMovieDB(movieName.replace(movie.year, ''));
            cover = movieSearches.results.length > 0 ? movieSearches.results[0].poster_path : null;
            cover = "https://image.tmdb.org/t/p/original" + cover;
            await Movie.findOneAndUpdate({
                name: movieName
            }, {
                cover: cover
            })
        } catch (e) {
            console.log(e)
        }
    }

    bot.sendMessage(chatId,
        `✨ فیلم ${msg.text.replace('🎥' , '')} انتخاب شد\nحالا از بین لینک های زیر بین کیفیت های مختلف یکی رو انتخاب کن تا برات بفرستیم:`, {
            reply_markup: {
                keyboard: movie.link.map(link => {
                    return [`📥${link.quality} ${link.release || ""} ${link.dubbed ? 'Dubbed' : ''} ${link.censored ? 'Censored' : ''} ${link.size? link.size.replace(" " , "") : ""}`.replace(/  +/g, ' ')]
                })
            }
        });


}


exports.linkSelect = async function (bot, msg, chatId) {

    let linkName = msg.text.replace('📥', '');

    let user = await userController.findOrCreate(msg.from);

    let movieName = await Search.findOne({
            action: 'movie_select',
            user: user._id
        }).sort({
            created_at: -1
        })
        .select(['input'])


    if (!movieName.input) {
        bot.sendMessage(chatId, "خطا در دریافت اطلاعات،با پشتیبانی تماس بگیرین😫");
        return false;
    }

    movieName = movieName.input;
    console.log(movieName)


    let movie = await Movie.findOne({
        name: movieName
    });


    let quality = helper.getQuality(linkName);
    let release = helper.getRelease(linkName);
    
    let size = helper.getSize(linkName);
    if(size){
        size = size.replace(/(mb|gb|kb|bytes)/i, " $1");
    }
    let dubbed = helper.isDubbed(linkName);
    let censored = helper.isSansored(linkName);


    let links = movie.link.filter(lin => {
        return lin.quality == quality &&
            lin.release == release &&
            lin.size == size &&
            lin.dubbed == dubbed &&
            lin.censored == censored;
    })


    if (links.length === 0) {
        bot.sendMessage(chatId, "دریافت لینک با خطا روبرو شد با پشتیبانی تماس بگیرین😫");
        return false;
    }

    bot.sendMessage(chatId, "به همین راحتی میتونی لینک دانلودت آماده شد،بهتر از اینم مگه میشه؟😍");
  
    
    let caption = `${movieName}\n📎 لینک دانلود: <a href="${links[0].link}">${(links[0].quality || "") + (links[0].release || "")}  ${links[0].size || ""}</a>\nربات دانلود رایگان مستقیم فیلم و سریال\n@comewatch_bot`;

    if (!movie.cover) {
        bot.sendMessage(chatId, caption,{parse_mode : "HTML"});
        return false;
    }


    bot.sendPhoto(chatId, movie.cover, {
        caption: caption,
        parse_mode : "HTML"
    });

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