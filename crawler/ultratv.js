var cheerio = require('cheerio')
var helper = require('../helpers/helpers')
var rp = require('request-promise')
var source = 'http://moviebuzz.one/Data/Movies/Hollywood/'
var fs = require('fs')
//done 

async function crawl() {
    try {
        var branches = await rp(source)
        var $ = cheerio.load(branches)

        $('a').each(async item => {
            var branchLink = $('a').eq(item).text()
            if (branchLink != '../'&&branchLink!='Batch219/'&&branchLink!='Batch220/') {
                var movieList = source + branchLink
                var moviesPage = await rp(movieList)
                var htmlPage = cheerio.load(moviesPage)
                htmlPage('a').each(async i => {
                    var movie = htmlPage('a').eq(i).attr('href')
                    if (movie != '../'&&!movie.includes('../') && !movie.includes('Batch219/')&&!movie.includes('srt')&&!movie.includes('SRT')) {
                 
                        var quality = helper.getQuality(movie)
                        var release = helper.getRelease(movie)
                        var year = helper.getYearFromMovieName(movie)
                        var name = helper.parseMovieName(movie, year)
                        var link = source + branchLink + movie
                        try {
                            var file = await rp(link, {
                                method: 'HEAD'
                            })
                            var size = helper.bytesToSize(file['content-length'])
                            var result = {
                                name: name,
                                year: year,
                                link:{
                                    link: link,
                                    size: size,
                                    release: release,
                                    quality: quality,
                                    dubbed:helper.isDubbed(movie),
                                    censored:helper.isSansored(movie)
                                }
                            }
                            console.table(result)
                            // fs.appendFileSync('../bin/ultratv.json', JSON.stringify(result)+',')
                        } catch (e) {
                            console.log(e.message)
                        }

                    }
                })

            }
        })



    } catch (error) {
        console.log(error.message)
    }
}

crawl()