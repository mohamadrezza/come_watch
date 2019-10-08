const cheerio = require('cheerio')
const rp = require('request-promise');

const fs = require('fs');

let moviesLinkPage = 'http://dl.fmdl.info/Movie/2015/';
let results = [];
rp(moviesLinkPage).then(htmlString => {
    let $ = cheerio.load(htmlString);

    $('a').each(async function (i, elem) {

        let sr = $(this).attr('href');
        let linkMovie = await rp(moviesLinkPage + $(this).attr('href'));
        let movieParsed = cheerio.load(linkMovie);

        movieParsed('a').each(function (i, elem) {
            console.log({
                name: movieParsed(this).text(),
                link: moviesLinkPage + sr + movieParsed(this).attr('href')
            })
            results.push({
                name: movieParsed(this).text(),
                link: moviesLinkPage + sr + movieParsed(this).attr('href')
            })
        })

        fs.writeFileSync('results.json', JSON.stringify(results))
    });


}).catch(e => {
    console.log(e)
})
