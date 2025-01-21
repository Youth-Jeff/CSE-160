// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 10.0;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWEBGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }  
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global related UI elements
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedSegment = 10;
let g_selectedType=POINT;
let g_rainbow = 0;

// Set up actions for HTML UI elements
function addActionsForHTMLUI() {

  // Button Events (Shape Type)
  document.getElementById("green").onclick = function() { g_selectedColor = [0.0,1.0,0.0,1.0]; };
  document.getElementById("red").onclick = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; };
  document.getElementById("randomcolor").onclick = function() { g_selectedColor = [Math.random(),Math.random(),Math.random(),1.0]; };
  document.getElementById("rainbow").onclick = function() { g_rainbow = 1 };
  document.getElementById("disablerainbow").onclick = function() { g_rainbow = 0 };
  document.getElementById("cat").onclick = function() { DrawCatEvent() };
  document.getElementById("rainbowcat").onclick = function() { DrawRainbowCatEvent() };
  document.getElementById("clearButton").onclick = function() { g_shapesList = []; renderAllShapes(); };

  document.getElementById("pointButton").onclick = function() { g_selectedType=POINT };
  document.getElementById("triButton").onclick = function() { g_selectedType=TRIANGLE };
  document.getElementById("circleButton").onclick = function() { g_selectedType=CIRCLE };
  
  // Color Slider Events
  document.getElementById("redSlide").addEventListener("mouseup", function() { g_selectedColor[0] = this.value/100; });
  document.getElementById("greenSlide").addEventListener("mouseup", function() { g_selectedColor[1] = this.value/100; });
  document.getElementById("blueSlide").addEventListener("mouseup", function() { g_selectedColor[2] = this.value/100; });

  // Size Slider Events
  document.getElementById("sizeSlide").addEventListener("mouseup", function() { g_selectedSize = this.value; });

  // Segment Slider Events
  document.getElementById("segSlide").addEventListener("mouseup", function() { g_selectedSegment = this.value; });
}

function main() {

  // Set up canvas and gl variables
  setupWEBGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();
  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  // canvas.onmousemove = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = []; // The array to store the size of a point

function click(ev) {

  // Extract the event click and return it in WebGL coordinates
  let [x, y] = convertCoordinatesEventToGL(ev);

  // Create and store the new point
  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  } else if (g_selectedType==TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  }
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  if (g_rainbow == 1) {
    point.color=[Math.random(),Math.random(),Math.random(),1.0].slice();
  }
  point.size=g_selectedSize;
  point.segments=g_selectedSegment
  g_shapesList.push(point);

  // Store the coordinates to g_points array
//  g_points.push([x, y]);
  // Store the color to g_colors array
//  g_colors.push(g_selectedColor.slice());
  // Store the size to g_sizes array
//  g_sizes.push(g_selectedSize);

  // Store the coordinates to g_points array
//  if (x >= 0.0 && y >= 0.0) {      // First quadrant
//    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
//  } else if (x < 0.0 && y < 0.0) { // Third quadrant
//    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
//  } else {                         // Others
//    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
//  }

  // Draw every shape that is suppose to be in the canvas
  renderAllShapes()
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  
  return([x, y]);
}

function renderAllShapes() {

  // Check the time at the start of this function
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

//  var len = g_points.length;
  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
  
  // Check the time at the end of the function and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps " + Math.floor(10000/duration)/10, "numdot");
}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

function DrawCatEvent() {

  // Pass the color of a point to u_FragColor variable
  gl.uniform4f(u_FragColor, 0.5, 0.5, 0.5, 1.0); // Gray

  // Pass the size
  gl.uniform1f(u_Size, 5);

  // Draw Process

  // Body
  
  drawTriangle1( [-0.34, -1.00, -0.34, -0.45, -1.0, -1.0] );

  drawTriangle1( [-0.34, -1.00, -0.34, -0.67, 0.0, -0.67] );

  drawTriangle1( [-0.34, -1.00, 0.0, -0.67, 0.0, -1.0] );

  drawTriangle1( [0.0, -0.67, 0.16, -0.67, 0.0, -1.0] );

  // Tail

  drawTriangle1( [-1.0, -1.0, -0.84, -0.87, -1.0, 0.39] );
  drawTriangle1( [-0.84, -0.87, -0.84, 0.29, -1.0, 0.39] );
  drawTriangle1( [-1.0, 0.39, -0.84, 0.5, -0.68, 0.19] );
  drawTriangle1( [-0.84, 0.5, -0.68, 0.19, -0.68, 0.39] );
  drawTriangle1( [-0.68, 0.39, -0.68, 0.19, -0.51, 0.29] );
  drawTriangle1( [-0.51, 0.29, -0.68, 0.19, -0.51, 0.19] );
  drawTriangle1( [-0.68, 0.19, -0.51, 0.03, -0.67, -0.03] );
  drawTriangle1( [-0.68, 0.19, -0.51, 0.03, -0.51, 0.19] );


  // Head
  drawTriangle1( [-0.34, -0.67, -0.34, 0.2, 0.34, 0.2] );
  drawTriangle1( [-0.34, -0.67, 0.34, 0.2, 0.34, -0.67] );

    // Eyes L and R
    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0); // White
    drawTriangle1( [-0.17, -0.12, -0.17, 0.1, 0.0, 0.1] );
    drawTriangle1( [-0.17, -0.12, 0.0, -0.12, 0.0, 0.1] );
    gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0); // Black
    drawTriangle1( [-0.09, 0.1, 0.0, 0.1, 0.0, -0.01] );
    
    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0); // White
    drawTriangle1( [-0.17  + 0.25, -0.12, -0.17  + 0.25, 0.1, 0.0  + 0.25, 0.1] );
    drawTriangle1( [-0.17  + 0.25, -0.12, 0.0  + 0.25, -0.12, 0.0  + 0.25, 0.1] ); 
    gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0); // Black
    drawTriangle1( [-0.09  + 0.25, 0.1, 0.0  + 0.25, 0.1, 0.0  + 0.25, -0.01] );
    
    // Nose
    gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0); // Black
    drawTriangle1( [0.0, -0.23, 0.16, -0.23, 0.08, -0.34] );

    // Mouth
    gl.uniform4f(u_FragColor, 0.66, 0.66, 0.66, 1.0); // Light Gray
    drawTriangle1( [-0.08, -0.34, 0.08, -0.34, 0.0, -0.45] );
    drawTriangle1( [-0.08 + 0.16, -0.34, 0.08 + 0.16, -0.34, 0.0 + 0.16, -0.45] );
    gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0); // Black
    drawTriangle1( [0.08, -0.34, 0.0, -0.45, 0.16, -0.45] );
    drawTriangle1( [0.08, -0.34, 0.0, -0.45, 0.16, -0.45] );
    drawTriangle1( [-0.01, -0.45, 0.17, -0.45, 0.08, -0.57] );
    gl.uniform4f(u_FragColor, 209/255, 144/255, 142/255, 1.0); // Pink
    drawTriangle1( [0.0, -0.45, 0.16, -0.45, 0.08, -0.56] );

    // Ears
    gl.uniform4f(u_FragColor, 0.5, 0.5, 0.5, 1.0); // Gray
    drawTriangle1( [-0.34, 0.2, -0.17, 0.64, 0.0, 0.2] );
    drawTriangle1( [-0.34 + 0.34, 0.2, -0.17 + 0.34, 0.64, 0.0 + 0.34, 0.2] );
    
  // Yarn
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0); // Red
  drawTriangle1( [0.66, 0.64, 0.83, 0.75, 0.83, 0.53] );
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0); // Red
  drawTriangle1( [0.83, 0.53, 0.83, 0.75, 1.0, 0.64] );
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0); // Red
  drawTriangle1( [0.83, 0.53, 1.0, 0.42, 1.0, 0.64] );
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0); // Red
  drawTriangle1( [0.83, 0.53, 1.0, 0.42, 0.83, 0.32] );
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0); // Red
  drawTriangle1( [0.83, 0.53, 0.66, 0.42, 0.83, 0.32] );
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0); // Red
  drawTriangle1( [0.83, 0.53, 0.66, 0.42, 0.66, 0.64] );
}

function DrawRainbowCatEvent() {

  // Pass the color of a point to u_FragColor variable
  RandomColorGen()

  // Pass the size
  gl.uniform1f(u_Size, 5);

  // Draw Process

  // Body
  RandomColorGen()
  drawTriangle1( [-0.34, -1.00, -0.34, -0.45, -1.0, -1.0] );
  RandomColorGen()
  drawTriangle1( [-0.34, -1.00, -0.34, -0.67, 0.0, -0.67] );
  RandomColorGen()
  drawTriangle1( [-0.34, -1.00, 0.0, -0.67, 0.0, -1.0] );
  RandomColorGen()
  drawTriangle1( [0.0, -0.67, 0.16, -0.67, 0.0, -1.0] );

  // Tail
  RandomColorGen()
  drawTriangle1( [-1.0, -1.0, -0.84, -0.87, -1.0, 0.39] );
  RandomColorGen()
  drawTriangle1( [-0.84, -0.87, -0.84, 0.29, -1.0, 0.39] );
  RandomColorGen()
  drawTriangle1( [-1.0, 0.39, -0.84, 0.5, -0.68, 0.19] );
  RandomColorGen()
  drawTriangle1( [-0.84, 0.5, -0.68, 0.19, -0.68, 0.39] );
  RandomColorGen()
  drawTriangle1( [-0.68, 0.39, -0.68, 0.19, -0.51, 0.29] );
  RandomColorGen()
  drawTriangle1( [-0.51, 0.29, -0.68, 0.19, -0.51, 0.19] );
  RandomColorGen()
  drawTriangle1( [-0.68, 0.19, -0.51, 0.03, -0.67, -0.03] );
  RandomColorGen()
  drawTriangle1( [-0.68, 0.19, -0.51, 0.03, -0.51, 0.19] );


  // Head
  RandomColorGen()
  drawTriangle1( [-0.34, -0.67, -0.34, 0.2, 0.34, 0.2] );
  RandomColorGen()
  drawTriangle1( [-0.34, -0.67, 0.34, 0.2, 0.34, -0.67] );

    // Eyes L and R
    RandomColorGen()
    drawTriangle1( [-0.17, -0.12, -0.17, 0.1, 0.0, 0.1] );
    RandomColorGen()
    drawTriangle1( [-0.17, -0.12, 0.0, -0.12, 0.0, 0.1] );
    RandomColorGen()
    drawTriangle1( [-0.09, 0.1, 0.0, 0.1, 0.0, -0.01] );
    
    RandomColorGen()
    drawTriangle1( [-0.17  + 0.25, -0.12, -0.17  + 0.25, 0.1, 0.0  + 0.25, 0.1] );
    RandomColorGen()
    drawTriangle1( [-0.17  + 0.25, -0.12, 0.0  + 0.25, -0.12, 0.0  + 0.25, 0.1] ); 
    RandomColorGen()
    drawTriangle1( [-0.09  + 0.25, 0.1, 0.0  + 0.25, 0.1, 0.0  + 0.25, -0.01] );
    
    // Nose
    RandomColorGen()
    drawTriangle1( [0.0, -0.23, 0.16, -0.23, 0.08, -0.34] );

    // Mouth
    RandomColorGen()
    drawTriangle1( [-0.08, -0.34, 0.08, -0.34, 0.0, -0.45] );
    RandomColorGen()
    drawTriangle1( [-0.08 + 0.16, -0.34, 0.08 + 0.16, -0.34, 0.0 + 0.16, -0.45] );
    RandomColorGen()
    drawTriangle1( [0.08, -0.34, 0.0, -0.45, 0.16, -0.45] );
    RandomColorGen()
    drawTriangle1( [0.08, -0.34, 0.0, -0.45, 0.16, -0.45] );
    RandomColorGen()
    drawTriangle1( [-0.01, -0.45, 0.17, -0.45, 0.08, -0.57] );
    RandomColorGen()
    drawTriangle1( [0.0, -0.45, 0.16, -0.45, 0.08, -0.56] );

    // Ears
    RandomColorGen()
    drawTriangle1( [-0.34, 0.2, -0.17, 0.64, 0.0, 0.2] );
    RandomColorGen()
    drawTriangle1( [-0.34 + 0.34, 0.2, -0.17 + 0.34, 0.64, 0.0 + 0.34, 0.2] );
    
  // Yarn
  RandomColorGen()
  drawTriangle1( [0.66, 0.64, 0.83, 0.75, 0.83, 0.53] );
  RandomColorGen()
  drawTriangle1( [0.83, 0.53, 0.83, 0.75, 1.0, 0.64] );
  RandomColorGen()
  drawTriangle1( [0.83, 0.53, 1.0, 0.42, 1.0, 0.64] );
  RandomColorGen()
  drawTriangle1( [0.83, 0.53, 1.0, 0.42, 0.83, 0.32] );
  RandomColorGen()
  drawTriangle1( [0.83, 0.53, 0.66, 0.42, 0.83, 0.32] );
  RandomColorGen()
  drawTriangle1( [0.83, 0.53, 0.66, 0.42, 0.66, 0.64] );
}

function RandomColorGen() {
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1.0);
}

function drawTriangle1(vertices) {
  //  var vertices = new Float32Array([
  //      0, 0.5,     -0.5, -0.5,     0.5, -0.5
  //  ]);
      var n = 3;
  
      // Create a buffer object
      var vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
          console.log("Failed to create the buffer object");
          return -1;
      }
  
      // Bind the buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      // Write data into the buffer object
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
      //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  //    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  //    if (a_Position < 0) {
  //        console.log("Failed to get the storage location of a_Position");
  //        return -1;
  //    }
      // Assign the buffer object to a_Position variable
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_Position);
  
      gl.drawArrays(gl.TRIANGLES, 0, n);
      // return n;
  }