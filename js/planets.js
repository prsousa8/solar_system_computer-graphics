import * as THREE from '../libraries/three.module.js';


// Modularização da função createTail
export function createTail(scene, planet, color, trailLength) {
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(trailLength * 3); // Cada partícula tem (x, y, z)
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color,
        size: 0.1, // Tamanho das partículas
        transparent: true,
        opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    return {
        particles,
        update: function () {
            const positions = particles.geometry.attributes.position.array;

            // Move as partículas existentes para trás no buffer
            for (let i = positions.length - 3; i > 2; i--) {
                positions[i] = positions[i - 3]; // Move x
                positions[i + 1] = positions[i - 2]; // Move y
                positions[i + 2] = positions[i - 1]; // Move z
            }

            // Atualiza a nova partícula com posição aleatória dentro do raio
            const worldPosition = new THREE.Vector3();
            planet.getWorldPosition(worldPosition);
            const radiusTail = 1.5;
            const angle = Math.random() * Math.PI * 2; // Ângulo aleatório em torno do planeta
            const distance = Math.random() * radiusTail; // Distância aleatória até o raio máximo
            const offsetX = Math.cos(angle) * distance;
            const offsetY = (Math.random() - 0.5) * radiusTail * 0.5; // Aleatório em altura
            const offsetZ = Math.sin(angle) * distance;

            positions[0] = worldPosition.x + offsetX;
            positions[1] = worldPosition.y + offsetY;
            positions[2] = worldPosition.z + offsetZ;

            particles.geometry.attributes.position.needsUpdate = true;
        },
    };
}

// Função createPlanet
export function createPlanet(scene, textureLoader, size, texturePath, distance, speed, satellites = [], color) {

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
    satellites.forEach(({ size, distance}) => {
        const satelliteGeometry = new THREE.SphereGeometry(size, 16, 16);
        const satelliteMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);

        const satelliteOrbit = new THREE.Object3D();
        satelliteOrbit.add(satellite);
        planet.add(satelliteOrbit);

        satellite.position.x = distance;
    });

    const tail = createTail(scene, planet, color, 200);

    return { planet, orbit, speed, distance, tail };
}

