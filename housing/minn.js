function init(){scene=new THREE.Scene;var e=window.innerWidth,t=window.innerHeight,n=e/t;camera=new THREE.PerspectiveCamera(45,n,.1,1e4),scene.add(camera),camera.position.z=396.845,camera.position.y=650.576,camera.position.x=103.37,camera.lookAt({x:0,y:0,z:0}),(renderer=Detector.webgl?new THREE.WebGLRenderer({antialias:!0}):new THREE.CanvasRenderer).setSize(e,t),(container=document.getElementById("ThreeJS")).appendChild(renderer.domElement),THREEx.WindowResize(renderer,camera),THREEx.FullScreen.bindKey({charCode:"m".charCodeAt(0)}),controls=new THREE.OrbitControls(camera,renderer.domElement);var a=new THREE.DirectionalLight(16777215,1);camera.add(a),projector=new THREE.Projector,window.addEventListener("resize",onWindowResize,!1),document.addEventListener("mousemove",onDocumentMouseMove,!1),currentvalue=0,current_term="block";var r=document.getElementById("Currentvalue");valueNode=document.createTextNode(""),r.appendChild(valueNode),valueNode.nodeValue="Hover over a "+current_term,currenttitle="Housing Prices";var o=document.getElementById("Currenttitle");titleNode=document.createTextNode(""),o.appendChild(titleNode);d3.select("#indexmenu").selectAll("option").data([{name:"Block"},{name:"Block Group"},{name:"Census Tract"},{name:"Neighborhood"},{name:"Major Market"}]).enter().append("option").text(function(e){return e.name});var i=d3.geo.equirectangular().scale(25e4).translate([720,450]).center([-73.89,40.66]),d=d3.geo.path().projection(i),s=[.017,.016,.03,.05,.05],c=["block","blockgroup","censustract","neighborhood","majormarket"];rate={};for(var l=0;l<c.length;l++)rate[c[l]]=s[l];k=rate.block;var u=["COOPMP06","COOPMP07","COOPMP08","COOPMP09","COOPMP10","COOPMP11","COOPMP12","COOPMP13","COOPMP14","COOPMP15"];d3.json("hblock.json",function(e){term="COOPMP06",countries=[];var t,n;for(toAdd=[],t=0;t<e.features.length;t++){var a=e.features[t],r=a.properties,o=d(a),i=transformSVGPathExposed(o);for(n=0;n<i.length;n++)countries.push({data:r,mesh:i[n]})}var s=getMaxMin(countries,u);for(max=s[0],min=s[1],t=0;t<countries.length;t++){var c=new THREE.MeshLambertMaterial({opacity:.9}),l=countries[t].mesh.extrude({amount:2,bevelEnabled:!1});toAdd[t]=new THREE.Mesh(l,c),setColorHeight(toAdd[t],countries[t].data,max,term,k,min),toAdd[t].rotation.x=Math.PI/2,toAdd[t].translateX(-350),toAdd[t].translateZ(50),toAdd[t].translateY(-50),scene.add(toAdd[t])}var m=document.getElementById("Endvalue");endNode=document.createTextNode(""),m.appendChild(endNode),endNode.nodeValue=toCommas(max.toFixed(0));var E=document.getElementById("Startvalue");startNode=document.createTextNode(""),E.appendChild(startNode),startNode.nodeValue=toCommas(min);document.getElementById("Start"),document.getElementById("Title");var h=d3.selectAll("div.info").append("svg").attr("height",42).attr("width",550),v=d3.scale.linear().domain([2006,2015]).range([20,300]).clamp(!0),p=d3.svg.brush().x(v).extent([2006,2006]).on("brush",function brushed(){var e=p.extent()[0];d3.event.sourceEvent&&(e=v.invert(d3.mouse(this)[0]),p.extent([e,e])),T.attr("cx",v(Math.floor(e))),g.select("text").text(Math.floor(e)),changeYear(Math.floor(e))});h.append("g").attr("class","x axis").attr("transform","translate(0,21)").call(d3.svg.axis().scale(v).orient("bottom").tickFormat(function(e){return e}).tickSize(0).tickPadding(12).tickValues([])).select(".domain").select(function(){return this.parentNode.appendChild(this.cloneNode(!0))}).attr("class","halo");var g=h.append("g").attr("class","slider").call(p);g.selectAll(".extent,.resize").remove(),g.select(".background").attr("height",42);var T=g.append("circle").attr("class","handle").attr("transform","translate(0,21)").attr("r",7);g.append("text").text(2006).style("font-size",12).style("font-weight","bold").attr("fill","darkblue").attr("transform","translate(330,24)"),g.call(p.event),d3.select("#example98 button").on("click",function(){g.call(p.event).transition().ease("linear").call(p.extent([2006,2006])).call(p.event),g.call(p.event).transition().ease("linear").duration(1e4).call(p.extent([2015,2015])).call(p.event)}),d3.select("#indexmenu").on("change",function(){for(t=0;t<countries.length;t++)scene.remove(toAdd[t]);var e=d3.select(this)[0][0].value;e=e.replace(/\s+/g,"").toLowerCase(),k=rate[e],current_term=d3.select(this)[0][0].value.toLowerCase(),current_value=v.invert(T.attr("cx")),d3.json("h"+e+".json",function(e){term="COOPMP06",countries=[];var t,n;for(toAdd=[],t=0;t<e.features.length;t++){var a=e.features[t],r=a.properties,o=d(a),i=transformSVGPathExposed(o);for(n=0;n<i.length;n++)countries.push({data:r,mesh:i[n]})}var s=getMaxMin(countries,u);for(max=s[0],min=s[1],t=0;t<countries.length;t++){var c=new THREE.MeshLambertMaterial({opacity:.9}),l=countries[t].mesh.extrude({amount:2,bevelEnabled:!1});toAdd[t]=new THREE.Mesh(l,c),setColorHeight(toAdd[t],countries[t].data,max,term,k,min),toAdd[t].rotation.x=Math.PI/2,toAdd[t].translateX(-350),toAdd[t].translateZ(50),toAdd[t].translateY(-50),scene.add(toAdd[t])}endNode.nodeValue=toCommas(max.toFixed(0)),startNode.nodeValue=toCommas(min),g.call(p.event).transition().ease("linear").call(p.extent([current_value,current_value])).call(p.event)})})})}function animate(e){requestAnimationFrame(animate),TWEEN.update(e),render(),update()}function update(){var e=new THREE.Vector3(mouse.x,mouse.y,1);projector.unprojectVector(e,camera);var t=new THREE.Raycaster(camera.position,e.sub(camera.position).normalize()).intersectObjects(scene.children);t.length>0?t[0].object!=INTERSECTED&&(INTERSECTED&&INTERSECTED.material.color.setHex(INTERSECTED.currentHex),1==(INTERSECTED=t[0].object).material.color.r&&1==INTERSECTED.material.color.g&&1==INTERSECTED.material.color.b?valueNode.nodeValue="None":valueNode.nodeValue=toCommas(Math.pow(INTERSECTED.scale.z/k-1+Math.sqrt(min),2).toFixed(0)),INTERSECTED.currentHex=INTERSECTED.material.color.getHex(),INTERSECTED.material.color.setHex(139)):(INTERSECTED&&INTERSECTED.material.color.setHex(INTERSECTED.currentHex),valueNode.nodeValue="Hover over a "+current_term,INTERSECTED=null),controls.update()}function onDocumentMouseMove(e){mouse.x=e.clientX/window.innerWidth*2-1,mouse.y=-e.clientY/window.innerHeight*2+1}function render(){renderer.render(scene,camera)}function onWindowResize(){camera.aspect=window.innerWidth/window.innerHeight,camera.updateProjectionMatrix(),renderer.setSize(window.innerWidth,window.innerHeight),render()}function changePositionsmooth(e,t){var n={y:t.position.y,element:t};t0=new TWEEN.Tween(n).to({y:e},0).easing(TWEEN.Easing.Cubic.InOut).delay(0).onUpdate(function(){this.element.position.y=this.y}).start()}function getMaxMin(e,t){for(var n=[],a=0;a<t.length;a++)for(var r=0;r<e.length;r++)e[r].data[t[a]]>0&&n.push(e[r].data[t[a]]);return[Math.max.apply(Math,n),Math.min.apply(Math,n)]}function setColorHeight(e,t,n,a,r,o){if(t[a]-o>=0){e.scale.z=(Math.sqrt(t[a])+1-Math.sqrt(o))*r;var i=.5-(Math.sqrt(t[a])+1-Math.sqrt(o))/(2*(Math.sqrt(n)+1-Math.sqrt(o)));e.material.color.setHSL(i,1,.5),changePositionsmooth(2*(Math.sqrt(t[a])+1-Math.sqrt(o))*r-50,e)}else e.scale.z=1,e.material.color.setHSL(0,0,1),changePositionsmooth(-48,e)}function changeYear(e){for(term="COOPMP"+e.toString().substring(2),i=0;i<countries.length;i++)setColorHeight(toAdd[i],countries[i].data,max,term,k,min)}function toCommas(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}var container,scene,camera,renderer,controls,stats,raycaster,INTERSECTED,mesh,position,mouse=new THREE.Vector2,radius=100,theta=0,clock=new THREE.Clock;init(),animate();