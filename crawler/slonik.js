var source = 'http://www.slonik.dasiu.pl/amovies/'
var helper = require('../helpers/helpers')
var fs = require('fs')
var cheerio = require('cheerio')
var rp = require('request-promise')
//done
async function crawl() {
    var page = await rp(source)
    var $ = cheerio.load(page)
    $('a').each(async item=>{
     var movie= $('a').eq(item).attr('href')
     if(helper.isValidExt(movie)){
         var link = source+movie
         var name = $('a').eq(item).text()
         var file = await rp.head(link)
         var size = file['content-length']
         var result ={
             name:helper.parseMovieName(name),
             year:'',
             link:{
                 link:link,
                 size:helper.bytesToSize(size),
                 dubbed:helper.isDubbed(link),
                 censored:helper.isSansored(link)
             }
         }
         fs.appendFileSync('../bin/slonik.json',JSON.stringify(result)+',')
        }
    })
}
crawl()