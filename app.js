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
function simulateCapillaryAction(scene, timeStep) {
    // Constants
    const kB = 1.38064852e-23; // Boltzmann constant (J/K)
    const temperature = 298.15; // Room temperature (K)

    // Calculate inter-molecular forces
    scene.traverse((object) => {
        if (object.type === 'Mesh' && object.geometry.type === 'SphereGeometry') {
            // Get neighboring particles within a certain radius
            const neighbors = getNeighbors(scene, object, 1.0);

            // Calculate van der Waals forces
            const vdwForce = calculateVanDerWaalsForce(object, neighbors);

            // Calculate hydrogen bonding forces
            const hbForce = calculateHydrogenBondingForce(object, neighbors);

            // Calculate electrostatic interactions
            const elecForce = calculateElectrostaticInteractions(object, neighbors);

            // Combine all forces
            const totalForce = vdwForce.add(hbForce).add(elecForce);

            // Update positions based on the total force and time step
            object.position.x += totalForce.x * timeStep;
            object.position.y += totalForce.y * timeStep;
            object.position.z += totalForce.z * timeStep;
        }
    });
}
function getNeighbors(scene, particle, radius) {
    const neighbors = [];

    scene.traverse((object) => {
        if (
            object.type === 'Mesh' &&
            object.geometry.type === 'SphereGeometry' &&
            object.uuid !== particle.uuid
        ) {
            const distance = object.position.distanceTo(particle.position);

            if (distance <= radius) {
                neighbors.push(object);
            }
        }
    });

    return neighbors;
}
function calculateVanDerWaalsForce(particle, neighbors) {
    const epsilon = 1; // Lennard-Jones well depth (unit: energy)
    const sigma = 1; // Lennard-Jones distance (unit: length)

    const force = new THREE.Vector3(0, 0, 0);

    neighbors.forEach((neighbor) => {
        const distanceVec = particle.position.clone().sub(neighbor.position);
        const distance = distanceVec.length();
        const distanceRatio = Math.pow(sigma / distance, 6);

        const forceMagnitude = 24 * epsilon * (2 * Math.pow(distanceRatio, 2) - distanceRatio) / distance;

        const forceVec = distanceVec.normalize().multiplyScalar(forceMagnitude);
        force.add(forceVec);
    });

    return force;
}
function calculateHydrogenBondingForce(particle, neighbors) {
    const hbStrength = 5; // Arbitrary hydrogen bond strength (unit: energy)

    const force = new THREE.Vector3(0, 0, 0);

    neighbors.forEach((neighbor) => {
        const distanceVec = particle.position.clone().sub(neighbor.position);
        const distance = distanceVec.length();

        // Check if the distance is within the hydrogen bonding range (e.g., 0.1 to 0.35 nm for water)
        if (distance > 0.1 && distance < 0.35) {
            const forceMagnitude = -hbStrength / Math.pow(distance, 2);
            const forceVec = distanceVec.normalize().multiplyScalar(forceMagnitude);
            force.add(forceVec);
        }
    });

    return force;
}
function calculateElectrostaticInteractions(particle, neighbors) {
    const chargeParticle = -0.834; // Partial charge of a water molecule (unit: elementary charge)
    const k = 8.9875517923e9; // Coulomb's constant (N m^2 C^-2)

    const force = new THREE.Vector3(0, 0, 0);

    neighbors.forEach((neighbor) => {
        const distanceVec = particle.position.clone().sub(neighbor.position);
        const distance = distanceVec.length();

        const forceMagnitude = k * chargeParticle * chargeParticle / Math.pow(distance, 2);
        const forceVec = distanceVec.normalize().multiplyScalar(forceMagnitude);
        force.add(forceVec);
    });

    return force;
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
