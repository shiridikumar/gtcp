import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useLocation } from 'react-router-dom';


const ViewSubgraphs=()=>{
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const url=queryParams.get("url");
    return (
        JSON.stringify({1:2})    )

}
export default ViewSubgraphs