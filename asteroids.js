import * as THREE from './libraries/three.module.js';

// Variáveis globais para armazenar asteroides
let asteroids = [];

// Função para criar asteroides
export function createAsteroids(scene) {
    const textureLoader = new THREE.TextureLoader();

    // Adiciona alguns asteroides à cena fora da área do sistema solar
    const asteroidTextures = [
        'assets/textures/stone-texture.jpg',
        'assets/textures/stone-texture.jpg',
        'assets/textures/stone-texture.jpg',
        'assets/textures/stone-texture.jpg',
        'assets/textures/stone-texture.jpg',
        'assets/textures/stone-texture.jpg',
        'assets/textures/stone-texture.jpg',
        'assets/textures/stone-texture.jpg',
        'assets/textures/stone-texture.jpg',
        'assets/textures/stone-texture.jpg'
    ];

    const positions = [
        new THREE.Vector3(150, 0, 200),  // Asteroide longe do sistema solar
        new THREE.Vector3(-200, 20, 250),  // Asteroide distante
        new THREE.Vector3(250, -50, 300),  // Outro asteroide mais distante
        new THREE.Vector3(-100, 10, -100),  // Asteroide no quadrante negativo
        new THREE.Vector3(300, 60, -150),   // Asteroide no quadrante oposto
        new THREE.Vector3(-300, -60, -150),   // Asteroide no quadrante oposto
        new THREE.Vector3(-160, 60, -150),   // Asteroide no quadrante oposto
        new THREE.Vector3(300, -60, -150),   // Asteroide no quadrante oposto
        new THREE.Vector3(300, 60, 150),   // Asteroide no quadrante oposto
        new THREE.Vector3(300, 90, -150),   // Asteroide no quadrante oposto
    ];

    asteroidTextures.forEach((texturePath, index) => {
        const geometry = new THREE.SphereGeometry(2, 12, 12);
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load(texturePath),
            roughness: 0.8,
            metalness: 0.2
        });

        const asteroid = new THREE.Mesh(geometry, material);
        asteroid.position.set(positions[index].x, positions[index].y, positions[index].z);
        scene.add(asteroid);
        asteroids.push(asteroid);
    });
}

// Função para alternar a visibilidade dos asteroides
export function toggleAsteroids() {
    asteroids.forEach(asteroid => {
        asteroid.visible = !asteroid.visible;
    });
}