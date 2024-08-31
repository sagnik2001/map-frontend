import React from 'react';
import './Navbar.css'; // Import CSS file if you're using plain CSS
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../utils/firebase';

const Navbar = () => {
    const route = useNavigate()
    return (
        <div className="navbar">
            <h1>Mapify</h1>
            <div className="dropdown">
                <img src='/profile.svg' alt='profile' />
                <div className="dropdown-content">
                    <a onClick={() => route("/profile")} href="">Profile</a>
                    <a onClick={() => route("/mapContainer")} href="">View Map</a>
                    <a onClick={async()=> {
                        await auth.signOut()
                        route("/")
                    }}>Logout</a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
