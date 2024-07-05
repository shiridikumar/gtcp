import React from 'react';
import '../main.css'; // Import your CSS file for styling

const TopGrid = (props) => {
    console.log(props,"***************")
    return (
        <div className="top-grid-container">
            <div className="top-grid-item">
                <span className="top-grid-label">Selected Dataset:</span>
                <span className="top-grid-value">{props["dataset"]}</span>
            </div>
            <div className="top-grid-item">
                <span className="top-grid-label">Selected Subgraph Algorithm:</span>
                <span className="top-grid-value">{props.subgraph_algo}</span>
            </div>
            <div className="top-grid-item">
                <span className="top-grid-label">Selected Patterns:</span>
                <span className="top-grid-value">{props.pattern_algo}</span>
            </div>
        </div>
    );
};

export default TopGrid;
