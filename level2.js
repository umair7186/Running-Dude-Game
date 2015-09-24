
var game = new Phaser.Game(800, 320, Phaser.AUTO, 'scr', { preload: preload, create: create, update: update });

function preload() {
    game.stage.backgroundColor= '#000000';
    game.load.tilemap('collect', 'assets/level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('hurdle', 'assets/imag.png',56,101);
    game.load.image('tiles', 'assets/stage1.png');
    game.load.image('flame', 'assets/flame_sprite.png');
    game.load.image('money', 'assets/money2.png');
    game.load.spritesheet('dude', 'assets/new.png', 84,126);
    game.load.audio('boden', ['assets/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/bodenstaendig_2000_in_rock_4bit.ogg']);
}

var map;
var layer;
var layer2;
var layer3;
var players;
var player;
var facing = 'right';
var jumpTimer = 0;
var cursors;
var jumpButton;
var enemy;
var enemies;
var fire;
var money;
var mon;
var score = 0;
var scoreText;
var music;
var x_var=0;

function create() {
    
    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('collect');

    map.addTilesetImage('world', 'tiles');

    music = game.sound.play('boden');
     music.play('',0,1,true);

    map.setCollisionBetween(901, 908);
    map.setCollisionBetween(916, 921);
    map.setCollisionBetween(951, 953);

    

    
    
    
    layer = map.createLayer('Tile Layer 1');
    layer2 = map.createLayer('Tile Layer 2');
    layer3 = map.createLayer('Tile Layer 3');
    
   
    layer.resizeWorld();
    layer2.resizeWorld();
    layer3.resizeWorld();
    game.physics.arcade.enable(layer2);
    map.setCollisionByExclusion([],true,layer2);
    game.physics.arcade.enable(layer3);
    map.setCollisionByExclusion([],true,layer3);
//   layer.debug = true;
     
    game.physics.arcade.gravity.y = 300;
    
    players=game.add.group();
    players.enableBody= true;
    player=players.create(80,34,'dude');
    player.scale.setTo(0.5,0.5);
    bounce();
    player.animations.add('left', [ 5,6, 7, 8,9,7], 6, true);
    player.animations.add('right', [0, 1, 2, 3,4,2], 6, true);
    game.camera.follow(player);


    enemies=game.add.group();
    enemies.enableBody = true;
    for (var i = 1; i < 8; i++)
    {
        
         enemy = enemies.create(i * 490, 30, 'hurdle');
        enemy.animations.add('anim',[2,3,4,5],3,true);
        enemy.animations.play('anim');
        enemy.scale.setTo(0.9,0.9);
    }
    

    money=game.add.group();
    money.enableBody= true;
    mon = money.create(300,30,'money');
    mon=createMoney();
    

    fire = game.add.sprite(35,11, 'flame');
    game.physics.arcade.enable(fire);
    fire.scale.setTo(0.1,0.1);
    fire.body.collideWorldBounds = true;
    
    
    
    
    scoreText = game.add.text(590, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
    scoreText.fixedToCamera = true;
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}


function createMoney() {

    mon = money.create(700,30,'money');
    mon = money.create(1300,30,'money');
    mon = money.create(1600,30,'money');
    mon = money.create(1650,30,'money');
    mon = money.create(2200,30,'money');
    mon = money.create(2300,30,'money');
     mon = money.create(2600,30,'money');
     mon = money.create(2750,30,'money');
     mon = money.create(2850,30,'money');
     mon = money.create(3020,30,'money');
}

function bounce ()
{
    return player.body.bounce.y = 0.2;
}

function update() {

    game.physics.arcade.collide(players, layer);
    game.physics.arcade.collide(players, layer2);
    game.physics.arcade.collide(enemies, layer);
    game.physics.arcade.collide(money, layer);
    game.physics.arcade.collide(money, layer2);
    game.physics.arcade.collide(fire,layer);
    game.physics.arcade.collide(fire,layer3);
    
    game.physics.arcade.overlap(players,fire,killDude,null,this);
    game.physics.arcade.overlap(players,money,collectMoney,null,this);

     enemy.animations.play('anim');
     game.physics.arcade.overlap(players,enemies,killDude2,null,this);
     fire.body.velocity.x +=0.1; 

    player.body.velocity.x = 0;
    

     if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        player.animations.play('left');
        x_var -=1;

        if (facing != 'left')
        {
            
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        player.animations.play('right');
        x_var+=1;

        if (facing != 'right')
        {
            
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 11;
            }
            else
            {
                player.frame = 10;
            }

            facing = 'idle';
        }
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -300;
        jumpTimer = game.time.now + 750;
        player.body.bounce.y = 0;
        player.animations.stop();

    }
    if (facing == 'left'&& !player.body.onFloor()&& cursors.left.isDown)
            {
                player.animations.stop();
                player.frame = 7;
            }
            else if(facing == 'right'&& !player.body.onFloor()&& cursors.right.isDown)
            {
                player.animations.stop();
                player.frame = 2;
            }
             else if(player.body.onFloor()&& (cursors.right.isDown||cursors.left.isDown))
            {
                if(facing == 'left')
                player.animations.play('left');
                else if(facing == 'right')
                 player.animations.play('right');   
                
            }

    if((player.y>game.height) || (player.x > 4800))
    {
        music.pause();
    }
    else
    {
        music.resume();
    }
    if(player.y>game.height)
    {
        layer.kill();
        layer2.kill();
        layer3.kill();
        fire.kill();
        enemy.kill();
        
    }
    else if (player.x > 4800)
    {
        layer.kill();
        layer2.kill();
        layer3.kill();
        fire.kill();
        enemy.kill();
    }


}
function killDude (fire,player) {
    player.kill();
    
}
function killDude2 (player,enemy) {

        player.kill();
       
}
function collectMoney (player,mon) {

        mon.kill();
        score += 10;
    scoreText.text = 'Score: ' + score;
}

