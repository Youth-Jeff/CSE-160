import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { createFloor, createSkybox } from './world.js'

// ---- Creating a Scene
// Camera and Scene
const scene = new THREE.Scene();

// Fog
let fogColor = 0xF6C187;
let fogNear = 10;
let fogFar = 1000;
scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 5;

// Rendering
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

// Addons: Orbit
const controls = new OrbitControls( camera, renderer.domElement );

// Textures
const loader = new THREE.TextureLoader();

// Background (Skybox)
createSkybox(scene, loader);

// Floor
createFloor(scene, loader);

// Object Loader
const kittenMtlLoader = new MTLLoader();
const kittenObjLoader = new OBJLoader();

// Cat Model
kittenMtlLoader.load('resources/models/Kitten/Mesh_Kitten.mtl', (mtl) => {
  mtl.preload();
  kittenObjLoader.setMaterials(mtl);
  kittenObjLoader.load('resources/models/Kitten/Mesh_Kitten.obj', (root) => {
    root.updateMatrixWorld();
    scene.add(root);
    // compute the box that contains all the stuff
    // from root and below
    const box = new THREE.Box3().setFromObject(root);

    const boxSize = box.getSize(new THREE.Vector3()).length();
    const boxCenter = box.getCenter(new THREE.Vector3());

    // set the camera to frame the box
    frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

    // update the Trackball controls to handle the new size
    controls.maxDistance = boxSize * 10;
    controls.target.copy(boxCenter);
    controls.update();

    // Add Two more kittens
    const kitten2 = root.clone();
    kitten2.scale.set(1, 1, 1);
    kitten2.rotation.set(0, 0.5, 0)
    kitten2.position.set(-100, 0, 0)
    scene.add(kitten2);

    const kitten3 = root.clone();
    kitten3.scale.set(1, 1, 1);
    kitten3.rotation.set(0, -0.5, 0)
    kitten3.position.set(100, 0, 0)
    scene.add(kitten3);

    const kitten4 = root.clone();
    kitten4.scale.set(1, 1, -1);
    kitten4.rotation.set(0, 0, 0)
    kitten4.position.set(0, 0, 200)
    scene.add(kitten4);
  });
});

const BarnMtlLoader = new MTLLoader();
const BarnObjLoader = new OBJLoader();

// Barn Model
BarnMtlLoader.load('resources/models/Farm/1267 Farm.mtl', (mtl) => {
  mtl.preload();
  BarnObjLoader.setMaterials(mtl);
  BarnObjLoader.load('resources/models/Farm/1267 Farm.obj', (root) => {
    root.scale.set(2, 2, 2);
    root.rotation.y = -30
    root.position.set(0, -20, -300)
    scene.add(root);
  });
});

const YarnMtlLoader = new MTLLoader();
const YarnObjLoader = new OBJLoader();

// Yarn Ball Model
YarnMtlLoader.load('resources/models/Yarn Ball v2/materials.mtl', (mtl) => {
  mtl.preload();
  YarnObjLoader.setMaterials(mtl);
  YarnObjLoader.load('resources/models/Yarn Ball v2/model.obj', (yarnball) => {
    yarnball.scale.set(6, 6, 6);
    yarnball.position.set(2, -19, 20)
    scene.add(yarnball);
    const yarnball2 = yarnball.clone();
    yarnball2.scale.set(6, 6, 6);
    yarnball2.rotation.set(0,20,0)
    yarnball2.position.set(10, -19, 20)
    scene.add(yarnball2);

    // Hut Cat have a lot of yarn
    const yarnball3 = yarnball.clone();
    yarnball3.scale.set(6, 6, 6);
    yarnball3.rotation.set(0,20,0)
    yarnball3.position.set(2, -19, 200)
    scene.add(yarnball3);
    const yarnball4 = yarnball.clone();
    yarnball4.scale.set(6, 6, 6);
    yarnball4.rotation.set(0,20,0)
    yarnball4.position.set(10, -19, 200)
    scene.add(yarnball4);
  
    const yarnball5 = yarnball.clone();
    yarnball5.scale.set(6, 6, 6);
    yarnball5.rotation.set(0,20,0)
    yarnball5.position.set(2, -19, 180)
    scene.add(yarnball5);
    const yarnball6 = yarnball.clone();
    yarnball6.scale.set(6, 6, 6);
    yarnball6.rotation.set(0,20,0)
    yarnball6.position.set(15, -19, 200)
    scene.add(yarnball6);

    const yarnball7 = yarnball.clone();
    yarnball7.scale.set(6, 6, 6);
    yarnball7.rotation.set(0,20,0)
    yarnball7.position.set(2, -19, 200)
    scene.add(yarnball7);
    const yarnball8 = yarnball.clone();
    yarnball8.scale.set(6, 6, 6);
    yarnball8.rotation.set(0,20,0)
    yarnball8.position.set(10, -19, 230)
    scene.add(yarnball8);
  });
});


const texture = loader.load( 'resources/images/image.png' );
texture.colorSpace = THREE.SRGBColorSpace;

// Cube configuration
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

// Directional Light
let color = 0xFFFFFF;
let intensity = 10;
const DirectionalLight = new THREE.DirectionalLight(color, intensity);
DirectionalLight.castShadow = true;
DirectionalLight.position.set(0, 5, 5);
scene.add(DirectionalLight);

// Spotlight
color = 0xFF0000;
intensity = 10000;
const SpotLight = new THREE.SpotLight(color, intensity);
SpotLight.position.set(0, 25, 230);
scene.add(SpotLight);

// Ambient Light
color = 0xF6C187;
intensity = 2;
const AmbientLight = new THREE.AmbientLight(color, intensity);
scene.add(AmbientLight);



// Animate
function render(time) {
    time *= 0.001;  // convert time to seconds

    PhongCubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    TextureCubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    sphereShadowBases.forEach((sphereShadowBase, ndx) => {
      const {base, sphereMesh, shadowMesh, y} = sphereShadowBase;
   
      // u is a value that goes from 0 to 1 as we iterate the spheres
      const u = ndx / sphereShadowBases.length;
   
      // compute a position for the base. This will move
      // both the sphere and its shadow
      const speed = time * .2;
      const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1);
      const radius = Math.sin(speed - ndx) * 10;
      base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
   
      // yOff is a value that goes from 0 to 1
      const yOff = Math.abs(Math.sin(time * 2 + ndx));
      // move the sphere up and down
      sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff);
      // fade the shadow as the sphere goes up
      shadowMesh.material.opacity = THREE.MathUtils.lerp(1, .25, yOff);
    });

    DirectionalLight.position.x = Math.sin(time * 2);
    DirectionalLight.position.z = Math.cos(time* 2);

    
    renderer.render(scene, camera);
   
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

// --- Functions
function makePhongCubes(geometry, color, coordinates, scale, rotate) {
  const material = new THREE.MeshPhongMaterial({color});
 
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
 
  cube.position.x = coordinates[0];
  cube.position.y = coordinates[1];
  cube.position.z = coordinates[2];
  if (scale) {
    cube.scale.set(scale[0], scale[1], scale[2]);
  }

  if (rotate) {
    cube.rotation.set(rotate[0], rotate[1], rotate[2]);
  }
 
  return cube;
}

function makeTextureCubes(geometry, map, coordinates, rotate) {
  const material = new THREE.MeshBasicMaterial({map});
   
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
   
  cube.position.x = coordinates[0];
  cube.position.y = coordinates[1];
  cube.position.z = coordinates[2];
   
  return cube;
}

function makeBasicMaterial(geometry, map, coordinates, scale, rotate) {
  const material = new THREE.MeshBasicMaterial({color: map});
   
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
   
  cube.position.x = coordinates[0];
  cube.position.y = coordinates[1];
  cube.position.z = coordinates[2];

  if (scale) {
    cube.scale.set(scale[0], scale[1], scale[2]);
  }
  
  
  return cube;
}

// --- Const

const PhongCubes = [
  makePhongCubes(geometry, 0x44aa88,  [0, 5, 20]),
  makePhongCubes(geometry, 0x8844aa,  [-2, 5, 20]),
  makePhongCubes(geometry, 0xaa8844,  [2, 5, 20]),
];

const TextureCubes = [
  makeTextureCubes(geometry, texture,  [0, 8, 20]),
  makeTextureCubes(geometry, texture,  [-2, 8, 20]),
  makeTextureCubes(geometry, texture,  [2, 8, 20]),
];

const BuildShelterOne = [
  makePhongCubes(geometry, 0xA1662F, [0, -20.4, 2], [50, 1, 50]),
  makePhongCubes(geometry, 0xA1662F, [-25, -10, 2], [1, 60, 50]),
  makePhongCubes(geometry, 0xA1662F, [25, -10, 2], [1, 60, 50]),
  makePhongCubes(geometry, 0xA1662F, [0, 20.4, 2], [50, 1, 50]),
  makePhongCubes(geometry, 0xA1662F, [25, -10, 2], [1, 60, 50]),
  makePhongCubes(geometry, 0xA1662F, [0, -10, -23], [50, 60, 1]),
  makePhongCubes(geometry, 0xA1662F, [0, 16, 44], [50, 1, 35], [-50, 0, 0]),
];

// Box coordinates
let x = 100;
let y = 0;
let z = 0;

const BuildShelterTwo = [
  makePhongCubes(geometry, 0xA1662F, [0+x, -20.4+y, 2+z], [50, 1, 50]),
  makePhongCubes(geometry, 0xA1662F, [-25+x, -10+y, 2+z], [1, 60, 50]),
  makePhongCubes(geometry, 0xA1662F, [25+x, -10+y, 2+z], [1, 60, 50]),
  makePhongCubes(geometry, 0xA1662F, [0+x, 20.4+y, 2+z], [50, 1, 50]),
  makePhongCubes(geometry, 0xA1662F, [25+x, -10+y, 2+z], [1, 60, 50]),
  makePhongCubes(geometry, 0xA1662F, [0+x, -10+y, -23+z], [50, 60, 1]),
  makePhongCubes(geometry, 0xA1662F, [0+x, 16+y, 44+z], [50, 1, 35], [-50, 0, 0]),
];

// Box coordinates
x = -100;
y = 0;
z = 0;

const BuildShelterThree = [
  makePhongCubes(geometry, 0xA1662F, [0+x, -20.4+y, 2+z], [50, 1, 50]),
  makePhongCubes(geometry, 0xA1662F, [-25+x, -10+y, 2+z], [1, 60, 50]),
  makePhongCubes(geometry, 0xA1662F, [25+x, -10+y, 2+z], [1, 60, 50]),
  makePhongCubes(geometry, 0xA1662F, [0+x, 20.4+y, 2+z], [50, 1, 50]),
  makePhongCubes(geometry, 0xA1662F, [25+x, -10+y, 2+z], [1, 60, 50]),
  makePhongCubes(geometry, 0xA1662F, [0+x, -10+y, -23+z], [50, 60, 1]),
  makePhongCubes(geometry, 0xA1662F, [0+x, 16+y, 44+z], [50, 1, 35], [-50, 0, 0]),
];

const YarnBalls = [
  makeTextureCubes(geometry, texture,  [0, 8, 20]),
  makeTextureCubes(geometry, texture,  [0, 8, 20]),
  makeTextureCubes(geometry, texture,  [0, 8, 20]),
]


function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
 
  // compute a unit vector that points in the direction the camera is now
  // from the center of the box
  const direction = (new THREE.Vector3()).subVectors(camera.position, boxCenter).normalize();
 
  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
 
  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;
 
  camera.updateProjectionMatrix();
 
  // point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

// Build the Hut
let radiusTop =  10;  
let radiusBottom = 10;  
let height = 15;  
let radialSegments = 12;  
let heightSegments = 2;  
let openEnded = true;  
let thetaStart = Math.PI * 0.25;  
let thetaLength = Math.PI * 1.5;  

const CylinderGeometry = new THREE.CylinderGeometry(
	radiusTop, radiusBottom, height,
	radialSegments, heightSegments,
	openEnded,
	thetaStart, thetaLength );


const material = new THREE.MeshPhongMaterial({color: 0x4F3727});
material.side = THREE.DoubleSide
const cylinder = new THREE.Mesh(CylinderGeometry, material);
cylinder.scale.set(5, 5, 5)
cylinder.position.set(0, 0, 200);
cylinder.rotation.set(0, 3, 0);

scene.add(cylinder)

let radius = 13;  
height = 8;  
radialSegments = 16;  
const ConeGeometry = new THREE.ConeGeometry( radius, height, radialSegments );
const cone = new THREE.Mesh(ConeGeometry, material);
cone.scale.set(5, 5, 5)
cone.position.set(0, 55, 200);
cone.rotation.set(0, 3, 0);

scene.add(cone)

// Shadow Experiment
const shadowTexture = loader.load('resources/images/shadow.png');
const sphereShadowBases = [];
const sphereRadius = 1;
const sphereWidthDivisions = 32;
const sphereHeightDivisions = 16;
const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
const planeSize = 1;
const shadowGeo = new THREE.PlaneGeometry(planeSize, planeSize);

const numSpheres = 15;
for (let i = 0; i < numSpheres; ++i) {
  // make a base for the shadow and the sphere
  // so they move together.
  const base = new THREE.Object3D();
  scene.add(base);
 
  // add the shadow to the base
  // note: we make a new material for each sphere
  // so we can set that sphere's material transparency
  // separately.
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,    // so we can see the ground
    depthWrite: false,    // so we don't have to sort
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.position.y = -19.8;  // so we're above the ground slightly
  shadowMesh.rotation.x = Math.PI * -.5;
  const shadowSize = sphereRadius * 4;
  shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
  base.add(shadowMesh);
 
  // add the sphere to the base
  const u = i / numSpheres;   // goes from 0 to 1 as we iterate the spheres.
  const sphereMat = new THREE.MeshPhongMaterial();
  sphereMat.color.setHSL(u, 1, .75);
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  sphereMesh.position.set(0, sphereRadius - 18, 0);
  base.add(sphereMesh);
 
  // remember all 3 plus the y position
  sphereShadowBases.push({base, sphereMesh, shadowMesh, y: sphereMesh.position.y});
}

// Billboard
const billboardTexture = loader.load( 'resources/images/shadow.png' );
const labelMaterial = new THREE.SpriteMaterial({
  map: billboardTexture,
  side: THREE.DoubleSide,
  transparent: true,
});

// Small Blackhole
const label = new THREE.Sprite(labelMaterial);
label.scale.set(25, 25, 25)
label.position.set(2, 10, 100);
scene.add(label);
