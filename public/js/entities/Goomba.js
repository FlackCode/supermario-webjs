import Entity from "../Entity.js";
import Trait from "../Trait.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import Killable from "../traits/Killable.js";
import PendulumWalk from "../traits/PendulumWalk.js";
import Physics from "../traits/Physics.js";
import Solid from "../traits/Solid.js";
import Stomper from "../traits/Stomper.js";

export function loadGoombaBrown() {
    return loadSpriteSheet("goomba-brown").then(createGoombaFactory);
}
export function loadGoombaBlue() {
    return loadSpriteSheet("goomba-blue").then(createGoombaFactory);
}

class Behavior extends Trait {
    collides(us, them) {
        if (us.traits.get(Killable).dead) {
            return;
        }

        if (them.traits.has(Stomper)) {
            if (them.vel.y > us.vel.y) {
                this.queue(() => {
                    us.traits.get(Killable).kill();
                })
                us.traits.get(PendulumWalk).speed = 0;
            } else {
                them.traits.get(Killable).kill();
            }
        }
    }
}

function createGoombaFactory(sprite) {
    const walkAnim = sprite.animations.get("walk");

    function routeAnim(goomba) {
        if (goomba.traits.get(Killable).dead) {
            return "flat";
        }

        return walkAnim(goomba.lifetime);
    }

    function drawGoomba(context) {
        sprite.draw(routeAnim(this), context, 0, 0);
    }

    return function createGoomba() {
        const goomba = new Entity();
        goomba.size.set(16, 16);

        goomba.addTrait(new Physics());
        goomba.addTrait(new Solid());
        goomba.addTrait(new PendulumWalk());
        goomba.addTrait(new Killable());
        goomba.addTrait(new Behavior());
        goomba.draw = drawGoomba;
        return goomba;
    }
}
