import React, { useEffect } from 'react';
import { Carousel } from 'bootstrap'; // Make sure Bootstrap's Carousel component is imported
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
const CarouselComponent = ({ images }) => {
    useEffect(() => {
        // Initialize Bootstrap Carousel on component mount
        const carousel = new Carousel(document.getElementById('carouselExampleIndicators'), {
            interval: 10000000, // Adjust interval as needed
            wrap: true
        });
    }, []);

    return (
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {images.map((_, index) => (
                    <button style={{backgroundColor:"grey"}} key={index} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} className={index === 0 ? 'active' : ''} aria-label={`Slide ${index + 1}`}></button>
                ))}
            </div>
            <div className="carousel-inner" style={{height:"100%", paddingTop:"40px"}}>
                {images.map((item, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img src={`data:image/png;base64,${item[0]}`} className="d-block w-100" alt={`Slide ${index + 1}`} style={{ maxHeight: '500px', objectFit: 'contain' }} />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Pattern Coverage: {item[1]}</h5>
                        </div>
                    </div>
                ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" >
                <ArrowBackIosIcon sx={{color:"grey"}}/>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next"  >
                <ArrowForwardIosIcon sx={{color:"grey"}}/>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default CarouselComponent;
