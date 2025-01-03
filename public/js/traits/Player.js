import { Trait } from "../Entity.js";
import Stomper from "./Stomper.js";

export default class Player extends Trait {
    constructor() {
        super("player");
        this.name = "UNNAMED";
        this.coins = 0;
        this.lives = 3;
        this.score = 0;

        this.listen(Stomper.EVENT_STOMP, () => {
            console.log(this.score);
            this.score += 100;
        });
    }
}
