window.addEventListener('load',makePlantTree );

function makePlantTree(){
  d3.json("treeDataPruned.json").then(function(data){

    let width = 954;
    let outerRadius = width / 2;
    let innerRadius = 307;

    let cluster = d3.cluster()
        .size([360, innerRadius])
        .separation((a, b) => 1);

    let color = d3.scaleOrdinal()
        .domain(["Aloe", "Araceae", "Marantaceae", "Begonia", "Hedera", "Gynura", "Dypsis"])
        .range(d3.schemeCategory10);


    //// legend without function
    //const g = d3.select('svg')
    //    .append("g")
    //    .attr('id','leg')
    //    .selectAll("g")
    //    .data(color.domain())
    //    .join("g")
    //    .attr("transform", (d, i) => `translate(19,${i*20})`); // just for the moment
    //    //.attr("transform", (d, i) => `translate(${-outerRadius},${-outerRadius + i * 20})`);
    //
    //g.append("rect")
    //    .attr("width", 18)
    //    .attr("height", 18)
    //    .attr("fill", color);
    //
    //g.append("text")
    //    .attr("x", 24)
    //    .attr("y", 9)
    //    .attr("dy", "0.35em")
    //    .text(d => d);
    /////// legend
    

    const root = d3.hierarchy(data)
        .sum(d => d.chiildren?.length ? 0 : 1)
        .sort((a, b) => (a.value - b.value) || d3.ascending(a.data.length, b.data.length));

  
    cluster(root);
    setRadius(root, root.data.length = 0, innerRadius / maxLength(root));
    setColor(root);
  
    const svg = d3.select("#radial")
        .append('svg')
        .attr("width","800")
        .attr("height","800")
        .attr("viewBox", [-outerRadius, -outerRadius, width, width])
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);
  
        console.log([outerRadius, outerRadius, width, width]);
  
    svg.append("style").text(`
  
  .link--active {
    stroke: #000 !important;
    stroke-width: 1.5px;
  }
  
  .link-extension--active {
    stroke-opacity: .6;
  }
  
  text {
    cursor: default;
  }
  
  .label--active {
    font-weight: bold;
  }
  
  `);


    legend = svg => {
      const g = svg
        .selectAll("g")
        .data(color.domain())
        .join("g")
          .attr("transform", (d, i) => `translate(${-outerRadius},${-outerRadius + i * 20})`);
    
      g.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", color);
    
      g.append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .text(d => d);
    }
  
    const linkExtension = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.25)
      .selectAll("path")
      .data(root.links().filter(d => !d.target.children))
      .join("path")
        .each(function(d) { d.target.linkExtensionNode = this; })
        .attr("d", linkExtensionConstant);
  
    const link = svg.append("g")
        .attr('class', 'link-wrapper')
        .attr("fill", "none")
        .attr("stroke", "#ccc")
      .selectAll("path")
      .data(root.links())
      .join("path")
        .each(function(d) { d.target.linkNode = this; })
        .attr("d", linkConstant)
        .attr("stroke", d => d.target.color);
  
    const nodes = svg.append("g")
          .attr("fill", "#fff")
          .attr("stroke", "#ccc")
        .selectAll("circle")
        .data(root.links())
        .join("circle")
          .attr("cx", d => nodeCircle(d, true))
          .attr("cy", d => nodeCircle(d, false))
          .attr("r", width * .002)
          .attr("stroke", d => d.target.color);
  
      console.log("here");

    svg.append("g")
      .selectAll("text")
      .data(root.leaves())
      .join("text")
        .attr("dy", ".31em")
        .attr("transform", d => `rotate(${d.x - 90}) translate(${innerRadius + 4},0)${d.x < 180 ? "" : " rotate(180)"}`)
        .attr("text-anchor", d => d.x < 180 ? "start" : "end")
        .text(d => d.data.name.replace(/_/g, " "))
        .on("mouseover", mouseovered(true))
        .on("mouseout", mouseovered(false));
  
    linkExtension.attr("d", linkExtensionConstant);
    link.attr("d", linkConstant);
  
    function mouseovered(active) {
      return function(event, d) {
        d3.select(this).classed("label--active", active);
        d3.select(d.linkExtensionNode).classed("link-extension--active", active).raise();
        do d3.select(d.linkNode).classed("link--active", active).raise();
        while (d = d.parent);
      };
    }
  
    //return svg.node();
  

    
    
    // Compute the maximum cumulative length of any node in the tree.
    function maxLength(d) {
      return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0);
    }
    
    // Set the radius of each node by recursively summing and scaling the distance from the root.
    function setRadius(d, y0, k) {
      d.radius = (y0 += d.data.length) * k;
      if (d.children) d.children.forEach(d => setRadius(d, y0, k));
    }
    
    // Set the color of each node by recursively inheriting.
    function setColor(d) {
      var name = d.data.name;
      d.color = color.domain().indexOf(name) >= 0 ? color(name) : d.parent ? d.parent.color : null;
      if (d.children) d.children.forEach(setColor);
    }
    
    function linkConstant(d) {
      return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
    }
    
    function linkExtensionConstant(d) {
      return linkStep(d.target.x, d.target.y, d.target.x, innerRadius);
    }
    
    function linkStep(startAngle, startRadius, endAngle, endRadius) {
      const c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI);
      const s0 = Math.sin(startAngle);
      const c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI);
      const s1 = Math.sin(endAngle);
      return "M" + startRadius * c0 + "," + startRadius * s0
          + (endAngle === startAngle ? "" : "A" + startRadius + "," + startRadius + " 0 0 " + (endAngle > startAngle ? 1 : 0) + " " + startRadius * c1 + "," + startRadius * s1)
          + "L" + endRadius * c1 + "," + endRadius * s1;
    }
    
    function nodeCircle(d, returnX = true) {
        let startAngle = d.target.x;
        let startRadius = d.target.y;
        let endAngle = d.target.x;
        let endRadius = innerRadius;
    
        const c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI);
        const s0 = Math.sin(startAngle);
        const c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI);
        const s1 = Math.sin(endAngle);
        const x = startRadius * c1
        const y = startRadius * s1;
        if (returnX) return x;
        else return y;
    }
    
    
    svg.append("g")
        .call(legend);

})}
