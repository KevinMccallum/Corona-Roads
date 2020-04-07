const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const grid = 30
const totalRows = canvas.height / grid
const enemies = []
const lanes = [60, 90, 120, 150, 180, 210, 240, 270, 330, 360, 390, 420, 450, 480, 510, 540]
let frames = 0
let randomSpeed = 0

// SQUARE CLASS
class Square {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}

//PERSON CLASS

class Person extends Square {
  constructor(x, y, width, height) {
    super(x, y, width, height)
  }

  drawPerson() {
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
}

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

function generateSpeed() {
  if (frames % 100 === 0) {
    randomSpeed = Math.floor(Math.random() * 3) + 1
  }
}

function generateEnemies() {
  for (let lane of lanes) {
    for (let i = 0; i < totalRows; i++) {
      if (i === 1 || i === 10 || i === 19 || i === 20) {
        continue
      } else if (frames % 250 === 0) {
        enemies.push(new Enemy(0 - grid, canvas.height - lane, grid, grid, randomSpeed))
      }
    }
  }
  enemies.forEach((enemy, index, arr) => {
    if (enemy.x + enemy.width > canvas.width) {
      arr.shift()
    }
  })
}

function drawEnemy() {
  enemies.forEach((enemy) => enemy.draw())
}

const person = new Person(300, 573, grid - 3, grid - 3)
// const row = new Row(generateLane())
// const enemy = new Enemy(0, canvas.height - grid * 2, grid * 2, grid, 1)

function update() {
  frames++
  context.clearRect(0, 0, canvas.width, canvas.height)
  person.drawPerson()
  generateSpeed()
  generateEnemies()
  drawEnemy()
  // row.draw()
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
})
