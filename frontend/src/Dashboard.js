import React, { useState } from "react";
import FundGraph from "./FundGraph";
import BranchHeatMap from "./BranchHeatMap";

function Dashboard() {

const [account, setAccount] = useState("A1");

return (

<div style={{display:"flex",flexDirection:"column"}}>

<h1>Fund Flow Investigation Dashboard</h1>

<div style={{marginBottom:"20px"}}>

<input
value={account}
onChange={(e)=>setAccount(e.target.value)}
placeholder="Enter Account ID"
/>

</div>

<div style={{display:"flex"}}>

<div style={{width:"20%", padding:"10px"}}>

<h3>Fraud Alerts</h3>

<p>Rapid Layering</p>
<p>Circular Transactions</p>

<br/>

<BranchHeatMap/>

</div>

<div style={{width:"60%", height:"600px"}}>

<FundGraph accountId={account}/>

</div>

<div style={{width:"20%", padding:"10px"}}>

<h3>Risk Score</h3>

<p>Loading...</p>

</div>

</div>

</div>

);

}

export default Dashboard;