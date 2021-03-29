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
                const respData = await sendRequest(`${process.env.REACT_APP_BACKEND_API}/api/v1/places/user/${userId}`)
                setPlaces(respData.places);
            }catch(err) {
                alert(err.message)
            }
        };
        fetchPlaces();

    }, [sendRequest, userId])
    const deletePlace = async (placeId) => {
        try{
            await sendRequest(`${process.env.REACT_APP_BACKEND_API}/api/v1/places/${placeId}`, 'DELETE', null, {
                'Authorization': 'Bearer ' + authContext.token
            });
            setPlaces(prevPlaces => prevPlaces.filter(p => !(p._id === placeId)));
        }catch(err) {
            alert(err.message)
        }
    }
    if(places.length === 0) {
        return (
        <div className="flex justify-center max-w-3xl mt-12">
            <div className="p-8 bg-white rounded-md shadow-sm ">
            <h1>Here is no places added by users.</h1>
            </div>
        </div>
        )
    }
    return (
        <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-2 px-12 mt-12 grids-cols-2">
            {places.map(place => <Place deletePlace={deletePlace} key={place._id} creator={place.creator} placeId={place._id} name={place.title} description={place.description} coordinates={place.coordinates} creator={place.creator} />)}
        </div>
        </div> 
    );
}

export default Places;