<div align="center">
  <h1> Simulação do Sistema Solar em Computação Gráfica</h1>
</div>

<p align="justify">Este projeto consiste no desenvolvimento de uma simulação interativa do Sistema Solar utilizando técnicas de computação gráfica. O objetivo é criar uma representação visualmente realista dos planetas, luas, e do Sol, permitindo a visualização de suas órbitas, tamanhos relativos e movimentos.</p>


## Site Sistema Solar 🤩
<p align="justify"> Neste link você irá acessar e interagir com o site</p>
- Link: <a href='#'>Site Sistema Solar</a>

## Tecnologias e Ferramentas Utilizadas 🔧

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="30" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="30" alt="css3 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" height="30" alt="javascript logo"/>
  <img width="12" />
  
Para criar um ambiente adequado de desenvolvimento Web, executamos os seguintes passos


### Editor de código

Escolha um editor de código de sua preferência. Algumas opções populares incluem o Visual Studio Code, Sublime Text, Atom, entre outros. Você pode baixar e instalar o Visual Studio Code em https://code.visualstudio.com/.


### Instalação da biblioteca ThreeJS


Three.js é uma biblioteca JavaScript usada para criar e mostrar gráficos 3D animados em um navegador web. 

Para trabalhar com a biblioteca **Three.js**, é necessário instalar alguns pacotes ou incluir os arquivos necessários no seu projeto. A seguir, explico as opções para instalar e usar o Three.js em um projeto:


#### 1. **Usar o CDN**
Você pode incluir o Three.js diretamente em seu projeto HTML através de um link CDN. Este é o método mais simples para quem quer começar rapidamente, sem gerenciar dependências:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js Example</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.min.js"></script>
  <script>
    // Código Three.js aqui
  </script>
</body>
</html>
```


#### 2. **Instalar via npm**
Se estiver usando um gerenciador de pacotes como o **npm** (para projetos estruturados com Node.js), instale o Three.js com o seguinte comando:

```bash
npm install --save three
```
Em seguida, instale também o Vite:

```bash
npm install --save-dev vite
```
Depois, importe o Three.js no seu código JavaScript:

```javascript
import * as THREE from 'three';

// Exemplo de criação de uma cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

#### 3. **Baixar os Arquivos**
Outra alternativa é baixar manualmente os arquivos da biblioteca no [site oficial do Three.js](https://threejs.org/) ou do repositório no GitHub. Coloque os arquivos em uma pasta no seu projeto e os referencie no HTML:

```html
<script src="caminho/para/three.min.js"></script>
```


## Executando o Projeto ⏳

Para executar o projeto, realize as seguintes etapas:

### Clone do repositório

- Verifique se o git está instalado na sua máquina
- Digite o comando via terminal

~~~
git clone https://github.com/prsousa8/solar_system_computer-graphics.git
~~~


### Execução

Utilize a extensão Live Server do VS Code para rodar o projeto localmente caso tenha baixado as bibliotecas diretamente do site ThreeJs. Mas caso tenha instalado o Vite, execute o seguinte comando no terminal:

```bash
npx vite
```

## Colaboradores

<table align="center">
<tr>
  <td align="center"><a href="https://github.com/caua-braga-de-lima"><img src="assets/equipe/caua.jpeg" width="70%;" alt="Cauã Braga"/><br /><sub><b>Cauã Braga</b></sub></a><br/></td>
  <td align="center"><a href="https://github.com/Geovanarsouza"><img src="assets/equipe/geo.jpg" width="70%;" alt="Geovana Rodrigues"/><br /><sub><b>Geovana Rodrigues</b></sub></a><br/></td>
  <td align="center"><a href="https://github.com/prsousa8"><img src="assets/equipe/paulo.jpeg" width="70%;" alt="Paulo Ricardo"/><br /><sub><b>Paulo Ricardo</b></sub></a><br/></td>
  <td align="center"><a href="https://github.com/Raquel-Luis-Duarte"><img src="assets/equipe/raquel.jpeg" width="70%;" alt="Raquel Duarte"/><br /><sub><b>Raquel Duarte</b></sub></a><br/></td>
  <td align="center"><a href="https://github.com/Samuel-C-C"><img src="assets/equipe/samuel.jpeg" width="70%;" alt="Samuel Camilo"/><br /><sub><b>Samuel Camilo</b></sub></a><br/></td>
  <td align="center"><a href="https://github.com/YasminEmily"><img src="assets/equipe/yasmin.jpeg" width="70%;" alt="Yasmin Emily"/><br /><sub><b>Yasmin Emily</b></sub></a><br/></td>
</tr>
</table>