var cheerio = require('cheerio')
var rp = require('request-promise')
var helper = require('../helpers/helpers')
var sources = [
    'http://dl.mellimovies.com/Movie_EN/98/2/',
    'http://dl.mellimovies.com/Movie_EN/98/3/',
    'http://dl.mellimovies.com/Movie_EN/98/4/',
    'http://dl.mellimovies.com/Movie_EN/98/5/',
    'http://dl.mellimovies.com/Movie_EN/98/6/',
    'http://dl.mellimovies.com/Movie_EN/98/7/',
]

async function scrap() {
    sources.forEach(async source => {
        try {
            var response = await rp(source)
            var $ = cheerio.load(response)
            $('a').each(async item => {
                var link = $('a').eq(item).attr('href')
                if (link != '../') {
                    var data = await rp(source + link)
                    var movie = cheerio.load(data)
                    movie('a').each(async item => {
                        try {
                            var movieData = movie('a').eq(item).attr('href')
                            if (movieData != '../') {
                                var dlLink = source + link + movieData
                                var year = helper.getYearFromMovieName(movieData)
                                var file = await rp(dlLink, {
                                    method: 'HEAD'
                                })
                                if (!movieData.includes('jpg') && !movieData.includes('zip')) {
                                    var result = {
                                        year: year,
                                        name: helper.parseMovieName(movieData, year),
                                        quality: helper.getQuality(movieData),
                                        release: helper.getRelease(movieData),
                                        dubbed: helper.isDubbed(movieData),
                                        link: dlLink,
                                        size: helper.bytesToSize(file['content-length'])
                                    }
                                    console.log(result)
                                }
                            }
                        } catch (e) {
                            console.log(e.message)
                        }


                    })
                }

            })
        } catch (e) {
            console.log(e.message)
        }
    })
}

scrap()