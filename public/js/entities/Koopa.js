import Entity from "../Entity.js";
import Trait from "../Trait.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import PendulumWalk from "../traits/PendulumWalk.js";
import Physics from "../traits/Physics.js";
import Solid from "../traits/Solid.js";
import Killable from "../traits/Killable.js";
import Stomper from "../traits/Stomper.js";
import Go from "../traits/Go.js";

export function loadKoopa() {
    return loadSpriteSheet("koopa-green").then(createKoopaFactory);
}

const STATE_WALKING = Symbol("walking");
const STATE_HIDING = Symbol("hiding");
const STATE_PANIC = Symbol("panic");

class Behavior extends Trait {
    constructor() {
        super();
        this.state = STATE_WALKING;
        this.hideTime = 0;
        this.hideDuration = 5;
        this.walkSpeed = null;
        this.panicSpeed = 300;
    }

    collides(us, them) {
        if (us.traits.get(Killable).dead) {
            return;
        }

        if (them.traits.has(Stomper)) {
            if (them.vel.y > us.vel.y) {
                this.handleStomp(us, them)
            } else {
                this.handleNudge(us, them);
            }
        }
    }

    handleNudge(us, them) {
        if (this.state === STATE_WALKING) {
            them.traits.get(Killable).kill();
        } else if (this.state === STATE_HIDING){
            this.panic(us, them);
        } else if (this.state = STATE_PANIC) {
            const travelDir = Math.sign(us.vel.x);
            const impactDir = Math.sign(us.pos.x - them.pos.x);
            if (travelDir !== 0 && travelDir !== impactDir) {
                them.traits.get(Killable).kill();
            }
        }
    }

    handleStomp(us, them) {
        if (this.state === STATE_WALKING) {
            this.hide(us);
        } else if (this.state === STATE_HIDING) {
            us.traits.get(Killable).kill();
            us.vel.set(100, -200);
            us.traits.get(Solid).obstructs = false;
        } else if (this.state === STATE_PANIC) {
            this.hide(us);
        }
    }

    hide(us) {
        us.vel.x = 0;
        us.traits.get(PendulumWalk).enabled = false;
        if (this.walkSpeed === null) {
            this.walkSpeed = us.traits.get(PendulumWalk).speed;
        }
        this.hideTime = 0;
        this.state = STATE_HIDING;
    }

    unhide(us) {
        us.traits.get(PendulumWalk).enabled = true;
        us.traits.get(PendulumWalk).speed = this.walkSpeed;
        this.state = STATE_WALKING;
    }

    panic(us, them) {
        us.traits.get(PendulumWalk).enabled = true;
        us.traits.get(PendulumWalk).speed = this.panicSpeed * them.traits.get(Go).dir;
        this.state = STATE_PANIC;
    }

    update(us, {deltaTime}) {
        if (this.state == STATE_HIDING) {
            this.hideTime += deltaTime;
            if (this.hideTime > this.hideDuration) {
                this.unhide(us);
            }
        }
    }
}

function createKoopaFactory(sprite) {
    const walkAnim = sprite.animations.get("walk");
    const wakeAnim = sprite.animations.get("wake");

    function routeAnim(koopa) {
        if (koopa.traits.get(Behavior).state === STATE_HIDING) {
            if (koopa.traits.get(Behavior).hideTime > 3) {
                return wakeAnim(koopa.traits.get(Behavior).hideTime);
            }
            return "hiding"
        }
        if (koopa.traits.get(Behavior).state === STATE_PANIC) {
            return "hiding";
        }

        return walkAnim(koopa.lifetime);
    }

    function drawKoopa(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0 ? true : false);
    }

    return function createKoopa() {
        const koopa = new Entity();
        koopa.size.set(16, 16);
        koopa.offset.set(0, 8);
        koopa.vel.x = -30;

        koopa.addTrait(new Physics());
        koopa.addTrait(new Solid());
        koopa.addTrait(new PendulumWalk());
        koopa.addTrait(new Killable());
        koopa.addTrait(new Behavior());
        koopa.draw = drawKoopa;
        return koopa;
    }
}
