var cheerio = require('cheerio')
//
var rp = require('request-promise')
var fs = require('fs')
var helper = require('../helpers/helpers')
var source = 'http://one75tv.com/SERIES/English/Peaky.Blinders/'
async function crawl() {
    var data = await rp(source)
    var $ = cheerio.load(data)
    $('tr').each(async item => {
        var seasonLink = $('tr').eq(item).find('a').attr('href')
        if (seasonLink != '/SERIES/English/' && seasonLink != undefined && seasonLink != '?C=N;O=D') {
            var seasonName = seasonLink.match(/S?0*(\d+)?[xS]0*(\d+)/)
            var url = await rp(source + seasonLink)
            var data = cheerio.load(url)
            data('tr').each(async i => {
                var episode = data('tr').eq(i).find('a').attr('href')
                if (episode != '/SERIES/English/' && episode != undefined && episode != '?C=N;O=D'&&episode!='/SERIES/English/Peaky.Blinders/') {
                    var dlLink =source+seasonLink+episode
                    var quality ='720p'
                    var release='Bluray'
                    var file =await rp.head(dlLink)
                    var size =helper.bytesToSize(file['content-length'])
                    var result={
                        name:'Peaky Blinders',
                        year:'2013-',
                        isSeries:true,
                        link:{
                            link:dlLink,
                            size:size,
                            release:release,
                            quality:quality,
                            isDubbed:false,
                            isCensored:false,
                            season:seasonName[2],
                            episode:episode.replace('Ep0','').replace('.mp4','')

                        }
                    }

                    fs.appendFileSync('../bin/peaky.json',JSON.stringify(result)+',')
                }
            })
        }
    })
}
crawl()