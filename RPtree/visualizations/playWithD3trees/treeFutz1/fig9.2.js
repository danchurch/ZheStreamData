window.addEventListener( "load", makeRadial );
function makeRadial() {
    d3.json( "https://raw.githubusercontent.com/janert/d3-for-the-impatient/master/examples/filesys.json")
      .then( function(json) {    
        var nodes = d3.cluster().size( [2*Math.PI, 125] )(        //<1>
            d3.hierarchy( json, d=>d.kids )
                .sort( (a,b)=>b.height-a.height )
        );

        var g = d3.select( "#radial" ).append( "g" )
            .attr( "transform", "translate(150, 150)" );          //<2>

        var h = function( r, phi ) { return  r*Math.sin(phi) }    //<3>
        var v = function( r, phi ) { return -r*Math.cos(phi) }  
        
        g.selectAll( "line" ).data( nodes.links() ).enter()
            .append( "line" ).attr( "stroke", "red" )
            .attr( "x1", d=>h(d.source.y, d.source.x) )           //<4>
            .attr( "y1", d=>v(d.source.y, d.source.x) )
            .attr( "x2", d=>h(d.target.y, d.target.x) )
            .attr( "y2", d=>v(d.target.y, d.target.x) );

        g.selectAll( "circle" ).data( nodes.descendants() ).enter()
            .append( "circle" ).attr( "r", 5 )
            .attr( "cx", d=>h(d.y, d.x) )
            .attr( "cy", d=>v(d.y, d.x) );
    } )
}
