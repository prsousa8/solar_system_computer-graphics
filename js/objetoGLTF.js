// GLTFLoaderModule.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function adicionarObjetoGLTF(scene, url, posicao, escala, rotacao = { x: 0, y: 0, z: 0 }) {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (gltf) => {
                const modelo = gltf.scene;

                // Configurando posição
                modelo.position.set(posicao.x, posicao.y, posicao.z);

                // Configurando escala
                modelo.scale.set(escala.x, escala.y, escala.z);

                // Configurando rotação inicial
                modelo.rotation.set(rotacao.x, rotacao.y, rotacao.z);

                // Adicionando à cena
                scene.add(modelo);

                console.log("Modelo GLTF carregado com sucesso:", url);

                // Retorna o modelo para animação no loop principal
                resolve(modelo);
            },
            (progress) => {
                console.log(`Progresso do carregamento do modelo: ${(progress.loaded / progress.total) * 100}%`);
            },
            (error) => {
                console.error("Erro ao carregar o modelo GLTF:", error);
                reject(error);
            }
        );
    });
}
