import Entity from "../Entity.js";
import { loadSpriteSheet } from "../loaders.js";
import PendulumWalk from "../traits/PendulumWalk.js";

export function loadKoopa() {
    return loadSpriteSheet("koopa").then(createKoopaFactory);
}

function createKoopaFactory(sprite) {
    const walkAnim = sprite.animations.get("walk");

    function drawKoopa(context) {
        sprite.draw(walkAnim(this.lifetime), context, 0, 0, this.vel.x < 0 ? true : false);
    }

    return function createKoopa() {
        const koopa = new Entity();
        koopa.size.set(16, 24);
        koopa.offset(0, 8);
        koopa.vel.x = -30;

        koopa.addTrait(new PendulumWalk());
        koopa.draw = drawKoopa;
        return koopa;
    }
}
