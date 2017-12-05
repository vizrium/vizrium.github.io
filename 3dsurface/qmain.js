
// MAIN
//var surface_data = {'Rent':rent_predication, 'Sell':sell_predication};
var surface_data = {'Rent':Quadtree_rent_predication, 'Sell':Quadtree_sell_predication};

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var term = 'Rent';

var value_min = getMin(surface_data[term]);

// parameters for the equations
var a = 0.01, b = 0.01, c = 0.01, d = 0.01;

var meshFunction;
// var segments = 195, 
//   xMin = -95, xMax = 100, xRange = xMax - xMin,
//   yMin = -95, yMax = 100, yRange = yMax - yMin;

var segments = 127, 
  xMin = -64, xMax = 63, xRange = xMax - xMin,
  yMin = -64, yMax = 63, yRange = yMax - yMin;
  

var graphGeometry;
var gridMaterial, wireMaterial, vertexColorMaterial;
var graphMesh;


var indexoptions  = [
{name: "Rent"},
{name: "Sell"},
];

var indexmenu = d3.select("#indexmenu");
    //.on("change", change);

indexmenu.selectAll("option")
    .data(indexoptions)
  .enter().append("option")
    .text(function(d) { return d.name; });


init();
animate();

// FUNCTIONS    
function init() 
{
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0.7, -116, 136);
  camera.lookAt(scene.position);  
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
  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls.noZoom = true;
  // LIGHT
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0,250,0);
  scene.add(light);
  
  var normMaterial = new THREE.MeshNormalMaterial;
  var shadeMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
  
  // "wireframe texture"
  var wireTexture = new THREE.ImageUtils.loadTexture( '../3dsurface/new.png' );
  wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping; 
  wireTexture.repeat.set( 20, 20 );
  wireMaterial = new THREE.MeshBasicMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side:THREE.DoubleSide } );

  var vertexColorMaterial  = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

   createGraph(value_min, surface_data[term]); 

}

function createGraph(value_min, data)
{
  xRange = xMax - xMin;
  yRange = yMax - yMin;
  //zFunc = Parser.parse(zFuncText).toJSFunction( ['x','y'] );
  meshFunction = function(x, y) 
  {
    x = xRange * x + xMin;
    y = yRange * y + yMin;
    if ( data[segments - Math.round(y)+yMin][Math.round(x)-xMin] > value_min){

    var z = (data[segments - Math.round(y)+yMin][Math.round(x)-xMin]-value_min)*20 + value_min; }

    else{

    var z = data[segments -Math.round(y)+yMin][Math.round(x)-xMin]; 

    }

    //= Math.cos(x) * Math.sqrt(y);
    if ( isNaN(z) )
      return new THREE.Vector3(0,0,0); // TODO: better fix
    else
    { 
      return new THREE.Vector3(x, y, z);}

  };
  
  // true => sensible image tile repeat...
  graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
  
  ///////////////////////////////////////////////
  // calculate vertex colors based on Z values //
  ///////////////////////////////////////////////
  graphGeometry.computeBoundingBox();
  zMin = graphGeometry.boundingBox.min.z;
  zMax = graphGeometry.boundingBox.max.z;
  zRange = zMax - zMin;

  var color, point, face, numberOfSides, vertexIndex;
  // faces are indexed using characters
  var faceIndices = [ 'a', 'b', 'c', 'd' ];
  // first, assign colors to vertices as desired
  for ( var i = 0; i < graphGeometry.vertices.length; i++ ) 
  {
    point = graphGeometry.vertices[ i ];
    color = new THREE.Color( 0x0000ff );
    if ( point.z != 0 ){
    color.setHSL(   0.5 * (zMax - point.z) / zRange, 1, 0.5 );}
    else{
          color.setHSL(   0, 0, 0.9 );

    }
    graphGeometry.colors[i] = color; // use this array for convenience
  }
  // copy the colors as necessary to the face's vertexColors array.

  for ( var i = 0; i < graphGeometry.faces.length; i++ ) 
  {
    face = graphGeometry.faces[ i ];
    numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
    for( var j = 0; j < numberOfSides; j++ ) 
    {
      vertexIndex = face[ faceIndices[ j ] ];
      face.vertexColors[ j ] = graphGeometry.colors[ vertexIndex ];
    }
  }
  ///////////////////////
  // end vertex colors //
  ///////////////////////
  
  // material choices: vertexColorMaterial, wireMaterial , normMaterial , shadeMaterial
  
  if (graphMesh) 
  {
    scene.remove( graphMesh );
    // renderer.deallocateObject( graphMesh );
  }

  wireMaterial.map.repeat.set( segments, segments );
  
  graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
  graphMesh.doubleSided = true;
  scene.add(graphMesh);
}

function preset01()
{
  createGraph(); 
}
    

function animate() 
{
    requestAnimationFrame( animate );
  render();   
  update();
}

function update()
{
  if ( keyboard.pressed("z") ) 
  { 
    // do something
  }
  
  controls.update();
//console.log(camera.position);
}

function render() 
{
  renderer.render( scene, camera );
}

function getMin(data){

var value_min_list = [];
var data_min = 10;
  for (x in data){
  for (var y =0; y<data[x].length; y++){
    if ( data[x][y]> 0 && data[x][y] < data_min )
    {
      data_min = data[x][y];
    }
  }
  value_min_list.push(data_min);
  value_min = 10;
}

return  Math.min.apply(Math, value_min_list);
}


d3.select("#indexmenu")
  .on('change', function() {

    var term = d3.select(this)[0][0].value;
    var value_min = getMin(surface_data[term]);
    scene.remove( graphMesh );
    createGraph(value_min, surface_data[term]); 


})

