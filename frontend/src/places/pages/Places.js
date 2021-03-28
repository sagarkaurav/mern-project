import react, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Place from '../components/Place';

import { useBackendApi } from '../../hooks/backendApi';


const Places = () => {
    const { isLoading, err, sendRequest } = useBackendApi();
    const [places, setPlaces] = useState([]);
    const { userId } = useParams();
    useEffect(() => {
        const fetchPlaces = async () => {
            try{
                const respData = await sendRequest(`http://localhost:5000/api/v1/places/user/${userId}`)
                setPlaces(respData.places);
            }catch(err) {
                alert(err.message)
            }
        };
        fetchPlaces();

    }, [sendRequest, userId])
    return (
        <div className="grid grid-cols-1 gap-2 px-12 mx-auto mt-12 grids-cols-2">
            {places.map(place => <Place key={place._id} creator={place.creator} placeId={place._id} name={place.title} description={place.description} coordinates={place.coordinates} creator={place.creator} />)}
        </div>
    );
}

export default Places;