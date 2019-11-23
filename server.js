var express = require("express");
var app = express();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://familyhistoryuser:elijah@localhost:5432/familyhistory";
const pool = new Pool({connectionString: connectionString});


app.set("port", (process.env.PORT || 5000))
app.get('/', function(req, res){res.sendFile('form.html', { root: __dirname + '/public'});})
app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.get("/getMovie", getMovie);
app.listen(app.get("port"), function() {
    console.log("Now listening for connections on port:  ", app.get("port"));
});

function getMovie(req,res){
    console.log("Getting person information.");

    var id = req.query.id;
    console.log("Retrieving person with id:  ", id);

    getMovieFromDb(id, function(error, result) {
        if(error || result == null || result.length != 1){
            res.status(500).json({success:false, data:error});
        } else {
            // var result = {id: id, title: title, releasedate: releasedate};
            // res.render('results.ejs', result);
            res.json(result[0]);
        }
    })

}

function getMovieFromDb(id, callback){
    console.log("getMovieFromDb called with id:  ", id);

    var sql = "SELECT id, title, releasedate, mpaa, genre, director, runtime, studio, summary FROM movies WHERE id = $1::int";
    var params = [id];

    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An errror with the DB occurred");
            console.log(err);
            callback(err, null);
        }

        console.log("Found DB result:  ", JSON.stringify(result.rows));

        callback(null, JSON.stringify(result.rows));

    })
}