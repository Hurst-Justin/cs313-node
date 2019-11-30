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
    var url = 'https://www.omdbapi.com/' + params;
  
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
        const year = data.Search[i].Year;
        const poster = data.Search[i].Poster;
  
        console.log('Adding: ' + title);
        const content = `<li><p><img src=${poster}  alt=${title} width="200" ></img> ${title} (${year})</p></li>`;
        resultList.innerHTML += content;
      }
    }
  }