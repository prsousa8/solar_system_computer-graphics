import * as THREE from '../libraries/three.module.js';

export function createDepressedGrid(size = 200, divisions = 50, depthFactor = 50, color = 0x00ff00) {
    // PlaneGeometry com número de divisões ajustado
    const planeGeometry = new THREE.PlaneGeometry(size, size, divisions, divisions);

    // Deforma a geometria para criar uma depressão
    planeGeometry.vertices.forEach((vertex) => {
        const distance = Math.sqrt(vertex.x ** 2 + vertex.y ** 2); // Distância do centro
        vertex.z = -Math.exp(-distance / 50) * depthFactor; // Função exponencial para suavidade
    });
    planeGeometry.computeVertexNormals(); // Recalcula normais para iluminação correta

    // Criação do material para a grade
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: color, // Cor da grade
        wireframe: true, // Ativa o modo de malha para mostrar linhas
    });

    // Criação da malha para representar a grade
    const depressedGrid = new THREE.Mesh(planeGeometry, wireframeMaterial);
    depressedGrid.rotation.x = -Math.PI / 2; // Alinha a grade ao plano XY

    return depressedGrid;
}
