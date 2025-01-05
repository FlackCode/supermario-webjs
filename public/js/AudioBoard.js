export default class AudioBoard {
    constructor() {
        this.buffers = new Map();
    }

    addAudio(name, buffer) {
        this.buffers.set(name, buffer);
    }

    playAudio(name, audioContext) {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.5; // setting volume lower for jumps and everything
        source.buffer = this.buffers.get(name);
        source.start(0);
    }
}
