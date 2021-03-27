import react, { useState, useContext } from 'react';
import place_default from '../../img/place_default.svg'
import Map from '../components/Map';
import AuthContext from '../../context/AuthContext';

const Place = ({name, description, coordinates}) => {
    const authContext = useContext(AuthContext);
    const [mapOpen, setmapOpen] = useState(false);
    const colseMap = () => setmapOpen(false);
    const openMap = () => setmapOpen(true);
    return(
    <>
    {mapOpen && <Map onClose={colseMap}  name={name} coordinates={coordinates} />}
    <div className="flex flex-col max-w-2xl bg-white rounded-md shadow-sm">
        <img className="w-full h-24 mt-4" src={place_default} alt={name} />
        <div className="py-4 text-center">
            <p>{name}</p>
            <p>{description}</p>
        </div>
        <div className="flex justify-between px-8 py-2 bg-gray-100 rounded-b-md">
            <div>
                <button onClick={openMap} className="px-2 py-2 text-white bg-green-400 rounded-lg hover:bg-green-500">VIew on Map</button>
            </div>
            <div className="space-x-4">
                {authContext.isLoggedIn &&
                <>
                <button className="w-20 px-2 py-2 bg-gray-200 rounded-lg hover:text-white hover:bg-yellow-400">Edit</button>
                <button className="w-20 px-2 py-2 bg-gray-200 rounded-lg hover:text-white hover:bg-red-400">Delete</button></>}
            </div>
        </div>
    </div>
    </>);
}

export default Place;