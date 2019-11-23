var express = require("express");
var app = express();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://familyhistoryuser:elijah@localhost:5432/familyhistory";
const pool = new Pool({connectionString: connectionString});


app.set("port",(process.env.port || 5000))
app.get("/getPerson", getPerson);
app.listen(app.get("port"), function() {
    console.log("Now listening for connections on port:  ", app.get("port"));
});

function getPerson(req,res){
    console.log("Getting person information.");

    var id = req.query.id;
    console.log("Retrieving person with id:  ", id);

    getPersonFromDb(id, function(error, result) {
        if(error || result == null || result.length != 1){
            res.status(500).json({success:false, data:error});
        } else {
            res.json(result[0]);
        }
        // console.log("Back from the getPersonFromDb function with results:  ", result);
        // res.json(result);
    })

}

function getPersonFromDb(id, callback){
    console.log("getPersonFromDb called with id:  ", id);

    var sql = "SELECT id, first, last, birthdate FROM person WHERE id = $1::int";
    var params = [id];

    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An errror with the DB occurred");
            console.log(err);
            callback(err, null);
        }

        console.log("Found DB result:  ", JSON.stringify(result.rows));

        callback(null, result.rows);

    })
}