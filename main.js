const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const images = {
  sprite1: './assets/sprite1.png',
  sprite2: './assets/sprite2.png',
  grass: './assets/grass.png',
  bg: './assets/froggrtBg4.png',
  virus: './assets/coronaRedSmall.png',
  pill: './assets/pill.png',
  toiletPaper: './assets/toiletPaper.png',
}

const themeSong = new Audio('./assets/476546__mrthenoronha__platform-game-theme-loop-2.wav')
const cheer = new Audio('./assets/333404__jayfrosting__cheer-2.wav')

let interval
const cycleLoopDown = [0, 2]
const grid = 30
let frames = 0
const viruses = []
const pills = []
let onPill = false
let lives = []

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
    this.jump = new Audio('./assets/350905__cabled-mess__jump-c-05.wav')
    this.audio = new Audio('./assets/Untitled-[AudioTrimmer.com] (1).mp3')
    this.imgSprite1 = new Image()
    this.imgSprite1.src = './assets/sprite1.png'
    this.imgSprite2 = new Image()
    this.imgSprite2.src = './assets/sprite2.png'
    this.type = type
    this.intialPos = [this.x, this.y]
    this.animate = 0
    this.position = 0
    this.animate2 = 0
    this.position2 = 0
    this.lives = 3
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
    this.jump.play()
  }

  moveDown() {
    this.y += grid
    this.animate = 2
    this.position = 0
    this.jump.play()
  }

  moveLeft() {
    this.x -= grid
    this.animate = 1
    this.position = 2
    this.jump.play()
  }

  moveRight() {
    this.x += grid
    this.animate = 2
    this.position = 1
    this.jump.play()
  }

  moveUpPlayer2() {
    this.y -= grid
    this.animate2 = 1
    this.position2 = 1
    this.jump.play()
  }

  moveDownPlayer2() {
    this.y += grid
    this.animate2 = 1
    this.position2 = 0
    this.jump.play()
  }

  moveLeftPlayer2() {
    this.x -= grid
    this.animate2 = 1
    this.position2 = 2
    this.jump.play()
  }

  moveRightPlayer2() {
    this.x += grid
    this.animate2 = 2
    this.position2 = 3
    this.jump.play()
  }

  resetPosition() {
    this.x = this.intialPos[0]
    this.y = this.intialPos[1]
    this.audio.play()
  }
}

class ToiletPaper {
  constructor(x, y, image) {
    this.x = x
    this.y = y
    this.width = 30
    this.height = 50
    this.image = new Image()
    this.image.src = images.toiletPaper
  }

  draw() {
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

class Virus {
  constructor(x, y, image, speed) {
    this.x = x
    this.y = y
    this.width = 60
    this.height = 30
    this.image = new Image()
    this.image.src = image
    this.speed = speed
  }

  drawRightToLeft() {
    this.x -= this.speed
    if (this.x < -canvas.width) this.x = canvas.width + grid
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }

  drawLeftToRight() {
    this.x += this.speed
    if (this.x > canvas.width) this.x = -canvas.width
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

class Pill {
  constructor(x, y, image, speed) {
    this.x = x
    this.y = y
    this.width = 60
    this.height = 30
    this.image = new Image()
    this.image.src = image
    this.speed = speed
  }

  drawRightToLeft() {
    this.x -= this.speed
    if (this.x < -canvas.width) this.x = canvas.width
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }

  drawLeftToRight() {
    this.x += this.speed
    if (this.x > canvas.width) this.x = -canvas.width
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

//Instances
const background = new Background()
const person = new Person(300, 573, grid - 3, grid - 3, 'sprite1')
const person2 = new Person(200, 573, grid - 3, grid - 3, 'sprite2')
const toilet = new ToiletPaper(200, 2, images.toiletPaper)
const toilet2 = new ToiletPaper(300, 2, images.toiletPaper)
const toilet3 = new ToiletPaper(400, 2, images.toiletPaper)

//VIRUS INSTANCES
const _1virus1 = new Virus(canvas.width / 4, canvas.height - 60, images.virus, 1.7)
const _2virus1 = new Virus(canvas.width / 2, canvas.height - 60, images.virus, 1.7)
const _3virus1 = new Virus(canvas.width * (3 / 4), canvas.height - 60, images.virus, 1.7)
const _1virus2 = new Virus(canvas.width / 4, canvas.height - 90, images.virus, 2.1)
const _2virus2 = new Virus(canvas.width / 2, canvas.height - 90, images.virus, 2.1)
const _3virus2 = new Virus(canvas.width * (3 / 4), canvas.height - 90, images.virus, 2.1)
const _1virus3 = new Virus(canvas.width / 4, canvas.height - 120, images.virus, 1.5)
const _2virus3 = new Virus(canvas.width / 2, canvas.height - 120, images.virus, 1.5)
const _3virus3 = new Virus(canvas.width * (3 / 4), canvas.height - 120, images.virus, 1.5)
const _1virus4 = new Virus(canvas.width / 4, canvas.height - 150, images.virus, 1)
const _2virus4 = new Virus(canvas.width / 2, canvas.height - 150, images.virus, 1)
const _3virus4 = new Virus(canvas.width * (3 / 4), canvas.height - 150, images.virus, 1)
const _1virus5 = new Virus(canvas.width / 4, canvas.height - 180, images.virus, 2)
const _2virus5 = new Virus(canvas.width / 2, canvas.height - 180, images.virus, 2)
const _3virus5 = new Virus(canvas.width * (3 / 4), canvas.height - 180, images.virus, 2)
const _1virus6 = new Virus(canvas.width / 4, canvas.height - 210, images.virus, 1.6)
const _2virus6 = new Virus(canvas.width / 2, canvas.height - 210, images.virus, 1.6)
const _3virus6 = new Virus(canvas.width * (3 / 4), canvas.height - 210, images.virus, 1.6)
const _1virus7 = new Virus(canvas.width / 4, canvas.height - 240, images.virus, 1.2)
const _2virus7 = new Virus(canvas.width / 2, canvas.height - 240, images.virus, 1.2)
const _3virus7 = new Virus(canvas.width * (3 / 4), canvas.height - 240, images.virus, 1.2)
const _1virus8 = new Virus(canvas.width / 4, canvas.height - 270, images.virus, 1.3)
const _2virus8 = new Virus(canvas.width / 2, canvas.height - 270, images.virus, 1.3)
const _3virus8 = new Virus(canvas.width * (3 / 4), canvas.height - 270, images.virus, 1.3)

//PILLS INSTANC(E
const _1pill1 = new Pill(canvas.width / 4, canvas.height - 330, images.pill, 0.5)
const _2pill1 = new Pill(canvas.width / 2, canvas.height - 330, images.pill, 0.5)
const _3pill1 = new Pill(canvas.width * (3 / 4), canvas.height - 330, images.pill, 0.5)
const _1pill2 = new Pill(canvas.width / 4, canvas.height - 360, images.pill, 0.3)
const _2pill2 = new Pill(canvas.width / 2, canvas.height - 360, images.pill, 0.3)
const _3pill2 = new Pill(canvas.width * (3 / 4), canvas.height - 360, images.pill, 0.3)
const _1pill3 = new Pill(canvas.width / 4, canvas.height - 390, images.pill, 0.4)
const _2pill3 = new Pill(canvas.width / 2, canvas.height - 390, images.pill, 0.4)
const _3pill3 = new Pill(canvas.width * (3 / 4), canvas.height - 390, images.pill, 0.4)
const _1pill4 = new Pill(canvas.width / 4, canvas.height - 420, images.pill, 0.5)
const _2pill4 = new Pill(canvas.width / 2, canvas.height - 420, images.pill, 0.5)
const _3pill4 = new Pill(canvas.width * (3 / 4), canvas.height - 420, images.pill, 0.5)
const _1pill5 = new Pill(canvas.width / 4, canvas.height - 450, images.pill, 0.6)
const _2pill5 = new Pill(canvas.width / 2, canvas.height - 450, images.pill, 0.6)
const _3pill5 = new Pill(canvas.width * (3 / 4), canvas.height - 450, images.pill, 0.6)
const _1pill6 = new Pill(canvas.width / 4, canvas.height - 480, images.pill, 0.7)
const _2pill6 = new Pill(canvas.width / 2, canvas.height - 480, images.pill, 0.7)
const _3pill6 = new Pill(canvas.width * (3 / 4), canvas.height - 480, images.pill, 0.7)
const _1pill7 = new Pill(canvas.width / 4, canvas.height - 510, images.pill, 0.8)
const _2pill7 = new Pill(canvas.width / 2, canvas.height - 510, images.pill, 0.8)
const _3pill7 = new Pill(canvas.width * (3 / 4), canvas.height - 510, images.pill, 0.8)
const _1pill8 = new Pill(canvas.width / 4, canvas.height - 540, images.pill, 0.9)
const _2pill8 = new Pill(canvas.width / 2, canvas.height - 540, images.pill, 0.9)
const _3pill8 = new Pill(canvas.width * (3 / 4), canvas.height - 540, images.pill, 0.9)

function update() {
  frames++
  context.clearRect(0, 0, canvas.width, canvas.height)
  background.drawBg()
  themeSong.play()
  _1virus1.drawLeftToRight()
  _2virus1.drawLeftToRight()
  _3virus1.drawLeftToRight()
  _1virus2.drawRightToLeft()
  _2virus2.drawRightToLeft()
  _3virus2.drawRightToLeft()
  _1virus3.drawLeftToRight()
  _2virus3.drawLeftToRight()
  _3virus3.drawLeftToRight()
  _1virus4.drawRightToLeft()
  _2virus4.drawRightToLeft()
  _3virus4.drawRightToLeft()
  _1virus5.drawLeftToRight()
  _2virus5.drawLeftToRight()
  _3virus5.drawLeftToRight()
  _1virus6.drawRightToLeft()
  _2virus6.drawRightToLeft()
  _3virus6.drawRightToLeft()
  _1virus7.drawLeftToRight()
  _2virus7.drawLeftToRight()
  _3virus7.drawLeftToRight()
  _1virus8.drawRightToLeft()
  _2virus8.drawRightToLeft()
  _3virus8.drawRightToLeft()
  _1pill1.drawRightToLeft()
  _2pill1.drawRightToLeft()
  _3pill1.drawRightToLeft()
  _1pill2.drawLeftToRight()
  _2pill2.drawLeftToRight()
  _3pill2.drawLeftToRight()
  _1pill3.drawRightToLeft()
  _2pill3.drawRightToLeft()
  _3pill3.drawRightToLeft()
  _1pill4.drawLeftToRight()
  _2pill4.drawLeftToRight()
  _3pill4.drawLeftToRight()
  _1pill5.drawRightToLeft()
  _2pill5.drawRightToLeft()
  _3pill5.drawRightToLeft()
  _1pill6.drawLeftToRight()
  _2pill6.drawLeftToRight()
  _3pill6.drawLeftToRight()
  _1pill7.drawRightToLeft()
  _2pill7.drawRightToLeft()
  _3pill7.drawRightToLeft()
  _1pill8.drawLeftToRight()
  _2pill8.drawLeftToRight()
  _3pill8.drawLeftToRight()
  drawToiletPaper()
  checkIfPlayerOnPill()
  checkIfPlayer2OnPill()
  checkCollisionVirus()
  checkProgressCount1()
  checkProgressCount2()
  checkWinPerson1()
  checkWinPerson2()
  person.drawPerson()
  person2.drawPerson()
  pills.forEach((pill) => {
    if (person.isTouching(pills)) onPill = true
  })
  if (checkInfectedPerson()) person.resetPosition()
  if (checkInfectedPerson2()) person2.resetPosition()
  if (person.x < 0 || person.x > canvas.width + grid) {
    person.resetPosition()
  }
  if (person2.x < 0 || person2.x > canvas.width + grid) {
    person2.resetPosition()
  }
  if (frames % 42 === 0) {
    person.animate++
    if (person.animate === 4) person.animate = 0
  }
  if (frames % 42 === 0) {
    person2.animate2++
    if (person2.animate2 === 4) person2.animate2 = 0
  }
}
interval = setInterval(update, 60 / 1000)

function drawToiletPaper() {
  switch (person.lives) {
    case 3:
      toilet.draw()
      toilet2.draw()
      toilet3.draw()
      break
    case 2:
      toilet.draw()
      toilet2.draw()
      break
    case 1:
      toilet2.draw()
      break
  }
}

function generateVirus() {
  viruses.push(
    _1virus1,
    _2virus1,
    _3virus1,
    _1virus2,
    _2virus2,
    _3virus2,
    _1virus3,
    _2virus3,
    _3virus3,
    _1virus4,
    _2virus4,
    _3virus4,
    _1virus5,
    _2virus5,
    _3virus5,
    _1virus6,
    _2virus6,
    _3virus6,
    _1virus7,
    _2virus7,
    _3virus7,
    _1virus8,
    _2virus8,
    _3virus8
  )
}
generateVirus()

function generatePills() {
  pills.push(
    _1pill1,
    _2pill1,
    _3pill1,
    _1pill2,
    _2pill2,
    _3pill2,
    _1pill3,
    _2pill3,
    _3pill3,
    _1pill4,
    _2pill4,
    _3pill4,
    _1pill5,
    _2pill5,
    _3pill5,
    _1pill6,
    _2pill6,
    _3pill6,
    _1pill7,
    _2pill7,
    _3pill7,
    _1pill8,
    _2pill8,
    _3pill8
  )
}
generatePills()

let countPerson1 = 0
let countPerson2 = 0

function winnerPerson1() {
  context.font = '60px Mexcellent-Regular'
  context.fillStyle = 'white'
  context.fillText('Player1 Wins!', 150, 300)
  themeSong.pause()
  cheer.play()
  clearInterval(interval)
}

function winnerPerson2() {
  context.font = '60px Mexcellent-Regular'
  context.fillStyle = 'yellow'
  context.fillText('Player2 Wins!', 150, 300)
  themeSong.pause()
  cheer.play()
  clearInterval(interval)
}

function checkProgressCount1() {
  if (person.y < canvas.height - 570) {
    countPerson1++
    person.lives--
    person.x = person.intialPos[0]
    person.y = person.intialPos[1]
  }
}

function checkProgressCount2() {
  if (person2.y < canvas.height - 570) {
    countPerson2++
    person.lives--
    person2.x = person2.intialPos[0]
    person2.y = person2.intialPos[1]
  }
}

function checkWinPerson1() {
  if (countPerson1 == 2) winnerPerson1()
}

function checkWinPerson2() {
  if (countPerson2 == 2) winnerPerson2()
}

function checkCollisionVirus() {
  viruses.forEach((virus) => {
    if (person.isTouching(virus)) {
      person.resetPosition()
    }
    if (person2.isTouching(virus)) {
      person2.resetPosition()
    }
  })
}

function personJumpOn(item) {
  person.x = item.x
  person.y = item.y
}

function person2JumpOn(item) {
  person2.x = item.x
  person2.y = item.y
}

function checkIfPlayerOnPill() {
  pills.forEach((pill) => {
    if (person.isTouching(pill)) {
      personJumpOn(pill)
      onPill = true
    }
  })
}

function checkIfPlayer2OnPill() {
  pills.forEach((pill) => {
    if (person2.isTouching(pill)) {
      person2JumpOn(pill)
      onPill = true
    }
  })
}

function checkInfectedPerson() {
  let infected = person.y <= 330 && person.y >= 540
  return !onPill && infected
}

function checkInfectedPerson2() {
  let infected = person2.y <= 330 && person2.y >= 540
  return !onPill && infected
}

function p1JumpOn(other) {
  person.x = other.x
  person.y = other.y
}

function p2JumpOn(other) {
  person2.x = other.x
  person2.y = other.y
}

window.addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 38:
      person.moveUp()
      break
    case 40:
      person.moveDown()
      break
    case 37:
      person.moveLeft()
      if (onPill) {
        if (person.y < canvas.height - 300 && person.y > canvas.height - 570) {
          onPill = false
          person.resetPosition()
        }
      }
      break
    case 39:
      person.moveRight()
      if (onPill) {
        if (person.y < canvas.height - 300 && person.y > canvas.height - 570) {
          onPill = false
          person.resetPosition()
        }
      }
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
      if (onPill) {
        if (person2.y < canvas.height - 300 && person2.y > canvas.height - 570) {
          onPill = false
          person2.resetPosition()
        }
      }
      break
    case 68:
      person2.moveRightPlayer2()
      if (onPill) {
        if (person2.y < canvas.height - 300 && person2.y > canvas.height - 570) {
          onPill = false
          person2.resetPosition()
        }
      }
      break
  }
})
