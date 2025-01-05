import Entity from "../Entity.js";
import Trait from "../Trait.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import Killable from "../traits/Killable.js";
import PendulumWalk from "../traits/PendulumWalk.js";
import Physics from "../traits/Physics.js";
import Solid from "../traits/Solid.js";

export function loadGoomba() {
    return loadSpriteSheet("goomba").then(createGoombaFactory);
}

class Behavior extends Trait {
    constructor() {
        super("behavior");
    }

    collides(us, them) {
        if (us.killable.dead) {
            return;
        }

        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                this.queue(() => {
                    us.killable.kill();
                })
                us.pendulumWalk.speed = 0;
            } else {
                them.killable.kill();
            }
        }
    }
}

function createGoombaFactory(sprite) {
    const walkAnim = sprite.animations.get("walk");

    function routeAnim(goomba) {
        if (goomba.killable.dead) {
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
