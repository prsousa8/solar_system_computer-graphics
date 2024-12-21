import * as THREE from '../libraries/three.module.js';


// Função para dar zoom em um planeta
export function zoomToPlanet(planet, camera, controls) {
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

// Função para resetar a câmera para a visão inicial
export function resetCamera(camera, controls) {
    camera.position.set(0, 20, 100);
    controls.target.set(0, 0, 0);
    controls.update();
}

// Função para mapear teclas a ações de zoom e reset
export function setupKeyboardInteractions(planets, camera, controls) {
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case '1': // Zoom em Mercúrio
                zoomToPlanet(planets[0].planet, camera, controls);
                break;
            case '2': // Zoom em Vênus
                zoomToPlanet(planets[1].planet, camera, controls);
                break;
            case '3': // Zoom na Terra
                zoomToPlanet(planets[2].planet, camera, controls);
                break;
            case '4': // Zoom em Marte
                zoomToPlanet(planets[3].planet, camera, controls);
                break;
            case '5': // Zoom em Júpiter
                zoomToPlanet(planets[4].planet, camera, controls);
                break;
            case '6': // Zoom em Saturno
                zoomToPlanet(planets[5].planet, camera, controls);
                break;
            case '7': // Zoom em Urano
                zoomToPlanet(planets[6].planet, camera, controls);
                break;
            case '8': // Zoom em Netuno
                zoomToPlanet(planets[7].planet, camera, controls);
                break;
            case 'R': // Reset da câmera para visão inicial
                resetCamera(camera, controls);
                break;
        }
    });
}
