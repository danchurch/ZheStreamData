window.addEventListener( "load", makeRadial );
function makeRadial() {
    //d3.json( "https://raw.githubusercontent.com/janert/d3-for-the-impatient/master/examples/filesys.json").then( function(json) {    
    d3.text("grahamAllSeqsTreeRelabeled.nwk").then(function(nwk){ 

       // some useful functions:
       let h = function( r, phi ) { return r*Math.sin(phi) };
       let v = function( r, phi ) { return -r*Math.cos(phi) };

       let parseNewick = function (a){
         for(var e=[],r={},s=a.split(/\s*(;|\(|\)|,|:)\s*/),t=0;t<s.length;t++)
           {var n=s[t];switch(n){case"(":var c={};
           r.branchset=[c],e.push(r),r=c;break;case",":var c={};
           e[e.length-1].branchset.push(c),r=c;break;case")":r=e.pop();
           break;
           case":":break;default:var h=s[t-1];")"==h||"("==h||","==h?r.name=n:":"==h&&(r.length=parseFloat(n))}}
         return r}

       let json = parseNewick(nwk);
       let nodes = d3.hierarchy(json, d => d.branchset);


       //let nodes = d3.cluster().size( [2*Math.PI, 125] )(lyout).sort( (a,b) => b.height - a.height );

       d3.cluster().size( [2*Math.PI, 350] )(nodes);

       //console.log( nodes );
       //console.log( nodes.links() );

       var g = d3.select('#radial').append('g')
         .attr('transform', 'translate(400, 400)' );



       g.selectAll( "line" )
         .data( nodes.links() )
         .join('line')
           .attr( "x1", d=>h(d.source.y, d.source.x) )           //<4>
           .attr( "y1", d=>v(d.source.y, d.source.x) )
           .attr( "x2", d=>h(d.target.y, d.target.x) )
           .attr( "y2", d=>v(d.target.y, d.target.x) )
           .attr( "stroke", "blue" );

       console.log( nodes.descendants() );

       g.selectAll('circle')
         .data( nodes.descendants() )
         .join('circle')
         .attr('r', 5)
         .attr('cx', d=> h(d.y, d.x) )
         .attr('cy', d=> v(d.y, d.x) );

})}
