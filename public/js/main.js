import { loadMario } from "./entities/Mario.js";
import Timer from "./Timer.js";
import { setupKeyboard } from "./input.js";
import Camera from "./Camera.js";
import { loadLevel } from "./loaders/level.js";
import { loadGoomba } from "./entities/Goomba.js";

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

Promise.all([
    loadMario(),
    loadGoomba(),
    loadLevel("1-1")
]).then(([
    createMario,
    createGoomba,
    level,
]) => {
    const camera = new Camera();
    
    const mario = createMario();
    mario.pos.set(64, 150);

    const goomba = createGoomba();
    goomba.pos.x = 220;
    level.entities.add(goomba);

    level.entities.add(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        level.update(deltaTime);

        if (mario.pos.x > 100) {
            camera.pos.x = mario.pos.x - 100;
        } // camera following mario

        level.comp.draw(context, camera);
    }
    timer.start();
});
