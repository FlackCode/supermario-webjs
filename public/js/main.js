import Timer from "./Timer.js";
import { setupKeyboard } from "./input.js";
import { createLevelLoader } from "./loaders/level.js";
import { loadEntities } from "./entities.js";
import { loadFont } from "./loaders/font.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { createPlayer, createPlayerEnv } from "./player.js";
import SceneRunner from "./SceneRunner.js";
import { createPlayerProgressLayer } from "./layers/player-progress.js";
import CompositionScene from "./CompositionScene.js";
import Scene from "./Scene.js";
import { createColorLayer } from "./layers/color.js";

async function main(canvas) {
    const videoContext = canvas.getContext("2d");
    const audioContext = new AudioContext();
    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext),
        loadFont()
    ]);

    const loadLevel = await createLevelLoader(entityFactory);

    const sceneRunner = new SceneRunner();
    const mario = createPlayer(entityFactory.mario());
    mario.player.name = "MARIO";
    
    const inputRouter = setupKeyboard(window);
    inputRouter.addReceiver(mario);

    async function runLevel(name) {
        const level = await loadLevel(name);

        level.entities.add(mario);

        const playerEnv = createPlayerEnv(mario);
        level.entities.add(playerEnv);

        const waitScreen = new CompositionScene();
        waitScreen.comp.layers.push(createColorLayer("#000"));
        //waitScreen.comp.layers.push(createDashboardLayer(font, level));
        waitScreen.comp.layers.push(createPlayerProgressLayer(font, level));
        sceneRunner.addScene(waitScreen);

        level.comp.layers.push(createDashboardLayer(font, level));
        sceneRunner.addScene(level);

        sceneRunner.runNext();
    }

    const gameContext = {
        audioContext,
        videoContext,
        entityFactory,
        deltaTime: null,
    }

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        gameContext.deltaTime = deltaTime;
        sceneRunner.update(gameContext);
    }
    timer.start();
    runLevel("1-2");
}

const canvas = document.getElementById("screen");

const start = () => {
    window.removeEventListener('click', start);
    main(canvas);
};

window.addEventListener('click', start);
