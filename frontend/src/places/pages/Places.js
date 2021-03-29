import react, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Place from '../components/Place';

import { useBackendApi } from '../../hooks/backendApi';
import AuthContext from '../../context/AuthContext';


const Places = () => {
    const { isLoading, err, sendRequest } = useBackendApi();
    const [places, setPlaces] = useState([]);
    const authContext = useContext(AuthContext);
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
    const deletePlace = async (placeId) => {
        try{
            await sendRequest(`http://localhost:5000/api/v1/places/${placeId}`, 'DELETE', null, {
                'Authorization': 'Bearer ' + authContext.token
            });
            setPlaces(prevPlaces => prevPlaces.filter(p => !(p._id === placeId)));
        }catch(err) {
            alert(err.message)
        }
    }
    return (
        <div className="grid grid-cols-1 gap-2 px-12 mx-auto mt-12 grids-cols-2">
            {places.map(place => <Place deletePlace={deletePlace} key={place._id} creator={place.creator} placeId={place._id} name={place.title} description={place.description} coordinates={place.coordinates} creator={place.creator} />)}
        </div>
    );
}

export default Places;