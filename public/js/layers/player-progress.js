import { findPlayers } from "../player.js";
import Player from "../traits/Player.js";

function getPlayerTrait(entities) {
    for (const entity of findPlayers(entities)) {
        return entity.traits.get(Player);
    }
}

function getPlayer(entities) {
    for (const entity of findPlayers(entities)) {
        return entity;
    }
}

export function createPlayerProgressLayer(font, level) {
    const spriteBuffer = document.createElement("canvas");
    spriteBuffer.width = 32;
    spriteBuffer.height = 32;
    const spriteBufferContext = spriteBuffer.getContext("2d");

    const size = font.size
    
    const playerTrait = getPlayerTrait(level.entities);
    const player = getPlayer(level.entities);
    const {lives} = playerTrait;
    const {name} = level;

    return function drawPlayerProgress(context) {
        font.print("WORLD " + name, context, size * 12, size * 12);

        spriteBufferContext.clearRect(0, 0, spriteBuffer.width, spriteBuffer.height);
        player.draw(spriteBufferContext);
        context.drawImage(spriteBuffer, size * 12, size * 15);

        font.print("x " + lives.toString().padStart(3, " "), context, size * 16, size * 15.5);
    }
}
