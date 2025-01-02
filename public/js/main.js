import Timer from "./Timer.js";
import { setupKeyboard } from "./input.js";
import Camera from "./Camera.js";
import { createLevelLoader } from "./loaders/level.js";
import { loadEntities } from "./entities.js";
import Entity from "./Entity.js";
import PlayerController from "./traits/PlayerController.js";
import { loadFont } from "./loaders/font.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { createAudioLoader } from "./loaders/audio.js";

function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerEnv.addTrait(playerControl);
    playerControl.setPlayer(playerEntity);
    playerControl.checkpoint.set(64, 64)
    return playerEnv;
}

class AudioBoard {
    constructor(context) {
        this.context = context;
        this.buffers = new Map();
    }

    addAudio(name, buffer) {
        this.buffers.set(name, buffer);
    }

    playAudio(name) {
        const source = this.context.createBufferSource();
        source.connect(this.context.destination);
        source.buffer = this.buffers.get(name);
        source.start(0);
    }
}

async function main(canvas) {
    const context = canvas.getContext("2d");
    const [entityFactory, font] = await Promise.all([
        loadEntities(),
        loadFont()
    ]);

    const audioContext = new AudioContext();
    const audioBoard = new AudioBoard(audioContext);
    const loadAudio = createAudioLoader(audioContext);
    loadAudio("audio/jump.ogg").then(buffer => {
        audioBoard.addAudio("jmup", buffer);
    })

    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel("1-1");
    const camera = new Camera();
    
    const mario = entityFactory.mario();

    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);

    level.comp.layers.push(createDashboardLayer(font, playerEnv));

    const input = setupKeyboard(mario);
    input.listenTo(window);

    const gameContext = {
        audioBoard,
        deltaTime: null,
    }

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        gameContext.deltaTime = deltaTime;
        level.update(gameContext);

        if (mario.pos.x > 100) {
            camera.pos.x = Math.max(0, mario.pos.x - 100);
        }

        level.comp.draw(context, camera);
    }
    timer.start();
}

const canvas = document.getElementById("screen");
main(canvas);
