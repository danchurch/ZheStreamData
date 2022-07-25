window.addEventListener("load", main);

function main(){
  d3.text("grahamAllSeqsTreeRelabeled.nwk").then(function(d){

    // borrowed from Jason Davies:
    function parseNewick(a){
      for(var e=[],r={},s=a.split(/\s*(;|\(|\)|,|:)\s*/),t=0;t<s.length;t++)
        {var n=s[t];switch(n){case"(":var c={};
        r.branchset=[c],e.push(r),r=c;break;case",":var c={};
        e[e.length-1].branchset.push(c),r=c;break;case")":r=e.pop();
        break;
        case":":break;default:var h=s[t-1];")"==h||"("==h||","==h?r.name=n:":"==h&&(r.length=parseFloat(n))}}
      return r}
    
    let zoop = parseNewick(d);

    let poop = d3.hierarchy(zoop, d => d.branchset)
    
    console.log(zoop);

    console.log(poop);

})}
