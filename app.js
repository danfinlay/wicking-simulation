import * as THREE from './node_modules/three/build/three.module';

function init() {
    const container = document.getElementById('simulation');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    return { scene, camera, renderer };
}
function animate(renderer, scene, camera) {
    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();
}
function createObjects(scene) {
    // Add hydrophilic material (e.g., a cylinder)
    const materialGeometry = new THREE.CylinderGeometry(1, 1, 5, 32);
    const materialMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const material = new THREE.Mesh(materialGeometry, materialMaterial);
    material.position.y = -2.5;
    scene.add(material);

    // Add water particles (e.g., small spheres)
    const particleGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    for (let i = 0; i < 50; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(Math.random() * 5 - 2.5, Math.random() * 5 - 2.5, Math.random() * 5 - 2.5);
        scene.add(particle);
    }
}
function setupCamera(camera) {
    camera.position.set(10, 5, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}
function simulateCapillaryAction(scene) {
    // Calculate inter-molecular forces and update positions of water particles
    // This is a placeholder for the actual simulation logic
    scene.traverse((object) => {
        if (object.type === 'Mesh' && object.geometry.type === 'SphereGeometry') {
            object.position.y += 0.001 * Math.random();
        }
    });
}
function main() {
    const { scene, camera, renderer } = init();
    createObjects(scene);
    setupCamera(camera);
    animate(renderer, scene, camera);

    // Run the simulation
    setInterval(() => {
        simulateCapillaryAction(scene);
    }, 1000 / 60); // Update simulation at 60 FPS
}

main();
