var cheerio = require('cheerio')
var rp = require('request-promise')
var sources = [
    'http://dl.mellimovies.com/Movie_EN/98/2/',
    'http://dl.mellimovies.com/Movie_EN/98/3/',
    // 'http://dl.mellimovies.com/Movie_EN/98/4/',
    // 'http://dl.mellimovies.com/Movie_EN/98/5/',
    // 'http://dl.mellimovies.com/Movie_EN/98/6/',
    // 'http://dl.mellimovies.com/Movie_EN/98/7/',
]

async function scrap() {
    sources.forEach(async source => {
        var response = await rp(source)
        var $ = cheerio.load(response)
        $('a').each(async item => {
            var link = $('a').eq(item).attr('href')
            if (link != '../') {
                var data = await rp(source + link)
                var movie = cheerio.load(data)
                movie('a').each(item => {
                    var movieData = movie('a').eq(item).attr('href')
                    if (movieData != '../') {
                        var dlLink=source+link+movieData
                        
                      
                    }
                })
            }
        })
    })
}

scrap()