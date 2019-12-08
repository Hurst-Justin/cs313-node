

function addMovie(movie_id){
  const { Pool } = require("pg");
  const pool = new Pool({connectionString: connectionString});
  console.log("adding movies with id:  ", movie_id);

  // var sql = "INSERT INTO movies (movie_id) VALUES (" + movie_id + ")";
  // console.log("SQL:  ", sql);
  // pool.query(sql) 

  pool.query(
    // "INSERT INTO movies (movie_id) VALUES (" + movie_id + ")",
    // (err, res) => {
    //   console.log(err, res);
    //   pool.end();
    // }
  );
}


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
    var params = '?api_key=7b9126790bdc4a5f7870fc330afb05f2&query=' + encodeURIComponent(searchString);
    var url = 'https://api.themoviedb.org/3/search/movie' + params;
 
  
    xhr.open('GET', url);
    xhr.send();
  }
  


  function updateResultList(data) {
    console.log('UpdateResultList');
    console.log(data);
  
    if (data.results && data.results.length > 0) {
      const resultList = document.getElementById('ulResults');
      resultList.innerHTML = '';
      
      // you could use a forEach here as well...it would change the following line like this:
      // data.results.forEach(function(item){ ...process each item here })
      for (let i = 0; i < data.results.length; i++) {
        const title = data.results[i].title;
        const dateY = new Date(data.results[i].release_date);
        const year = dateY.getFullYear();
        const poster = "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path;
        const movie_id = data.results[i].id;
        const overview = data.results[i].overview;
        const popularity = data.results[i].popularity;           
  
        console.log('Adding: ' + title);
        const content = `<li><a href="https://www.themoviedb.org/movie/${movie_id}" class="title" target="_blank">${title} (${year})</a><button class="button1" onclick="addMovie(${movie_id});">Add</button><p class="overview">${overview}</p><img src=${poster}  alt=${title} height="150px"></img></li>`;
        resultList.innerHTML += content;
      }
    }
  }
