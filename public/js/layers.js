import TileResolver from "./TileResolver.js";

export function createBackgroundLayer(level, tiles, sprites) {
    const resolver = new TileResolver(tiles);
    const buffer = document.createElement("canvas");
    buffer.width = 256 + 16;
    buffer.height = 240;

    const context = buffer.getContext("2d");

    function redraw(startIndex, endIndex) {
        context.clearRect(0, 0, buffer.width, buffer.height);
        for (let x = startIndex; x <= endIndex; x++) {
            const col = tiles.grid[x];
            if (col) {
                col.forEach((tile, y) => {
                    if (sprites.animations.has(tile.name)) {
                        sprites.drawAnim(tile.name, context, x - startIndex, y, level.totalTime);
                    } else {
                        sprites.drawTile(tile.name, context, x - startIndex, y);
                    }
                    
                });
            }
        }
    }

    return function drawBackgroundLayer(context, camera) {
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFrom = resolver.toIndex(camera.pos.x);
        const drawTo = drawFrom + drawWidth;
        redraw(drawFrom, drawTo);

        context.drawImage(buffer, -Math.floor(camera.pos.x % 16), -Math.floor(camera.pos.y));
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

export function createCameraLayer(cameraToDraw) {
    return function drawCameraRect(context, fromCamera) {
        context.strokeStyle = "purple";
        context.beginPath();
        context.rect(cameraToDraw.pos.x - fromCamera.pos.x, cameraToDraw.pos.y - fromCamera.pos.y, cameraToDraw.size.x, cameraToDraw.size.y);
        context.stroke();
    }
}
