const map = L.map('map').setView([34.0709, -118.444], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function addMarker(data){
    // console.log(data)
    // these are the names of our fields in the google sheets:
    L.marker([data.lat,data.long]).addTo(map).bindPopup(`<h3>${data.name}</h3>`+ '' + 
    `<p>${data.description} - ${data.location}</p>` + '' + `<p>${data.optional}</p>`)
    return data.name, data.description, data.optional, data.location
}

let url = "https://spreadsheets.google.com/feeds/list/1-tvbo8KspmckYS9FBsGCNdSVqFt_O03iafruSI31PYg/oij5pet/public/values?alt=json"

fetch(url)
	.then(response => {
		return response.json();
		})
    .then(data =>{
                //console.log(data)
                processData(data)
        }
)

function processData(theData){
    const formattedData = [] /* this array will eventually be populated with the contents of the spreadsheet's rows */
    const rows = theData.feed.entry // this is the weird Google Sheet API format we will be removing
    // we start a for..of.. loop here 
    for(const row of rows) { 
      const formattedRow = {}
      for(const key in row) {
        // time to get rid of the weird gsx$ format...
        if(key.startsWith("gsx$")) {
              formattedRow[key.replace("gsx$", "")] = row[key].$t
        }
      }
      // add the clean data
      formattedData.push(formattedRow)
    }
    // lets see what the data looks like when its clean!
    console.log(formattedData)
    // we can actually add functions here too
    formattedData.forEach(addMarker)
}