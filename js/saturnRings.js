import * as THREE from '../libraries/three.module.js';


export function createColoredRing(innerRadius, outerRadius, color) {
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true, // Adicionando transparência
        opacity: 0.8, // Definindo o nível de opacidade
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2; // Rotação para ficar paralelo ao plano XY
    return ring;
}

export function createSaturnRings(planet) {
    const rings = [
        createColoredRing(3.5, 4, 0x2E2A2A),  // Anel D (Preto com tom marrom escuro)
        createColoredRing(4, 4.5, 0x6E4B3A),  // Anel C (Marrom escuro)
        createColoredRing(4.5, 5, 0xA67C52),  // Anel B (Marrom médio)
        createColoredRing(5, 5.4, 0xD2B48C),  // Anel A (Bege / Marrom claro)
        createColoredRing(5.4, 5.8, 0x8B4513), // Anel F (Marrom escuro)
        createColoredRing(5.8, 6.2, 0x3E2723), // Anel G (Marrom muito escuro / quase preto)
        createColoredRing(6.2, 6.6, 0x1C1C1C), // Anel E (Preto)
        createColoredRing(6.6, 7, 0x4B2F2F),  // Anel extra 1 (Marrom escuro)
        createColoredRing(7, 7.4, 0x5D4037),  // Anel extra 2 (Marrom médio escuro)
        createColoredRing(7.4, 7.8, 0x3E2723), // Anel extra 3 (Marrom muito escuro / quase preto)
    ];

    rings.forEach((ring) => planet.add(ring));
}
