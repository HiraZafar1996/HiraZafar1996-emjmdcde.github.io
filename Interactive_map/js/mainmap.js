// Wrap every letter in a span
var textWrapper = document.querySelector('.ml2');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml2 .letter',
    scale: [4,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 950,
    delay: (el, i) => 70*i
  }).add({
    targets: '.ml2',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });

  //creating the map; defining the location in the center of the map (geographic coords) and the zoom level. These are properties of the leaflet map object
//the map window has been given the id 'map' in the .html file
var map = L.map('map', {
    center: [47.796866, 13.045889],
    zoom: 11
});
//Mouse Events, show coordinates when you move the mouse 

//basemap intialization
var BasemapAT_highdpi = L.tileLayer('https://maps{s}.wien.gv.at/basemap/bmaphidpi/{type}/google3857/{z}/{y}/{x}.{format}', {
    maxZoom: 20,
    attribution:'Map data &copy; <a href="https://www.basemap.at">OpenStreetMap</a> contributors, ' +
             '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-EMJMD</a>, ' +
                 'Imagery © <a href="https://www.basemap.at">basemap.at</a>',
    subdomains: ["", "1", "2", "3", "4"],
    center: [47.8095, 13.0550],
    type: 'normal',
    format: 'jpeg',
    bounds: [[46.35877, 8.782379], [49.037872, 17.189532]]
});

var BasemapAT_orthofoto = L.tileLayer('https://maps{s}.wien.gv.at/basemap/bmaporthofoto30cm/{type}/google3857/{z}/{y}/{x}.{format}', {
    maxZoom: 20,
    center: [47.8095, 13.0550],
    attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>',
    subdomains: ["", "1", "2", "3", "4"],
    type: 'normal',
    format: 'jpeg',
    bounds: [[46.35877, 8.782379], [49.037872, 17.189532]]
});

var OSM=L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

// Interactivity functions for lakes

function highlightFeature(e) {
    var activefeature = e.target;  //access to activefeature that was hovered over through e.target
    
    activefeature.setStyle({
        weight: 5,
        color: '#5AD94B',
        dashArray: '',
        fillOpacity: 0.8
    });
    
    if (!L.Browser.ie && !L.Browser.opera) {
        activefeature.bringToFront();
    }
}

//function for resetting the highlight
function resetHighlight(e) {
    lakes.resetStyle(e.target);
}

 
// Interactivity functions for reserviors

function highlightReservior(e) {
    var activefeature = e.target;  //access to activefeature that was hovered over through e.target
    
    activefeature.setStyle({
        weight: 5,
        color: '#5AA50A',
        dashArray: '',
        fillOpacity: 0.5
    });
    
    if (!L.Browser.ie && !L.Browser.opera) {
        activefeature.bringToFront();
    }
}

//function for resetting the highlight
function resetHighlightReserviors(e) {
    WaterReserviors.resetStyle(e.target);
}

// Interactivity functions for reserviors

function highlightWaterWays(e) {
    var activefeature = e.target;  //access to activefeature that was hovered over through e.target
    
    activefeature.setStyle({
        weight: 5,
        color: '#3FE0DB',
        dashArray: '',
        fillOpacity: 0.7
    });
    
    if (!L.Browser.ie && !L.Browser.opera) {
        activefeature.bringToFront();
    }
}

//function for resetting the highlight
function resetHighlightWaterWays(e) {
    WaterWays.resetStyle(e.target);
}
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

//to call these methods we need to add listeners to our features

function interactiveFunction(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
});
    if (feature.properties) {
            layer.bindPopup("<p><b>"+ feature.properties.NAME +"</b><br> <center><img src='style/images/" + feature.properties.Picture+".jpg" +
             "' style='width:200px;height:300x;'></center>" +'</b></p>',{offset: new L.Point(20, 0)});
        }
}


function interactiveWaterWays(feature, layer) {
    layer.on({
        mouseover: highlightWaterWays,
        mouseout: resetHighlightWaterWays
   } );
}

//feature layers
//Layer1 Fountains
var FountainIcon = L.icon({
    iconUrl: 'style/images/fountains.png',
    iconSize: [18, 18]
});

var Fountains = L.geoJson(FountainSalzburg, {
    pointToLayer: function(feature, latlng) {
    return  L.marker(latlng, {icon: FountainIcon, clickable: true, title: "Fountain"} );
    },
    onEachFeature: function(feature, marker) {
        marker.bindPopup('<div class="popup">' +"Fountain"+'<br>'+"Name: " +feature.properties.ANL_NAME +'<br>'
            +"  Address: "+feature.properties.FULL_ANL_NAME + '<br>'
            + marker.getLatLng()+ '</b>' + '</div>');
    }
});

//Fountains.addTo(map);

//Layer2 Water wheels 
var WaterWheelsIcon = L.icon({
    iconUrl: 'style/images/WaterWheel.png',
    iconSize: [18, 18]
});

var WaterWheels = L.geoJson(SalzburgWaterWheels, {
    pointToLayer: function(feature, latlng) {
    return  L.marker(latlng, {icon: WaterWheelsIcon, clickable: true, title: "Water Wheel"} );
    },
    onEachFeature: function(feature, marker) {
        marker.bindPopup('<div class="popup">' +"Water Wheel"+'<br>'+
        feature.properties.ANL_NAME + '<br>' + 
        '<b>' + marker.getLatLng() + '</b>' + 
         '</div>');
    }
});
WaterWheels.addTo(map);

//Layer3 Waste Water Treatment Plant 
var WasteWaterTreatmentIcon = L.icon({
    iconUrl: 'style/images/WasteWaterTreatmentIcon.png',
    iconSize: [16, 16]
});

var WasteWaterTreatment = L.geoJson(WasteWaterTreatment, {
    pointToLayer: function(feature, latlng) {
    return  L.marker(latlng, {icon: WasteWaterTreatmentIcon, clickable: true, title: "Waste Water Treatment Plant"} );
    },
    onEachFeature: function(feature, marker) {
        marker.bindPopup('<div class="popup">' +"Waste Water Treatment Plant"+'<br>'+
        feature.properties.ANL_NAME + '<br>' + 
        '<b>' + marker.getLatLng() + '</b>' + 
         '</div>');
    }
});


//Layer4 Water Ways Line Features
var WaterWaysStyle = {
    "color": "#0C6997",
    "weight": 2,
    "opacity": 0.80
};

WaterWays=L.geoJSON(WaterWays, {
    style: WaterWaysStyle,
    onEachFeature:interactiveWaterWays
}).bindTooltip(function (layer) {
    return layer.feature.properties.NAME;
 }).addTo(map);

//Layer5 Lakes

var LakeStyle = {
    color: "#3FE0DB",
    weight: 4,
    opacity: 1,
    fillOpacity: 0.7
}

lakes = L.geoJson(lakes, {
    style: LakeStyle,
    onEachFeature:interactiveFunction
}).bindTooltip(function (layer) {
    return layer.feature.properties.NAME;
 }
).addTo(map); 


//Adding a layer control for base maps and feature layers

//styled layer control
var baseMaps = [
                            { 
                                groupName : "Base Maps",
                                expanded : false,
                                layers    : {
                                     "Austria OrthoFoto": BasemapAT_orthofoto,
                                     "Austria HighDpi": BasemapAT_highdpi,
                                     "Open Street Map": OSM
                                }
                            }];
                    
var FeatureLayers = [
                             {
                                groupName : "Feature Layers",
                                expanded : false,
                                layers    : { 
                                    "<span style='color: blue font-weight: 400'>Salzburg  Fountains</span><img src='style/images/fountains.png' width='20' height='20'/>": Fountains,
                                    "Salzburg Water Wheels  <img src='style/images/WaterWheel.png' width='20' height='20'/>":WaterWheels,
                                    "Salzburg Waste Water Treatment Plants  <img src='style/images/WasteWaterTreatmentIcon.png' width='18' height='18'/>":WasteWaterTreatment,
                                    "Salzburg Water Ways":WaterWays,
                                    "Salzburg Lakes  <img src='style/images/lake.png' width='20' height='20'/>":lakes

                                }   
                             }];
            
            var options = {
                container_width     : "300px",
                group_maxHeight     : "80px",
                //container_maxHeight : "350px", 
                exclusive           : false,
                collapsed : true, 
                position: 'topright'
            };
        
            var control = L.Control.styledLayerControl(baseMaps, FeatureLayers, options);
            map.addControl(control);
// Adding a scale bar

L.control.scale().addTo(map);

//Print map function

// Here we hide all controls from end image
            map.on(L.Control.BrowserPrint.Event.PrintStart, function() {
                map._controlCorners.topleft.style.display = "none";
                map._controlCorners.topright.style.display = "none";
            });

            // Here we show all controls after image was created
            map.on(L.Control.BrowserPrint.Event.PrintEnd, function() {
                map._controlCorners.topleft.style.display = "";
                map._controlCorners.topright.style.display = "";
            });

L.control.browserPrint({
                documentTitle: "Water Resource Map",
                printModes: [
                    L.control.browserPrint.mode.auto("Download PNG")
                ]
            }).addTo(map);

            map.on(L.Control.BrowserPrint.Event.PrintStart, function(e){
                /*on print start we already have a print map and we can create new control and add it to the print map to be able to print custom information */
                L.legendControl({position: 'bottomright'}).addTo(e.printMap);
            });





