const canvas = document.querySelector(`canvas`);
const c = canvas.getContext(`2d`);
const displayText = document.querySelector(`#displayText`);

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: `./img/background.png`
});
const shop = new Sprite({
  position: {
    x: 635,
    y: 188
  },
  imageSrc: `./img/decorations/shop_anim.png`,
  scale: 1,
  framesMax: 6
});

const player = new Fighter({
  position: {
    x: 20,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  colour: `red`,
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: "./img/warriorSimon/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 200,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: "./img/warriorSimon/Idle.png",
      framesMax: 8
    },
    run: {
      imageSrc: "./img/warriorSimon/Run.png",
      framesMax: 8
    },
    jump: {
      imageSrc: "./img/warriorSimon/Jump.png",
      framesMax: 2
    },
    attack1: {
      imageSrc: "./img/warriorSimon/Attack1.png",
      framesMax: 6
    },
    takeHit: {
      imageSrc: "./img/warriorSimon/Take Hit - white silhouette.png",
      framesMax: 4
    },
    death: {
      imageSrc: "./img/warriorSimon/Death.png",
      framesMax: 6
    }
  },
  attackBox: {
    offset: { x: 60, y: 40 },
    width: 170,
    height: 50
  }
});

const enemy = new Fighter({
  position: {
    x: 910,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  colour: `blue`,
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: "./img/warriorNicole/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 200,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: "./img/warriorNicole/Idle.png",
      framesMax: 4
    },
    run: {
      imageSrc: "./img/warriorNicole/Run.png",
      framesMax: 8
    },
    jump: {
      imageSrc: "./img/warriorNicole/Jump.png",
      framesMax: 2
    },
    attack1: {
      imageSrc: "./img/warriorNicole/Attack1.png",
      framesMax: 4
    },
    takeHit: {
      imageSrc: "./img/warriorNicole/Take hit.png",
      framesMax: 3
    },
    death: {
      imageSrc: "./img/warriorNicole/Death.png",
      framesMax: 7
    }
  },
  attackBox: {
    offset: { x: -180, y: 40 },
    width: 170,
    height: 50
  }
});

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  s: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowDown: {
    pressed: false
  }
};

decreaseTimer();

function animate() {
  c.fillStyle = `black`;
  window.requestAnimationFrame(animate);
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = `rgba(255,255,255,0.12)`;
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  player.switchSprite(`idle`);

  if (keys.a.pressed && player.lastKey === `a` && player.position.x > 0) {
    player.velocity.x = -5;
    player.switchSprite(`run`);
  } else if (
    keys.d.pressed &&
    player.lastKey === `d` &&
    player.position.x < canvas.width - 100
  ) {
    player.switchSprite(`run`);
    player.velocity.x = 5;
  }

  if (player.velocity.y < 0) {
    player.switchSprite(`jump`);
  }

  //enemy movement
  enemy.switchSprite(`idle`);
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === `ArrowLeft` &&
    enemy.position.x > 0
  ) {
    enemy.switchSprite(`run`);
    enemy.velocity.x = -5;
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === `ArrowRight` &&
    enemy.position.x < canvas.width - 100
  ) {
    enemy.switchSprite(`run`);
    enemy.velocity.x = 5;
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite(`jump`);
  }

  //detect for player colission && enemy gets fit
  if (
    rectangularCollission({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to(`#enemyHealth`, {
      width: enemy.health + `%`
    });
  }
  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //detect for enemy colission && player take hit
  if (
    rectangularCollission({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to(`#playerHealth`, {
      width: player.health + `%`
    });
  }
  // enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if ((player.health <= 0) | (enemy.health <= 0)) {
    determineWinner({ player, enemy, timerID });
  }
}
animate();

window.addEventListener(`keydown`, (event) => {
  if (!player.dead) {
    switch (event.key) {
      // player keys
      case `d`:
        keys.d.pressed = true;
        player.lastKey = `d`;
        break;
      case `a`:
        keys.a.pressed = true;
        player.lastKey = `a`;
        break;
      case `w`:
        if (
          player.position.y + player.height + player.velocity.y >=
          canvas.height - 45
        ) {
          player.image = player.sprites.run.image;
          player.velocity.y = -17;
        }
        break;
      case `s`:
        if (timer > 0 && !keys.s.pressed) {
          keys.s.pressed = true;
          player.attack();
        }
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      //enemy keys
      case `ArrowRight`:
        keys.ArrowRight.pressed = true;
        enemy.lastKey = `ArrowRight`;
        break;

      case `ArrowLeft`:
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = `ArrowLeft`;
        break;

      case `ArrowUp`:
        if (
          enemy.position.y + enemy.height + enemy.velocity.y >=
          canvas.height - 45
        ) {
          enemy.velocity.y = -17;
        }
        break;
      case `ArrowDown`:
        if (timer > 0 && !keys.ArrowDown.pressed) {
          keys.ArrowDown.pressed = true;
          enemy.attack();
        }

        break;
    }
  }
});
window.addEventListener(`keyup`, (event) => {
  switch (event.key) {
    // player keys
    case `d`:
      keys.d.pressed = false;
      break;
    case `a`:
      keys.a.pressed = false;
      break;

    case `s`:
      keys.s.pressed = false;
      break;

    //enemy keys
    case `ArrowRight`:
      keys.ArrowRight.pressed = false;
      break;

    case `ArrowLeft`:
      keys.ArrowLeft.pressed = false;
      break;

    case `ArrowDown`:
      keys.ArrowDown.pressed = false;
      break;
  }
});
