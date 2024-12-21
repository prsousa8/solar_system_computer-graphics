// ParticleSphere.js
import * as THREE from '../libraries/three.module.js';

let particleSphere = null;

export function createDynamicParticleSphere(scene, radius, color, particleCount) {
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius + (Math.random() - 0.5) * 10;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        velocities[i * 3] = (Math.random() - 0.5) * 0.1;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: color,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
    });

    particleSphere = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSphere);
}

export function animateParticles() {
    if (!particleSphere) return;

    const positions = particleSphere.geometry.attributes.position.array;
    const velocities = particleSphere.geometry.attributes.velocity.array;

    for (let i = 0; i < velocities.length / 3; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        const distance = Math.sqrt(
            positions[i * 3] ** 2 +
            positions[i * 3 + 1] ** 2 +
            positions[i * 3 + 2] ** 2
        );

        if (distance > 110 || distance < 90) {
            velocities[i * 3] *= -1;
            velocities[i * 3 + 1] *= -1;
            velocities[i * 3 + 2] *= -1;
        }
    }

    particleSphere.geometry.attributes.position.needsUpdate = true;
}

export function resetParticleSphere(scene) {
    if (particleSphere) {
        scene.remove(particleSphere);
        particleSphere.geometry.dispose();
        particleSphere.material.dispose();
        particleSphere = null;
    }
}
