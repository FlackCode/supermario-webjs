import { findPlayers } from "../player.js";
import LevelTimer from "../traits/LevelTimer.js";
import Player from "../traits/Player.js";

function getPlayerTrait(entities) {
    for (const entity of findPlayers(entities)) {
        return entity.traits.get(Player);
    }
}

function getTimerTrait(entities) {
    for (const entity of entities) {
        if (entity.traits.has(LevelTimer)) {
            return entity.traits.get(LevelTimer);
        }
    }
}

export function createDashboardLayer(font, level) {
    const LINE1 = font.size;
    const LINE2 = font.size * 2;

    return function drawDashboard(context) {
        const playerTrait = getPlayerTrait(level.entities);
        const timerTrait = getTimerTrait(level.entities);
        const {currentTime} = timerTrait;
        const {score, coins} = playerTrait;
        const {name} = level;

        font.print(playerTrait.name, context, 16, LINE1);
        font.print(score.toString().padStart(6, "0"), context, 16, LINE2);
        font.print("@x" + coins.toString().padStart(2, "0"), context, 96, LINE2);

        font.print("WORLD", context, 152, LINE1);
        font.print(name, context, 160, LINE2);

        font.print("TIME", context, 208, LINE1);
        font.print(currentTime.toFixed().toString().padStart(3, "0"), context, 216, LINE2);
    }
}
