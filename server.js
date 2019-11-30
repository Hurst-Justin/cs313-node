var express = require("express");
var movies = require('./movies-xhr.js');
var app = express();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://familyhistoryuser:elijah@localhost:5432/familyhistory";
const pool = new Pool({connectionString: connectionString});


app.set("port", (process.env.PORT || 5000))
app.get('/', function(req, res){res.sendFile('movieSearch-xhr.html', { root: __dirname + '/public'});})
app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
// app.get("/getMovie", getMovie);
app.get("/search", search);
app.listen(app.get("port"), function() {
    console.log("Now listening for connections on port:  ", app.get("port"));
});

// function getMovie(req,res){
//     console.log("Getting movies information.");

//     var id = req.query.id;
//     console.log("Retrieving movies with id:  ", id);

//     getMovieFromDb(id, function(error, result) {
//         if(error || result == null || result.length != 1){
//             res.status(500).json({success:false, data:error});
//         } else {
//             // var result = {id: id, title: title, releasedate: releasedate};
//             // res.render('results.ejs', result);
//             res.json(result[0]);
//         }
//     })

// }

// function getMovieFromDb(id, callback){
//     console.log("getMovieFromDb called with id:  ", id);

//     var sql = "SELECT id, title, releasedate, mpaa, genre, director, runtime, studio, summary FROM movies WHERE id = $1::int";
//     var params = [id];

//     pool.query(sql, params, function(err, result) {
//         if (err) {
//             console.log("An errror with the DB occurred");
//             console.log(err);
//             callback(err, null);
//         }

//         console.log("Found DB result:  ", JSON.stringify(result.rows));

//         callback(null, result.rows);

//     })
// }

function search() {
    // Get the value from the search box
    var searchString = document.getElementById('txtSearch').value;
    console.log('Searching for: ' + searchString);
  
    var xhr = new XMLHttpRequest();
  
    // set up the function to be called when this is complete
    xhr.onload = function() {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        // We are back from the server now...
  
        console.log('Back from server with the following results:');
        console.log(xhr.responseText);
  
        updateResultList(JSON.parse(xhr.responseText));
      } else {
        // This will run when it's not
        console.log('The request failed!');
      }
    };
  
    // Set up the parameters to send to the API
    var params = '?apikey=d28e3b70&s=' + encodeURIComponent(searchString);
    var url = 'http://www.omdbapi.com/' + params;
  
    xhr.open('GET', url);
    xhr.send();
  }
  
  function updateResultList(data) {
    console.log('UpdateResultList');
    console.log(data);
  
    if (data.Search && data.Search.length > 0) {
      const resultList = document.getElementById('ulResults');
      resultList.innerHTML = '';
      
      // you could use a forEach here as well...it would change the following line like this:
      // data.Search.forEach(function(item){ ...process each item here })
      for (let i = 0; i < data.Search.length; i++) {
        const title = data.Search[i].Title;
  
        console.log('Adding: ' + title);
        const content = `<li><p>${title}</p></li>`;
        resultList.innerHTML += content;
      }
    }
  }