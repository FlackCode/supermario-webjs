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
