import * as THREE from '../libraries/three.module.js';

// Variáveis globais para armazenar constelações e linhas
let constellations = [];
let constellationLines = [];

// Função para criar constelações
export function createConstellations(scene) {
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    // Exemplo de constelações mais distantes
    const starPositions1 = [
        new THREE.Vector3(10, 5, 20),
        new THREE.Vector3(15, 10, 25),
        new THREE.Vector3(20, 15, 30)
    ];

    const starPositions2 = [
        new THREE.Vector3(-10, -15, 20),
        new THREE.Vector3(-15, -10, 25),
        new THREE.Vector3(-20, -5, 30)
    ];

    // Adicionando as estrelas
    const stars1 = createStarsFromPositions(starPositions1, scene);
    const stars2 = createStarsFromPositions(starPositions2, scene);

    // Adicionando linhas para representar as constelações
    addLinesForConstellation(starPositions1, scene);
    addLinesForConstellation(starPositions2, scene);

    // Armazenar estrelas e linhas
    constellations.push(...stars1, ...stars2);
}

// Função para criar estrelas a partir de posições
function createStarsFromPositions(positions, scene) {
    const stars = [];
    positions.forEach(position => {
        const geometry = new THREE.SphereGeometry(0.5, 8, 8);
        const star = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
        star.position.set(position.x, position.y, position.z);
        scene.add(star);
        stars.push(star);
    });
    return stars;
}

// Função para adicionar linhas entre as estrelas para formar as constelações
function addLinesForConstellation(positions, scene) {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
    let line;

    for (let i = 0; i < positions.length - 1; i++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([positions[i], positions[i + 1]]);
        line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);
        constellationLines.push(line);
    }
}

// Função para alternar a visibilidade das constelações e suas linhas
export function toggleConstellations() {
    constellations.forEach(star => {
        star.visible = !star.visible;
    });
    
    constellationLines.forEach(line => {
        line.visible = !line.visible;
    });
}