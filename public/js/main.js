import Timer from "./Timer.js";
import { setupKeyboard } from "./input.js";
import { createLevelLoader } from "./loaders/level.js";
import { loadEntities } from "./entities.js";
import { loadFont } from "./loaders/font.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { makePlayer, findPlayers, bootstrapPlayer, resetPlayer } from "./player.js";
import SceneRunner from "./SceneRunner.js";
import { createPlayerProgressLayer } from "./layers/player-progress.js";
import { createColorLayer } from "./layers/color.js";
import Level from "./Level.js";
import TimedScene from "./TimedScene.js";
import Scene from "./Scene.js";
import { createTextLayer } from "./layers/text.js";
import { createCollisionLayer } from "./layers/collision.js";
import Pipe, { connectEntity } from "./traits/Pipe.js";

const triggerState = {
    inTriggerZone: false,
    currentTriggerSpec: null,
    enterPressed: false
};

async function main(canvas) {
    const videoContext = canvas.getContext("2d");
    const audioContext = new AudioContext();
    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext),
        loadFont()
    ]);
    const loadLevel = await createLevelLoader(entityFactory);

    const sceneRunner = new SceneRunner();

    const mario = entityFactory.mario();
    makePlayer(mario, "MARIO");

    const inputRouter = setupKeyboard(window, triggerState);
    inputRouter.addReceiver(mario);

    function createLoadingScreen(name) {
        const scene = new Scene();
        scene.comp.layers.push(createColorLayer('#000'));
        scene.comp.layers.push(createTextLayer(font, `Loading ${name}...`));
        return scene;
    }

    async function setupLevel(name) {
        const loadingScreen = createLoadingScreen(name);
        sceneRunner.addScene(loadingScreen);
        sceneRunner.runNext();

        await new Promise(resolve => setTimeout(resolve, 1000));

        const level = await loadLevel(name);
        bootstrapPlayer(mario, level);

        level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
            if (spec.type === "goto" && triggerState.enterPressed) {
                for (const _ of findPlayers(touches)) {
                    triggerState.inTriggerZone = true;
                    triggerState.currentTriggerSpec = spec;
                    triggerState.enterPressed = false;
                    startWorld(spec.name);
                    return;
                }
            }
        });

        level.events.listen(Pipe.EVENT_PIPE_COMPLETE, async pipe => {
            if (pipe.props.goesTo) {
                const nextLevel = await setupLevel(pipe.props.goesTo.name);
                sceneRunner.addScene(nextLevel);
                sceneRunner.runNext();
                if (pipe.props.backTo) {
                    nextLevel.events.listen(Pipe.EVENT_PIPE_COMPLETE, async () => {
                        const level = await setupLevel(name);
                        let foundExitPipe = null;
                        for (const entity of level.entities) {
                            if (entity.id === pipe.props.backTo) {
                                foundExitPipe = entity;
                            }
                        }
                        if (foundExitPipe) {
                            connectEntity(foundExitPipe, mario);
                        } else {
                            console.error("Exit pipe not found:", pipe.props.backTo);
                        }
                        sceneRunner.addScene(level);
                        sceneRunner.runNext();
                    });
                } else {
                    level.events.emit(Level.EVENT_COMPLETE);
                }
            }
        });

        //level.comp.layers.push(createCollisionLayer(level));

        const dashboardLayer = createDashboardLayer(font, mario);
        level.comp.layers.push(dashboardLayer);

        return level;
    }

    async function startWorld(name) {
        triggerState.inTriggerZone = false;
        triggerState.currentTriggerSpec = null;

        const level = await setupLevel(name);
        resetPlayer(mario, name);

        const playerProgressLayer = createPlayerProgressLayer(font, level);
        const dashboardLayer = createDashboardLayer(font, mario);

        const waitScreen = new TimedScene();
        waitScreen.countDown = 0;
        waitScreen.comp.layers.push(createColorLayer('#000'));
        waitScreen.comp.layers.push(dashboardLayer);
        waitScreen.comp.layers.push(playerProgressLayer);

        sceneRunner.addScene(waitScreen);
        sceneRunner.addScene(level);
        sceneRunner.runNext();
    }

    const gameContext = {
        audioContext,
        videoContext,
        entityFactory,
        deltaTime: null,
        tick: 0,
    }

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        gameContext.tick++;
        gameContext.deltaTime = deltaTime;
        sceneRunner.update(gameContext);
    }
    timer.start();
    startWorld("1-2");
}

const canvas = document.getElementById("screen");

const start = () => {
    window.removeEventListener('click', start);
    main(canvas);
};

window.addEventListener('click', start);
