var cheerio = require('cheerio')
var helper = require('../helpers/helpers')
var fs = require('fs')
var rp = require('request-promise')
var sources = ['http://9092.ultratv100.com:9090/movies/Batch219/', 'http://9092.ultratv100.com:9090/movies/Batch220/']
//done
async function crawl() {
    sources.forEach(async source => {
        var data = await rp(source)
        var $ = cheerio.load(data)
        $('a').each(async i => {
            var movieAddress = $('a').eq(i).attr('href')
            if (movieAddress != '../')
                try {
                    var moviePage = await rp(source + movieAddress)
                    var data = cheerio.load(moviePage)
                    data('a').each(async element => {
                        try {
                            var movie = data('a').eq(element).text()
                            if (helper.isValidExt(movie)) {
                                var dlLink = source + movieAddress + movie
                                var year = helper.getYearFromMovieName(movie)
                                var name = helper.parseMovieName(movie, year)
                                var file = await rp(dlLink, {
                                    method: 'HEAD'
                                })
                                if(helper.isValidExt(name)){
                                    var result = {
                                        name: name,
                                        year: year,
                                        link: {
                                            quality: helper.getQuality(dlLink),
                                            release: helper.getRelease(dlLink),
                                            dubbed: helper.isDubbed(dlLink),
                                            censored:helper.isSansored(movie),
                                            link: dlLink,
                                            size: helper.bytesToSize(file["content-length"])
                                        }
                                 
                                }
                                  }
                                fs.appendFileSync('../bin/batches.json', JSON.stringify(result)+',')
                            }
                        } catch (e) {
                            console.log(e.message)
                        }
                    })
                } catch (e) {
                    console.log(e.message)
                }

        })
    })
}
crawl()