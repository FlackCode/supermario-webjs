import Timer from "./Timer.js";
import { setupKeyboard } from "./input.js";
import Camera from "./Camera.js";
import { loadLevel } from "./loaders/level.js";
import { loadEntities } from "./entities.js";

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

Promise.all([
    loadEntities(),
    loadLevel("1-1")
]).then(([
    entity,
    level,
]) => {
    const camera = new Camera();
    
    const mario = entity.mario();
    mario.pos.set(64, 150);

    const goomba = entity.goomba();
    goomba.pos.x = 220;
    level.entities.add(goomba);

    const koopa = entity.koopa();
    koopa.pos.x = 260;
    level.entities.add(koopa);

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
