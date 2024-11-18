// Основні змінні
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Додавання текстур
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('textures/earth.jpg');
const moonTexture = textureLoader.load('textures/moon.jpg');
const starsTexture = textureLoader.load('textures/stars.jpg');

// Фон зі зірками
const starsGeometry = new THREE.SphereGeometry(500, 64, 64);
const starsMaterial = new THREE.MeshBasicMaterial({
    map: starsTexture,
    side: THREE.BackSide,
});
const stars = new THREE.Mesh(starsGeometry, starsMaterial);
scene.add(stars);

// Земля
const earthGeometry = new THREE.SphereGeometry(15, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Місяць
const moonGeometry = new THREE.SphereGeometry(5, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Світло
const pointLight = new THREE.PointLight(0xffffff, 2, 150); // Збільшена інтенсивність
pointLight.position.set(30, 0, 30); // Світло спрямоване на бік планети
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Напрямлене світло
directionalLight.position.set(-30, 0, -30); // Інше світло з протилежного боку
directionalLight.target = earth; // Орієнтація світла точно на Землю
scene.add(directionalLight);

// Додавання "помічників" (опціонально для налагодження)
//const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
//const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
//scene.add(pointLightHelper, directionalLightHelper); // Видаліть ці рядки у фінальній версії


// Орбіти
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;

// Анімація
const moonOrbitRadius = 30;
let moonAngle = 0;

function animate() {
    requestAnimationFrame(animate);

    // Обертання Землі
    earth.rotation.y += 0.005;

    // Рух Місяця
    moonAngle += 0.01;
    moon.position.set(
        Math.cos(moonAngle) * moonOrbitRadius,
        0,
        Math.sin(moonAngle) * moonOrbitRadius
    );

    // Рендеринг сцени
    renderer.render(scene, camera);
}

animate();
// Адаптація до зміни розміру вікна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Встановити розмір на весь екран
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
