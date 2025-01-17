import { findPlayers } from "../player.js";
import Player from "../traits/Player.js";

function getPlayer(entities) {
    for (const entity of findPlayers(entities)) {
        return entity;
    }
}

export function createPlayerProgressLayer(font, level) {
    const size = font.size;

    const spriteBuffer = document.createElement("canvas");
    spriteBuffer.width = 32;
    spriteBuffer.height = 32;
    const spriteBufferContext = spriteBuffer.getContext("2d");

    return function drawPlayerProgress(context) {
        const entity = getPlayer(level.entities);
        const player = entity.traits.get(Player);

        const {lives} = player;
        const {name} = level;

        font.print("WORLD " + name, context, size * 12, size * 12);

        font.print("x " + lives.toString().padStart(3, " "), context, size * 16, size * 15.5);

        spriteBufferContext.clearRect(0, 0, spriteBuffer.width, spriteBuffer.height);
        entity.draw(spriteBufferContext);
        context.drawImage(spriteBuffer, size * 12, size * 15);
    }
}
