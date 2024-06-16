import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useLocation } from 'react-router-dom';


const ViewSubgraphs=()=>{
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const url=queryParams.get("url");
    return (
        <img src={`http://localhost:5000/${url}`}/>
    )

}
export default ViewSubgraphs