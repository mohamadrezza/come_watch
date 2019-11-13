//usa server
const cheerio = require('cheerio')
const rp = require('request-promise');
const helper = require('./../helpers/helpers');
const fs = require('fs');

let results = [];

let urls = [
    "http://192.240.120.146/da03/fullhd/",
    "http://192.240.120.146/da02/",
    "http://192.240.120.146/da02/fullhd2/mkv/",
    "http://192.240.120.146/da02/fullhd2/",
    "http://192.240.120.146/da01/fullhd1/",
    "http://192.240.120.146/da01/fullhd1/mkv/",
    "http://192.240.120.146/da01/fullhd1/mkv/",
    "http://192.240.120.146/da03/fullhd/mkv/",
    'http://www.kingdomfantasy.com/videos/', //france
    'http://178.162.145.97/publicDL/Movies/', //netherland
    'http://37.187.126.11/Films/', //france,
    'http://192.240.120.146/da02/fullhd2/mkv/'
];
let errors = [];
urls.forEach(function (url) {

    rp(url).then(htmlString => {
        let $ = cheerio.load(htmlString)

        $('tr').each(async i => {
            try {

                let link = $('tr').eq(i).find('a').attr('href');
                if (link != 'undefined' || !link == 'mkv/' || !link == 'mkv') {
                    let name = $('tr').eq(i).find('a').text();
                    let year = helper.getYearFromMovieName(name);
                    let nameParsed = helper.parseMovieName(name, year)
                    let file = await rp(url + link,{method:'HEAD'})
                    var quality = helper.getQuality(link)
                    var release = helper.getRelease(link)
                    let dubbed = helper.isDubbed(link)
                    let censored = helper.isSansored(link) //
                    var result = {
                        name: nameParsed,
                        year: year,
                        link: {
                            link:url+link,
                            quality: quality,
                            size: helper.bytesToSize(file['content-length']),
                            release: release,
                            dubbed: dubbed,
                            censored: censored
                        }

                    }
                    fs.appendFileSync('./../bin/ma_collection.json',JSON.stringify(result)+',')
                }
            } catch (e) {
                console.log(e)
            }

        });



        // if (results.length > 1660) {
        //     fs.appendFileSync('../bin/mammadCollection.json', JSON.stringify(results))
        // }

    }).catch(e => {
        console.log(e)
    })
})