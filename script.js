import * as THREE from './libraries/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createAsteroids, toggleAsteroids } from './js/asteroids.js';
import { createConstellations, toggleConstellations } from './js/constellations.js';
import { createRandomParticles } from './js/stars.js';
import { createDynamicParticleSphere, animateParticles, resetParticleSphere } from './js/particlesphere.js';
import { createParticleBeam, animateParticleBeam, resetParticleBeam } from './js/particlebeam.js';
import { adicionarObjetoGLTF } from './js/objetoGLTF.js';
import { createPlanet } from './js/planets.js';
import { createSun } from './js/sun.js';
import { createSaturnRings } from './js/saturnRings.js';
import { setupKeyboardInteractions } from './js/zoomToPlanet.js';
import { toggleAudio} from './js/audio.js';
import { initializeSolarSystem, moveSolarSystem, setupMoveSystemButton} from './js/moveSolarSystem.js';
import { orbits, createOrbit, toggleOrbitsVisibility } from './js/orbits.js';
import { createDepressedGrid } from './js/grid.js';

// Configuração inicial: Cena, Câmera e Renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 3000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Gerenciador de Texturas
const textureLoader = new THREE.TextureLoader();


// Controles de câmera
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 100;
controls.update();

// Fundo da Cena
const spaceTexture1 = new THREE.TextureLoader().load('assets/textures/stars.jpg');
const spaceTexture2 = new THREE.TextureLoader().load('assets/textures/mercury.jpg');
scene.background = spaceTexture1;

// Luzes
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(0, 0, 0); // No centro (Sol)
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Luz ambiente suave
scene.add(ambientLight);


// Cria o Sol
const sun = createSun(scene, textureLoader);

// Adiciona os planetas
const planets = [
    createPlanet(scene,textureLoader,1, 'assets/textures/mercury.jpg', 10, 0.02), // Mercúrio
    createPlanet(scene,textureLoader,1.5, 'assets/textures/venus.jpg', 15, 0.015), // Vênus
    createPlanet(scene,textureLoader,2, 'assets/textures/earth.jpg', 20, 0.01, [  // Terra com satélite (Lua)
        { size: 0.5, distance: 2.5, speed: 0.03 }
    ]),
    createPlanet(scene,textureLoader,1.2, 'assets/textures/mars.jpg', 25, 0.008), // Marte
    createPlanet(scene,textureLoader,3, 'assets/textures/jupiter.jpg', 35, 0.005), // Júpiter
    createPlanet(scene,textureLoader,2.5, 'assets/textures/saturn.jpg', 50, 0.003, [ // Saturno
        { size: 0.8, distance: 3, speed: 0.01 }
    ]),
    createPlanet(scene,textureLoader,2, 'assets/textures/uranus.jpg', 65, 0.002), // Urano
    createPlanet(scene,textureLoader,1.8, 'assets/textures/nepturne.jpg', 75, 0.0015)  // Netuno
];

// Anéis de Saturno
createSaturnRings(planets[5].planet);


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
setupKeyboardInteractions(planets, camera, controls);

// Cria asteroides
createAsteroids(scene);

// Cria constelações
createConstellations(scene);

// GRID
const size = 200;
const divisions = 50;
const depthFactor = 50;
const color = 0x00ff00;

createDepressedGrid(size, divisions, depthFactor, color, scene, 'toggleButtonGrid');

// Lógica de áudio
toggleAudio();

// Botão Movimento Sistema Solar
initializeSolarSystem(scene, sun, planets);
setupMoveSystemButton();

// Órbitas

// Cria as órbitas (inicialmente ocultas)
planets.forEach((planet, index) => {
    const orbit = createOrbit(planet.distance, 0x888888);
    orbit.visible = false; // Começa oculto
    scene.add(orbit);
    orbits.push(orbit); // Armazena no array para controle
});

const toggleOrbitButton = document.getElementById('toggleOrbitButton');
toggleOrbitsVisibility(toggleOrbitButton, orbits);


// ROTAÇÂO E TRANSLAÇÃO
// Variável de controle para o movimento
let isMoving = false; // Movimento desativo por padrão

// Botão para alternar o movimento
const toggleMovementButton = document.getElementById('toggleMovement');
toggleMovementButton.addEventListener('click', () => {
    isMoving = !isMoving; // Alterna o estado
    toggleMovementButton.textContent = isMoving ? 'Pause Movement' : 'Resume Movement';
});

// ESTRELAS

createRandomParticles(scene, 1000, 100, 700);

// BURACO NEGRO

let modeloAnimado = null; // Variável para armazenar o modelo animado

// Carregar o objeto GLTF
adicionarObjetoGLTF(
    scene,
    './blackhole.glb',  // Caminho do modelo
    { x: 0, y: 100, z: 500 },  // Posição
    { x: 100, y: 100, z: 100 },  // Escala
    { x: 2.5, y: 4.5, z: 2.5 }   // Rotação inicial (opcional)
).then((modelo) => {
    modeloAnimado = modelo; // Armazena o modelo para animação
}).catch((error) => {
    console.error("Erro ao carregar o modelo:", error);
});

// Esfera de particulas

// Configuração do evento de teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'j') {
        createDynamicParticleSphere(scene, 100, 0xffff00, 20000);
    }
    if (event.key === 'c') {
        createParticleBeam(scene, new THREE.Vector3(300, 0, 0), new THREE.Vector3(-1, 0, 0), 0xff0000, 10000, 500, 300);
    }
    if (event.key === 'r') {
        resetParticleSphere(scene);
        resetParticleBeam(scene);
    }
});

// Loop de animação
function animate() {
    requestAnimationFrame(animate);

    // Controle de movimento dos planetas
    if (isMoving) {
        planets.forEach(({ planet, orbit, speed, tail }) => {
            orbit.rotation.y += speed * speedMultiplier; // Translação
            planet.rotation.y += 0.02; // Rotação
            tail.update();
        });
    }

    // Outros movimentos, se houver
    moveSolarSystem(); // Exemplo de movimento do sistema solar
    animateParticles();
    animateParticleBeam(100);
    // Animação do modelo (se carregado)
    if (modeloAnimado) {
        modeloAnimado.rotation.x += 0.009;
        modeloAnimado.rotation.z += 0.009;
    }
    renderer.render(scene, camera);
}

// Inicializa a animação
animate();


// Evento de clique no botão para ativar/desativar asteroides e constelações
document.getElementById('toggleButton').addEventListener('click', () => {
    toggleAsteroids();
    toggleConstellations();
});

// Alternar a textura do plano de fundo
const toggleBackgroundButton = document.getElementById('toggleBackground');
toggleBackgroundButton.addEventListener('click', () => {
    if (scene.background === spaceTexture1) {
        scene.background = spaceTexture2; // Altera para a segunda textura
    } else {
        scene.background = spaceTexture1; // Volta para a primeira textura
    }
});