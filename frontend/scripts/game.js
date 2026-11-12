import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.18.0/dist/maplibre-gl.mjs';

const map = new maplibregl.Map({
    style: `https://tiles.openfreemap.org/styles/bright`,
    center: [44.005216749397505, 56.3265313629756],
    zoom: 17,
    pitch: 0,
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