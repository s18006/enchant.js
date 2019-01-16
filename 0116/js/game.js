enchant();
window.onload = function () {
  core = new Core(320, 320);
  var scene = new Scene();
  core.preload('chara0.png', 'chara2.png', 'map0.png', 'icon0.png', 'effect0.png');
  core.fps = 16;
  core.keybind(88, 'a');

  core.onload = function() {
    var image = new Surface(320, 320);
    var val;
    var val2;
    //draw (image, dx, dy, dw, dh, then surface x, y, w, h)
    for (let i = 0; i < 20; i++) {
      for (let k = 0; k < 20; k++) {
        val = 0;
        val2 = 0;
        image.draw(core.assets['map0.png'], val, val2, 16, 16, i*16, k*16, 16, 16);
        if (i % 4 == 1 && k % 4 == 1) {
          val = 48;
          val2 = 16;
          image.draw(core.assets['map0.png'], val, val2, 16, 16, i*16, k*16, 16, 16);
        }
      }
    }
  
    var bg = new Sprite(320, 320);
    bg.image = image;
    core.rootScene.addChild(bg);

    var Enemy = enchant.Class.create(enchant.Sprite, {
      initialize: function(x, y){
        enchant.Sprite.call(this, 32, 32);
        this.image = core.assets['chara2.png'];
        this.x = x;
        this.y = y;
        this.vx = 2;
        this.moveTo(320, Math.floor(Math.random() * 320));
        this.scaleX = 1;
        this.frame = [1, 2, 3];
        this.addEventListener('enterframe', function() {
          this.x -= this.vx;
          if (this.x < -36) {
            this.remove();
          }
        })
        core.rootScene.addChild(this)
      },
      remove: function() {
        core.rootScene.removeChild(this)
        delete this
      }
    });

    var enemies = [];
    let rand = 0
    core.rootScene.tl.then(function() {
      var enemy = new Enemy();
      enemy.id = rand
      enemies[enemy.id] = enemy
      rand++
    }).delay(50).loop();


    var Explosion = enchant.Class.create(enchant.Sprite, {
      initialize: function(x, y) {
        enchant.Sprite.call(this, 16, 16)
        this.x = x
        this.y = y
        this.frame = 0
        this.image = core.assets['effect0.png']
        this.tick = 0

        this.addEventListener('enterframe', function() {
          this.frame++
          if (this.frame == 5) {
            core.rootScene.removeChild(this)
            delete this
            this.tick = 0
          }
        })
        core.rootScene.addChild(this)
      }
    })


  var Bullet = enchant.Class.create(enchant.Sprite, {
    initialize: function(){
      enchant.Sprite.call(this, 16, 16);
      this.image = core.assets['icon0.png'];
      this.moveTo(player.x+8, player.y + 8);
      this.frame = 45;
      core.rootScene.addChild(this);

      this.addEventListener('enterframe', function() {
        this.x += 4;
        if (this.x > 320) {
          core.rootScene.removeChild(this)
        }
        for (let i in enemies) {
          if (enemies[i].intersect(this)) {
            var effect = new Explosion(enemies[i].x + enemies[i].width / 4, enemies[i].y + enemies[i].height / 4)
            core.rootScene.removeChild(enemies[i])
            delete enemies[i]
          }
        }
      })
    }

  });
    var Player = enchant.Class.create(enchant.Sprite, {
      initialize: function(x, y) {
        enchant.Sprite.call(this, 32, 32);
        this.image = core.assets['chara0.png'];
        this.frame = 7;
        this.x = x;
        this.y = y;
        this.tick = 0;
        this.addEventListener('enterframe', function(e) {
          if (core.input.left && this.x >= 0) {
            this.x -= 4;
            this.frame = 16 + this.tick % 2;
            this.tick++;
          }
          if (core.input.right && this.x <= 288) {
            this.x += 4;
            this.frame = 25 + this.tick % 2;
            this.tick++;
          }
          if (core.input.up && this.y >= 0) {
            this.y -= 4;
            this.frame = 34 + this.tick % 2;
            this.tick++;
          }
          if (core.input.down && this.y <= 288) {
            this.y += 4;
            this.frame = 7 + this.tick % 2;
            this.tick++;
          }

          if (core.input.a) {
            var bullet = new Bullet();
          }

          for (let i in enemies) {
            if (enemies[i].intersect(this)) {
              var effect = new Explosion(enemies[i].x + enemies[i].width / 4, enemies[i].y + enemies[i].height / 4)
              core.rootScene.removeChild(enemies[i])
              delete enemies[i]
            }
          }
        })
        core.rootScene.addChild(this)
      }
    })

    var player = new Player(120, 50)

  }
  core.start();
}

