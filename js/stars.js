import * as THREE from '../libraries/three.module.js';

// Função para criar N partículas distribuídas aleatoriamente entre um raio inferior e superior
export function createRandomParticles(scene, numParticles, innerRadius, outerRadius) {
    const textureLoader = new THREE.TextureLoader();
    const particles = [];

    // Loop para criar as partículas
    for (let i = 0; i < numParticles; i++) {
        // Calcula um raio aleatório entre o raio inferior e o raio superior
        const radius = Math.random() * (outerRadius - innerRadius) + innerRadius;

        // Calcula um ângulo aleatório para a distribuição em torno de uma esfera
        const theta = Math.random() * Math.PI * 2; // Ângulo azimutal (em torno da esfera)
        const phi = Math.random() * Math.PI; // Ângulo polar (de cima para baixo)

        // Calcula as coordenadas cartesianas a partir dos ângulos e do raio
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        // Criação de uma partícula (esfera)
        const geometry = new THREE.SphereGeometry(0.5, 8, 8); // Tamanho da partícula
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(Math.random(), Math.random(), Math.random()), // Cores aleatórias
            roughness: 0.8,
            metalness: 0.2
        });

        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(x, y, z); // Define a posição da partícula

        // Adiciona a partícula à cena e à lista
        scene.add(particle);
        particles.push(particle);
    }

    // Retorna a lista de partículas
    return particles;
}
