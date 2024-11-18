let scene, camera, renderer, controls, stars, sun, planets = [], orbits = [];
let animationRunning = true;
let moon;

// Дані планет
const planetData = {
    mercury: { distance: 20, size: 2, texture: 'mercury.jpg', info: 'Mercury is the smallest planet.' },
    venus: { distance: 30, size: 3, texture: 'venus.jpg', info: 'Venus rotates in the opposite direction.' },
    earth: { distance: 40, size: 3.5, texture: 'earth.jpg', info: 'Earth is the only planet known to support life.' },
    mars: { distance: 50, size: 2.5, texture: 'mars.jpg', info: 'Mars is known as the Red Planet.' },
    jupiter: { distance: 70, size: 6, texture: 'jupiter.jpg', info: 'Jupiter is the largest planet.' },
    saturn: { distance: 90, size: 5.5, texture: 'saturn.jpg', ringTexture: 'saturn_ring.jpg', info: 'Saturn has beautiful rings.' },
    uranus: { distance: 110, size: 4.5, texture: 'uranus.jpg', info: 'Uranus rotates on its side.' },
    neptune: { distance: 130, size: 4.5, texture: 'neptune.jpg', info: 'Neptune has the strongest winds in the Solar System.' }
};

// Ініціалізація сцени
function init() {
    scene = new THREE.Scene();

    // Камера
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 150);

    // Рендерер
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Контролери
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Фон
    const starTexture = new THREE.TextureLoader().load('textures/stars.jpg');
    scene.background = starTexture;

    // Сонце
    const sunTexture = new THREE.TextureLoader().load('textures/sun.jpg');
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    sun = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), sunMaterial);
    scene.add(sun);

    // Планети та орбіти
    Object.keys(planetData).forEach((name) => {
        const data = planetData[name];

        // Планета
        const texture = new THREE.TextureLoader().load(`textures/${data.texture}`);
        const material = new THREE.MeshStandardMaterial({ 
            map: texture, 
            emissive: new THREE.Color(0x000000) 
        });
        const planet = new THREE.Mesh(new THREE.SphereGeometry(data.size, 32, 32), material);
        planet.position.set(data.distance, 0, 0);
        planets.push({ mesh: planet, data, angle: 0 });
        scene.add(planet);

        // Орбіта
        const orbit = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const orbitMesh = new THREE.Mesh(orbit, orbitMaterial);
        orbitMesh.rotation.x = Math.PI / 2;
        orbits.push(orbitMesh);
        scene.add(orbitMesh);

        // Кільця для Сатурна
        if (name === 'saturn') {
            const ringTexture = new THREE.TextureLoader().load(`textures/${data.ringTexture}`);
            const ringMaterial = new THREE.MeshBasicMaterial({ 
                map: ringTexture, 
                side: THREE.DoubleSide, 
                transparent: true 
            });
            const ringGeometry = new THREE.RingGeometry(data.size + 1, data.size + 3, 64);
            const rings = new THREE.Mesh(ringGeometry, ringMaterial);
            rings.rotation.x = Math.PI / 2;
            planet.add(rings);
        }

        // Місяць для Землі
        if (name === 'earth') {
            const moonTexture = new THREE.TextureLoader().load('textures/moon.jpg');
            const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
            moon = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), moonMaterial);
            moon.position.set(5, 0, 0); // Відстань від Землі

            // Додаємо Місяць до Землі
            planet.add(moon);
        }
    });

    // Освітлення
    const light = new THREE.PointLight(0xffffff, 2, 300);
    light.position.set(0, 0, 0);
    scene.add(light);
}

// Анімація планет
function animatePlanets() {
    if (animationRunning) {
        planets.forEach((planet, index) => {
            planet.angle += (index === 1 ? -0.002 : 0.002); // Венера обертається у зворотному напрямку
            const { distance } = planet.data;
            planet.mesh.position.x = distance * Math.cos(planet.angle);
            planet.mesh.position.z = distance * Math.sin(planet.angle);

            // Анімація Місяця
            if (planet.data.texture === 'earth.jpg') {
                const moonOrbitAngle = planet.angle + 0.02; // Швидкість обертання Місяця
                moon.position.x = 5 * Math.cos(moonOrbitAngle);
                moon.position.z = 5 * Math.sin(moonOrbitAngle);
            }
        });
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animatePlanets);
}

// Кнопка Start/Stop Animation
document.getElementById('start-stop').onclick = () => {
    animationRunning = !animationRunning;
    document.getElementById('start-stop').innerText = animationRunning ? 'Stop Animation' : 'Start Animation';
};

function highlightPlanet(planet) {
    // Скидання підсвічування
    planets.forEach(p => {
        p.mesh.material.emissive = new THREE.Color(0x000000);
    });

    // Підсвітити вибрану планету
    planet.mesh.material.emissive = new THREE.Color(0xff0000); // Червоне підсвічування
}


// Натискання на планети
Object.keys(planetData).forEach(name => {
    document.getElementById(name).onclick = () => {
        const planet = planets.find(p => p.data.texture.includes(name));

        // Показати інформацію про планету
        const { data } = planet;
        document.getElementById('info').style.display = 'block';
        document.getElementById('planet-name').innerText = name.toUpperCase();
        document.getElementById('planet-details').innerText = `${data.info} Distance: ${data.distance}. Size: ${data.size}`;

        // Підсвітити планету
        highlightPlanet(planet);
    };
});



// Ініціалізація та запуск
init();
animatePlanets();
