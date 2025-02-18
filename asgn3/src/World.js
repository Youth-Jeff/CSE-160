// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform int u_whichTexture;
  void main() {

    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;                 // Use color

    } else if (u_whichTexture == -1) {            // Use UV debug color
      gl_FragColor = vec4(v_UV,1.0,1.0);
      
    } else if (u_whichTexture == 0) {             // Use texture0 Sky From Lecture
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    
    } else if (u_whichTexture == 1) {             // Use texture1 Grass
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    
    } else if (u_whichTexture == 2) {             // Use texture2 Wood
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    
    } else if (u_whichTexture == 3) {             // Use texture3 New Sky
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    
    } else {                                      // Error, put Redish
      gl_FragColor = vec4(1,.2,.2,1);
    }

  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_whichTexture;

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

  gl.enable(gl.DEPTH_TEST);
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

  // // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log("Failed to get the storage location of u_ProjectionMatrix");
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log("Failed to get the storage location of u_ViewMatrix");
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log("Failed to get the storage location of u_GlobalRotateMatrix");
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log("Failed to get the storage location of u_Sampler0");
    return;
  }
  
  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log("Failed to get the storage location of u_Sampler1");
    return;
  }

  // Get the storage location of u_Sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log("Failed to get the storage location of u_Sampler2");
    return;
  }

  // Get the storage location of u_Sampler3
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log("Failed to get the storage location of u_Sampler3");
    return;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log("Failed to get the storage location of u_whichTexture");
    return;
  }

  // Set an initial value for this matrix to identify
  var identifyM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identifyM.elements);
}

function initTextures() {

  var image = new Image(); // Create the image object
  if (!image) {
    console.log("Failed to create the image object");
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTextureToTEXTURE0(image); };
  // Tell the browser to load an image
  image.src = "sky.jpg";

  return true;
}

function sendTextureToTEXTURE0(image) {

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  //gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle

  console.log("finished loadTexture");
}

function initTextures1() {

  var image1 = new Image(); // Create the image object
  if (!image1) {
    console.log("Failed to create the image object");
    return false;
  }
  // Register the event handler to be called on loading an image
  image1.onload = function(){ sendTextureToTEXTURE1(image1); };
  // Tell the browser to load an image
  // Source: https://www.deviantart.com/nuxlystardust-stock/art/Texture-Grass-LowRes-256-311696360
  image1.src = "grass.jpg";

  return true;
}

function sendTextureToTEXTURE1(image) {

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);

  //gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle

  console.log("finished loadTexture");
}

function initTextures2() {

  var image2 = new Image(); // Create the image object
  if (!image2) {
    console.log("Failed to create the image object");
    return false;
  }
  // Register the event handler to be called on loading an image
  image2.onload = function(){ sendTextureToTEXTURE2(image2); };
  // Tell the browser to load an image
  // Source: https://opengameart.org/content/tiny-texture-pack-wood-18-256x256png
  image2.src = "wood.png";

  return true;
}

function sendTextureToTEXTURE2(image) {

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);

  //gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle

  console.log("finished loadTexture");
}

function initTextures3() {

  var image3 = new Image(); // Create the image object
  if (!image3) {
    console.log("Failed to create the image object");
    return false;
  }
  // Register the event handler to be called on loading an image
  image3.onload = function(){ sendTextureToTEXTURE3(image3); };
  // Tell the browser to load an image
  // Source: https://opengameart.org/content/sky-box-sunny-day
  image3.src = "newsky.bmp";

  return true;
}

function sendTextureToTEXTURE3(image) {

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE3);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler3, 3);

  //gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle

  console.log("finished loadTexture");
}

// ... CODE FROM BLOCKY ANIMAL

// Global related UI elements
let g_selectedColor = [1.0,1.0,1.0,1.0];

// Animal Angles
  // Head Angle
let g_headAngle=0;
  // Body Angle
let g_bodyAngle=0;
  // Tail Angle
let g_topTAngle=0;
let g_middleTAngle=0;
let g_bottomTAngle=0;
 // Ear Angle
let g_earAngle=0;

  // Left Front Leg Angle
let g_leftFrontLegAngle=0;
let g_leftFrontJointAngle=0;
let g_leftFrontPawAngle=0;
  // Right Front Leg Angle
let g_rightFrontLegAngle=0;
let g_rightFrontJointAngle=0;
let g_rightFrontPawAngle=0;
  // Left Back Leg Angle
let g_leftBackLegAngle=0;
let g_leftBackLegJoint=0;
let g_leftBackPawAngle=0;
  // Right Back Leg Angle
let g_rightBackLegAngle=0;
let g_rightBackLegJoint=0;
let g_rightBackPawAngle=0;

// Poke Animation
let g_pokeBody=0;
let g_pokeBodyPos = [0, 0, 0];

// Animation Booleans
let g_wagTailAnimation=false;
let g_earAnimation=false;
let g_shakeAnimation=false;

// Global camera setup
let g_angleYSlide=0;
let g_globalAngle=0;

let rotationX=0;
let rotationY=0;
let lastX=0;
let lastY=0;
let isDragging=false;
let sensitivity=0.5;

// Set up actions for HTML UI elements
function addActionsForHTMLUI() {

  // Button Events (Shape Type)
  document.getElementById("animationEarSlideOffButton").onclick = function() {g_earAnimation=false;};
  document.getElementById("animationEarSlideOnButton").onclick = function() {g_earAnimation=true;};

  document.getElementById("animationShakeOffButton").onclick = function() {g_shakeAnimation=false;};
  document.getElementById("animationShakeOnButton").onclick = function() {g_shakeAnimation=true;};

  document.getElementById("animationwagTailOffButton").onclick = function() {g_wagTailAnimation=false;};
  document.getElementById("animationwagTailOnButton").onclick = function() {g_wagTailAnimation=true;};
  document.getElementById("resetAnimation").onclick = function() {resetAnimation();};

  // Color Slider Events
  document.getElementById("TopTailJointSlide").addEventListener("mousemove", function() { g_topTAngle = this.value; renderAllShapes(); });
  document.getElementById("MiddleTailJointSlide").addEventListener("mousemove", function() { g_middleTAngle = this.value; renderAllShapes(); });
  document.getElementById("BottomTailJointSlide").addEventListener("mousemove", function() { g_bottomTAngle = this.value; renderAllShapes(); });
  document.getElementById("EarSlide").addEventListener("mousemove", function() { g_earAngle = this.value; renderAllShapes(); });
  // Camera Angle Slider Events
  document.getElementById("angleSlide").addEventListener("mousemove", function() { g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById("angleYSlide").addEventListener("mousemove", function() { g_angleYSlide = this.value; renderAllShapes(); });
}

let g_camera;

function main() {

  // Set up canvas and gl variables
  setupWEBGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();
  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();

  g_camera = new Camera();
  document.onkeydown = keydown;

  initTextures();
  initTextures1();
  initTextures2();
  initTextures3();


  canvas.addEventListener("mousedown", function(ev) {
    isDragging = true;
    lastX = ev.clientX;
    lastY = ev.clientX
  });

  canvas.addEventListener("mousemove", function(ev) {
    if (isDragging) {
      let deltaX = ev.clientX - lastX;
      let deltaY = ev.clientY - lastY;
      rotationX += deltaY * sensitivity;
      rotationY += deltaX * sensitivity;
      lastX = ev.clientX;
      lastY = ev.clientY;

      renderAllShapes();
    }
  });

  canvas.addEventListener("mouseup", function() {
    isDragging = false;
  });

  canvas.addEventListener("mouseout", function() {
    isDragging = false;
  });

  // Shift key event
  canvas.addEventListener("mousedown", function(ev) {
    if (ev.shiftKey) {
      g_pokeBody=-45;
      g_pokeBodyPos = [-0.4, 0.5, 0];
    }
  });

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // renderAllShapes();
  requestAnimationFrame(tick);
}

function keydown(ev) {
  if (ev.keyCode == 87) {         // W key (Moves Forward)
    g_camera.moveForward(); 
  } else if (ev.keyCode == 83) {  // S key (Moves Backwards)
    g_camera.moveBackwards();
  } else if (ev.keyCode == 65) {  // A key (Moves Left)
    g_camera.moveLeft();
  } else if (ev.keyCode == 68) {  // D key (Moves Right)
    g_camera.moveRight();
  } else if (ev.keyCode == 81) {  // Q key (Moves panLeft)
    g_camera.panLeft();
  } else if (ev.keyCode == 69) {  // E key (Moves panRight)
    g_camera.panRight();
  }

  renderAllShapes();
  console.log(ev.keyCode);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

// Called by browser repeatedly whenever its time
function tick() {
  // Save the current time
  g_seconds=performance.now()/1000.0-g_startTime;
  //console.log(g_seconds);

  // Update Animation Angles
  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

// Update the angles of everything if currently animated
function updateAnimationAngles() {

  if (g_wagTailAnimation) {
    g_topTAngle = (15*Math.sin(g_seconds));
    g_middleTAngle = (30*Math.sin(3*g_seconds));
    g_bottomTAngle = (30*Math.sin(3*g_seconds));
  }

  if (g_earAnimation) {
    g_earAngle = (5*Math.sin(g_seconds));
  }

  if (g_shakeAnimation) {
    g_headAngle = (35*Math.sin(6*g_seconds));
    g_bodyAngle = (25*Math.sin(3*g_seconds));
  }
}

function resetAnimation() {
  g_wagTailAnimation=false;
  g_earAnimation=false;
  g_shakeAnimation=false; 
  // Reset all Angles
  g_topTAngle=0;
  g_middleTAngle=0;
  g_bottomTAngle=0;
  g_earAngle=0;
  g_headAngle=0;
  g_bodyAngle=0;
  renderAllShapes();
}

var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1],
  [1, 0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1, 0, 1],
  [1, 0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1, 0, 1],
  [1, 0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0, 1],
  [1, 0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0, 1],
  [1, 0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1, 0, 1],
  [1, 0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1, 0, 1],
  [1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 120, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 1],
  [1, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
  [1, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 1],
  [1, 0, 0, 5, 7, 7, 5, 5, 5, 0, 0, 0, 0, 10, 10, 0, 10, 10, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
  [1, 0, 0, 5, 7, 7, 5, 5, 5, 0, 0, 0, 0, 10, 10, 0, 10, 10, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 1],
  [1, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 10, 10, 0, 10, 10, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
  [1, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function drawMap() {

  // Draw the floor
  var floor = new Cube();
  floor.color = [124 / 255, 252 / 255, 0 / 255, 1.0];
  floor.textureNum=1;
  floor.matrix.translate(0, -0.56, 0.0);
  floor.matrix.scale(32, 0, 32);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.renderfast();
  

  // Draw the sky
  var sky = new Cube();
  sky.color = [135 / 255, 206 / 255, 235 / 255, 1.0];
  sky.textureNum=3;
  sky.matrix.scale(200, 200, 200);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.renderfast();

  // Draw the walls (32x32)
  var wall = new Cube();
  wall.textureNum=2;
  for (x = 0; x < 32; x++) {
    for (z = 0; z < 32; z++) {
      if (g_map[x][z] > 0) {
        for (y = 0; y < g_map[x][z]; y++) {
        wall.color = [Math.random(),Math.random(),Math.random(),1.0];
        wall.matrix.setTranslate(0,-0.55,0);
        wall.matrix.scale(1, 1, 1);
        wall.matrix.translate(x-16, y, z-16);
        wall.renderfaster();
        }
      }
    }
  }
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {

  // Check the time at the start of this function
  var startTime = performance.now();

  // Pass the projection matrix
  var projMat = g_camera.projMat;
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat = g_camera.viewMat;
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);

  globalRotMat.rotate(g_angleYSlide, 1, 0, 0);
  globalRotMat.rotate(rotationX, 1, 0, 0);
  globalRotMat.rotate(rotationY, 0, 1, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the map

  drawMap();

  // Body
  let bodyX = -0.5;
  let bodyY = -0.05;
  let bodyZ = -0.25
  var body = new Cube();
  body.color = [70/255, 70/255, 70/255, 1.0]

  body.matrix.translate(-0.5, -0.05, -0.25);
  //body.matrix.rotate(-60,0,0,1);
  //body.matrix.translate(-0.4, 0.5, 0.0);
  body.matrix.rotate(-20,0,0,1);
  //body.matrix.rotate(g_bodyAngle, 0, 0, 1);

  // Shake Animation
  body.matrix.translate(-bodyX, -bodyY, -bodyZ);
  body.matrix.rotate(g_bodyAngle, 1, 0, 0);
  body.matrix.translate(bodyX, bodyY, bodyZ);

  body.matrix.rotate(g_pokeBody, 0, 0, 1);
  body.matrix.translate(g_pokeBodyPos[0], g_pokeBodyPos[1], g_pokeBodyPos[2]);

  var bodyCoordinateMat = new Matrix4(body.matrix);
  body.matrix.scale(1.0, 0.4, 0.4);

  body.renderfast();

  // Left Front Leg
  var LeftFrontLeg = new Cube();
  LeftFrontLeg.color = [50/255, 50/255, 50/255, 1.0];
  LeftFrontLeg.matrix.translate(-0.45, -0.4, -0.2801);

  // Shake Animation
  LeftFrontLeg.matrix.translate(-bodyX, -bodyY, -bodyZ);
  LeftFrontLeg.matrix.rotate(g_bodyAngle, 1, 0, 0);
  LeftFrontLeg.matrix.translate(bodyX, bodyY, bodyZ);

  LeftFrontLeg.matrix.rotate(g_pokeBody, 0, 0, 1);
  LeftFrontLeg.matrix.translate(g_pokeBodyPos[0], g_pokeBodyPos[1], g_pokeBodyPos[2]);
  var LeftFrontLegCoordinatesMat = new Matrix4(LeftFrontLeg.matrix);
  LeftFrontLeg.matrix.scale(0.17, 0.45, 0.2);
  LeftFrontLeg.renderfast();
  // Left Front Leg Joint
  var LeftFrontJoint = new Cube();
  LeftFrontJoint.color = [40/255, 40/255, 40/255, 1.0];
  LeftFrontJoint.matrix = new Matrix4(LeftFrontLegCoordinatesMat);
  LeftFrontJoint.matrix.translate(0.0, -0.1, 0.0);
  var LeftFrontJointCoordinatesMat = new Matrix4(LeftFrontJoint.matrix);
  LeftFrontJoint.matrix.scale(0.15, 0.3, 0.2);
  LeftFrontJoint.renderfast();
  // Left Front Paw
  var LeftFrontPaw = new Cube();
  LeftFrontPaw.color = [30/255, 30/255, 30/255, 1.0] 
  LeftFrontPaw.matrix = new Matrix4(LeftFrontJointCoordinatesMat);
  LeftFrontPaw.matrix.translate(-0.05, -0.05, 0.0);
  LeftFrontPaw.matrix.scale(0.2, 0.05, 0.2);
  LeftFrontPaw.renderfast();

  // Right Front Leg
  var RightFrontLeg = new Cube();
  RightFrontLeg.color = [50/255, 50/255, 50/255, 1.0];
  RightFrontLeg.matrix.translate(-0.45, -0.4, 0.0);

  RightFrontLeg.matrix.translate(-bodyX, -bodyY, -bodyZ);
  RightFrontLeg.matrix.rotate(g_bodyAngle, 1, 0, 0);
  RightFrontLeg.matrix.translate(bodyX, bodyY, bodyZ);

  RightFrontLeg.matrix.rotate(g_pokeBody, 0, 0, 1);
  RightFrontLeg.matrix.translate(g_pokeBodyPos[0], g_pokeBodyPos[1], g_pokeBodyPos[2]);
  var RightFrontLegCoordinatesMat = new Matrix4(RightFrontLeg.matrix);
  RightFrontLeg.matrix.scale(0.17, 0.45, 0.2);
  RightFrontLeg.renderfast();
  // Right Front Leg Joint
  var RightFrontJoint = new Cube();
  RightFrontJoint.color = [40/255, 40/255, 40/255, 1.0];
  RightFrontJoint.matrix = new Matrix4(RightFrontLegCoordinatesMat);
  RightFrontJoint.matrix.translate(0.0, -0.1, 0.0);
  var RightFrontJointCoordinatesMat = new Matrix4(RightFrontJoint.matrix);
  RightFrontJoint.matrix.scale(0.15, 0.3, 0.2);
  RightFrontJoint.renderfast();
  // Right Front Paw
  var RightFrontPaw = new Cube();
  RightFrontPaw.color = [30/255, 30/255, 30/255, 1.0] 
  RightFrontPaw.matrix = new Matrix4(RightFrontJointCoordinatesMat);
  RightFrontPaw.matrix.translate(-0.05, -0.05, 0.0);
  RightFrontPaw.matrix.scale(0.2001, 0.05, 0.2);
  RightFrontPaw.renderfast();

  // Left Back Leg
  var LeftBackLeg = new Cube();
  LeftBackLeg.color = [50/255, 50/255, 50/255, 1.0]
  LeftBackLeg.matrix.translate(0.2, -0.45, -0.3501);
  LeftBackLeg.matrix.scale(0.25, 0.35, 0.2);
  LeftBackLeg.renderfast();
  // Left Back Leg Joint
  var LeftBackJoint = new Cube();
  LeftBackJoint.color = [40/255, 40/255, 40/255, 1.0]
  LeftBackJoint.matrix.translate(0.225, -0.55, -0.3501);
  LeftBackJoint.matrix.scale(0.20, 0.35, 0.2);
  LeftBackJoint.renderfast();
  // Left Back Paw
  var LeftBackPaw = new Cube();
  LeftBackPaw.color = [30/255, 30/255, 30/255, 1.0]
  LeftBackPaw.matrix.translate(0.1, -0.55, -0.3501);
  LeftBackPaw.matrix.scale(0.25, 0.05, 0.2);
  LeftBackPaw.renderfast();

  // Right Back Leg
  var RightBackLeg = new Cube();
  RightBackLeg.color = [50/255, 50/255, 50/255, 1.0]
  RightBackLeg.matrix.translate(0.2, -0.45, 0.05);
  RightBackLeg.matrix.scale(0.25, 0.35, 0.2);
  RightBackLeg.renderfast();
  // Right Back Leg Joint
  var RightBackJoint = new Cube();
  RightBackJoint.color = [40/255, 40/255, 40/255, 1.0]
  RightBackJoint.matrix.translate(0.225, -0.55, 0.05);
  RightBackJoint.matrix.scale(0.20, 0.35, 0.2);
  RightBackJoint.renderfast();
  // Right Back Paw
  var RightBackPaw = new Cube();
  RightBackPaw.color = [30/255, 30/255, 30/255, 1.0]
  RightBackPaw.matrix.translate(0.1, -0.55, 0.05);
  RightBackPaw.matrix.scale(0.25, 0.05, 0.2);
  RightBackPaw.renderfast();

  // Head
  let headX=-0.7;
  let headY=0.15;
  let headZ=-0.225;
  var Head = new Cube();
  Head.color = [55/255, 55/255, 55/255, 1.0]
  Head.matrix = new Matrix4(bodyCoordinateMat);
  Head.matrix.translate(-0.35, 0.2, 0.025);

  // Shake Animation
  Head.matrix.translate(-headX, -headY, -headZ);
  Head.matrix.rotate(g_headAngle, 1, 0, 0);
  Head.matrix.translate(headX, headY, headZ);

  var headCoordinatesMat=new Matrix4(Head.matrix);
  Head.matrix.scale(0.35, 0.35 , 0.35);
  Head.renderfast();

  // Ear 1
  var Ear = new TrianglePrism();
  Ear.color = [30/255, 30/255, 30/255, 1.0];
  Ear.matrix = new Matrix4(headCoordinatesMat);
  Ear.matrix.translate(0.1, 0.35, 0.0);
  Ear.matrix.rotate(g_earAngle, 0.0, 0.0, 1.0);
  Ear.matrix.rotate(g_earAngle, 0.0, 1.0, 0.0);
  Ear.matrix.scale(0.15, 0.2, 0.15);
  Ear.render();

  // Ear 2
  var Ear2 = new TrianglePrism();
  Ear2.color = [25/255, 25/255, 25/255, 1.0];
  Ear2.matrix = new Matrix4(headCoordinatesMat);
  Ear2.matrix.translate(0.1, 0.35, 0.2);
  Ear2.matrix.rotate(g_earAngle, 0.0, 0.0, 1.0);
  Ear2.matrix.rotate(g_earAngle, 0.0, 1.0, 0.0);
  Ear2.matrix.scale(0.15, 0.2, 0.15);
  Ear2.render();


  // Tail Bottom
  var Tail = new Cube();
  Tail.color = [30/255, 30/255, 30/255, 1.0]
  Tail.matrix = new Matrix4(bodyCoordinateMat);
  Tail.matrix.translate(0.9, 0.3, 0.15);
  Tail.matrix.rotate(-30, 0.0, 0.0, 1.0);
  Tail.matrix.rotate(-g_bottomTAngle, 0.0, 0.0, 1.0);
  var bottomCoordinatesMat = new Matrix4(Tail.matrix);
  Tail.matrix.scale(0.1, 0.4, 0.1);
  Tail.renderfast();
  // Joint 1 Middle
  var TailJ = new Cube();
  TailJ.color = [10/255, 10/255, 10/255, 1.0]
  TailJ.matrix = bottomCoordinatesMat;
  TailJ.matrix.translate(0.0, 0.4, 0.0);
  TailJ.matrix.rotate(-g_middleTAngle, 0.0, 0.0, 1.0);
  var middleCoordinatesMat=new Matrix4(TailJ.matrix);
  TailJ.matrix.scale(0.1, 0.25, 0.1);
  TailJ.renderfast();
  // Joint 2 Top
  var TailJ2 = new Cube();
  TailJ2.color = [255 / 255 * .9, 255 / 255 *.9, 255 / 255 *.9, 1.0]
  TailJ2.matrix = middleCoordinatesMat;
  TailJ2.matrix.translate(0.0, 0.25, 0.0);
  TailJ2.matrix.rotate(g_topTAngle,0,0,1);
  TailJ2.matrix.scale(0.1, 0.1, 0.1);
  TailJ2.renderfast();
  
  // All seven rainbow blocks
  var rainbowblock1 = new Cube();
  rainbowblock1.color = [Math.random(), Math.random(), Math.random(), 1.0]
  rainbowblock1.textureNum = -2;
  rainbowblock1.matrix.setTranslate(-1.85, 119.5, 11.4);
  rainbowblock1.matrix.scale(0.2,0.2,0.2);
  rainbowblock1.renderfast();
  var rainbowblock2 = new Cube();
  rainbowblock2.color = [Math.random(), Math.random(), Math.random(), 1.0]
  rainbowblock2.textureNum = -2;
  rainbowblock2.matrix.setTranslate(0.25,-0.55, -0.15);
  rainbowblock2.matrix.scale(0.2,0.2,0.2);
  rainbowblock2.renderfast();
  var rainbowblock3 = new Cube();
  rainbowblock3.color = [Math.random(), Math.random(), Math.random(), 1.0]
  rainbowblock3.textureNum = -2;
  rainbowblock3.matrix.setTranslate(10,-0.55,10);
  rainbowblock3.matrix.scale(0.2,0.2,0.2);
  rainbowblock3.renderfast();
  var rainbowblock4 = new Cube();
  rainbowblock4.color = [Math.random(), Math.random(), Math.random(), 1.0]
  rainbowblock4.textureNum = -2;
  rainbowblock4.matrix.setTranslate(0,-0.55,0);
  rainbowblock4.matrix.setTranslate(11,-0.55,-1);
  rainbowblock4.matrix.scale(0.2,0.2,0.2);
  rainbowblock4.renderfast();
  var rainbowblock5 = new Cube();
  rainbowblock5.color = [Math.random(), Math.random(), Math.random(), 1.0]
  rainbowblock5.textureNum = -2;
  rainbowblock5.matrix.setTranslate(11, 4.55,-12.5);
  rainbowblock5.matrix.scale(0.2,0.2,0.2);
  rainbowblock5.renderfast();
  var rainbowblock6 = new Cube();
  rainbowblock6.color = [Math.random(), Math.random(), Math.random(), 1.0]
  rainbowblock6.textureNum = -2;
  rainbowblock6.matrix.setTranslate(-8, 2.55,-11.5);
  rainbowblock6.matrix.scale(0.2,0.2,0.2);
  rainbowblock6.renderfast();
  var rainbowblock7 = new Cube();
  rainbowblock7.color = [Math.random(), Math.random(), Math.random(), 1.0]
  rainbowblock7.textureNum = -2;
  rainbowblock7.matrix.setTranslate(-14, 0.55, 13.5);
  rainbowblock7.matrix.scale(0.2,0.2,0.2);
  rainbowblock7.renderfast();

  // Check the time at the end of the function and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps " + Math.floor(10000/duration)/10, "numdot");
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

function RandomColorGen() {
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1.0);
}