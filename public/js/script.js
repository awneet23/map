// const socket = io();
// console.log('hey');

// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition((position) => {
//     const { latitude, longitude } = position.coords; // Fixing the variable name here
//     socket.emit('send-location', { latitude, longitude }); // Fixed 'longitud' to 'longitude'
//   }, (error) => {
//     console.error(error);
//   },
//   {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0
//   });
// }

// const map = L.map('map').setView([0, 0], 16); // Fixed capitalization here
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: 'openStreetMap'
// }).addTo(map);


// const markers = {};

// socket.on('receive-location',(data)=>{
//   const {id,latitude,longitude} = data
//   map.setView([latitude,longitude])
//   if(markers[id]){
//     markers[id].setLatLng({latitude,longitude})
//   }
//   else{
//     markers[id]  = L.marker([latitude,longitude]).addTo(map)
//   }
// })

// socket.on('user-disconnected',()=>{
//   if(markers[id]){
//     map.removeLayer(markers[id])
//     delete markers[id];
//   }

// })





const socket = io();
const map = L.map('map').setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'openStreetMap'
}).addTo(map);

const markers = {};

socket.on('initial-state', (users) => {
  console.log('Initial state:', users);
  Object.entries(users).forEach(([id, { latitude, longitude }]) => {
    if (!markers[id]) {
      markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
  });
});

socket.on('receive-location', ({ id, latitude, longitude }) => {
  console.log(`Received location for id ${id}: ${latitude}, ${longitude}`);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on('user-disconnected', (id) => {
  console.log(`User disconnected: ${id}`);
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { enableHighAccuracy: true });
      } else if (result.state === 'denied') {
        console.log('Geolocation permissions denied');
        alert('Location access is required to show your position on the map.');
      }
      result.onchange = function () {
        console.log(result.state);
      };
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function successCallback(position) {
  const { latitude, longitude } = position.coords;
  console.log(`Sending location: ${latitude}, ${longitude}`);
  socket.emit('send-location', { latitude, longitude });

  // Set initial map view to user's location
  map.setView([latitude, longitude], 16);
}

function errorCallback(error) {
  console.error(error);
  alert('Error fetching location. Please enable location services and try again.');
}

getLocation();

