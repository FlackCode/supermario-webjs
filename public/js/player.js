import Entity from "./Entity.js";
import { Vec2 } from "./math.js";
import LevelTimer from "./traits/LevelTimer.js";
import Player from "./traits/Player.js";
import PlayerController from "./traits/PlayerController.js";

export function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerEnv.addTrait(playerControl);
    playerControl.setPlayer(playerEntity);
    playerControl.checkpoint.set(64, 64)
    return playerEnv;
}

export function makePlayer(entity, name) {
    const player = new Player();
    player.name = name;
    entity.addTrait(player);

    const timer = new LevelTimer();
    entity.addTrait(timer);
}

export function resetPlayer(entity, worldName) {
    entity.traits.get(LevelTimer).reset();
    entity.traits.get(Player).world = worldName;
}

export function bootstrapPlayer(entity, level) {
    entity.traits.get(LevelTimer).hurryEmitted = null;
    entity.pos.copy(level.checkpoints[0]);
    level.entities.add(entity);
}

export function* findPlayers(entities) {
    for (const entity of entities) {
        if (entity.traits.has(Player)) {
            yield entity;
        }
    }
}
