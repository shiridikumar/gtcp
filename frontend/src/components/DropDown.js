import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import DataObjectIcon from '@mui/icons-material/DataObject';
import "../main.css"
export default function AccordionUsage(props) {
    const datasets = props.datasets
    return (
        <div>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                >
                    Datasets
                </AccordionSummary>
                <AccordionDetails className='dataset-list' sx={{ maxHeight: "600px", overflowY: "scroll" }}>
                    {datasets.map(file => (
                        <>
                            <button onClick={() => { props.fun(file["file_name"],file["id"]) }}>
                                <i class="fa-solid fa-database fa-lg" style={{ fontSize: "20px" }}></i> {file["file_name"]}
                            </button>
                            <Divider sx={{ borderWidth: "1px", border: " 1px solid grey" }} />
                        </>
                    ))}
                </AccordionDetails>
            </Accordion>
            <div style={{ display: "flex", flexDirection: "column", boxShadow: "2px 2px 6px darkgrey", marginTop: "40px", padding: "20px" }}>
                <h5 style={{ textAlign: "left" }}>Subgraph Mining Algorithms</h5>
                <div className='alg1-list' style={{ maxHeight: "400px", padding: "20px" }}>
                    <ImageListItem sx={{ boxShadow: "2px 2px 6px darkgray", height: "200px", maxWidth: "60%", padding: "20px" }}>
                        <DataObjectIcon style={{ fontSize: "100px", color: "green" }} />
                        <h3>gSpan</h3>
                    </ImageListItem>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", boxShadow: "2px 2px 6px darkgrey", marginTop: "40px", padding: "20px" }}>
                <h5 style={{ textAlign: "left" }}>Coverage Pattern Algorithms</h5>
                <div className='alg1-list' style={{ maxHeight: "400px", padding: "20px" }}>
                    <ImageListItem sx={{ boxShadow: "2px 2px 6px darkgray", height: "200px", maxWidth: "60%", padding: "20px" }}>
                        <DataObjectIcon style={{ fontSize: "100px", color: "blue" }} />
                        <h5>Graph transactional Coverage Patterns</h5>
                    </ImageListItem>
                </div>
            </div>

        </div>
    );
}
