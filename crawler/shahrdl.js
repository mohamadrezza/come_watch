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
            var urls = $('a').eq(i).attr('href').replace('/C', '');
            var movieLinks = source + urls
            if (urls == '/web.config' || urls == '/') {
                return false;
            }
            var link = await rp(movieLinks)
            var xxx = cheerio.load(link)
            xxx('a').each(async test => {
                var ppp = xxx('a').eq(test).attr('href')
                var movieLinks = source + ppp
                if (ppp == '/' || ppp == '/L/Alarm/') {
                    return false
                }
                var dlPage = await rp(movieLinks)
                var page = cheerio.load(dlPage)
                page('a').each(async item => {
                    var name = page('a').eq(item).text()
                    var link = page('a').eq(item).attr('href')
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
                    fs.writeFileSync('./shahrdl.json',JSON.stringify(results))

                })
            })
            
        } catch (e) {
            console.log(e.message)
        }

    })
  
}).catch(err => {
    console.log(err.message)
})
