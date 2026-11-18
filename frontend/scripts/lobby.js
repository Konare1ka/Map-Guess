import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.18.0/dist/maplibre-gl.mjs';

//сделать систем оф генерейшен токен и в game.js сделать ещё проверку, мол если токена нет, то редиректить чувака назад

const lobbyPlaces = [[44.005216749397505, 56.3265313629756], [43.98044630810523, 56.32650112499462], [43.97692744837764, 56.304445874486106], [43.98519044693012, 56.30826822357818], [43.94502883664393, 56.29886726829892], [43.988781853643104, 56.32873384017441], [43.96424761320327, 56.335137633808216], [43.923238549629104, 56.26906376149984]]

const map = new maplibregl.Map({
    style: `https://tiles.openfreemap.org/styles/bright`,
    center: lobbyPlaces[Math.floor(Math.random() * lobbyPlaces.length)],
    zoom: 17,
    pitch: 75,
    bearing: 0,
    container: 'map',
    canvasContextAttributes: {antialias: true},
    interactive: false,
    attributionControl: false,
});

map.on('load', () => {
    const layers = map.getStyle().layers;

    let labelLayerId;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    map.addSource('openfreemap', {
        url: `https://tiles.openfreemap.org/planet`,
        type: 'vector',
    });

    map.addLayer(
        {
            'id': '3d-buildings',
            'source': 'openfreemap',
            'source-layer': 'building',
            'type': 'fill-extrusion',
            'minzoom': 15,
            'filter': ['!=', ['get', 'hide_3d'], true],
            'paint': {
                'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
                ],
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    16,
                    ['get', 'render_height']
                ],
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    16,
                    ['get', 'render_min_height']
                ]
            }
        },
        labelLayerId
    );

    layers.forEach((layer) => {
        if (layer.type !== 'symbol') return;
        const id = layer.id.toLowerCase();
        if (
            id.includes('poi') ||
            id.includes('shop') ||
            id.includes('amenity') ||
            id.includes('restaurant') ||
            id.includes('housenumber')
        ) {
            map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
    if (layer.layout && layer.layout['text-field']) {        
        map.setLayoutProperty(layer.id, 'text-field', ['get', 'name']);
    }
    });

    rotateCamera(0)
});

const changeBackground = setInterval(async () => {
    const css = document.querySelector('#blackscreen');
    css.style.opacity = "1";
    await sleep(1000);
    changePosition();
    await sleep(500);
    css.style.opacity = "0";
}, 15000);

function changePosition() {
    var next;
    do { next = lobbyPlaces[Math.floor(Math.random() * lobbyPlaces.length)];
    } while ( next === map.getCenter().toArray() );

    map.jumpTo({ center: next });
}

function rotateCamera(timestamp) {
    map.rotateTo( (timestamp / 100) % 360, { duration: 0 } );
    requestAnimationFrame(rotateCamera);
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
};

document.getElementById("changePos_btn").addEventListener("click", changePosition);
document.getElementById("connectRoom_btn").addEventListener("click", () => {
    window.location.href = "game.html";
});