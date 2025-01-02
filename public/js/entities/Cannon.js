import Entity from "../Entity.js";
import { loadAudioBoard } from "../loaders/audio.js";
import { findPlayers } from "../player.js";
import Emitter from "../traits/Emitter.js";

const HOLD_FIRE_THRESHOLD = 30;

export function loadCannon (audioContext, entityFactories) {
    return loadAudioBoard("cannon", audioContext)
    .then(audio => {
        return createCannonFactory(audio, entityFactories);
    })
}

function createCannonFactory(audio, entityFactories) {
    let dir = 1;

    function emitBullet(cannon, level) {
        for (const player of findPlayers(level)) {
            if (player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD && player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD) {
                return;
            }
            if (player.pos.x < cannon.pos.x) {
                dir = -1;
            } else {
                dir = 1;
            }
        }
        const bullet = entityFactories.bullet();
        bullet.pos.copy(cannon.pos);
        bullet.vel.set(80 * dir, 0);
        cannon.sounds.add("shoot");
        level.entities.add(bullet);
    }

    return function createcannon() {
        const cannon = new Entity();
        cannon.audio = audio;
        const emmiter = new Emitter();
        emmiter.interval = 4;
        emmiter.emitters.push(emitBullet);
        cannon.addTrait(emmiter);
        return cannon;
    }
}
