function init(){scene=new THREE.Scene;var e=window.innerWidth,n=window.innerHeight,a=e/n;camera=new THREE.PerspectiveCamera(45,a,.1,2e4),scene.add(camera),camera.position.set(1,-168,198),camera.lookAt(scene.position),(renderer=Detector.webgl?new THREE.WebGLRenderer({antialias:!0}):new THREE.CanvasRenderer).setSize(e,n),(container=document.getElementById("ThreeJS")).appendChild(renderer.domElement),THREEx.WindowResize(renderer,camera),THREEx.FullScreen.bindKey({charCode:"m".charCodeAt(0)}),(controls=new THREE.TrackballControls(camera,renderer.domElement)).noZoom=!0;var r=new THREE.PointLight(16777215);r.position.set(0,250,0),scene.add(r);new THREE.MeshNormalMaterial,new THREE.MeshLambertMaterial({color:16711680});var t=new THREE.ImageUtils.loadTexture("../3dsurface/new.png");t.wrapS=t.wrapT=THREE.RepeatWrapping,t.repeat.set(20,20),wireMaterial=new THREE.MeshBasicMaterial({map:t,vertexColors:THREE.VertexColors,side:THREE.DoubleSide});new THREE.MeshBasicMaterial({vertexColors:THREE.VertexColors});createGraph(value_min,surface_data[term])}function createGraph(e,n){xRange=xMax-xMin,yRange=yMax-yMin,meshFunction=function(a,r){if(a=xRange*a+xMin,r=yRange*r+yMin,n[segments-Math.round(r)+yMin][Math.round(a)-xMin]>e)var t=20*(n[segments-Math.round(r)+yMin][Math.round(a)-xMin]-e)+e;else t=n[segments-Math.round(r)+yMin][Math.round(a)-xMin];return isNaN(t)?new THREE.Vector3(0,0,0):new THREE.Vector3(a,r,t)},(graphGeometry=new THREE.ParametricGeometry(meshFunction,segments,segments,!0)).computeBoundingBox(),zMin=graphGeometry.boundingBox.min.z,zMax=graphGeometry.boundingBox.max.z,zRange=zMax-zMin;for(var a,r,t,o,i,s=["a","b","c","d"],c=0;c<graphGeometry.vertices.length;c++)r=graphGeometry.vertices[c],a=new THREE.Color(255),0!=r.z?a.setHSL(.5*(zMax-r.z)/zRange,1,.5):a.setHSL(0,0,.9),graphGeometry.colors[c]=a;for(c=0;c<graphGeometry.faces.length;c++){o=(t=graphGeometry.faces[c])instanceof THREE.Face3?3:4;for(var d=0;d<o;d++)i=t[s[d]],t.vertexColors[d]=graphGeometry.colors[i]}graphMesh&&scene.remove(graphMesh),wireMaterial.map.repeat.set(segments,segments),(graphMesh=new THREE.Mesh(graphGeometry,wireMaterial)).doubleSided=!0,scene.add(graphMesh)}function animate(){requestAnimationFrame(animate),render(),update()}function update(){keyboard.pressed("z"),controls.update()}function render(){renderer.render(scene,camera)}function getMin(e){var n=[],a=10;for(x in e){for(var r=0;r<e[x].length;r++)e[x][r]>0&&e[x][r]<a&&(a=e[x][r]);n.push(a),value_min=10}return Math.min.apply(Math,n)}var container,scene,camera,renderer,controls,stats,meshFunction,graphGeometry,gridMaterial,wireMaterial,vertexColorMaterial,graphMesh,surface_data={Rent:rent_predication,Sell:sell_predication},keyboard=new THREEx.KeyboardState,clock=new THREE.Clock,term="Rent",value_min=getMin(surface_data[term]),a=.01,b=.01,c=.01,d=.01,segments=195,xMin=-95,xMax=100,xRange=xMax-xMin,yMin=-95,yMax=100,yRange=yMax-yMin,indexoptions=[{name:"Rent"},{name:"Sell"}],indexmenu=d3.select("#indexmenu");indexmenu.selectAll("option").data(indexoptions).enter().append("option").text(function(e){return e.name}),init(),animate(),d3.select("#indexmenu").on("change",function(){var e=d3.select(this)[0][0].value,n=getMin(surface_data[e]);scene.remove(graphMesh),createGraph(n,surface_data[e])});