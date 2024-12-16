import * as THREE from './libraries/three.module.js';
import { OrbitControls } from './libraries/OrbitControls.js';
import { createDepressedGrid } from './js/grid.js';
import { createAsteroids, toggleAsteroids } from './js/asteroids.js';
import { createConstellations, toggleConstellations } from './js/constellations.js';

// Configuração inicial: Cena, Câmera e Renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 3000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Gerenciador de Texturas
const textureLoader = new THREE.TextureLoader();


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
const sunGeometry = new THREE.SphereGeometry(5,32,32);
const sunMaterial = new THREE.MeshStandardMaterial({
    emissive: 0xffff00, // Cor emissiva (brilho)
    emissiveIntensity: 2, // Intensidade do brilho
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

// Cria asteroides
createAsteroids(scene);

// Cria constelações
createConstellations(scene);

// Criar a grade de depressão
let depressedGrid = createDepressedGrid(200, 50, 50, 0x00ff00); // Parâmetros ajustáveis

// Variável para verificar se a grade está visível
let gridVisible = true;
scene.add(depressedGrid);

// Lógica de áudio
const audio = new Audio('assets/audio/audio.mp3'); // Substitua pelo caminho correto do seu áudio
audio.loop = true; // O áudio irá repetir continuamente

// Botão para ativar/desativar áudio
const audioToggle = document.getElementById('audioToggle');
let isAudioPlaying = false; // Estado inicial do áudio

// Variável para controlar o estado do movimento do sistema solar
let isSystemMoving = false; // Inicialmente parado
let systemDirection = 1; // Define direção inicial (1 = direita, -1 = esquerda)

// Crie um grupo para o sistema solar (agrupa planetas e o sol)
const solarSystem = new THREE.Group();
scene.add(solarSystem);

// Adiciona o Sol e planetas ao grupo do sistema solar
solarSystem.add(sun);
planets.forEach(({ orbit }) => solarSystem.add(orbit));

// Botão para alternar o movimento do sistema solar
const moveSystemButton = document.getElementById('moveSystem');
moveSystemButton.addEventListener('click', () => {
    isSystemMoving = !isSystemMoving; // Alterna o estado de movimento
    moveSystemButton.textContent = isSystemMoving ? 'Stop System' : 'Move System';
});

// Lógica para deslocar o sistema solar
function moveSolarSystem() {
    if (isSystemMoving) {
        solarSystem.position.x += 0.05 * systemDirection; // Move em X
        // Altera a direção se atingir uma "parede" imaginária
        if (solarSystem.position.x > 50 || solarSystem.position.x < -50) {
            systemDirection *= -1; // Inverte a direção
        }
    }
}

// Array para armazenar as órbitas
const orbits = [];

// Função para criar uma órbita
function createOrbit(radius, color = 0xffffff) {
    const orbitGeometry = new THREE.BufferGeometry();
    const points = [];

    // Gera os pontos do círculo
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        points.push(radius * Math.cos(angle), 0, radius * Math.sin(angle)); // (x, y, z)
    }

    // Adiciona os pontos à geometria
    orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

    // Material da linha
    const orbitMaterial = new THREE.LineBasicMaterial({ color });

    // Cria e retorna a linha
    return new THREE.Line(orbitGeometry, orbitMaterial);
}

// Cria as órbitas (inicialmente ocultas)
planets.forEach((planet, index) => {
    const orbit = createOrbit(planet.distance, 0x888888);
    orbit.visible = false; // Começa oculto
    scene.add(orbit);
    orbits.push(orbit); // Armazena no array para controle
});

// Função para alternar a visibilidade das órbitas
const toggleOrbitButton = document.getElementById('toggleOrbitButton');
let orbitsVisible = false;

// Salvar o estado inicial do sistema solar e da câmera
const initialCameraPosition = camera.position.clone();
const initialCameraTarget = controls.target.clone();
const initialSolarSystemPosition = solarSystem.position.clone();
let isBackground1 = true; // Estado inicial do plano de fundo
scene.background = spaceTexture1; // Define o fundo inicial

// Função para resetar o estado
function resetScene() {
    // Resetar a posição da câmera
    camera.position.copy(initialCameraPosition);
    controls.target.copy(initialCameraTarget);
    controls.update();

    // Resetar a posição do sistema solar
    solarSystem.position.copy(initialSolarSystemPosition);

    // Resetar as rotações dos planetas e órbitas
    planets.forEach(({ planet, orbit }) => {
        orbit.rotation.set(0, 0, 0);
        planet.rotation.set(0, 0, 0);
    });

    // Resetar o plano de fundo
    scene.background = spaceTexture1;
    isBackground1 = true;

    // Resetar estados
    speedMultiplier = 1;
    isAudioPlaying = false;
    isSystemMoving = false;
    audio.pause();
    audio.currentTime = 0; // Reinicia o áudio

    // Atualizar textos e ícones de botões
    audioToggle.style.backgroundImage = "url('assets/icons/volume_off.svg')";
    moveSystemButton.textContent = 'Move System';
    toggleOrbitButton.textContent = 'Show Orbits';

    // Resetar órbitas e grade, se necessário
    orbits.forEach(orbit => (orbit.visible = false));
    gridVisible = true;
    scene.add(depressedGrid);
}

// Evento para o botão de reset
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetScene);

// Variável de controle para o movimento
let isMoving = false; // Movimento desativo por padrão

// Botão para alternar o movimento
const toggleMovementButton = document.getElementById('toggleMovement');
toggleMovementButton.addEventListener('click', () => {
    isMoving = !isMoving; // Alterna o estado
    toggleMovementButton.textContent = isMoving ? 'Pause Movement' : 'Resume Movement';
});

// Loop de animação
function animate() {
    requestAnimationFrame(animate);

    // Controle de movimento dos planetas
    if (isMoving) {
        planets.forEach(({ planet, orbit, speed }) => {
            orbit.rotation.y += speed * speedMultiplier; // Translação
            planet.rotation.y += 0.02; // Rotação
        });
    }

    // Outros movimentos, se houver
    moveSolarSystem(); // Exemplo de movimento do sistema solar

    renderer.render(scene, camera);
}

// Inicializa a animação
animate();


// Evento de clique no botão para ativar/desativar asteroides e constelações
document.getElementById('toggleButton').addEventListener('click', () => {
    toggleAsteroids();
    toggleConstellations();
});

// Adicionar evento para alternar a visibilidade da grade
const toggleButton = document.getElementById('toggleButtonGrid');
toggleButton.addEventListener('click', () => {
    if (gridVisible) {
        scene.remove(depressedGrid); // Remove a grade da cena
    } else {
        scene.add(depressedGrid); // Adiciona a grade à cena
    }
    gridVisible = !gridVisible; // Alterna o estado
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

// Ativar e desativar audio
audioToggle.addEventListener('click', () => {
    if (isAudioPlaying) {
        audio.pause();
        audioToggle.style.backgroundImage = "url('assets/icons/volume_off.svg')"; // Atualiza para ícone de som desligado
    } else {
        audio.play();
        audioToggle.style.backgroundImage = "url('assets/icons/volume_up.svg')"; // Atualiza para ícone de som ligado
    }
    isAudioPlaying = !isAudioPlaying; // Alterna o estado do áudio
});

toggleOrbitButton.addEventListener('click', () => {
    orbitsVisible = !orbitsVisible; // Alterna o estado
    orbits.forEach(orbit => (orbit.visible = orbitsVisible)); // Alterna a visibilidade de todas as órbitas
    toggleOrbitButton.textContent = orbitsVisible ? 'Hide Orbits' : 'Show Orbits'; // Atualiza o texto do botão
});