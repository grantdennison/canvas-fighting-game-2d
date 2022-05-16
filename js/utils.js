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
}

let timer = 30;
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
