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
    'http://37.187.126.11/Films/' //france
];
let errors = [];
urls.forEach(function (url) {

    rp(url).then(htmlString => {
        let $ = cheerio.load(htmlString)

        $('tr').each(function (i, elem) {


            let link = $(this).find('td').eq(1).find('a').attr('href');
            let name = $(this).find('td').eq(1).find('a').text();

            let year = helper.getYearFromMovieName(name);
            let nameParsed = helper.parseMovieName(name, year)

            let result = {
                    name: nameParsed,
                    link: url + link,
                    linkName: $(this).find('td').eq(1).find('a').text(),
                    year: year,
                    size: $(this).find('td').eq(3).text(),
                }
            ;

            if (i === 2 || result.name == '' || link === undefined || result.size === '' || !helper.isValidExt(name)) {
                //nothing
                errors.push(result)
            } else {
                // console.log(i)
                // console.log(result)
                results.push(result)
                //return false;
            }
        });


        console.log(`founded ${results.length}`)
        console.log(`errors ${errors.length}`)

        if (results.length > 1660) {
            console.log('writing to file ...')
            fs.writeFileSync('./ma_192.240.120.146.json', JSON.stringify(results))
        }

    }).catch(e => {
        console.log(e)
    })
})




