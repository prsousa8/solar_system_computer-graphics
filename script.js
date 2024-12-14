import * as THREE from './libraries/three.module.js';
import { OrbitControls } from './libraries/OrbitControls.js';

// Configuração inicial: Cena, Câmera e Renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 3000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Gerenciador de Texturas
const textureLoader = new THREE.TextureLoader();


// Fundo da Cena
const spaceTexture = textureLoader.load('assets/textures/stars.jpg');
scene.background = spaceTexture;

// Luzes
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(0, 0, 0); // No centro (Sol)
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Luz ambiente suave
scene.add(ambientLight);

// Cria o Sol
const sunGeometry = new THREE.SphereGeometry(5,32,32);
const sunMaterial = new THREE.MeshStandardMaterial({
    emissive: 0xffff00, // Cor emissiva (brilho)
    emissiveIntensity: 1, // Intensidade do brilho
    emissiveMap: textureLoader.load('assets/textures/sun.jpg') // Textura para controlar a emissão
});

const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Função para criar planetas com órbitas e texturas
function createPlanet(size, texturePath, distance, speed,satellites = []) {
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texturePath)
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    const orbit = new THREE.Object3D();
    orbit.add(planet);
    scene.add(orbit);

    planet.position.x = distance; // Define a posição inicial na órbita

    // Adiciona satélites, se houver
    satellites.forEach(({ size, distance, speed }) => {
        const satelliteGeometry = new THREE.SphereGeometry(size, 16, 16);
        const satelliteMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);

        const satelliteOrbit = new THREE.Object3D();
        satelliteOrbit.add(satellite);
        planet.add(satelliteOrbit);

        satellite.position.x = distance;
        satelliteOrbit.userData = { speed, angle: 0 };
    });

    return { planet, orbit, speed, angle: 0, distance };
}

// Adiciona os planetas
const planets = [
    createPlanet(1, 'assets/textures/mercury.jpg', 10, 0.02), // Mercúrio
    createPlanet(1.5, 'assets/textures/venus.jpg', 15, 0.015), // Vênus
    createPlanet(2, 'assets/textures/earth.jpg', 20, 0.01, [  // Terra com satélite (Lua)
        { size: 0.5, distance: 2.5, speed: 0.03 }
    ]),
    createPlanet(1.2, 'assets/textures/mars.jpg', 25, 0.008), // Marte
    createPlanet(3, 'assets/textures/jupiter.jpg', 35, 0.005), // Júpiter
    createPlanet(2.5, 'assets/textures/saturn.jpg', 45, 0.003, [ // Saturno
        { size: 0.8, distance: 3, speed: 0.01 }
    ]),
    createPlanet(2, 'assets/textures/uranus.jpg', 55, 0.002), // Urano
    createPlanet(1.8, 'assets/textures/nepturne.jpg', 65, 0.0015)  // Netuno
];

// Anéis de Saturno
const ringGeometry = new THREE.RingGeometry(4, 5, 64);
const ringMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('assets/textures/saturn_ring.png'),
    side: THREE.DoubleSide,
    transparent: true
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2; // Rotação para ficar paralelo ao plano XY
planets[5].planet.add(ring);

// Controles de câmera
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 100;
controls.update();


// Estados
let speedMultiplier = 1;

// Evento para interação do usuário
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'p': // Aumentar velocidade global
            speedMultiplier *= 1.1;
            break;
        case 'm': // Diminuir velocidade global
            speedMultiplier /= 1.1;
            break;
        case 'w': // Aproxima a câmera (zoom in)
            camera.position.z -= 5;
            break;
        case 's': // Afasta a câmera (zoom out)
            camera.position.z += 5;
            break;
        case 'a': // Move a câmera para a esquerda
            camera.position.x -= 5;
            break;
        case 'd': // Move a câmera para a direita
            camera.position.x += 5;
            break;
    }
});

// Função para dar zoom em um planeta
function zoomToPlanet(planet) {
    const offset = 10; // Distância da câmera ao planeta
    const targetPosition = planet.position.clone(); // Posição do planeta
    const cameraPosition = targetPosition.clone().add(new THREE.Vector3(0, offset, offset)); // Posição da câmera relativa ao planeta

    // Animação suave para mover a câmera
    const animationDuration = 1000; // Duração da animação em ms
    const startTime = performance.now();
    const startPosition = camera.position.clone();

    function animateZoom() {
        const elapsedTime = performance.now() - startTime;
        const t = Math.min(elapsedTime / animationDuration, 1); // Progresso da animação (0 a 1)

        // Interpolação linear entre posição inicial e final
        camera.position.lerpVectors(startPosition, cameraPosition, t);
        controls.target.lerp(targetPosition, t); // Atualiza o alvo da câmera

        if (t < 1) {
            requestAnimationFrame(animateZoom); // Continua a animação
        } else {
            controls.update(); // Atualiza os controles no final da animação
        }
    }

    animateZoom();
}

// Interação com teclado
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case '1': // Zoom em Mercúrio
            zoomToPlanet(planets[0].planet);
            break;
        case '2': // Zoom em Vênus
            zoomToPlanet(planets[1].planet);
            break;
        case '3': // Zoom na Terra
            zoomToPlanet(planets[2].planet);
            break;
        case '4': // Zoom em Marte
            zoomToPlanet(planets[3].planet);
            break;
        case '5': // Zoom em Júpiter
            zoomToPlanet(planets[4].planet);
            break;
        case '6': // Zoom em Saturno
            zoomToPlanet(planets[5].planet);
            break;
        case '7': // Zoom em Urano
            zoomToPlanet(planets[6].planet);
            break;
        case '8': // Zoom em Netuno
            zoomToPlanet(planets[7].planet);
            break;
        case 'R': // Reset da câmera para visão inicial
            camera.position.set(0, 20, 100);
            controls.target.set(0, 0, 0);
            controls.update();
            break;
    }
});

// Animação
function animate() {
    requestAnimationFrame(animate);

    planets.forEach(({ planet, orbit, speed, distance }) => {
        orbit.rotation.y += speed * speedMultiplier; // Translação
        planet.rotation.y += 0.02; // Rotação
    });

    renderer.render(scene, camera);
}


animate();
