document.querySelector("#reset").addEventListener(`click`, resetGame);

function rectangularCollission({ rectangle1, rectangle2 }) {
  if (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  ) {
    return true;
  }
}

function determineWinner({ player, enemy, timerID }) {
  clearTimeout(timerID);
  timer = 0;
  displayText.style.display = `flex`;
  if (player.health === enemy.health) {
    displayText.innerHTML = `Tie`;
  } else if (player.health > enemy.health) {
    displayText.innerHTML = `Player 1 Winner`;
  } else {
    displayText.innerHTML = `Player 2 Winner`;
  }
  reset.style.display = `flex`;
}

let timer = 20;
let timerID;
function decreaseTimer() {
  if (timer > 0) {
    timerID = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy });
  }
}

function resetGame() {
  displayText.style.display = `none`;
  reset.style.display = `none`;
  timer = 20;
  player.health = 100;
  enemy.health = 100;
  player.position.x = 20;
  enemy.position.x = 930;
  player.position.y = 0;
  enemy.position.y = 0;
  player.dead = false;
  enemy.dead = false;
  gsap.to(`#enemyHealth`, {
    width: enemy.health + `%`
  });
  gsap.to(`#playerHealth`, {
    width: player.health + `%`
  });
  player.image = player.sprites.idle.image;
  player.framesMax = player.sprites.idle.framesMax;
  enemy.image = enemy.sprites.idle.image;
  enemy.framesMax = enemy.sprites.idle.framesMax;
  decreaseTimer();
}
