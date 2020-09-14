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
        const RANGE_MARKER     = markers.getRange().get(location),
              PATH_MARKER      = markers.getPath().includes(location),
              SELECTION_MARKER = markers.getSelection().get(location),
              FOCUS_MARKER     = markers.getFocus() === location;

        if (RANGE_MARKER !== undefined || SELECTION_MARKER !== undefined || FOCUS_MARKER) {
            const IS_SLOPED   = location.isSloped(),
                  IS_MIRRORED = IS_SLOPED && [Game.logic.general.ORIENTATIONS.WEST, Game.logic.general.ORIENTATIONS.EAST].includes(location.getOrientation()),
                  X_INDEX     = ~~IS_SLOPED * ([Game.logic.general.ORIENTATIONS.WEST, Game.logic.general.ORIENTATIONS.NORTH].includes(location.getOrientation()) ? 1 : 2),
                  POS_X       = camera.getPosX() + (location.getPosX() * this.getScaling()) + (~~IS_MIRRORED * 32 * this.getScaling()),
                  POS_Y       = camera.getPosY() + (location.getPosY() * this.getScaling());
            
            ctx.save();
            ctx.translate(POS_X, POS_Y);

            if (IS_MIRRORED)
                ctx.scale(-1, 1);

            let CONFIG = null;

            if (SELECTION_MARKER !== undefined && SELECTION_MARKER.isSelectable) {
                CONFIG = markers.colors[SELECTION_MARKER.color];
            } else if (RANGE_MARKER !== undefined && RANGE_MARKER.isSelectable) {
                CONFIG = markers.colors[RANGE_MARKER.color];
            }

            if (CONFIG !== null) {
                const DELTA_MS = (CONFIG.ms + delta) % CONFIG.duration;
                ctx.globalAlpha = CONFIG.opacity + Math.floor(Math.abs(DELTA_MS - (CONFIG.duration / 2))) / (CONFIG.duration * 2) + (~~PATH_MARKER * 0.4);
                ctx.drawImage(markers.getImage(), X_INDEX * 32, CONFIG.index * 32, 32, 24, 0, 0, (32 * this.getScaling()), (24 * this.getScaling()));
                ctx.globalAlpha = 1;
            }

            if (FOCUS_MARKER) {
                const DELTA_MS = (markers.focus.ms + delta) % markers.focus.duration,
                      DERIVED_INDEX = Math.floor((DELTA_MS % (markers.focus.duration * .75)) / (markers.focus.duration * .25)),
                      OVERFLOW_INDEX = ~~!DERIVED_INDEX * Math.floor(DELTA_MS / (markers.focus.duration * .5));
                ctx.drawImage(markers.getImage(), (DERIVED_INDEX + OVERFLOW_INDEX) * 32, (X_INDEX * 32) + 96, 32, 24, 0, 0, (32 * this.getScaling()), (24 * this.getScaling()));
            }

            ctx.restore();
        }
    }
}