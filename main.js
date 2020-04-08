const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const images = {
  greenHair: './assets/greenHairCharacter.png',
  blondeHair: './assets/blondeHairCharacter.png',
}

const grid = 30
let attached = null
let frames = 0
let randomSpeed = 0
const totalRows = canvas.height / grid
const enemies = []
const leftEnemies = []
const leftLanes = [
  90,
  90,
  90,
  150,
  150,
  150,
  210,
  210,
  210,
  270,
  270,
  270,
  360,
  360,
  360,
  420,
  420,
  420,
  480,
  480,
  480,
  540,
  540,
  540,
]
const lanes = [
  60,
  60,
  60,
  120,
  120,
  120,
  180,
  180,
  180,
  240,
  240,
  240,
  330,
  330,
  330,
  330,
  330,
  330,
  390,
  390,
  390,
  390,
  390,
  450,
  450,
  450,
  510,
  510,
  510,
]

// SQUARE CLASS
class Square {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  isTouching(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    )
  }
}

//PERSON CLASS

class Person extends Square {
  constructor(x, y, width, height, type) {
    super(x, y, width, height)
    let imgGreen = new Image()
    imgGreen.src = images.greenHair
    let imgBlonde = new Image()
    imgBlonde = images.blondeHair
    this.type = type
  }

  drawPerson() {
    if (this.type === 'green') {
      context.drawImage()
    }
    context.fillStyle = 'green'
    context.fillRect(this.x, this.y, this.width, this.height)
  }

  moveUp() {
    this.y -= grid
  }

  moveDown() {
    this.y += grid
  }

  moveLeft() {
    this.x -= grid
  }

  moveRight() {
    this.x += grid
  }

  attach(enemies) {
    if (this.y < canvas.height - 300) {
      let ok = false
      enemies.forEach((enemy) => {
        if (this.isTouching(enemy)) {
          ok = true
          attached = enemy
          if (attached !== null) {
            this.x = attached.x
            this.y = attached.y
          }
        }
      })
      if (!ok) resetGame()
    }
  }

  // attach2(enemies) {
  //   if (person2.y < canvas.height - 300) {
  //     let ok = false
  //     enemies.forEach((enemy) => {
  //       if (this.isTouching(enemy)) {
  //         ok = true
  //         attached = enemy
  //         if (attached !== null) {
  //           this.x = attached.x
  //           this.y = attached.y
  //         }
  //       }
  //     })
  //   }
  // }

  attachBack(leftEnemies) {
    if (this.y < canvas.height - 300) {
      let ok = false
      leftEnemies.forEach((enemy) => {
        if (this.isTouching(enemy)) {
          ok = true
          attached = enemy
          if (attached !== null) {
            this.x = attached.x
          }
        }
      })
    }
  }

  // attachBack2(leftEnemies) {
  //   if (person2.y < canvas.height - 300) {
  //     let ok = false
  //     leftEnemies.forEach((enemy) => {
  //       if (this.isTouching(enemy)) {
  //         ok = true
  //         attached = enemy
  //         if (attached !== null) {
  //           this.x = attached.x
  //         }
  //       }
  //     })
  //   }
  // }

  // function checkAttachBack() {
  //   if (person.y < canvas.height - 300) {
  //     let ok = false
  //     leftEnemies.forEach((enemy) => {
  //       if (person.isTouching(enemy)) {
  //         ok = true
  //         person.attachBack(attached)
  //       }
  //     })
  //   }
  // }

  // jumpOn() {
  //   if (attached != null) {
  //     this.x += 0.3
  //   }
  // }
}

//ENEMY CLASS

class Enemy extends Square {
  constructor(x, y, width, height, speed) {
    super(x, y, width, height)
    this.speed = speed
  }

  draw() {
    this.x += this.speed
    if (this.x > canvas.width) this.x = -canvas.width
    context.fillStyle = 'red'
    context.fillRect(this.x, this.y, this.width, this.height)
  }

  drawBack() {
    this.x -= 0.3
    if (this.x < -canvas.width) this.x = canvas.width + grid
    context.fillStyle = 'red'
    context.fillRect(this.x, this.y, this.width, this.height)
  }
}

const person = new Person(300, 573, grid, grid - 2)
const person2 = new Person(200, 573, grid, grid - 2)

// class Row {
//   constructor(lane) {
//     this.x = 0
//     this.y = canvas.height - this.lane
//     this.width = canvas.width
//     this.height = grid
//     // this.speed = speed
//     this.lane = lane
//   }

//   draw() {
//     for (let i = 0; i < enemies.length; i++) {
//       context.fillStyle = 'blue'
//       context.fillRect(this.x, this.y, this.width, this.height)
//     }
//   }
// }

//MAIN FUNCTIONS

// const lane = lanes.forEach((lane) => lane)

// function generateSpeed() {
//   if (frames % 100 === 0) {
//     randomSpeed = Math.floor(Math.random() * 3) + 1
//   }
// }

function generateEnemies() {
  const random = Math.floor(Math.random() * lanes.length)
  for (let i = 0; i < totalRows; i++) {
    if (i === 1 || i === 10 || i === 19 || i === 20) {
      context.fillStyle = 'Yellow'
      context.fillRect(0, canvas.height - 600, canvas.width, grid)
      context.fillRect(0, canvas.height - 570, canvas.width, grid)
      context.fillRect(0, canvas.height - 300, canvas.width, grid)
      context.fillRect(0, canvas.height - 30, canvas.width, grid)
      continue
    } else if (frames % 250 === 0) {
      enemies.push(new Enemy(0 - grid, canvas.height - lanes[random], grid * 2, grid, 0.3))
    }
  }

  enemies.forEach((enemy, index, arr) => {
    if (enemy.x >= canvas.width) {
      arr.splice(index, 1)
      console.log('Ya se salio')
    }
  })
}
//RIGHT TO LEFT
function generateEnemiesBack() {
  const random = Math.floor(Math.random() * leftLanes.length)
  for (let i = 0; i < totalRows; i++) {
    if (i === 1 || i === 10 || i === 19 || i === 20) {
      context.fillStyle = 'Yellow'
      context.fillRect(0, canvas.height - 600, canvas.width, grid)
      context.fillRect(0, canvas.height - 570, canvas.width, grid)
      context.fillRect(0, canvas.height - 300, canvas.width, grid)
      context.fillRect(0, canvas.height - 30, canvas.width, grid)
      continue
    } else if (frames % 250 === 0) {
      leftEnemies.push(
        new Enemy(canvas.width + grid, canvas.height - leftLanes[random], grid * 2, grid, 1)
      )
    }
  }

  leftEnemies.forEach((en, index, arr0) => {
    if (en.x + en.width < -canvas.width) {
      arr0.splice(index, 1)
    }
  })
}

function drawEnemy() {
  enemies.forEach((enemy) => {
    enemy.draw()
  })
}

function drawEnemyBack() {
  leftEnemies.forEach((enemy) => {
    enemy.drawBack()
  })
}

function resetGame() {
  // let audio = new Audio('./assets/Untitled-[AudioTrimmer.com] (1).mp3')
  // audio.play()
  person.x = 300
  person.y = 573
}

function checkCrash() {
  enemies.forEach((enemy) => {
    if (person.isTouching(enemy)) {
      resetGame()
    }
  })
}

function checkCrashBack() {
  leftEnemies.forEach((enemy) => {
    if (person.isTouching(enemy)) {
      resetGame()
    }
  })
}

// function checkAttach() {
//   if (person.y < canvas.height - 300) {
//     let ok = false
//     enemies.forEach((enemy) => {
//       if (person.isTouching(enemy)) {
//         ok = true
//         person.attach(attached)
//       }
//     })
//   }
// }

// const row = new Row(generateLane())
// const enemy = new Enemy(0, canvas.height - grid * 2, grid * 2, grid, 1)

function update() {
  console.log(enemies.length)
  frames++
  context.clearRect(0, 0, canvas.width, canvas.height)
  generateEnemiesBack()
  generateEnemies()
  drawEnemy()
  drawEnemyBack()
  person.attach(enemies)
  person.attachBack(leftEnemies)
  person2.attach(enemies)
  person2.attachBack(leftEnemies)
  // checkAttachBack()
  // person.jumpOn()
  person.drawPerson()
  person2.drawPerson()
  checkCrash()
  checkCrashBack()
}

setInterval(update, 60 / 1000)

window.addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 38:
      return person.moveUp()
      break
    case 40:
      return person.moveDown()
      break
    case 37:
      return person.moveLeft()
      break
    case 39:
      return person.moveRight()
      break
  }

  switch (keyCode) {
    case 87:
      return person2.moveUp()
      break
    case 83:
      return person2.moveDown()
      break
    case 65:
      return person2.moveLeft()
      break
    case 68:
      return person2.moveRight()
      break
  }
})
