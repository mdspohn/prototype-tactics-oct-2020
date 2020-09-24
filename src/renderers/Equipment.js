class EquipmentRenderer {
    static render(ctx, beast, layer, translateX, translateY, { scaling = 1 } = settings) {
        const beastAnimation = beast.animations.current,
              beastIndex = beastAnimation.config[beastAnimation.frame].idx,
              isMirrored = beastAnimation.mirrored;

        Object.values(beast.equipment.equipment).forEach(item => {
            if (item === null)
                return;

            const config = item.tileset.config[beastIndex]?.[~~isMirrored];
            if (config === undefined || config.layer !== layer)
                return;

            ctx.save();
            ctx.translate(translateX + ((~~config.ox + (~~config.mirrored * item.tw)) * scaling), translateY + (~~config.oy * scaling));
    
            if (config.mirrored)
                ctx.scale(-1, 1);

            ctx.drawImage(
                item.tileset.img,
                (config.idx * item.tileset.tw) % item.tileset.width,
                Math.floor((config.idx * item.tileset.tw) / item.tileset.width) * (item.tileset.th),
                item.tileset.tw,
                item.tileset.th,
                0,
                0,
                item.tileset.tw * scaling,
                item.tileset.th * scaling
            );
            ctx.restore();
        });
    }
}