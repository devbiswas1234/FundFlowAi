import React, { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { getFundTrace } from "./api";

function FundGraph({ accountId }) {

 const [elements, setElements] = useState([]);
 const [cy, setCy] = useState(null);

 useEffect(() => {
   if (cy && elements.length > 0) {
     const layout = cy.layout({
       name: 'cose',
       directed: true,
       padding: 50,
       animate: true,
       randomize: true, // Forces nodes to scatter initially, preventing physics overlapping at (0,0)
       nodeRepulsion: function( node ){ return 400000; },
       nodeOverlap: 20,
       idealEdgeLength: function( edge ){ return 100; },
       edgeElasticity: function( edge ){ return 100; },
       nestingFactor: 5,
       gravity: 80,
       numIter: 1000,
       initialTemp: 200,
       coolingFactor: 0.95,
       minTemp: 1.0
     });
     
     layout.pon('layoutstop').then(function( event ){
       cy.fit(undefined, 50);
       if (cy.zoom() > 1.2) {
         cy.zoom(1.2);
         cy.center();
       }
     });

     layout.run();
   }
 }, [cy, elements]);

 useEffect(() => {

   getFundTrace(accountId).then(res => {

     const data = res.data;

     let nodes = {};
     let edges = [];

     data.forEach(tx => {

       const from = tx.a;
       const to = tx.b;

       nodes[from] = { data: { id: from, risk: tx.a_risk || 0 } };
       nodes[to] = { data: { id: to, risk: tx.b_risk || 0 } };

       edges.push({
         data: {
           source: from,
           target: to,
           label: `₹${(tx.amount || 0).toLocaleString()}`
         }
       });

     });

     setElements([
       ...Object.values(nodes),
       ...edges
     ]);

   });

 }, [accountId]);

 const cyStyle = [
   {
     selector: 'node',
     style: {
       'background-color': '#3b82f6', // blue
       'label': 'data(id)',
       'color': '#ffffff',
       'text-valign': 'center',
       'text-halign': 'center',
       'font-size': '12px',
       'width': 45,
       'height': 45,
       'border-width': 2,
       'border-color': '#ffffff',
       'text-outline-width': 1,
       'text-outline-color': '#1e293b'
     }
   },
   {
     selector: 'node[risk > 30]',
     style: {
       'background-color': '#eab308' // yellow
     }
   },
   {
     selector: 'node[risk > 60]',
     style: {
       'background-color': '#ef4444' // red
     }
   },
   {
     selector: 'edge',
     style: {
       'width': 2,
       'line-color': '#475569',
       'target-arrow-color': '#475569',
       'target-arrow-shape': 'triangle',
       'curve-style': 'bezier',
       'label': 'data(label)',
       'font-size': '10px',
       'color': '#94a3b8',
       'text-rotation': 'autorotate',
       'text-margin-y': -10
     }
   }
 ];

 return (

   <CytoscapeComponent
     elements={elements}
     stylesheet={cyStyle}
     style={{ width: "100%", height: "600px" }}
     minZoom={0.1}
     maxZoom={1.5}
     cy={(instance) => {
       if (!cy) setCy(instance);
     }}
   />

 );

}

export default FundGraph;