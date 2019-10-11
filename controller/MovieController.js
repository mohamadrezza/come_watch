var queryHelper = require('../helpers/query')
var movieHelper = require('../helpers/helpers')
var Movie = require('../models/Movie')

exports.create = async (req, res) => {
    try {
        //example
        var link = 'http://dl11.difid.ir/A/2002/A.Walk.to.Remember.2002.720p.Bluray.Ganool.%5Bshahrdl.com%5D.mkv'
        //look for movie if exist
        var movie = await Movie.findOne({
            name: 'remember me ',

        })
        if (movie) {
            //add additional link,quality,release if not exist
            await Movie.findByIdAndUpdate(movie._id, {
                $addToSet: {
                    'link': 'test.com',
                    'quality': '1080',
                    'release': 'webdl'
                }
            })
        } else {
            var movie = await Movie.create({
                name: 'remember me ',
                link: link,
                dubbed: true,
                year: movieHelper.getYearFromMovieName('a Walk to Remember 2002'),
                release: movieHelper.getRelease(link),
                quality: movieHelper.getQuality(link)
            })
            console.log('movie created')
        }
        //for test  
        res.send(movie)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }

}
exports.find = async (req, res) => {
    try {
        //look for movie which contains "input"
        var movie = await queryHelper.findByName(Movie, 'input')
        if (movie.length == 0) {
            return res.status(404).send('sorry movie not found')
        } else {
            //for test
            res.send(movie)
        }
        console.log('find ...?')
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message)
    }

}
exports.getAll = async (req, res) => {
    var movies = await Movie.find()
    res.send(movies)
}