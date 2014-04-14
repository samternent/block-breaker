;

// Block Break Game
// 14 April 2014
// v.0.1


// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();






var BBG = BBG || { };

BBG.Factory = BBG.Factory || { };

// this takes care of all things canvas
BBG.Factory.CanvasManager = (function (downument, window){
    var
        settings_ = {
            canvas: null,
            ctx: null,
            width: window.innerWidth,
            height: window.innerHeight
        },
        methods_ = {
            buildCanvas: function (id) {

                var parent =    document.getElementById(id) ||
                                document.body;

                settings_.canvas = document.createElement('canvas'),
                settings_.canvas.width = settings_.width;
                settings_.canvas.height = settings_.height;
                settings_.ctx = settings_.canvas.getContext('2d');

                parent.appendChild(settings_.canvas);
            },
            animateLoop: function () {
                requestAnimFrame(methods_.animateLoop);
                settings_.ctx.clearRect(
                    0,
                    0,
                    settings_.canvas.width,
                    settings_.canvas.width
                );
                BBG.Game.Entities.Paddle.Update();
            }
        },
        expose = {
            Create: function (el) {
                return methods_.buildCanvas(el);
            },
            Canvas: function () {
                return settings_.canvas;
            },
            Animate: function () {
                methods_.animateLoop();
            }
        };

    return expose;
})(document, window);




// player entity
BBG.Factory.Entity = (function () {

    var Base = {
        type: null,
        health: null,
        position: {
            x: null,
            y: null
        },
        color: null,
        width: null,
        height: null,
        velocity: {
            x: null,
            y: null
        },
        speed: null,
        friction: null
    };

    var
        methods_ = {
            buildPrototype: function (obj) {
                return Object.create(Base, obj);
            }
        },
        expose = {
            Create: function (obj) {
                return methods_.buildPrototype(obj);
            }
        };

    return expose;
})();


// game specific stuff
BBG.Game = BBG.Game || { };

BBG.Factory.CanvasManager.Create('game-wrapper');


// create entities
BBG.Game.Entities = BBG.Game.Entities || { };

BBG.Game.Entities.Paddle = BBG.Factory.Entity.Create({
    type: {
        value: 'paddle'
    },
    color: {
        value: 'red'
    },
    position: {
        value : {
            x: BBG.Factory.CanvasManager.Canvas().width/2,
            y: BBG.Factory.CanvasManager.Canvas().height - 25
        }
    },
    width: {
        value: 100
    },
    height: {
        value: 20
    },
    velocity: {
        value : {
            x: 0,
            y: 0
        }
    },
    speed: {
        value: 5
    },
    friction: {
        value: .97
    }
});

BBG.Game.Entities.Paddle.Draw = function () {
    var ctx = BBG.Factory.CanvasManager.Canvas().getContext('2d');

    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
};

BBG.Game.Entities.Paddle.Update = function (key) {
    if (key) {
        switch (key.keyCode) {
            case 39:
                if (this.velocity.x < this.speed) {
                    this.velocity.x++;
                }
                break;
            case 37:
                if (this.velocity.x > -this.speed)
                this.velocity.x--;
                break;
        }
    }

    this.velocity.x *= this.friction;
    this.position.x += this.velocity.x;

    if (this.position.x >= BBG.Factory.CanvasManager.Canvas().width - (this.width/2)) {
        this.position.x = 0;
    } else if (this.position.x <= -(this.width/2)) {
        this.position.x = BBG.Factory.CanvasManager.Canvas().width - (this.width/2);
    }

    BBG.Game.Entities.Paddle.Draw();
};


// start logic down here


BBG.Game.Entities.Paddle.Draw();
BBG.Factory.CanvasManager.Animate();

document.addEventListener('keydown', function (e) {
    BBG.Game.Entities.Paddle.Update(e);
});

