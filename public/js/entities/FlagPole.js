import Entity from "../Entity.js";
import { loadAudioBoard } from "../loaders/audio.js";
import Pole from "../traits/Pole.js";

export function loadFlagPole(audioContext) {
    return Promise.all([
        loadAudioBoard("flag-pole", audioContext)
    ])
    .then(([audio]) => {
        return createFlagPoleFactory(audio);
    });
}

function createFlagPoleFactory(audio) {
    const entity = new Entity();
    entity.audio = audio;
    entity.size.set(8, 144);
    entity.offset.set(4, 0);
    entity.addTrait(new Pole());
    console.log(entity)
    return entity;
}
