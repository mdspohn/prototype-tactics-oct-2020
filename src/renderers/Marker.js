class MarkerRenderer {
    static update(markers, ms, isDeltaUpdate, { speed = 1 } = settings) {
        if (!markers.hasActive())
            return;

        const adjustedMs = ms * speed;
        markers.delta = ~~isDeltaUpdate * adjustedMs;
        markers.forEachConfig(config => {
            if (config.ms === undefined)
                return;
            config.ms = (config.ms + (~~!isDeltaUpdate * adjustedMs)) % config.duration;
        });
    }
    
    static render(markers, location, { scaling = 1 } = settings) {
        if (!markers.hasActive())
            return;

        const range      = markers.range.get(location),
              onPath     = markers.path.includes(location),
              selection  = markers.selection.get(location),
              isMirrored = location.isSloped && [CombatLogic.ORIENTATIONS.WEST, CombatLogic.ORIENTATIONS.EAST].includes(location.orientation),
              translateX = Game.camera.getPosX() + (location.posX * scaling) + (~~isMirrored * 32 * scaling),
              translateY = Game.camera.getPosY() + (location.posY * scaling),
              color      = (!!selection && selection.isSelectable) ? selection.color : (!!range && range.isSelectable) ? range.color : null,
              x          = (!location.isSloped) ? 0 : [CombatLogic.ORIENTATIONS.WEST, CombatLogic.ORIENTATIONS.NORTH].includes(location.orientation) ? 1 : 2;

        Game.ctx.save();
        Game.ctx.translate(translateX, translateY);

        if (isMirrored)
            Game.ctx.scale(-1, 1);

        if (color !== null) {
            const config = markers.configurations[color],
                  ms     = (config.ms + markers.delta) % config.duration,
                  alpha  = config.opacity + Math.floor(Math.abs(ms - (config.duration / 2))) / (config.duration * 2) + (~~onPath * 0.4);
            
            Game.ctx.globalAlpha = alpha;
            Game.ctx.drawImage(markers.img, x * 32, config.y * 32, 32, 24, 0, 0, 32 * scaling, 24 * scaling);
            Game.ctx.globalAlpha = 1;
        }

        if (markers.focus === location) {
            const config   = markers.configurations.focus,
                  ms       = (config.ms + markers.delta) % config.duration,
                  overflow = Math.floor((ms % (config.duration * .75)) / (config.duration * .25)),
                  index    = (~~!overflow * Math.floor(ms / (config.duration * .5))) + overflow;
            
            Game.ctx.drawImage(markers.img, index * 32, x * 32 + 96, 32, 24, 0, 0, 32 * scaling, 24 * scaling);
        }

        Game.ctx.restore();
    }

    static renderGlobal(markers, beast, { scaling = 1 } = settings) {
        if (markers.orientation === null)
            return;

        const config     = markers.configurations.orientation[beast.orientation],
              translateX = Game.camera.getPosX() + (beast.location.posX * scaling),
              translateY = Game.camera.getPosY() + (beast.location.posY - beast.tileset.th + beast.location.td + 3) * scaling;

        Game.ctx.save();
        Game.ctx.translate(translateX, translateY);
        Game.ctx.drawImage(markers.img, config[0] * 32, config[1] * 16 + 192, 32, 16, 0, 0, 32 * scaling, 16 * scaling);
        Game.ctx.restore();
    }
}