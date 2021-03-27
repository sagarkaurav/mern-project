import react from 'react';
import avatar from '../../img/avatar.svg';
import {Link} from 'react-router-dom';

const User = ({id, name}) => {
    return <Link to={`/${id}/places`}>
    <div className="flex flex-wrap items-center justify-between max-w-2xl p-2 bg-white rounded-md shadow-sm flex-inline">
        <div className="flex items-center space-x-2 flex-inline">        
        <img className="w-12 h-12" src={avatar} alt={name} />
        <p>{name}</p>
        </div> 
        <p className="text-sm text-gray-400">3 places</p>
    </div>
    </Link>
}

export default User;