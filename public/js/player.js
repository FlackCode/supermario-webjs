import Entity from "./Entity.js";
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

export function createPlayer(entity) {
    entity.addTrait(new Player());
    return entity;
}

export function* findPlayers(level) {
    for (const entity of level.entities) {
        if (entity.player) {
            yield entity;
        }
    }
}
