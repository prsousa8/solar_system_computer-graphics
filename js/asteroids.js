import * as THREE from '../libraries/three.module.js';

// Variáveis globais para armazenar asteroides
let asteroids = [];

// Função para criar asteroides no anel
export function createAsteroids(scene) {
    const textureLoader = new THREE.TextureLoader();

    // Define o número de asteroides e o raio do anel
    const numAsteroids = 100;
    const radius = 200;

    // Adiciona os asteroides ao anel
    for (let i = 0; i < numAsteroids; i++) {
        // Calcula uma posição aleatória ao longo da circunferência do anel
        const angle = Math.random() * Math.PI * 2; // Aleatório entre 0 e 2*PI
        const x = radius * Math.cos(angle); // Posição no eixo X
        const z = radius * Math.sin(angle); // Posição no eixo Z

        // Aleatoriza um pouco a posição Y para dar mais variedade
        const y = Math.random() * 10 - 5; // Posição aleatória entre -5 e 5 no eixo Y

        // Carrega a textura dos asteroides
        const texturePath = 'assets/textures/stone-texture.jpg';
        const geometry = new THREE.SphereGeometry(2, 12, 12);
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load(texturePath),
            roughness: 0.8,
            metalness: 0.2
        });

        // Cria o asteroide e define a sua posição
        const asteroid = new THREE.Mesh(geometry, material);
        asteroid.position.set(x, y, z);

        // Adiciona o asteroide à cena
        scene.add(asteroid);
        asteroids.push(asteroid);
    }
}

// Função para alternar a visibilidade dos asteroides
export function toggleAsteroids() {
    asteroids.forEach(asteroid => {
        asteroid.visible = !asteroid.visible;
    });
}
