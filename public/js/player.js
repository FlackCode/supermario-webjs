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

export function makePlayer(entity, name) {
    const player = new Player();
    player.name = name;
    entity.addTrait(player);
}

export function* findPlayers(entities) {
    for (const entity of entities) {
        if (entity.traits.has(Player)) {
            yield entity;
        }
    }
}
