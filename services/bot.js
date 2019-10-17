let Movie = require('./../models/Movie');
let User = require('./../models/User');
let Search = require('./../models/Search');
let Log = require('./../models/Log')
let mongoose = require('mongoose')

const helper = require('./../helpers/helpers')

let userController = require('./../controller/UserController')




const canUseBot = async function (bot, user, chatId) {


    // return new Promise((resolve) => {
    //     resolve(true)
    // })


    let searchDone = await Log.find({
        user: user._id,
        type: "done"
    }).count();

    return new Promise(async (resolve) => {

        if (searchDone > 1) {
            bot.getChatMember(process.env.CHANNEL_USERNAME, chatId).then(res => {
                if (res.status === 'left') {
                    resolve(false)
                }
                resolve(true)
            }).catch(e=>{
                console.log(e)
            })
        } else {
            resolve(true)
        }
    })
}



exports.searchMovie = async (bot, msg, chatId) => {

    try {


        bot.sendMessage(chatId, `🔎درحال جستجو : ${msg.text}`);

        let movies = await Movie.find({
            name: {
                $regex: msg.text,
                $options: 'i'
            }
        }).select({
            'name': true
        }).limit(20);


        // let searchResultCount = await Movie.find({
        //     name: {
        //         $regex: msg.text,
        //         $options: 'i'
        //     }
        // }).count();


        let user = await userController.findOrCreate(msg.from);


        let canUseBotValue = await canUseBot(bot, user, chatId);
        if (!canUseBotValue) {
            bot.sendMessage(chatId, `⚠برای استفاده  نامحدود از این ربات کافیست تا در کانال ${process.env.CHANNEL_USERNAME} عضو شوید و سپس دوباره سعی کنید!!`)
            return false;
        }

        Search.create({
            input: msg.text,
            action: 'search',
            user: user._id
        });

        if (movies.length === 0) {
            Log.create({
                value: msg.text,
                type: "no_result_search",
                user: user._id
            })
            bot.sendMessage(chatId, "متاسفانه چیزی پیدا نکردیم😞\n ⚠فیلم درخواستی شما را ثبت کردیم و در اسرع وقت آن را به ربات اضافه خواهیم کرد و به شما اطلاع خواهیم داد")
            return true
        }


        if (movies.length === 1) {
            msg.text = '🎥' + movies[0].name
            this.selectMovie(bot, msg, chatId);
            return false;
        }


        bot.sendMessage(
            chatId,
            `خب حالا یکی از این فیلم ها رو انتخاب کن اگه نتیجه مورد نظرت توی لیست نبود یادت باشه یه نگاهی به آخر لیست هم بندازی :`, {
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




    let user = await userController.findOrCreate(msg.from);


    let canUseBotValue = await canUseBot(bot, user, chatId);
    if (!canUseBotValue) {
        bot.sendMessage(chatId, `⚠برای استفاده  نامحدود از این ربات کافیست تا در کانال ${process.env.CHANNEL_USERNAME} عضو شوید و سپس دوباره سعی کنید!!`)
        return false;
    }


    let movie = await Movie.findOneAndUpdate({
        name: {
            $regex:movieName,
            $options:"i"
        }
    }, {
        $inc: {
            views: 1
        }
    })

    Search.create({
        input: movieName,
        action: 'movie_select',
        user: user._id
    });


    if(movie === null){
        bot.sendMessage(chatId , "خطا در دریافت اطلاعات،با پشتیبانی تماس بگیرین😫");
        return false;
    }

    let cover = movie.cover;
    if (cover === null) {
        //get cover from api
        try {
            let movieSearches = await helper.searchMovieDB(movieName.replace(movie.year, ''));
            cover = movieSearches.results.length > 0 ? movieSearches.results[0].poster_path : null;
            cover = "https://image.tmdb.org/t/p/original" + cover;
            movie.cover = cover;
            await Movie.findOneAndUpdate({
                name: movieName
            }, {
                cover: cover
            })
        } catch (e) {
            console.log(e)
        }
    }



    if (movie.link.length <= 2) {
        await bot.sendMessage(chatId, "به همین راحتی میتونی فیلم مورد علاقت رو دانلود کنی،بهتر از اینم مگه میشه؟😍");


        let caption = `${movieName}\n`;


        movie.link.forEach(li => {
            caption += `📎 لینک دانلود: <a href="${li.link}">${(li.quality || "") + (li.release || "")}  ${li.size || ""} ${li.dubbed ? "Dubbed" : ""} ${li.censored ? "Censored" : ""}</a>\n`
        })


        caption += `ربات دانلود رایگان مستقیم فیلم\n@comewatch_bot`;


        Log.create({
            value: movieName,
            type: "done",
            user: user._id
        })


        if (!movie.cover) {
            await bot.sendMessage(chatId, caption, {
                parse_mode: "HTML"
            });

            bot.sendMessage(chatId, "نظرت چیه مارو به دوستات معرفی کنی تا ما هم انگیزه بگیریم و ربات رو کامل و کامل تر کنیم؟🤔");
            return true;
        }


        await bot.sendPhoto(chatId, movie.cover, {
            caption: caption,
            parse_mode: "HTML"
        });

        bot.sendMessage(chatId, "نظرت چیه مارو به دوستات معرفی کنی تا ما هم انگیزه بگیریم و ربات رو کامل و کامل تر کنیم؟🤔");



        return true;
    }

    bot.sendMessage(chatId,
        `✨ فیلم ${msg.text.replace('🎥' , '')} انتخاب شد\nحالا از بین لینک های زیر بین کیفیت های مختلف یکی رو انتخاب کن تا برات بفرستیم:`, {
            reply_markup: {
                keyboard: movie.link.map(link => {
                    return [`📥${link.quality || ""} ${link.release || ""} ${link.dubbed ? 'Dubbed' : ''} ${link.censored ? 'Censored' : ''} ${link.size? link.size.replace(" " , "") : ""}`.replace(/  +/g, ' ')]
                })
            }
        });


}


exports.linkSelect = async function (bot, msg, chatId) {

    let linkName = msg.text.replace('📥', '');

    let user = await userController.findOrCreate(msg.from);


    let canUseBotValue = await canUseBot(bot, user, chatId);
    if (!canUseBotValue) {
        bot.sendMessage(chatId, `⚠برای استفاده  نامحدود از این ربات کافیست تا در کانال ${process.env.CHANNEL_USERNAME} عضو شوید و سپس دوباره سعی کنید!!`)
        return false;
    }

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
    let movie = await Movie.findOne({
        name: movieName
    });


    let quality = helper.getQuality(linkName);
    let release = helper.getRelease(linkName);

    let size = helper.getSize(linkName);
    if (size) {
        size = size.replace(/(mb|gb|kb|bytes)/i, " $1");
    }
    let dubbed = helper.isDubbed(linkName);
    let censored = helper.isSansored(linkName);


    let links = movie.link.filter(lin => {
        
        if(lin.censored === undefined){
            lin.censored = false;
        }
        
        if(lin.dubbed === undefined){
            lin.dubbed = false;
        }

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

    let caption = `${movieName}\n📎 لینک دانلود: <a href="${links[0].link}">${(links[0].quality || "")  + (links[0].release || "")}  ${links[0].size || ""} ${links[0].dubbed ? 'Dubbed' : ''} ${links[0].censored ? 'Censored' : ''}</a>\nربات دانلود رایگان مستقیم فیلم\n@comewatch_bot`;




    Log.create({
        value: movieName,
        type: "done",
        user: user._id
    })

    if (!movie.cover) {
        await bot.sendMessage(chatId, caption, {
            parse_mode: "HTML"
        });


        bot.sendMessage(chatId, "نظرت چیه مارو به دوستات معرفی کنی تا ما هم انگیزه بگیریم و ربات رو کامل و کامل تر کنیم؟🤔");
        return false;
    }


    await bot.sendPhoto(chatId, movie.cover, {
        caption: caption,
        parse_mode: "HTML"
    });

    bot.sendMessage(chatId, "نظرت چیه مارو به دوستات معرفی کنی تا ما هم انگیزه بگیریم و ربات رو کامل و کامل تر کنیم؟🤔");
}


exports.welcome = async function (bot, msg, chatId) {
    userController.findOrCreate(msg.from);
    bot.sendMessage(
        chatId,
        `👋 سلام ${msg.from.first_name}\nبه ربات کامواچ خوش اومدی🎉\nمیتونی بین 20 هزارتا فیلم موجود در ربات جستجو کنی و ازش رایگان استفاده کنی🤩🤩\nفعلا فقط فیلم داریم و به زودی سریال ها و یه عالمه امکانات دیگه رو هم اضافه میکنیم😎\nاسم فیلم موردنظرت رو بنویس تا لینکش رو برات بفرستیم...`
    );
}