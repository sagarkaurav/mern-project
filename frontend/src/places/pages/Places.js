import react, { useState } from 'react';

import Place from '../components/Place';


const Places = () => {
    const [places, setPlaces] = useState([{
        id: 'p1',
        image: '',
        name: 'lorem lipsum',
        desc: 'lorem lipsum',
        coordinates: {
            lat: 1000,
            lng: 1000,
        },
        creator: {
            id: '1'
        }
    }]);
    return (
        <div className="grid grid-cols-1 gap-2 px-12 mt-12 grids-cols-2">
            {places.map(place => <Place key={place.id} name={place.name} description={place.desc} coordinates={place.coordinates} creator={place.creator} />)}
        </div>
    );
}

export default Places;