import * as THREE from 'three';

export function createSkybox(scene, loader) {
    const skybox = loader.load('resources/images/background.png');
    skybox.mapping = THREE.EquirectangularReflectionMapping;
    skybox.colorSpace = THREE.SRGBColorSpace;
    scene.background = skybox;
}

export function createFloor(scene, loader) {
    const geometry = new THREE.BoxGeometry(1500, 1, 1500);
    const map = loader.load('resources/images/grass.png');
    const material = new THREE.MeshBasicMaterial({map});
    
    const floor = new THREE.Mesh(geometry, material);
    scene.add(floor);

    floor.position.y = -20.5;
   
    return floor;    
}