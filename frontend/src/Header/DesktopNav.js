import react, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const DesktopNav = () => {
    const authContext = useContext(AuthContext);
    return (
        <div className="justify-between hidden px-12 py-4 bg-blue-100 shadow-sm md:flex">
            <NavLink to="/" className="text-xl font-bold">Home</NavLink>
            <div className="space-x-4">
                <NavLink className="hover:underline" to="/users">Users</NavLink>
                {authContext.isLoggedIn && <NavLink className="hover:underline" to="/places/new">New Place</NavLink>}
            </div>
        </div>
    );
}

export default DesktopNav;