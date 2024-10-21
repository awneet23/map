const socket = io();
console.log('hey');

if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords; // Fixing the variable name here
    socket.emit('send-location', { latitude, longitude }); // Fixed 'longitud' to 'longitude'
  }, (error) => {
    console.error(error);
  },
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  });
}

const map = L.map('map').setView([0, 0], 16); // Fixed capitalization here
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'openStreetMap'
}).addTo(map);


const markers = {};

socket.on('receive-location',(data)=>{
  const {id,latitude,longitude} = data
  map.setView([latitude,longitude])
  if(markers[id]){
    markers[id].setLatLng({latitude,longitude})
  }
  else{
    markers[id]  = L.marker([latitude,longitude]).addTo(map)
  }
})

socket.on('user-disconnected',()=>{
  if(markers[id]){
    map.removeLayer(markers[id])
    delete markers[id]
  }

})