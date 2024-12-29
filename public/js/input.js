import Keyboard from "./KeyboardState.js";

export function setupKeyboard(entity) {
    const input = new Keyboard();
    ["Space", "ArrowUp"].forEach(inputName => {
        input.addMapping(inputName, keyState => {
            if (keyState) {
                entity.jump.start();
            } else {
                entity.jump.cancel();
            }
        });
    })
    input.addMapping("ArrowRight", keyState => {
        entity.go.dir = keyState;
    });
    input.addMapping("ArrowLeft", keyState => {
        entity.go.dir = -keyState;
    });
    return input;
}
