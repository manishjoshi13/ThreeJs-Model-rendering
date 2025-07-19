import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 50;
scene.add(camera);
const canvas = document.querySelector('canvas');


const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // Set clear color with 0 alpha for transparency
renderer.outputColorSpace = THREE.SRGBColorSpace;
const light = new THREE.AmbientLight(0xffffff, 1); // Soft white light
scene.add(light);

const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  // scene.background = texture;
  scene.environment = texture;
});



// Remove box mesh, load GLB model instead
const loader = new GLTFLoader();
let glbModel = null;

// GUI parameters for rotation
const modelRotation = {
  x: 0,
  y: 0,
  z: 0
};
// 2.35 1.57 -1.04
// Setup lil-gui


// Replace 'model.glb' with the path to your GLB file
loader.load(
  '/guitar.glb',
  (gltf) => {
    glbModel = gltf.scene;
    glbModel.scale.set(0.5, 0.5, 0.5);
    
    glbModel.position.set(0,0,0);
   
    scene.add(glbModel);
   
    // Set initial rotation from GUI
    glbModel.rotation.set(2.35, 1.57, -1.04);
  },
  undefined,
  (error) => {
    console.error('An error happened while loading the GLB model:', error);
  }
);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;


window.addEventListener('resize',()=>{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
// Move the gsap animation inside the loader callback to ensure it runs after the model is loaded
// (Place this after glbModel is added to the scene in the loader.load callback)
  
const clock = new THREE.Clock();
function animate(){
  window.requestAnimationFrame(animate);



  controls.update();
  renderer.render(scene, camera);
}
animate();
