const cheerio = require('cheerio')
var helper = require('../helpers/helpers')
var rp = require('request-promise')
var fs = require('fs')
var source = 'http://dl11.difid.ir'
var results = []
var errors = []
rp(source).then(htmlString => {
    const $ = cheerio.load(htmlString)
    $('a').each(async (i) => {
        try {
            var urls = $('a').eq(i).attr('href');
            var movieLinks = source + urls
            if (urls == '/web.config' || urls == '/') {
                return false;
            }
            var link = await rp(movieLinks)
            var page = cheerio.load(link)
            page('a').each(async test => {
                var route = page('a').eq(test).attr('href')
                var movieLinks = source + route
                if (route == '/' || route == '/L/Alarm/') {
                    return false
                }
                var dlPage = await rp(movieLinks)
                var nextPage = cheerio.load(dlPage)
                nextPage('a').each(async item => {
                    var name = nextPage('a').eq(item).text()
                    var link = nextPage('a').eq(item).attr('href')
                    let year = helper.getYearFromMovieName(name);
                    let parsedName = helper.parseMovieName(name, year)
                    var dlLink = source + link
                    if (link == '/') {
                        return false
                    }
                    var result = {
                        name: parsedName,
                        link: dlLink,
                        year: year,
                        size: "!!!",
                        dubbed: helper.isDubbed(name)

                    }
                    if (!helper.isValidExt(name)) {
                        errors.push(result)
                        return false
                    } else {
                        results.push(result)
                      
                    }
                })
            })
    console.log(results)
            
        } catch (e) {
            console.log(e.message)
        }

    })
  
}).catch(err => {
    console.log(err.message)
})
