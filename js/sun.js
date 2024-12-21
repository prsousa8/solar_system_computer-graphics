import * as THREE from '../libraries/three.module.js';

export function createSun(scene, textureLoader) {
    // Cria o Sol
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
        emissive: 0xffff00, // Cor emissiva (brilho)
        emissiveIntensity: 2, // Intensidade do brilho
        emissiveMap: textureLoader.load('assets/textures/sun.jpg') // Textura para controlar a emissão
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    return sun;
}