const map = L.map('map').setView([34.0709, -118.444], 5);

const url = "https://spreadsheets.google.com/feeds/list/1-tvbo8KspmckYS9FBsGCNdSVqFt_O03iafruSI31PYg/oij5pet/public/values?alt=json"

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map)

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

let visitYes = L.featureGroup();
let visitNo = L.featureGroup();

fetch(url)
	.then(response => {
		return response.json();
		})
    .then(data =>{
                // console.log(data)
                formatData(data)
        }
)

let circleOptions = {
    radius: 5,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

function addMarker(data){
    if(data.doyouvisitthisplaceoften == "Yes"){
        circleOptions.fillColor = "cyan"
        visitYes.addLayer(L.circleMarker([data.lat,data.long],circleOptions).addTo(map).bindPopup(`<h3>${data.name}</h3>`+ '' + 
        `<p>${data.inawordorphrasecanyoudescribewhythisplacewassentimentaltoyou} - ${data.whatplacelocationareyoumostsentimentalabout}</p>` + '' + `<p>${data.optionaldescribethefeelingsthatyouhadwhenyoufirstvisitedthisplaceandthefeelingsthatyouhadifwhenyourevisitedtheplace}</p>`))
        // changed the data so that the true descrption can be defined
        createButtons(data.lat, data.long, data.whatplacelocationareyoumostsentimentalabout)
        }
    else{
        circleOptions.fillColor = "magenta"
        visitNo.addLayer(L.circleMarker([data.lat,data.long],circleOptions).addTo(map).bindPopup(`<h3>${data.name}</h3>`+ '' + 
        `<p>${data.inawordorphrasecanyoudescribewhythisplacewassentimentaltoyou} - ${data.whatplacelocationareyoumostsentimentalabout}</p>` + '' + `<p>${data.optionaldescribethefeelingsthatyouhadwhenyoufirstvisitedthisplaceandthefeelingsthatyouhadifwhenyourevisitedtheplace}</p>`))
        // changed the data so that the true descrption can be defined
        createButtons(data.lat, data.long, data.whatplacelocationareyoumostsentimentalabout)
    }
    return data.timestamp
}

function createButtons(lat,long,whatplacelocationareyoumostsentimentalabout){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button"+whatplacelocationareyoumostsentimentalabout; // gives the button a unique id
    newButton.innerHTML = whatplacelocationareyoumostsentimentalabout; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("long",long); // sets the longitude 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,long]); //this is the flyTo from Leaflet
    })
    const spaceForButtons = document.getElementById('contents')
    spaceForButtons.appendChild(newButton);//this adds the button to our page.
}


function formatData(theData){
        const formattedData = []
        const rows = theData.feed.entry
        for(const row of rows) {
          const formattedRow = {}
          for(const key in row) {
            if(key.startsWith("gsx$")) {
                  formattedRow[key.replace("gsx$", "")] = row[key].$t
            }
          }
          formattedData.push(formattedRow)
        }
        console.log(formattedData)
        formattedData.forEach(addMarker)
        visitYes.addTo(map)
        visitNo.addTo(map)
        let allLayers = L.featureGroup([visitYes,visitNo]);
        map.fitBounds(allLayers.getBounds());        
}

let layers = {
	"Visit Often": visitYes,
	"Does not Visit Often": visitNo
}

L.control.layers(null,layers).addTo(map)