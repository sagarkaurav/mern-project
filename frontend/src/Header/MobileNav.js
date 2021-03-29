import react, {useState, useContext} from 'react';
import {NavLink} from 'react-router-dom';
import AuthContext from '../context/AuthContext';
const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const authContext = useContext(AuthContext);
    return (
        <>
        <div className="flex justify-between px-12 py-4 bg-blue-100 shadow-sm md:hidden">
            <NavLink to="/users" className="text-xl font-bold">YourPlaces</NavLink>
            <div onClick={() => setIsOpen(prevState => !prevState)}>
                <svg className="w-8 h-8 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </div>
        </div>
       <div className={ isOpen ?  "flex flex-col py-4 text-center bg-blue-100 md:hidden": 'hidden'}>
                <NavLink className="hover:underline" to="/users">
                    Users
                </NavLink>
                {authContext.isLoggedIn && <NavLink className="hover:underline" to="/places/new">New Place</NavLink>}
                {authContext.isLoggedIn && <button className="hover:underline" onClick={authContext.logout}>Logout</button>}
                {!authContext.isLoggedIn && <NavLink className="hover:underline" to="/signup">Signup</NavLink>}
                {!authContext.isLoggedIn && <NavLink className="hover:underline" to="/login">Login</NavLink>}
       </div> 
       </>
    );
}
export default MobileNav;