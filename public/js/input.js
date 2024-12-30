import Keyboard from "./KeyboardState.js";

export function setupKeyboard(mario) {
    const input = new Keyboard();
    ["Space", "ArrowUp", "KeyW"].forEach(inputName => {
        input.addMapping(inputName, keyState => {
            if (keyState) {
                mario.jump.start();
            } else {
                mario.jump.cancel();
            }
        });
    });
    ["KeyD", "ArrowRight"].forEach(keyName => {
        input.addMapping(keyName, keyState => {
            mario.go.dir += keyState ? 1 : -1;
        });
    });
    ["KeyA", "ArrowLeft"].forEach(keyName => {
        input.addMapping(keyName, keyState => {
            mario.go.dir += -keyState ? -1 : 1;
        });
    });
    input.addMapping("ShiftLeft", keyState => {
        mario.turbo(keyState);
    })
    return input;
}
