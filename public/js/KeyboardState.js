const keyStates = {
    PRESSED: 1,
    RELEASED: 0
}

export default class Keyboard {
    constructor() {
        //Current state of a given key
        this.keyStates = new Map();
        //Callback functions for a key code
        this.keyMap = new Map();
    }

    addMapping(code, callback) {
        this.keyMap.set(code, callback);
    }

    handleEvent(event) {
        const {code} = event;

        if (!this.keyMap.has(code)) {
            return; // not mapped
        }

        event.preventDefault();
        const keyState = event.type === 'keydown' ? keyStates.PRESSED : keyStates.RELEASED;

        if (this.keyStates.get(code) === keyState) {
            return;
        }

        this.keyStates.set(code, keyState);

        this.keyMap.get(code)(keyState);
    }

    listenTo(window) {
        ["keydown", "keyup"].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            })
        })
    }
}
