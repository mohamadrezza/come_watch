//server not respond

const cheerio = require('cheerio')
const rp = require('request-promise');
const helper = require('./../helpers/helpers')
const fs = require('fs');
const URL = require('url')


async function crawl(){
try {
    let moviesLinkPage = 'http://moviebuzz.one/Data/Movies/Hollywood/';
    var data = await rp(moviesLinkPage)
    var $=cheerio.load(data)
    let count = 0;
    let responseCount = 0;
    let promises = $('a').each(item=>{
        var moviePage=$('a').eq(item).attr('href')
        console.log('requested=> ' +  moviePage)
     
        rp(URL.resolve(moviesLinkPage  ,  moviePage)).then(res=>{
            console.log(res)
            let parsed = cheerio.load(res);
            parsed('a').each(async item=>{
                console.log(parsed(this).text())
            })
        });
       
    })
    Promise.all(promises).then(()=>{
        console.log('all done')
    })
} catch (error) {
    console.log(error)
}

}
crawl();