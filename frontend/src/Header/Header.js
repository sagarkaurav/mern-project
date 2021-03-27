import react from 'react'
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Header = () => {
    return (
        <>
            <DesktopNav />
            <MobileNav />
        </>
    );
}

export default Header;