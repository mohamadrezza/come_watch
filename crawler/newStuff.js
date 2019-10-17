// faghanse ...
var cheerio = require('cheerio')
var rp = require('request-promise')
var helper = require('../helpers/helpers')
var fs = require('fs')
var source = 'http://5.135.165.69/'
//done
async function crawl() {
    try {
        var moviePage = await rp(source)
        var $ = cheerio.load(moviePage)
        $('tr').each(async item => {
            var movie = $('a').eq(item).text()
            if (helper.isValidExt(movie)) {
                var quality = helper.getQuality(movie)
                var release = helper.getRelease(movie)
                var year = helper.getYearFromMovieName(movie)
                var name = helper.parseMovieName(movie, year)
                var link = source + movie
                var file = await rp(link, {
                    method: 'HEAD'
                })
                var size = helper.bytesToSize(file['content-length'])
                var result = {
                    name: name,
                    year: year,
                    link: {
                        link: link,
                        size: size,
                        release: release,
                        quality: quality,
                        dubbed:false,
                        censored:false
                    }

                }
                fs.appendFileSync('../bin/newStuff.json', JSON.stringify(result)+',')
            }
        })





    } catch (e) {
        console.log(e.message)
    }
}

crawl()