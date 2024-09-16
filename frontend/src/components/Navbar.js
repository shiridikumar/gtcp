import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from './logo.avif';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const navigate=useNavigate();
    const [activeLink, setActiveLink] = useState('');

    const handleSetActiveLink = (link) => {
        setActiveLink(link);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${activeLink === 'about' ? 'active' : ''}`} 
                            href="#about" 
                            onClick={() => handleSetActiveLink('about')}
                        >
                            About
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${activeLink === 'contact' ? 'active' : ''}`} 
                            href="#contact" 
                            onClick={() => handleSetActiveLink('contact')}
                        >
                            Contact
                        </a>
                    </li>
                    <li className="nav-item">
                        <a style={{cursor:"pointer"}}
                            className={`nav-link ${activeLink === 'view-tool' ? 'active' : ''}`} 
                            onClick={() => navigate("new")}
                        >
                            View Tool
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
