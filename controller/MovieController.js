var queryHelper = require("../helpers/query");
var movieHelper = require("../helpers/helpers");
var Movie = require("../models/Movie");

exports.create = async function (movieObj) {
  try {




    var movie = await Movie.findOne({
      name: movieObj.name
    });
    //console.log(movie)

    if (movie) {
      //add additional link,quality,release if not exist
      await Movie.findByIdAndUpdate(movie._id, {
        $addToSet: {
          link: movieObj.link,
        }
      });

      console.log(`${movieObj.name} added Link`)
    } else {
      var movie = await Movie.create({
        name: movieObj.name,
        link: movieObj.link,
        type: movieObj.type,
        year: movieObj.year || null,
        cover: movieObj.cover || null,
        imdb: movieObj.imdb || null,
        description: movieObj.description || null,
        category: movieObj.category || []
      });


      console.log(`${movieObj.name}  created`);
    }
  } catch (e) {
    console.log(e);
  }
};
exports.find = async (input) => {
  try {
    //look for movie which contains "input"
    var movie = await queryHelper.findByName(Movie, input);
    if (movie.length == 0) {
      return res.status(404).send("sorry movie not found");
    } else {
      //for test
      console.table(movie)
    }
    console.log("find ...?");
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};
exports.getAll = async (req, res) => {
  var movies = await Movie.find();
  res.send({
    movies: movies,
    count: movies.length
  });
};

// exports.delete = async () => {
//   try {
//     await Movie.update({
//       'link.link': {
//         "$regex": "http://192.240.120.146",
//         "$options": "i"
//       }
//     }, {
//       "$pull": {
//         "link": {
//           "link": {
//             "$regex": "http://192.240.120.146/",
//             "$options": "i"
//           }
//         }
//       }
//     }, {
//       multi: true
//     })
//     console.log('ok')
//   } catch (error) {
//     console.log(error.message)
//     // res.send(error.message)
//   }

// }