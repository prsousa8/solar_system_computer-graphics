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
    emissiveIntensity: 2, // Intensidade do brilho
    emissiveMap: textureLoader.load('assets/textures/sun.jpg') // Textura para controlar a emissão
});

const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Função para criar planetas com órbitas e texturas
function createPlanet(size, texturePath, distance, speed) {
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texturePath)
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    const orbit = new THREE.Object3D();
    orbit.add(planet);
    scene.add(orbit);

    planet.position.x = distance; // Define a posição inicial na órbita

    return { planet, orbit, speed, angle: 0, distance };
}

// Adiciona os planetas
const planets = [
    createPlanet(1, 'assets/textures/mercury.jpg', 10, 0.02), // Mercúrio
    createPlanet(1.5, 'assets/textures/venus.jpg', 15, 0.015), // Vênus
    createPlanet(2, 'assets/textures/earth.jpg', 20, 0.01),   // Terra
    createPlanet(1.2, 'assets/textures/mars.jpg', 25, 0.008), // Marte
    createPlanet(3, 'assets/textures/jupiter.jpg', 35, 0.005), // Júpiter
    createPlanet(2.5, 'assets/textures/saturn.jpg', 45, 0.003),   // Saturno
    createPlanet(2, 'assets/textures/uranus.jpg', 55, 0.002), // Urano
    createPlanet(1.8, 'assets/textures/neptune.jpg', 65, 0.0015)  // Netuno
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

// Velocidade
let speedMultiplier = 1;
window.addEventListener('keydown', (event) => {
    if (event.key === '+') speedMultiplier *= 1.1;
    if (event.key === '-') speedMultiplier /= 1.1;
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

