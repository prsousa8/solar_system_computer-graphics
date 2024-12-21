// ParticleBeam.js
import * as THREE from '../libraries/three.module.js';

let particleBeam = null;

export function createParticleBeam(scene, start, direction, color, particleCount, beamRadius, sourceRadius) {
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * beamRadius;
        const sourceOffset = Math.random() * sourceRadius;

        const offsetX = radius * Math.cos(angle) + sourceOffset * (Math.random() - 0.5);
        const offsetY = radius * Math.sin(angle) + sourceOffset * (Math.random() - 0.5);
        const offsetZ = 0;

        positions[i * 3] = start.x + offsetX;
        positions[i * 3 + 1] = start.y + offsetY;
        positions[i * 3 + 2] = start.z + offsetZ;

        velocities[i * 3] = direction.x + (Math.random() - 0.5) * 0.1;
        velocities[i * 3 + 1] = direction.y + (Math.random() - 0.5) * 0.1;
        velocities[i * 3 + 2] = direction.z + (Math.random() - 0.5) * 0.1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
        color: color,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
    });

    particleBeam = new THREE.Points(particleGeometry, material);
    scene.add(particleBeam);
}

export function animateParticleBeam(radius) {
    if (!particleBeam) return;

    const positions = particleBeam.geometry.attributes.position.array;
    const velocities = particleBeam.geometry.attributes.velocity.array;

    for (let i = 0; i < velocities.length / 3; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        const distance = Math.sqrt(
            positions[i * 3] ** 2 +
            positions[i * 3 + 1] ** 2 +
            positions[i * 3 + 2] ** 2
        );

        if (distance <= radius) {
            const normalX = positions[i * 3] / distance;
            const normalY = positions[i * 3 + 1] / distance;
            const normalZ = positions[i * 3 + 2] / distance;

            velocities[i * 3] += normalX * 0.1;
            velocities[i * 3 + 1] += normalY * 0.1;
            velocities[i * 3 + 2] += normalZ * 0.1;
        }
    }

    particleBeam.geometry.attributes.position.needsUpdate = true;
}

export function resetParticleBeam(scene) {
    if (particleBeam) {
        scene.remove(particleBeam);
        particleBeam.geometry.dispose();
        particleBeam.material.dispose();
        particleBeam = null;
    }
}
