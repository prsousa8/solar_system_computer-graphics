import * as THREE from '../libraries/three.module.js';

// Array para armazenar as órbitas
export const orbits = [];

// Função para criar uma órbita
export function createOrbit(radius, color = 0xffffff) {
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

// Função para alternar a visibilidade das órbitas
export function toggleOrbitsVisibility(toggleOrbitButton, orbits) {
    let orbitsVisible = false;
    
    toggleOrbitButton.addEventListener('click', () => {
        orbitsVisible = !orbitsVisible; // Alterna o estado
        orbits.forEach(orbit => (orbit.visible = orbitsVisible)); // Alterna a visibilidade de todas as órbitas
        toggleOrbitButton.textContent = orbitsVisible ? 'Hide Orbits' : 'Show Orbits'; // Atualiza o texto do botão
    });
}
