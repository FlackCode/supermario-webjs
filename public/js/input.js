import Keyboard from "./KeyboardState.js";

export function setupKeyboard(entity) {
    const input = new Keyboard();
    ["Space", "ArrowUp", "KeyW"].forEach(inputName => {
        input.addMapping(inputName, keyState => {
            if (keyState) {
                entity.jump.start();
            } else {
                entity.jump.cancel();
            }
        });
    });
    ["KeyD", "ArrowRight"].forEach(keyName => {
        input.addMapping(keyName, keyState => {
            entity.go.dir += keyState ? 1 : -1;
        });
    });
    ["KeyA", "ArrowLeft"].forEach(keyName => {
        input.addMapping(keyName, keyState => {
            entity.go.dir += -keyState ? -1 : 1;
        });
    });
    return input;
}
