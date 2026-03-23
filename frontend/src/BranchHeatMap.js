import { useEffect, useState } from "react";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || `${API_BASE_URL}`;


function BranchHeatMap() {

const [data,setData] = useState([]);

useEffect(()=>{

axios.get(`${API_BASE_URL}/branch-risk`)
.then(res => setData(res.data))
.catch(err => console.log(err));

},[]);

return(

<div>

<h3>Fraud Heat Map</h3>

{data.length === 0 && <p>Loading...</p>}

{data.map((b)=>(
<div key={b.branch}>

<b>{b.branch}</b> — {b.risk} ({b.transactions} transactions)

</div>
))}

</div>

);

}

export default BranchHeatMap;