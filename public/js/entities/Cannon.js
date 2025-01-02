import Entity from "../Entity.js";
import { loadAudioBoard } from "../loaders/audio.js";
import Emitter from "../traits/Emitter.js";

export function loadCannon (audioContext, entityFactories) {
    return loadAudioBoard("mario", audioContext)
    .then(audio => {
        return createCannonFactory(audio, entityFactories);
    })
}

function createCannonFactory(audio, entityFactories) {
    function emitBullet(cannon, level) {
        const bullet = entityFactories.bullet();
        bullet.pos.copy(cannon.pos);
        level.entities.add(bullet);
    }

    return function createcannon() {
        const cannon = new Entity();
        cannon.audio = audio;
        const emmiter = new Emitter();
        emmiter.emitters.push(emitBullet);
        cannon.addTrait(emmiter);
        
        return cannon;
    }
}
