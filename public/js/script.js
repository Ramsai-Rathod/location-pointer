const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Sending location:', latitude, longitude); // Debugging line
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error('Geolocation error:', error);
            alert('Error getting location: ' + error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
} else {
    console.error('Geolocation is not supported by this browser.');
    alert('Geolocation is not supported by this browser.');
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "lets-locate-where-we-are"
}).addTo(map);

const markers = {};
socket.on("location-info", (data) => {
    const { id, latitude, longitude } = data;
    console.log('Received location info:', data); 
    
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
    map.setView([latitude, longitude], 15); 
});

socket.on("disconnected", (data) => {
    const { id } = data;
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
