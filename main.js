const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const images = {
  sprite1: './assets/sprite1.png',
  sprite2: './assets/sprite2.png',
  grass: './assets/grass.png',
  bg: './assets/froggrtBg2.png',
  virus: './assets/coronaRedSmall.png',
  pill: './assets/pill.png',
}
let grass = new Image()
grass.src = images.grass
const cycleLoopDown = [0, 2]
const grid = 30
let attached = null
let frames = 0
let randomSpeed = 0
const totalRows = canvas.height / grid
const enemies = []
const leftEnemies = []
const topLeftEnemies = []
const topRightEnemies = []
const topLeftLanes = [360, 360, 360, 420, 420, 420, 480, 480, 480, 540, 540, 540]
const leftLanes = [90, 90, 90, 150, 150, 150, 210, 210, 210, 270, 270, 270]
const topRightLanes = [330, 330, 330, 330, 390, 390, 390, 390, 390, 450, 450, 450, 510, 510, 510]
const lanes = [60, 60, 60, 120, 120, 120, 180, 180, 180, 240, 240, 240]

// SQUARE CLASS
class Background {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.bgImg = new Image()
    this.bgImg.src = images.bg
  }

  drawBg() {
    context.drawImage(this.bgImg, this.x, this.y, this.width, this.height)
  }
}

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
    this.audio = new Audio('./assets/Untitled-[AudioTrimmer.com] (1).mp3')
    this.imgSprite1 = new Image()
    this.imgSprite1.src = './assets/sprite1.png'
    // imgSprite1.onload = function () {
    //   init()
    // }
    this.imgSprite2 = new Image()
    this.imgSprite2.src = './assets/sprite2.png'
    this.type = type
    this.intialPos = [this.x, this.y]
    this.animate = 0
    this.position = 0
    this.animate2 = 0
    this.position2 = 0
  }

  drawPerson() {
    if (this.type === 'sprite1') {
      context.drawImage(
        this.imgSprite1,
        this.animate * 49.25,
        this.position * 64,
        49.25,
        64,
        this.x,
        this.y,
        grid - 1,
        grid - 1
      )
      // context.fillStyle = 'green'
      // context.fillRect(this.x, this.y, this.width, this.height)
    } else if (this.type === 'sprite2') {
      context.drawImage(
        this.imgSprite2,
        this.animate2 * 83.5,
        this.position2 * 125,
        83.5,
        125,
        this.x,
        this.y,
        grid - 1,
        grid - 1
      )
    }
  }

  moveUp() {
    this.y -= grid
    this.animate = 2
    this.position = 3
  }

  moveDown() {
    this.y += grid
    this.animate = 2
    this.position = 0
  }

  moveLeft() {
    this.x -= grid
    this.animate = 1
    this.position = 2
  }

  moveRight() {
    this.x += grid
    this.animate = 2
    this.position = 1
  }

  moveUpPlayer2() {
    this.y -= grid
    this.animate2 = 1
    this.position2 = 1
  }

  moveDownPlayer2() {
    this.y += grid
    this.animate2 = 1
    this.position2 = 0
  }

  moveLeftPlayer2() {
    this.x -= grid
    this.animate2 = 1
    this.position2 = 2
  }

  moveRightPlayer2() {
    this.x += grid
    this.animate2 = 2
    this.position2 = 3
  }

  attach() {
    if (this.y < canvas.height - 300) {
      let ok = false
      enemies.forEach((enemy) => {
        if (this.isTouching(enemy)) {
          ok = true
          attached = enemy
          if (attached !== null) {
            this.x = attached.x
          }
        } else {
        }
      })
    } else if (this.y > canvas.height - 300) {
      enemies.forEach((enemy) => {
        if (this.isTouching(enemy)) {
          this.x = this.intialPos[0]
          this.y = this.intialPos[1]
          // this.audio.play()
        }
      })
    }
  }

  attachBack() {
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
    } else if (this.y > canvas.height - 300) {
      leftEnemies.forEach((enemy) => {
        if (this.isTouching(enemy)) {
          this.x = this.intialPos[0]
          this.y = this.intialPos[1]
          // this.audio.play()
        }
      })
    }
  }
}

//ENEMY CLASS

class Enemy extends Square {
  constructor(x, y, width, height, speed, image) {
    super(x, y, width, height)
    this.speed = speed
    this.image = new Image()
    this.image.src = image
  }

  draw() {
    this.x += this.speed
    if (this.x > canvas.width) this.x = -canvas.width
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }

  drawBack() {
    this.x += this.speed
    if (this.x < -canvas.width) this.x = canvas.width + grid
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

//Instances
const background = new Background()
const person = new Person(300, 573, grid - 3, grid - 3, 'sprite1')
const person2 = new Person(200, 573, grid - 3, grid - 3, 'sprite2')

function generateEnemies() {
  const random = Math.floor(Math.random() * lanes.length)
  for (let i = 0; i < totalRows; i++) {
    if (i === 1 || i === 10 || i === 19 || i === 20) {
      continue
    } else if (frames % 250 === 0) {
      enemies.push(
        new Enemy(0 - grid, canvas.height - lanes[random], grid * 2, grid, 0.3, images.virus)
      )
    }
  }

  enemies.forEach((enemy, index) => {
    if (enemy.x >= canvas.width) {
      enemies.splice(index, 20)
    }
  })
}

function generateEnemiesTopRight() {
  const random = Math.floor(Math.random() * topRightLanes.length)
  for (let i = 0; i < totalRows; i++) {
    if (i === 1 || i === 10 || i === 19 || i === 20) {
      continue
    } else if (frames % 250 === 0) {
      topRightEnemies.push(
        new Enemy(0 - grid, canvas.height - topRightLanes[random], grid * 2, grid, 0.3, images.pill)
      )
    }
  }

  topRightEnemies.forEach((enemy, index) => {
    if (enemy.x >= canvas.width) {
      topRightEnemies.splice(index, 20)
    }
  })
}

//RIGHT TO LEFT

function generateEnemiesBack() {
  const random = Math.floor(Math.random() * leftLanes.length)
  for (let i = 0; i < totalRows; i++) {
    if (i === 1 || i === 10 || i === 19 || i === 20) {
      continue
    } else if (frames % 250 === 0) {
      leftEnemies.push(
        new Enemy(
          canvas.width + grid,
          canvas.height - leftLanes[random],
          grid * 2,
          grid,
          -0.3,
          images.virus
        )
      )
    }
  }

  leftEnemies.forEach((en, index, arr0) => {
    if (en.x + en.width < -canvas.width) {
      leftEnemies.splice(index, 20)
    }
  })
}

function generateEnemiesTopLeft() {
  const random = Math.floor(Math.random() * topLeftLanes.length)
  for (let i = 0; i < totalRows; i++) {
    if (i === 1 || i === 10 || i === 19 || i === 20) {
      continue
    } else if (frames % 250 === 0) {
      topLeftEnemies.push(
        new Enemy(
          canvas.width + grid,
          canvas.height - topLeftLanes[random],
          grid * 2,
          grid,
          -0.3,
          images.pill
        )
      )
    }
  }

  topLeftEnemies.forEach((enemy, index) => {
    if (enemy.x < -canvas.width) {
      topLeftEnemies.splice(index, 20)
    }
  })
}

function drawEnemy() {
  enemies.forEach((enemy) => {
    enemy.draw()
  })
}

function drawTopRightEnemy() {
  topRightEnemies.forEach((enemy) => {
    enemy.draw()
    if (person.isTouching(enemy)) {
      p1JumpOn(enemy)
      console.log('touching')
    }
    if (person2.isTouching(enemy)) {
      p2JumpOn(enemy)
      console.log('Touching')
    }
  })
}

function drawEnemyBack() {
  leftEnemies.forEach((enemy) => {
    enemy.drawBack()
  })
}

function drawTopLeftEnemy() {
  topLeftEnemies.forEach((enemy) => {
    enemy.drawBack()
    if (person.isTouching(enemy)) {
      p1JumpOn(enemy)
    }
    if (person2.isTouching(enemy)) {
      p2JumpOn(enemy)
    }
  })
}

function resetGamePlayer1() {
  let audio = new Audio('./assets/Untitled-[AudioTrimmer.com] (1).mp3')
  audio.play()
  person.x = 300
  person.y = 573
}

function resetGamePlayer2() {
  person2.x = 200
  person2.y = 573
}

function p1JumpOn(other) {
  person.x = other.x
  person.y = other.y
}

function p2JumpOn(other) {
  person2.x = other.x
  person2.y = other.y
}

function update() {
  frames++
  context.clearRect(0, 0, canvas.width, canvas.height)
  background.drawBg()
  generateEnemiesBack()
  generateEnemies()
  generateEnemiesTopLeft()
  generateEnemiesTopRight()
  drawEnemy()
  drawEnemyBack()
  drawTopLeftEnemy()
  drawTopRightEnemy()
  person.attach()
  person.attachBack()
  person2.attach()
  person2.attachBack()
  person.drawPerson()
  person2.drawPerson()
  if (frames % 42 === 0) {
    person.animate++
    if (person.animate === 4) person.animate = 0
  }
  if (frames % 42 === 0) {
    person2.animate2++
    if (person2.animate2 === 4) person2.animate2 = 0
  }
  topLeftEnemies.forEach((enemy) => {
    if (!person.isTouching(enemy)) {
      if (person.y < canvas.height - 570) {
        person.x = person.intialPos[0]
        person.y = person.intialPos[1]
      }
    }
  })
  topRightEnemies.forEach((enemy) => {
    if (!person.isTouching(enemy)) {
      if (person.y < canvas.height - 570) {
        person.x = person.intialPos[0]
        person.y = person.intialPos[1]
      }
    }
  })
  leftEnemies.forEach((enemy) => {
    if (!person2.isTouching(enemy)) {
      if (person2.y < canvas.height - 570) {
        person2.x = person2.intialPos[0]
        person2.y = person2.intialPos[1]
      }
    }
  })
  enemies.forEach((enemy) => {
    if (!person2.isTouching(enemy)) {
      if (person2.y < canvas.height - 570) {
        person2.x = person2.intialPos[0]
        person2.y = person2.intialPos[1]
      }
    }
  })

  // if((person.x < 0) || (person.x > canvas.width))
}

setInterval(update, 60 / 1000)

window.addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 38:
      person.moveUp()
      break
    case 40:
      person.moveDown()
      // person.animateDown()
      break
    case 37:
      person.moveLeft()
      break
    case 39:
      person.moveRight()
      break
  }

  switch (keyCode) {
    case 87:
      person2.moveUpPlayer2()
      break
    case 83:
      person2.moveDownPlayer2()
      break
    case 65:
      person2.moveLeftPlayer2()
      break
    case 68:
      person2.moveRightPlayer2()
      break
  }
})

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

// function checkCrash() {
//   enemies.forEach((enemy) => {
//     if (person.isTouching(enemy)) {
//       resetGame()
//     }
//   })
// }

// function checkCrashBack() {
//   leftEnemies.forEach((enemy) => {
//     if (person.isTouching(enemy)) {
//       resetGame()
//     }
//   })
// }

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

// context.fillStyle = 'Yellow'
// context.fillRect(0, canvas.height - 600, canvas.width, grid)
// context.fillRect(0, canvas.height - 570, canvas.width, grid)
// context.fillRect(0, canvas.height - 300, canvas.width, grid)
// context.fillRect(0, canvas.height - 30, canvas.width, grid)

// context.drawImage(grass, 0, canvas.height - 600, canvas.width, grid)
// context.drawImage(grass, 0, canvas.height - 570, canvas.width, grid)
// context.drawImage(grass, 0, canvas.height - 300, canvas.width, grid)
// context.drawImage(grass, 0, canvas.height - 30, canvas.width, grid)
