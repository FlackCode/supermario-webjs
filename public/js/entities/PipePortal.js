import Entity from "../Entity.js";
import { loadAudioBoard } from "../loaders/audio.js";
import { Direction } from "../math.js";
import Pipe from "../traits/Pipe.js";

export function loadPipePortal(audioContext) {
    return Promise.all([
        loadAudioBoard("pipe-portal", audioContext)
    ])
    .then(([audio]) => {
        return createPipeFactory(audio);
    });
}

function createPipeFactory(audio) {
    return function createPipePortal(props) {
        console.log(props);
        const pipe = new Pipe();
        pipe.direction.copy(Direction[props.dir]);
        const entity = new Entity();
        entity.props = props;
        entity.audio = audio;
        entity.size.set(24, 30);
        entity.addTrait(pipe);
        return entity;
    }
}
