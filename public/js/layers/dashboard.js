import LevelTimer from "../traits/LevelTimer.js";
import Player from "../traits/Player.js";

export function createDashboardLayer(font, entity) {
    const LINE1 = font.size * 2;
    const LINE2 = font.size * 3;

    return function drawDashboard(context) {
        const playerTrait = entity.traits.get(Player);
        const timerTrait = entity.traits.get(LevelTimer);
        const {currentTime} = timerTrait;
        const {score, coins, world} = playerTrait;

        font.print(playerTrait.name, context, 16, LINE1);
        font.print(score.toString().padStart(6, "0"), context, 16, LINE2);

        font.print("@x" + coins.toString().padStart(2, "0"), context, 96, LINE2);

        font.print("WORLD", context, 152, LINE1);
        font.print(world, context, 160, LINE2);

        font.print("TIME", context, 208, LINE1);
        font.print(currentTime.toFixed().toString().padStart(3, "0"), context, 216, LINE2);
    }
}
