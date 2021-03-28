import react from 'react';

const Map = ({name, coordinates, onClose}) => {
    return (
        <div onClick={onClose} className="min-w-full min-h-screen bg-gray-700 bg-opacity-80">
            <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="bg-white">
                    <button onClick={onClose}>Close</button>
                </div>
            </div> 
        </div>
    );
}

export default Map;