import InputRouter from "./InputRouter.js";
import Keyboard from "./KeyboardState.js";

export function setupKeyboard(window) {
    const input = new Keyboard();
    const router = new InputRouter();

    input.listenTo(window);
    
    ["Space", "ArrowUp", "KeyW"].forEach(inputName => {
        input.addMapping(inputName, keyState => {
            if (keyState) {
                router.route(entity => entity.jump.start());
            } else {
                router.route(entity => entity.jump.cancel());
            }
        });
    });
    ["KeyD", "ArrowRight"].forEach(keyName => {
        input.addMapping(keyName, keyState => {
            router.route(entity => entity.go.dir += keyState ? 1 : -1);
        });
    });
    ["KeyA", "ArrowLeft"].forEach(keyName => {
        input.addMapping(keyName, keyState => {
            router.route(entity => entity.go.dir += -keyState ? -1 : 1);
        });
    });
    input.addMapping("ShiftLeft", keyState => {
        router.route(entity => entity.turbo(keyState));
    })
    return router;
}
