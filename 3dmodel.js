// Get the reference of the 3D scene container
const container = document.querySelector('#3d-model-container');

// Create a renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Create a directional light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();

// Create a scene
const scene = new THREE.Scene();
scene.add(light);

// Load the model using GLTFLoader
const loader = new THREE.GLTFLoader();
loader.load('./angilica/source/zainii4.glb', (gltf) => {
    const model = gltf.scene;

    scene.add(model);

    // Set the position of the model
    model.position.set(0, 0, 0);
    model.rotation.x = Math.PI / 8; // Adjust the rotation around the X-axis

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(model.position); // Make the camera look at the model

    // Add camera controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.copy(model.position); // Set the controls' target to the model's position
    controls.update();

    animate(); // Start the animation after the model is loaded
}, undefined, (error) => {
    console.error('An error occurred while loading the model.', error);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
