// src/components/LandingPage.jsx

import React ,{useState}from 'react';
import { Link, Element, animateScroll as scroll } from 'react-scroll';
import './LandingPage.css';
import logo from './logo.avif';
import Navbar from './Navbar';
// import React, { useState } from 'react';

const LandingPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        feedback: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here (e.g., send data to backend)
        console.log(formData);
        // Clear form fields after submission (optional)
        setFormData({
            name: '',
            email: '',
            phone: '',
            feedback: ''
        });
    };
    return (
        <div className="landing-page">
            {/* <nav className="navbar">
                <ul className="nav-links">
                    <li><Link to="about" smooth={true} duration={500}>About</Link></li>
                    <li><Link to="tool" smooth={true} duration={500}>Our Tool</Link></li>
                    <li><Link to="contact" smooth={true} duration={500}>Contact & Feedback</Link></li>
                </ul>
            </nav> */}
            <Navbar/>


            <header className="header" style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", height: "90vh" }}>
                <div>
                    <h1 className="title">Coverage Patterns extraction tool</h1>
                    <p className="subtitle">~ In application to Drug discovery</p>
                    <button className="tool-button" onClick={() => scroll.scrollToBottom()}>Explore Our Tool</button>
                </div>
                {/* <img src={logo} alt="Project Logo" className="logo" style={{ marginLeft:"50px",height: "300px", width: "350px" }} /> */}

            </header>

            <Element name="about" className="element" id="about">
                <div className="about-section" style={{ paddingLeft: "300px", paddingRight: "300px", paddingTop: "150px", paddingBottom: "150px" }}>
                    <h2>About the Project</h2>
                    <p>
                        We are developing a state-of-the-art web-based tool designed to extract and analyze Subgraph Coverage Patterns (SCPs) to significantly enhance the drug discovery process. Utilizing advanced graph mining techniques, our tool aims to identify potential drug candidates, predict drug interactions, and elucidate mechanisms of drug action with greater efficiency and accuracy. This innovative approach promises to streamline and accelerate the identification of novel therapeutic compounds, paving the way for breakthroughs in medical research and development.
                    </p>
                    <p>
                        Our approach leverages cutting-edge methodologies to mine and interpret complex graph data, including chemical structures and biological networks. By identifying unique patterns and relationships within these graphs, we can uncover insights that traditional methods might miss. This tool not only aids in the discovery of new drugs but also helps in understanding the intricate details of drug interactions and side effects, making the drug development process more robust and reliable
                    </p>
                    <p>
                        Through this project, we aim to bridge the gap between theoretical research and practical application, providing researchers and pharmaceutical companies with a powerful tool to revolutionize drug discovery and development.
                    </p>
                    <img src={logo} alt="Project Logo" className="logo" style={{ marginLeft:"50px",height: "300px", width: "350px" }} />

                </div>
            </Element>


            <Element name="contact" className="element" id="contact">
                <div className="contact-section">
                    <h2>Contact & Feedback</h2>
                    <p>We value your feedback and are here to assist you. Please reach out to us with any questions or comments.</p>
                    <div className="form-container">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number:</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="feedback">Feedback:</label>
                                <textarea
                                    id="feedback"
                                    name="feedback"
                                    value={formData.feedback}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                </div>
            </Element>

            <footer className="footer">
                <p>Copyrights @ Data science and Analytics center , KCIS 4th floor , IIIT Hyderabad</p>
            </footer>
        </div>
    );
};

export default LandingPage;
