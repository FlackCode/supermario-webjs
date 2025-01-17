import Player from "../traits/Player.js";

function handle({entity, match, resolver, gameContext, level}) {
    if (entity.traits.has(Player)) {
        entity.traits.get(Player).addCoins(1);
        const grid = resolver.matrix;
        grid.delete(match.indexX, match.indexY);
    }
}

export const coin = [handle, handle];
