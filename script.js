import * as THREE from './js/three.min.js';
import { OrbitControls } from './js/OrbitControls.js';

let scene, camera, renderer, controls, planets = {}, animationRunning = true;

const planetData = {
    sun: { size: 8, texture: 'textures/sun.jpg', distance: 0, speed: 0 },
    mercury: { size: 1, texture: 'textures/mercury.jpg', distance: 10, speed: 0.004 },
    venus: { size: 2, texture: 'textures/venus.jpg', distance: 14, speed: -0.003 },
    earth: { size: 2.5, texture: 'textures/earth.jpg', distance: 18, speed: 0.002 },
    mars: { size: 1.8, texture: 'textures/mars.jpg', distance: 24, speed: 0.0018 },
    jupiter: { size: 5, texture: 'textures/jupiter.jpg', distance: 30, speed: 0.001 },
    saturn: { size: 4, texture: 'textures/saturn.jpg', distance: 38, speed: 0.0008 },
    uranus: { size: 3, texture: 'textures/uranus.jpg', distance: 48, speed: 0.0004 },
    neptune: { size: 3, texture: 'textures/neptune.jpg', distance: 54, speed: 0.0003 },
};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Background
    const starsTexture = new THREE.TextureLoader().load('textures/stars.jpg');
    scene.background = starsTexture;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Sun and Planets
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    for (let [name, data] of Object.entries(planetData)) {
        const material = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(data.texture) });
        const planet = new THREE.Mesh(geometry.clone(), material);
        planet.scale.set(data.size, data.size, data.size);
        planet.position.set(data.distance, 0, 0);
        scene.add(planet);
        planets[name] = { mesh: planet, angle: 0, speed: data.speed, distance: data.distance };
        if (name !== 'sun') {
            const orbit = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
            const orbitMesh = new THREE.Mesh(orbit, orbitMaterial);
            orbitMesh.rotation.x = Math.PI / 2;
            scene.add(orbitMesh);
        }
    }

    // Camera and Controls
    camera.position.set(0, 50, 100);
    controls = new OrbitControls(camera, renderer.domElement);

    animate();
}

function animate() {
    if (animationRunning) {
        Object.values(planets).forEach(planet => {
            if (planet.speed !== 0) {
                planet.angle += planet.speed;
                planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
                planet.mesh.position.z = planet.distance * Math.sin(planet.angle);
            }
        });
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function toggleAnimation() {
    animationRunning = !animationRunning;
}

function focusPlanet(name) {
    const planet = planets[name];
    camera.position.set(planet.mesh.position.x, 20, planet.mesh.position.z + 20);
    camera.lookAt(planet.mesh.position);
    document.getElementById('info').style.display = 'block';
    document.getElementById('planet-name').innerText = name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById('planet-details').innerText = `Distance: ${planetData[name].distance} AU, Size: ${planetData[name].size}`;
}

function resetView() {
    camera.position.set(0, 50, 100);
    controls.reset();
    document.getElementById('info').style.display = 'none';
}

window.onload = init;
