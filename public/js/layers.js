export function createBackgroundLayer(level, sprites) {
    const buffer = document.createElement("canvas");
    buffer.width = 2048;
    buffer.height = 240;

    const context = buffer.getContext("2d");

    level.tiles.forEach((tile, x, y) => {
        sprites.drawTile(tile.name, context, x, y);
    })

    return function drawBackgroundLayer(context, camera) {
        context.drawImage(buffer, -Math.floor(camera.pos.x), -Math.floor(camera.pos.y));
    };
}

export function createSpriteLayer(entities, maxWidth = 64, maxHeight = 64) {
    const spriteBuffer = document.createElement("canvas");
    spriteBuffer.width = maxWidth;
    spriteBuffer.height = maxHeight;
    const spriteBufferContext = spriteBuffer.getContext("2d");

    return function drawSpriteLayer(context, camera) {
        const {pos} = camera;

        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, maxWidth, maxHeight);

            entity.draw(spriteBufferContext);

            context.drawImage(
                spriteBuffer,
                Math.floor(entity.pos.x - pos.x),
                Math.floor(entity.pos.y - pos.y)
            );
        });
    };
}
