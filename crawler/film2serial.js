//iran servers
const cheerio = require("cheerio");
const rp = require("request-promise");
const helper = require("./../helpers/helpers");
const fs = require("fs");
const URL = require("url");

const MovieController = require('./../controller/MovieController');

const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/COM_WATCH", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("connected to com_watch database");
  crawl();
});






 function crawl(){
  let results = [];

  let urls = [
    "http://dl2.film2serial.ir/film2serial/film/doble/94/",
    "http://dl2.film2serial.ir/film2serial/film/doble/95/",
    "http://dl2.film2serial.ir/film2serial/film/doble/96/",
    "http://dl2.film2serial.ir/film2serial/film/doble/97/",
    "http://dl2.film2serial.ir/film2serial/film/doble/98/",
    "http://dl2.film2serial.ir/film2serial/film/asli/94/",
    "http://dl2.film2serial.ir/film2serial/film/asli/95/",
    "http://dl2.film2serial.ir/film2serial/film/asli/96/",
    "http://dl2.film2serial.ir/film2serial/film/asli/97/",
    "http://dl2.film2serial.ir/film2serial/film/asli/98/",
    "http://dl2.film2serial.ir/film2serial/film/doble/3D/94/",
    "http://dl2.film2serial.ir/film2serial/film/doble/3D/95/"
  ];

  let errors = [];

  helper.asyncForEach(urls , async function(url) {
    rp(url)
      .then(htmlString => {
        let $ = cheerio.load(htmlString);
        $("a").each(function(i, elem) {
          let monthUrl = $(this).attr("href");

          rp(URL.resolve(url, monthUrl))
            .then(response => {
              let htmlParsed = cheerio.load(response);
              htmlParsed("a").each( function(i, elem) {

                if(results.length > 5){
                  return false;
                }

                if (helper.isValidExt($(this).attr("href"))) {
                  let link = $(this).attr("href");
                  let name = $(this).text();

                  let year = helper.getYearFromMovieName(name);
                  let nameParsed = helper.parseMovieName(name, year);

                  rp({
                    url: URL.resolve(url + monthUrl, link),
                    method: "HEAD"
                  })
                    .then(async (file) => {
                      let result = {
                        name: nameParsed.replace(">", ""),
                        link:{
                          link: URL.resolve(url + monthUrl, link),
                          linkName: $(this)
                            .text()
                            .replace("...>", ""),
                            quality: helper.getQuality(link),
                            release: helper.getRelease(link),
                            size: helper.bytesToSize(file["content-length"]),
                            dubbed: helper.isDubbed(link),
                            censored: helper.isSansored(link)
                        },
                        year: year,
                      };
                      //await MovieController.create(result);
                      results.push(result)


                      console.log(results.length)
                      if(results.length >= 8208){
                      console.time('writing')
                      fs.writeFileSync('./film.json' , JSON.stringify(results));
                      console.timeEnd('writing');
                      }
                      //console.log(result);
                      //console.log("founded: " + results.length);
                    })
                    .catch(async e => {

              let result = {
                name: nameParsed.replace(">", ""),
                link:{
                  link: URL.resolve(url + monthUrl, link),
                  linkName: $(this)
                    .text()
                    .replace("...>", ""),
                    quality: helper.getQuality(link),
                    release: helper.getRelease(link),
                    size: null,
                    dubbed: helper.isDubbed(link),
                    censored: helper.isSansored(link)
                },
                year: year,
              };


              //await MovieController.create(result);
              results.push(result);
              


              console.log(results.length)
                if(results.length >= 8208){
                console.time('writing')
                fs.writeFileSync('./film.json' , JSON.stringify(results));
                console.timeEnd('writing');
                }

              //console.log(result);
              console.log("with error founded: " + results.length);

                      // console.log("error " ,e);
                    });
                }
              });
            })
            .catch(e => {
              console.log("rrrrr " + URL.resolve(url, monthUrl));
            });


            
       
        });
      })
      .catch(e => {
        console.log("asdasd");
      });


    

  });


  
}