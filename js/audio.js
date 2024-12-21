// Lógica de áudio
export function toggleAudio() {
    const audio = new Audio('assets/audio/audio.mp3'); // Substitua pelo caminho correto do seu áudio
    audio.loop = true; // O áudio irá repetir continuamente

    // Botão para ativar/desativar áudio
    const audioToggle = document.getElementById('audioToggle');
    let isAudioPlaying = false; // Estado inicial do áudio

    audioToggle.addEventListener('click', () => {
        if (isAudioPlaying) {
            audio.pause();
            audioToggle.style.backgroundImage = "url('assets/icons/volume_off.svg')"; // Atualiza para ícone de som desligado
        } else {
            audio.play();
            audioToggle.style.backgroundImage = "url('assets/icons/volume_up.svg')"; // Atualiza para ícone de som ligado
        }
        isAudioPlaying = !isAudioPlaying; // Alterna o estado do áudio
    });
}
