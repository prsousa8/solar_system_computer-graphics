import * as THREE from '../libraries/three.module.js';

// Variáveis de controle do movimento do sistema solar
let isSystemMoving = false; // Inicialmente parado
let systemDirection = 1; // Define direção inicial (1 = direita, -1 = esquerda)
const moveSystemButton = document.getElementById('moveSystem');

// Criação do grupo para o sistema solar (agrupa planetas e o sol)
export const solarSystem = new THREE.Group();

// Função para inicializar o sistema solar com sol e planetas
export function initializeSolarSystem(scene, sun, planets) {
    scene.add(solarSystem);

    // Adiciona o Sol e os planetas ao grupo do sistema solar
    solarSystem.add(sun);
    planets.forEach(({ orbit }) => solarSystem.add(orbit));
}

// Função para configurar o botão de movimento do sistema solar
export function setupMoveSystemButton() {
    moveSystemButton.addEventListener('click', () => {
        isSystemMoving = !isSystemMoving; // Alterna o estado de movimento
        moveSystemButton.textContent = isSystemMoving ? 'Stop System' : 'Move System';
    });
}

// Função para movimentar o sistema solar
export function moveSolarSystem() {
    if (isSystemMoving) {
        solarSystem.position.x += 0.05 * systemDirection; // Move em X

        // Altera a direção se atingir uma "parede" imaginária
        if (solarSystem.position.x > 50 || solarSystem.position.x < -50) {
            systemDirection *= -1; // Inverte a direção
        }
    }
}
