import { useEffect, useRef, useState } from 'react';
import data from './data.js';
import caba from './caba.js';

import Map, {
    Source,
    Layer,
  } from "react-map-gl";
import { Slider, Typography } from '@mui/material';
import Cuadro from './cuadro.js';
import { IsMobile } from '../utils/mobile.js';


export default function CabaMap() {
    
    const [fullData, setFullData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [sueldo, setSueldo] = useState(210000);
    const [porcentaje, setPorcentaje] = useState(100);
    const [paso, setPaso] = useState(0);

    const mobile = IsMobile();

    useEffect(() => {
        caba.features.map((f) => {
            var final = f;
            const barrio = f.properties.BARRIO
            var properties = f.properties;
            var mas = data.filter((d) => d.BARRIO.toLowerCase() === barrio.toLowerCase())[0]
            final.properties = {...properties, ...mas}

            return final;
        })

        setFullData(caba)
        // setFiltered(caba)
        // console.log(caba)

    }, []);

    useEffect(() => {
        if (fullData && fullData.features) {

            let fullCopy = JSON.parse(JSON.stringify(fullData.features))

            var f = fullCopy.filter((barrio) => {
                return barrio.properties['INDEX'] < sueldo * (porcentaje/100)
            })

            var dataFiltered = JSON.parse(JSON.stringify(fullData));
            dataFiltered.features = f;
    
            setFiltered(dataFiltered)
    
        }

    }, [fullData, sueldo, porcentaje])

    const layerStyle = {
        'type': 'fill',
        'source-id': 'barrios',
        'paint': {              
            'fill-color': {
                property: 'INDEX',
                stops: [[200000, '#ffff00'], [600000, '#ff0000']]
            },
            'fill-opacity': 0.5
        }
      };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            {filtered && (mobile ? <Map
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.NEXT_PUBLIC_TOKEN}
                boxZoom={false}
                // scrollZoom={false}
                style={{
                    height: '100vh',
                    width: '100vw'
                }}
                onMove={(a) => {}}
                onLoad={(a) => {
                    a.target.setZoom(10.20)
                    for (let index = 0; index < 100000; index++) {
                        console.log()                        
                    }
                    a.target.flyTo({ center: [-58.45689200256368, -34.55322214007016] })
                }}
                initialViewState={{
                    longitude: -58.44493682767809, 
                    latitude: -34.46406573521092, 
                    zoom: 10.23}}
                >
                    <Source id="barrios" type="geojson" data={filtered}>
                        <Layer {...layerStyle}>
                        </Layer>
                    </Source>                
            </Map> : <Map
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.NEXT_PUBLIC_TOKEN}
                boxZoom={false}
                // scrollZoom={false}
                style={{
                    height: '100vh',
                    width: '100vw'
                }}
                // onMove={(a) => {console.log(a)}}
                initialViewState={{
                    longitude: -58.50330169991081, 
                    latitude: -34.61621393391216, 
                    zoom: 11.35}}
                >
                    <Source id="barrios" type="geojson" data={filtered}>
                        <Layer {...layerStyle}>
                        </Layer>
                    </Source>                
            </Map>)}
            <Cuadro sueldo={sueldo} setSueldo={setSueldo} filtered={filtered} porcentaje={porcentaje} setPorcentaje={setPorcentaje} paso={paso} setPaso={setPaso} />
        </div>
        
    );
  }