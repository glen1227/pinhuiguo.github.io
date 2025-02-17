mapboxgl.accessToken = 'pk.eyJ1IjoiZ2xlbjEiLCJhIjoiY201d2o2YXMwMDlnZDJqcjB5NXN6d2U2dCJ9.hhCm1Tp0faKPViMsyKbN8w';

document.addEventListener('DOMContentLoaded', function () {
    let isHeatmapActive = false;
    let popup = null, popup2 = null ,marker = null, blingTimer= null;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/glen1/cm73zs7iy01h401sd3ndxfzna', // Main map
        center: [109.213657, 23.581460],
        zoom: 6
    });
    window.map = map;

    let layers = ['na-68uqcs','sheng-2ds203', 'point-abvwgc'];

map.on('load', function () {
map.on('click',  function (e) {
const features = map.queryRenderedFeatures(e.point, { layers });
console.log(features); // Placeholder for actual feature selection functionality
popup && popup.remove();
 if (features.length) {
let html = '<strong style="font-size: 1.2em">' + features[0].properties.name +
'</strong>'+`<div class='properties'>
${['address', 'coordinates', 'location', 'tel', 'type', 'typecode'].map((item, index) => {
return `<p><b>${item}:</b> ${features[0].properties[item]}</p>`
        }).join('')}
            </div>
            `
popup = new mapboxgl.Popup({ offset: 15, anchor: 'top' })
               .setLngLat(features[0].geometry.coordinates)
               .setHTML(html)
               .addTo(map);
        }
      });
      
      layers.forEach(layer => {
function onMouseEnter(e) {
const features = map.queryRenderedFeatures(e.point, { layers: [layer] });
popup2 && popup2.remove();
  
 if (features.length) {
 popup2 = new mapboxgl.Popup({ offset: 15 ,anchor: 'bottom' })
               .setLngLat(features[0].geometry.coordinates)
               .setHTML(features[0].properties.name)
               .addTo(map);
  }
}
function onMouseLeave(e) {
map.getCanvas().style.cursor = '';
popup2 && popup2.remove();
}
map.on('mouseenter', layer, onMouseEnter )
map.on('mouseleave', layer, onMouseLeave )

   });
});

document.getElementById('clock').textContent = 'Loading time...';
function updateClock() {
let now = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Shanghai' });
document.getElementById('clock').textContent = 'China Time: ' + now;
}
setInterval(updateClock, 1000);

document.querySelectorAll('input[name="toggle"]').forEach(radio => {
        popup && popup.remove();
        popup2 && popup2.remove();
        marker && marker.remove();
radio.addEventListener('change', function () {
let category = this.value;
layers.forEach(layer => {
map.setLayoutProperty(layer, 'visibility', category === 'all' || layer === category ? 'visible' : 'none');
            });
        });
    });

document.getElementById('toggle-heatmap').addEventListener('click', function () {
        isHeatmapActive = !isHeatmapActive;
const newStyle = isHeatmapActive ? 'mapbox://styles/glen1/cm738hfso01nu01r57gkw0sdg' : 'mapbox://styles/glen1/cm73zs7iy01h401sd3ndxfzna';//Main and heatmap toggle
       map.setStyle(newStyle);
  
document.getElementById('toggle-heatmap').textContent = isHeatmapActive ? 'Toggle MainMap' : 'Toggle Heatmap';
document.getElementById('search-title').style.display = isHeatmapActive ? 'none' : 'block';
document.getElementById('search').style.display = isHeatmapActive ? 'none' : 'block';
document.getElementById('filter-title').style.display = isHeatmapActive ? 'none' : 'block';
document.getElementById('filter-options').style.display = isHeatmapActive ? 'none' : 'block';
    });

// carriage return search
document.getElementById('search').addEventListener('keydown', function (e) {
if (e.keyCode === 13) {
            e.preventDefault();
            let query = e.target.value.toLowerCase();
            console.log('Searching for:', query); // Placeholder for actual search functionality
            const features = map.queryRenderedFeatures({
              layers // Specify the query layer ID
            });
console.log(features); // Placeholder for actual search results display
let feature = features.find(feature=>feature.properties.name.toLowerCase().includes(query));
if(feature){
 marker && marker.remove();
 marker = new mapboxgl.Marker({
color: "#FF0000", 
draggable: false, 
element: document.createElement("div") 
 })
.setLngLat(feature.geometry.coordinates) 
.addTo(map);

blingTimer && window.clearTimeout(blingTimer);
blingTimer = setTimeout(() => {
marker && marker.remove();
}, 5000);
              
marker.getElement().classList.add("mapboxgl-marker"); 

map.flyTo({
center: feature.geometry.coordinates,
zoom: 11
              });
            }
        }
    });
});