var cheerio = require('cheerio')
var fs = require('fs')
var rp = require('request-promise')
var source = 'http://aurares.potato.moe/vrc/'
var helper = require ('../helpers/helpers')
//done
async function crawl() {
    try {
        var page = await rp(source)
        var $ = cheerio.load(page)
        $('a').each(async item => {
            try {
                var movie = $('a').eq(item).text()
                if(movie!='../'){
                    var name=helper.parseMovieName(movie)
                    var link = source+movie
                    var file =await rp.head(link)
                    var quality=helper.getQuality(link)
                    if(quality==null){
                        quality='720'
                    }
                    var result = {
                        name:name,
                        link:{
                            quality:quality+'p',
                            link:link,
                            size:helper.bytesToSize(file['content-length']),
                            dubbed:false,
                            censored:false
                        }

                    }
                    fs.appendFileSync('../bin/aurares.json',JSON.stringify(result)+',')
                }
            } catch (e) {
                console.log(e.message)
            }
        })
    } catch (e) {
        console.log(e.message)
    }

}

crawl()