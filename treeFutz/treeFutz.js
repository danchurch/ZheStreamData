window.addEventListener( "load", makeRadial );
function makeRadial() {
    d3.json( "https://raw.githubusercontent.com/janert/d3-for-the-impatient/master/examples/filesys.json")
      .then( function(json) {    
        let nodes = d3.hierarchy(json, d => d.kids);
        console.log(nodes);


        //d3.tree().size([250,224])(nodes);
        //console.log('poop');
        //console.log(nodes);

        d3.select('#tree').append('g')
          .attr('transform', 'translate(25, 25)' );

})}
