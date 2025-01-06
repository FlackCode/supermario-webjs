import InputRouter from "./InputRouter.js";
import Keyboard from "./KeyboardState.js";
import Go from "./traits/Go.js";
import Jump from "./traits/Jump.js";
import PipeTraveller from "./traits/PipeTraveller.js";

export function setupKeyboard(window, triggerState) {
    const input = new Keyboard();
    const router = new InputRouter();

    input.listenTo(window);
    
    ["Space", "ArrowUp"].forEach(inputName => {
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
    input.addMapping("KeyS", keyState => {
        router.route(entity => {
            entity.traits.get(PipeTraveller).direction.y += keyState ? 1 : -1;
        });
    });
    input.addMapping("KeyW", keyState => {
        router.route(entity => {
            entity.traits.get(PipeTraveller).direction.y += keyState ? -1 : 1;
        });
    });
    input.addMapping("ShiftLeft", keyState => {
        router.route(entity => entity.turbo(keyState));
    });
    input.addMapping("Enter", keyState => {
        triggerState.enterPressed = true;
    });
    return router;
}
