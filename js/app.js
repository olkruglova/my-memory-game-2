/* const listOfCards = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt",
  "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle", "fa fa-diamond", "fa fa-bomb",
  "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"];
*/

let card = document.getElementsByClassName('card')
let cards = [...card]
let deck = document.querySelector('.deck3')
let openedCards = []
let changeMovesNumber = document.querySelector('.moves')
let matchCount = 0
let matchedCards = []
let modal = document.querySelector('.modal')
let starN = 0
let time = '00:00'
let seconds = 0
let minutes = 0
let hours = 0
let moves = 0
let t
let timer = document.querySelector('.timer')
let modalHeading = document.querySelector('#modal-heading')
let modalMessage = ''
let timeTiger = 0
let playAgain = document.querySelector('#playAgain')
let shuffledCards = shuffle(cards)

// @description toggles open and show class to display cards
var displayCard = function () {
  this.classList.toggle('open')
  this.classList.toggle('show')
  this.classList.toggle('disabled')
}

/* start the game  from scratch  when page is refreshed / loads */
document.body.onload = newGame()

/*
*Setting up the cards for the game:
*Shuffle function from http://stackoverflow.com/a/2450976
*/

function shuffle (array) {
  var currentIndex = array.length
  var temporaryValue
  var randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

/*
*display the cards on the page
*loop through each card and create its HTML
*add each card's HTML to the page
*/

function newGame (cards) {
  for (let i = 0; i < shuffledCards.length; i++) {
    deck.appendChild(shuffledCards[i])
    shuffledCards[i].classList.remove('show', 'open', 'match', 'disabled')
  }

  matchCount = 0
  timeTiger = 0
  openedCards = []
  modalMessage.innerHTML = ''

  // set moves to "0"
  moves = 0
  changeMovesNumber.textContent = moves

  // set timer to "00:00"
  seconds = 0
  minutes = 0
  hours = 0
  var timer = document.querySelector('.timer')
  timer.innerHTML = '00:00'
  clearInterval(t)

  // set star rating
  document.querySelector('.one').innerHTML = '<i class="fa fa-star"></i>'
  document.querySelector('.two').innerHTML = '<i class="fa fa-star"></i>'
}

/* this function starts different function to show and match cards */
for (let shuffledCard of shuffledCards) {
  shuffledCard.addEventListener('click', displayCard)
  shuffledCard.addEventListener('click', clickedCards)
}

/* once the card is clicked the time and comparison initialise */
function clickedCards (event) {
  // display cards
  openedCards.push(this)
  // this.classList.add('open', 'show')

  timeTiger++
  if (timeTiger === 1) {
    startTimer()
  }

  if (openedCards.length === 2) {
    addMoves()
    if (openedCards[0].innerHTML === openedCards[1].innerHTML) {
      matchCount++
      matchedCards.push(openedCards[0])
      matchedCards.push(openedCards[1])
      stopClock()
      match()
    } else {
      notMatch()
    }
  }

  function startTimer () {
    clearInterval(t)
    t = setInterval(function () {
      timer.textContent = time
      seconds++

      if (seconds === 60) {
        seconds = 0
        minutes++
        if (minutes === 60) {
          minutes = 0
          seconds = 0
        }
      }
      timer.textContent =
        (minutes < 10 ? '0' + minutes.toString() : minutes) +
        ':' +
        (seconds < 10 ? '0' + seconds.toString() : seconds)
    },
    1000)
  }

  /* check whether the two cards match or not */
  function match () {
    openedCards[0].classList.add('match', 'disabled')
    openedCards[1].classList.add('match', 'disabled')
    openedCards[0].classList.remove('show', 'open', 'no-event')
    openedCards[1].classList.remove('show', 'open', 'no-event')
    openedCards = []
  }

  function notMatch () {
    openedCards[0].classList.add('unmatched')
    openedCards[1].classList.add('unmatched')
    disable()

    setTimeout(function () {
      openedCards[0].classList.remove('open', 'show', 'no-event', 'unmatched')
      openedCards[1].classList.remove('open', 'show', 'no-event', 'unmatched')
      enable()
      openedCards = []
    },
    500
    )
  }
}

// disable cards temporarily
function disable () {
  Array.prototype.filter.call(cards, function (card) {
    card.classList.add('disabled')
  })
}

// @description enable cards and disable matched cards
function enable () {
  Array.prototype.filter.call(cards, function (card) {
    card.classList.remove('disabled')
    for (var i = 0; i < matchedCards.length; i++) {
      matchedCards[i].classList.add('disabled')
    }
  })
}

/* increment the move counter and display it on the page */
function addMoves () {
  moves++
  changeMovesNumber.innerHTML = moves
  starRating()
}

/* deduct stars */
function starRating () {
  if (moves > 8 && moves < 12) {
    starN = 3
  }

  if (moves > 12 && moves < 18) {
    document.querySelector('.one').innerHTML = '<i class="fa fa-star-o"></i>'
    starN = 2
  }

  if (moves > 22) {
    document.querySelector('.one').innerHTML = '<i class="fa fa-star-o"></i>'
    document.querySelector('.two').innerHTML = '<i class="fa fa-star-o"></i>'
    starN = 1
  }
}

/* restart the game */
let restart = document.querySelector('.restart')
restart.onclick = function () {
  shuffle(cards)
  newGame()
}

function stopClock () {
  if (matchCount === 8) {
    clearInterval(t)
    gameEnd()
  }
}

/* MODAL - display a message with the final score */
/* When the user clicks on the last card the modal oopens */
function gameEnd () {
  modalMessage = document.createElement('p')
  modalMessage.innerHTML = '<p>Your time  <strong>' +
    timer.textContent +
    '</strong>, <br> You did it in  <strong>' +
    moves +
    '</strong> moves <br> you stars: <strong>' +
    starN +
    '</strong> ! </p>'
  modalMessage.classList.add('modal-text')
  modalHeading.appendChild(modalMessage)
  modal.style.display = 'block'
}

// When the user clicks on the button, close it
playAgain.onclick = function () {
  modal.style.display = 'none'
  shuffle(cards)
  newGame()
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = 'none'
    shuffle(cards)
    newGame()
  }
}
