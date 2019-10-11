const mdb = require('moviedb')('6f0c625e9b7f81e80f475be102f64bfc');

mdb.searchMovie({query:"Dark Knight"}  , (err, res) => {
  console.log(err)
  console.log(res.results[0]);
});