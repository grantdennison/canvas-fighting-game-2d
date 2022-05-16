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
    y: 0,
  },
  imageSrc: `./img/background.png`,
});
const shop = new Sprite({
  position: {
    x: 635,
    y: 188,
  },
  imageSrc: `./img/decorations/shop_anim.png`,
  scale: 1,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  colour: `red`,
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/warriorSimon/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 200,
    y: 157,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  colour: `blue`,
  offset: {
    x: -50,
    y: 0,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  c.fillStyle = `black`;
  window.requestAnimationFrame(animate);
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  // enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastKey === `a`) {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === `d`) {
    player.velocity.x = 5;
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === `ArrowLeft`) {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === `ArrowRight`) {
    enemy.velocity.x = 5;
  }
  //detect for player colission
  if (
    rectangularCollission({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector(`#enemyHealth`).style.width = enemy.health + `%`;
  }
  //detect for enemy colission
  if (
    rectangularCollission({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector(`#playerHealth`).style.width = player.health + `%`;
  }
  if ((player.health <= 0) | (enemy.health <= 0)) {
    determineWinner({ player, enemy, timerID });
  }
}
animate();

window.addEventListener(`keydown`, (event) => {
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
        player.velocity.y = -20;
      }
      break;
    case `s`:
      if (timer > 0) player.attack();
      break;
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
        enemy.velocity.y = -20;
      }
      break;
    case `ArrowDown`:
      if (timer > 0) enemy.attack();
      break;
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
    //enemy keys
    case `ArrowRight`:
      keys.ArrowRight.pressed = false;
      break;

    case `ArrowLeft`:
      keys.ArrowLeft.pressed = false;
      break;
  }
});
