var axios = require ('axios')
var cheerio = require ('cheerio')
var source = 'http://dhakaftp.com/Data/'
var helper = require ('../helpers/helpers')
var x = 0
async function crawl(){
  var data = await axios.get(source)
  var $ = cheerio.load(data.data)
  $('a').each(async item =>{
    var discs = $('a').eq(item).text()
      if(discs!='../'){
        var discUrl =source+discs
        var discData = await axios.get(discUrl)
        var _$=cheerio.load(discData.data)
        _$('a').each(async i=>{
            var folder = _$('a').eq(i).attr().href
            if(folder!='../'&&folder!='test/'&&folder!='Software/'&&folder!='Tv%20Series/'&&folder!='Games/'&&folder!='TV%20Series/'&&folder!='Tv%20series/'){
                var collection = discUrl+folder
                var moviesData =await axios.get(collection)
                var moviesPage = cheerio.load(moviesData.data)
                moviesPage('a').each(async element=>{
                    try {
                        var movie = moviesPage('a').eq(element).attr().href
                        if(movie!='../'){
                            var moviePage = await axios.get(collection+movie)
                            var movieData = cheerio.load(moviePage.data)
                            movieData('a').each(async num=>{
                                var movie = movieData('a').eq(num).text()
                                if(helper.isValidExt(movie)){
                                    x++
                                        console.log(movie)
                                    console.log(x)
                                }
                            })
                        }    
                    } catch (error) {
                        console.log(error)
                    }
                    
                    
                }) 
            }

        })
    }
  })
}
crawl()