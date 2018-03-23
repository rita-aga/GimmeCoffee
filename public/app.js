checkLocation();
getBg();

// Get user's geolocation
function checkLocation() {
  if (navigator.geolocation) {
    // Do this while accessing user's location
    document.getElementById('message').innerHTML = "Locating...";

    function geoSuccess(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      // Connect socket
      var socket = io.connect();
      // Send coordinates
      socket.emit('coords', {
        latitude: lat,
        longitude: long
      });
      // Receive and process API data
      socket.on('jsonReady', function (data) {
        document.getElementById('message').innerHTML = "Coffee is here:";
        console.log(data);
        // Sort shops by distance from user
        var items = data.businesses;
        items.sort(function (a, b) {
          return a.distance - b.distance
        });

        // Iterate through all elements
        for (i = 0; i < items.length; i++) {
          // Create elements to display info
          const card = document.createElement('div');
          card.setAttribute('class', 'card col-12 col-sm-10 col-md-4');
          const shopName = document.createElement('h2');
          shopName.textContent = items[i].name;
          const shopAddress = document.createElement('p');
          shopAddress.textContent = items[i].location.address1;
          const shopDistance = document.createElement('span');
          // Display distance in miles
          shopDistance.textContent = (items[i].distance / 1609.344).toFixed(2) + " mi";
          shopDistance.setAttribute('class', 'distance');
          // Build cards
          results.appendChild(card);
          card.appendChild(shopName);
          card.appendChild(shopAddress);
          card.appendChild(shopDistance);
          // Make a link to search in Google
          var googleSearchUrl = "https://www.google.com/search?q=" + items[i].name.replace(" ", "+") + "+coffee";
          const searchGoogle = document.createElement('a');
          searchGoogle.innerHTML = '<i class="fab fa-google"></i>';
          searchGoogle.href = googleSearchUrl;
          searchGoogle.setAttribute('class', 'google-search');
          card.appendChild(searchGoogle);
          // Get Yelp page link
          const goToYelp = document.createElement('a');
          goToYelp.innerHTML = '<i class="fab fa-yelp"></i>';
          goToYelp.href = items[i].url;
          searchGoogle.setAttribute('class', 'yelp-link');
          card.appendChild(goToYelp);
          // Get photo
          if (items[i].image_url) {
            const wrapper = document.createElement('div');
            wrapper.setAttribute('class', 'yelp-photo-wrapper');
            const photo = document.createElement('img');
            photo.src = items[i].image_url;
            photo.setAttribute('class', 'yelp-photo');
            card.appendChild(wrapper);
            wrapper.appendChild(photo);
          }
        }
      });
    }

    function geoError() {
      document.getElementById('message').innerHTML = "Couldn't get location";
    }

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

  } else {
    document.getElementById('message').innerHTML = "navigator.geolocation not supported";
  }
}

// Get backround photo from Unsplash
function getBg() {
  var data = null;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.unsplash.com/photos/random/?client_id=cd19466e7f4684ce947d4061b7e294f543e24c31e9c46e685435ad1f76bbc659&query=coffee");
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      data = JSON.parse(this.responseText);
      document.body.style = "background: url(" + data.urls.regular + ") no-repeat; background-size: cover;";
    }
  });
  xhr.send(data);
}

/*
// Call node to get Yelp's data
function callMyServer() {
  var data = null;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://gimme-coffee.herokuapp.com/api.json", true);
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      data = JSON.parse(this.responseText);
      console.log(data);
      // Sort shops by distance from user
      var items = data.businesses;
      items.sort(function (a, b) {
        return a.distance - b.distance
      });

      // Iterate all elements
      for (i = 0; i < items.length; i++) {
        // Create elements to display info
        const card = document.createElement('div');
        card.setAttribute('class', 'card col-12 col-sm-10 col-md-4');
        const shopName = document.createElement('h2');
        shopName.textContent = items[i].name;
        const shopAddress = document.createElement('p');
        shopAddress.textContent = items[i].location.address1;
        const shopDistance = document.createElement('span');
        // Display distance in miles
        shopDistance.textContent = (items[i].distance / 1609.344).toFixed(2) + " mi";
        shopDistance.setAttribute('class', 'distance');
        // Build cards
        results.appendChild(card);
        card.appendChild(shopName);
        card.appendChild(shopAddress);
        card.appendChild(shopDistance);
        // Make a link to search in Google
        var googleSearchUrl = "https://www.google.com/search?q=" + items[i].name.replace(" ", "+") + "+coffee";
        const searchGoogle = document.createElement('a');
        searchGoogle.innerHTML = '<i class="fab fa-google"></i>';
        searchGoogle.href = googleSearchUrl;
        searchGoogle.setAttribute('class', 'google-search');
        card.appendChild(searchGoogle);
        // Get Yelp page link
        const goToYelp = document.createElement('a');
        goToYelp.innerHTML = '<i class="fab fa-yelp"></i>';
        goToYelp.href = items[i].url;
        searchGoogle.setAttribute('class', 'yelp-link');
        card.appendChild(goToYelp);
        // Get photo
        if (items[i].image_url) {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'yelp-photo-wrapper');
        const photo = document.createElement('img');
        photo.src = items[i].image_url;
        photo.setAttribute('class', 'yelp-photo');
        card.appendChild(wrapper);
        wrapper.appendChild(photo);
        }
        // Add a google map
        const mapArea = document.createElement('div');
        mapArea.setAttribute('class', 'map');
        mapArea.setAttribute('id', 'map' + i);
        card.appendChild(mapArea);
        const busLat = items[i].coordinates.latitude;
        const busLng = items[i].coordinates.longitude;
        var shopMarker = {lat: busLat, lng: busLng};
        var map = new google.maps.Map(document.getElementById('map' + i), {
            zoom: 4,
            center: shopMarker
          });
          var marker = new google.maps.Marker({
            position: shopMarker,
            map: map
          });
        }
      }
    });
  xhr.send(data);
}

*/