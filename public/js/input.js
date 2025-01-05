import InputRouter from "./InputRouter.js";
import Keyboard from "./KeyboardState.js";
import Go from "./traits/Go.js";
import Jump from "./traits/Jump.js";

export function setupKeyboard(window) {
    const input = new Keyboard();
    const router = new InputRouter();

    input.listenTo(window);
    
    ["Space", "ArrowUp", "KeyW"].forEach(inputName => {
        input.addMapping(inputName, keyState => {
            if (keyState) {
                router.route(entity => entity.traits.get(Jump).start());
            } else {
                router.route(entity => entity.traits.get(Jump).cancel());
            }
        });
    });
    ["KeyD", "ArrowRight"].forEach(keyName => {
        input.addMapping(keyName, keyState => {
            router.route(entity => entity.traits.get(Go).dir += keyState ? 1 : -1);
        });
    });
    ["KeyA", "ArrowLeft"].forEach(keyName => {
        input.addMapping(keyName, keyState => {
            router.route(entity => entity.traits.get(Go).dir += -keyState ? -1 : 1);
        });
    });
    input.addMapping("ShiftLeft", keyState => {
        router.route(entity => entity.turbo(keyState));
    })
    return router;
}
