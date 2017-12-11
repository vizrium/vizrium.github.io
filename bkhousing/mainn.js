
// standard global variables
var container, scene, camera, renderer, controls, stats;
var raycaster;

      var mouse = new THREE.Vector2(), INTERSECTED;
      var radius = 100, theta = 0;


var clock = new THREE.Clock();

// custom global variables
var mesh, position;

init();
animate();

// FUNCTIONS    
function init() 
{
  // SCENE
  scene = new THREE.Scene();

  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 10000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.z = 462.86;
  camera.position.y = 758.8;
  camera.position.x = 120.56;
  camera.lookAt({x:0, y:0, z:0});  

  // RENDERER
  if ( Detector.webgl )
    renderer = new THREE.WebGLRenderer( {antialias:true} );
  else
    renderer = new THREE.CanvasRenderer(); 
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById( 'ThreeJS' );
  container.appendChild( renderer.domElement );

  // EVENTS
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  // LIGHT 
    var light = new THREE.DirectionalLight( 0xffffff , 1);
   camera.add( light );

//
projector = new THREE.Projector();  

        window.addEventListener( 'resize', onWindowResize, false );
         document.addEventListener('mousemove', onDocumentMouseMove, false);  

//LEGEND
currentvalue = 0;
current_term = 'block';

var valueElement = document.getElementById("Currentvalue");
 valueNode = document.createTextNode("");
valueElement.appendChild(valueNode);
valueNode.nodeValue = "Hover over a " + current_term;


currenttitle = "Housing Prices";
var valuetitle = document.getElementById("Currenttitle");
 titleNode = document.createTextNode("");
valuetitle.appendChild(titleNode);
//titleNode.nodeValue = currenttitle;

var indexoptions  = [
{name: "Block"},
{name: "Block Group"},
{name: "Census Tract"},
{name: "Neighborhood"},
{name: "Major Market"}
];

var indexmenu = d3.select("#indexmenu");
    //.on("change", change);

indexmenu.selectAll("option")
    .data(indexoptions)
  .enter().append("option")
    .text(function(d) { return d.name; });



//ADD COUNTRIES
var projection = d3.geo.equirectangular()
    .scale(250000)
    .translate([720, 450])
    .center([-73.9, 40.64]);

var path = d3.geo.path()
    .projection(projection);

var kvalue = [ 0.013, 0.012, 0.01, 0.05,  0.05];
var file_names = ['block', 'blockgroup', 'censustract', 'neighborhood', 'majormarket'];
rate = {};
for (var x =0; x<file_names.length; x++){
  rate[file_names[x]] = kvalue[x];
}


k = rate['block'];



var column_names =  ['COOPMP06', 'COOPMP07', 'COOPMP08', 'COOPMP09' ,'COOPMP10', 'COOPMP11' ,'COOPMP12' ,'COOPMP13' ,'COOPMP14', 'COOPMP15'];


d3.json( 'hblock.json', function(data) {

        term = 'COOPMP06';
        countries = [];
        var i, j;
         toAdd = [];

      //  var rate = [ 0.000008, 0.0000015, 0.000006, 0.000005,  0.0000055, 0.000002,  0.0000015, 0.000008, 0.000004, 0.000006];

       
        
        // convert to threejs meshes
        for (i = 0 ; i < data.features.length ; i++) {
          var geoFeature = data.features[i];
          var properties = geoFeature.properties;
          var feature = path(geoFeature);
          
          // we only need to convert it to a three.js path
          var mesh = transformSVGPathExposed(feature);
          
          // add to array
          for (j = 0 ; j < mesh.length ; j++) {
              countries.push({"data": properties, "mesh": mesh[j]});
          }
        }
        
        //find the max value
        var values = getMaxMin(countries, column_names);
        max = values[0];
        min = values[1];
       //  console.log(min);
        // extrude paths and add color
        for (i = 0 ; i < countries.length ; i++) {
  
          var material = new THREE.MeshLambertMaterial({
            opacity:0.9
          }); 

          // extrude mesh
          var shape3d = countries[i].mesh.extrude({
            amount: 2, 
            bevelEnabled: false
          });


          // create a mesh based on material and extruded shape
          toAdd[i] = new THREE.Mesh(shape3d, material);
          
          //set mesh color
          setColorHeight(toAdd[i], countries[i].data, max, term, k, min);
          
          // rotate and position the elements
          toAdd[i].rotation.x = Math.PI/2;
          toAdd[i].translateX(-500);
          toAdd[i].translateZ(50);
          toAdd[i].translateY(-550);

          // add to scene
          scene.add(toAdd[i]);
}


var endElement = document.getElementById("Endvalue");
 endNode = document.createTextNode("");
endElement.appendChild(endNode);
endNode.nodeValue = toCommas(max.toFixed(0));


var startElement = document.getElementById("Startvalue");
startNode = document.createTextNode("");
startElement.appendChild(startNode);
startNode.nodeValue = toCommas(min);

var startdiv = document.getElementById("Start");
var titlediv = document.getElementById("Title");

//Slider
var svg = d3.selectAll("div.info").append("svg").attr("height", 42).attr("width", 550);

var x = d3.scale.linear()
    .domain([2006, 2015])
    .range([20, 300])
    .clamp(true);
var brush = d3.svg.brush()
    .x(x)
    .extent([2006, 2006])
    .on("brush", brushed);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + 42 / 2 + ")")
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d) { return d ; })
      .tickSize(0)
      .tickPadding(12)
      .tickValues([]))
  .select(".domain")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halo");


var slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", 42);

var handle = slider.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + 42 / 2 + ")")
    .attr("r", 7);


// handle.append("path")
//     .attr("transform", "translate(0," + 42 / 2 + ")")
//     .attr("d", "M 0 -20 V 20");

slider.append("text")
  .text(2006).style("font-size", 12).style("font-weight", "bold").attr("fill", "darkblue")
      .attr("transform", "translate(330," + (24 ) + ")");
 // .attr("transform", "translate(6," + (42 / 2 -10) + ")");

slider
    .call(brush.event);
  // .transition() // gratuitous intro!
  // .ease("linear")
  //   .duration(10000)
  //   .call(brush.extent([2015, 2015]))
  //   .call(brush.event);

function brushed() {
  var value = brush.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
//handle.select('text');
    value = x.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
  }

  handle.attr("cx", x(Math.floor(value)));
  slider.select('text').text(Math.floor(value));

// if(value == 2006)  slider.select('text').attr("x", 1); 
// else if(value == 2015)  slider.select('text').attr("x", 461); 
// else {try{slider.select('text').attr("x", d3.mouse(this)[0]-20)}
//   catch(err){console.log('non');}
//   }; 

changeYear(Math.floor(value));

//console.log(Math.round(value)); 


}

//button
d3.select("#example98 button").on("click", function() {
  

slider
    .call(brush.event)
  .transition() // gratuitous intro!
  .ease("linear")
   // .duration(15000)
    .call(brush.extent([2006, 2006]))
    .call(brush.event);

slider
    .call(brush.event)
  .transition() // gratuitous intro!
  .ease("linear")
    .duration(10000)
    .call(brush.extent([2015, 2015]))
    .call(brush.event);

// slider.select('text').transition.ease("linear")
//     .duration(10000).attr("x", 480);

});


d3.select("#indexmenu")
        .on('change', function() {


 for (i = 0 ; i < countries.length ; i++) {
   scene.remove(toAdd[i]);
 }

          var dropdown_kind = d3.select(this)[0][0].value;
          dropdown_kind = dropdown_kind.replace(/\s+/g, '').toLowerCase();
       //   console.log(dropdown_kind);

 k = rate[dropdown_kind];
//console.log(k);
current_term = (d3.select(this)[0][0].value).toLowerCase();
current_value =  x.invert(handle.attr("cx"));

d3.json( 'h' + dropdown_kind + ".json", function(data) {

        term = 'COOPMP06';
        countries = [];
        var i, j;
         toAdd = [];

      //  var rate = [ 0.000008, 0.0000015, 0.000006, 0.000005,  0.0000055, 0.000002,  0.0000015, 0.000008, 0.000004, 0.000006];

       
        
        // convert to threejs meshes
        for (i = 0 ; i < data.features.length ; i++) {
          var geoFeature = data.features[i];
          var properties = geoFeature.properties;
          var feature = path(geoFeature);
          
          // we only need to convert it to a three.js path
          var mesh = transformSVGPathExposed(feature);
          
          // add to array
          for (j = 0 ; j < mesh.length ; j++) {
              countries.push({"data": properties, "mesh": mesh[j]});
          }
        }
        
        //find the max value
        var values = getMaxMin(countries, column_names);
        max = values[0];
        min = values[1];
       //  console.log(min);
        // extrude paths and add color
        for (i = 0 ; i < countries.length ; i++) {
  
          var material = new THREE.MeshLambertMaterial({
            opacity:0.9
          }); 

          // extrude mesh
          var shape3d = countries[i].mesh.extrude({
            amount: 2, 
            bevelEnabled: false
          });


          // create a mesh based on material and extruded shape
          toAdd[i] = new THREE.Mesh(shape3d, material);
          
          //set mesh color
          setColorHeight(toAdd[i], countries[i].data, max, term, k, min);
          
          // rotate and position the elements
          toAdd[i].rotation.x = Math.PI/2;
          toAdd[i].translateX(-500);
          toAdd[i].translateZ(50);
          toAdd[i].translateY(-550);

          // add to scene
          scene.add(toAdd[i]);
}


endNode.nodeValue = toCommas(max.toFixed(0));
startNode.nodeValue = toCommas(min);


slider
    .call(brush.event)
  .transition() // gratuitous intro!
  .ease("linear")
   // .duration(15000)
    .call(brush.extent([current_value, current_value]))
    .call(brush.event);


})





        });


});

 }


function animate(time) 
{
    requestAnimationFrame( animate );
    TWEEN.update(time);
  render();   
  update();
}


function update()
{
  //find intersection
   var vector = new THREE.Vector3(mouse.x, mouse.y, 1);  
                projector.unprojectVector(vector, camera);  
                var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());  
  
                  
                var intersects = ray.intersectObjects(scene.children);  
  
                  
                if (intersects.length > 0) {  
                     
                    if (intersects[0].object != INTERSECTED) {  
                         
                        if (INTERSECTED)  
                            INTERSECTED.material.color.setHex(INTERSECTED.currentHex);  
                         
                        INTERSECTED = intersects[0].object;  

                  // change legend value
                       if (INTERSECTED.material.color.r == 1  && INTERSECTED.material.color.g == 1 &&  INTERSECTED.material.color.b == 1){
                        //if (term == 'BUILDYEAR'){
                        valueNode.nodeValue  = 'None';
                    //     if (term == 'ALTERYEAR'){
                    //    valueNode.nodeValue  = 'Before 1970 or None';}

}
                      else{         

                        //console.log(min);
                        valueNode.nodeValue  = toCommas(Math.pow((INTERSECTED.scale.z)/k -1 + Math.sqrt(min), 2).toFixed(0));

                      }

                        INTERSECTED.currentHex = INTERSECTED.material.color.getHex();  
                        
                        INTERSECTED.material.color.setHex(0x00008b);  
                    }  
                }  
                else   
                {  
                    if (INTERSECTED)  
                        INTERSECTED.material.color.setHex(INTERSECTED.currentHex);  
                      valueNode.nodeValue  = "Hover over a " + current_term;
                    INTERSECTED = null;  
                }  

  controls.update();
 //console.log(camera.position.x, camera.position.y, camera.position.z);
}


 function onDocumentMouseMove(event) {  
                
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;  
                 
            }  


function render() 
{
  renderer.render( scene, camera );
}


function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
        render();

      }


function changePositionsmooth(value, element){

var p0 = {y: element.position.y, element: element};

var updateCallback = function() {
            this.element.position.y = this.y;
          }

t0 = new TWEEN.Tween(p0).to({y: value}, 0) 
.easing( TWEEN.Easing.Cubic.InOut)
//.delay(Math.random() * 250)
.delay(0)
.onUpdate(updateCallback)
.start();

}


function getMaxMin(data, names){

var value_list = [];
for (var j = 0; j < names.length; j++){
for (var i = 0 ; i < data.length ; i++) {
  if (data[i].data[names[j]]> 0){
value_list.push(data[i].data[names[j]]);}
 }}

 return [Math.max.apply(Math, value_list) , Math.min.apply(Math, value_list)];

}


function setColorHeight(object, data, max, term, k, start){

if ((data[term] - start) >= 0 ){

object.scale.z = (Math.sqrt(data[term])+1 - Math.sqrt(start)) * k ;
var value = 0.5-((Math.sqrt(data[term])+1 - Math.sqrt(start))/(2*(Math.sqrt(max)+1-Math.sqrt(start))));
object.material.color.setHSL(value, 1.0, 0.5);
changePositionsmooth((Math.sqrt(data[term])+1 -Math.sqrt(start))*2*k - 50, object);

}

else{

object.scale.z = 1;
object.material.color.setHSL(0, 0, 1);
changePositionsmooth((1 )*2 - 50, object);

}

}

function changeYear(value){

term = 'COOPMP' + value.toString().substring(2);
//var max = getMax(countries, term);

//update mesh color and height

 for (i = 0 ; i < countries.length ; i++) {
setColorHeight(toAdd[i], countries[i].data, max, term, k, min);
 }

//change lengend
//  endNode.nodeValue = max.toFixed(0);
// startNode.nodeValue = start;


}


function toCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }