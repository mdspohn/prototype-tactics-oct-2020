class MarkerRenderer extends Renderer {
    constructor(settings) {
        super(settings);
    }

    update(step, markers) {
        Object.values(markers.colors).forEach(config => config.ms = (config.ms + step) % config.duration);
        if (markers.focus.location !== null)
            markers.focus.ms = (markers.focus.ms + step) %  markers.focus.duration;
    }

    render(delta, ctx, camera, location, markers) {
        const rangeMarker     = markers.getRange().get(location),
              pathMarker      = markers.getPath().includes(location),
              selectionMarker = markers.getSelection().get(location),
              focusMarker     = markers.getFocus() === location;

        if (rangeMarker !== undefined || selectionMarker !== undefined || focusMarker) {
            const isSloped   = location.isSloped(),
                  isMirrored = isSloped && ['west', 'east'].includes(location.getOrientation()),
                  xIndex     = ~~isSloped * (['west', 'north'].includes(location.getOrientation()) ? 1 : 2),
                  translateX = camera.getPosX() + (location.getPosX() * this.getScaling()) + (~~isMirrored * 32 * this.getScaling()),
                  translateY = camera.getPosY() + (location.getPosY() * this.getScaling());
            
            ctx.save();
            ctx.translate(translateX, translateY);

            if (isMirrored)
                ctx.scale(-1, 1);

            let config = null;

            if (selectionMarker !== undefined && selectionMarker.isSelectable) {
                config = markers.colors[selectionMarker.color];
            } else if (rangeMarker !== undefined && rangeMarker.isSelectable) {
                config = markers.colors[rangeMarker.color];
            }

            if (config !== null) {
                const deltaMs = (config.ms + delta) % config.duration;
                ctx.globalAlpha = config.opacity + Math.floor(Math.abs(deltaMs - (config.duration / 2))) / (config.duration * 2) + (~~pathMarker * 0.4);
                ctx.drawImage(markers.getImage(), xIndex * 32, config.index * 32, 32, 24, 0, 0, (32 * this.getScaling()), (24 * this.getScaling()));
                ctx.globalAlpha = 1;
            }

            if (focusMarker) {
                const deltaMs = (markers.focus.ms + delta) % markers.focus.duration,
                      derivedIndex = Math.floor((deltaMs % (markers.focus.duration * .75)) / (markers.focus.duration * .25)),
                      overflowIndex = ~~!derivedIndex * Math.floor(deltaMs / (markers.focus.duration * .5));
                ctx.drawImage(markers.getImage(), (derivedIndex + overflowIndex) * 32, (xIndex * 32) + 96, 32, 24, 0, 0, (32 * this.getScaling()), (24 * this.getScaling()));
            }

            ctx.restore();
        }
    }

    renderDirectionalArrows(delta, ctx, camera, beast, markers) {
        if (markers.getDirectionalArrows() === null)
            return;

        const translateX = camera.getPosX() + ((beast.location.getPosX()) * this.getScaling()),
              translateY = camera.getPosY() + ((beast.location.getPosY() - beast.tileset.th + beast.location.td + 3) * this.getScaling());

        let x, y;
        switch(markers.getDirectionalArrows()) {
            case 'north':
                x = 0;
                y = 0;
                break;
            case 'east':
                x = 0;
                y = 1;
                break;
            case 'south':
                x = 1;
                y = 1;
                break;
            case 'west':
                x = 1;
                y = 0;
                break;
        }

        ctx.save();
        ctx.translate(translateX, translateY);
        ctx.drawImage(markers.getImage(), x * 32, (y * 16) + 192, 32, 16, 0, 0, (32 * this.getScaling()), (16 * this.getScaling()))
        ctx.restore();
    }
}