GAME_DATA.skills['template'] = {
    name: 'Test',
    description: 'A test skill that uses TP to do something.',
    distance: 3,
    basic: [true, false], // is just meant to be a basic attack that generates TP
    movement: ['NONE', 'TELEPORT', 'CHARGE'],
    unit_animation: ['charge', 'slash', 'punch', 'meteor'],
    skill_animation: ['template', 'blunt-attack', 'mandelic-stab'],
    pattern: ['POINT', 'CROSS_EXCLUSIVE', 'CROSS_INCLUSIVE'],
    tp: 15
};

GAME_DATA.skills['slash'] = {
    name: 'Melee Attack',
    description: 'A simple melee attack using a weapon, claw, or body weight.',
    distance: 1,
    basic: true,
    movement: 'NONE',
    unit_animation: 'slash',
    skill_animation: 'slash',
    pattern: 'POINT'
};