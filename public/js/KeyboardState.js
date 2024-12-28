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

    addMapping(keyCode, callback) {
        this.keyMap.set(keyCode, callback);
    }

    handleEvent(event) {
        const {keyCode} = event;

        if (!this.keyMap.has(keyCode)) {
            return; // not mapped
        }

        event.preventDefault();
        const keyState = event.type === 'keydown' ? keyStates.PRESSED : keyStates.RELEASED;

        if (this.keyStates.get(keyCode) === keyState) {
            return;
        }

        this.keyStates.set(keyCode, keyState);
        console.log(this.keyStates);

        this.keyMap.get(keyCode)(keyState);
    }

    listenTo(window) {
        ["keydown", "keyup"].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            })
        })
    }
}
