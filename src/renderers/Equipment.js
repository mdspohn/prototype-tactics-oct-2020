class EquipmentRenderer {
    static render(ctx, beast, index, isMirrored, layer, translateX, translateY, { scaling = 1 } = settings) {
        Object.values(beast.equipment.equipment).forEach(item => {
            if (item === null)
                return;

            const config = item.tileset.configuration[index]?.[~~isMirrored];
            if (config === undefined || config.layer !== layer)
                return;

            ctx.save();
            ctx.translate(translateX + ((~~config.ox + (~~config.mirrored * item.tileset.sw)) * scaling), translateY + (~~config.oy * scaling));
    
            if (config.mirrored)
                ctx.scale(-1, 1);

            ctx.drawImage(
                item.tileset.img,
                (config.idx * item.tileset.sw) % item.tileset.width,
                Math.floor((config.idx * item.tileset.sw) / item.tileset.width) * (item.tileset.sh),
                item.tileset.sw,
                item.tileset.sh,
                0,
                0,
                item.tileset.sw * scaling,
                item.tileset.sh * scaling
            );
            ctx.restore();
        });
    }
}