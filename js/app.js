// access to the main canvas and its context
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// period for refreshing the game play area
const refreshPeriod = 50;

// period for generating enemies
let generateEnemyPeriod = 2000;


// fastest and slowest enemy speed
let fastestSpeed = 10;
let slowestSpeed = 5;

// default difficult level: EASY
let currentDifficulty = "EASY";

// period for generating random items (gems, etc)
const generateItemPeriod = 2000;


// constants for generating background icons
const widthHeightFactor = 1.7;
const startOfRowsYPos = 50;
const totalRows = 7;
const numFixedObjects = 8;
const widthFixedObject = 60;
const heightFixedObject = widthFixedObject*widthHeightFactor;


/* this is used to subtract the y pos of the next row so that the row of 
lower layer objects overlap the row of  objects immediately above it */
const heightLag = 50;
const unitHorizontalMovement = widthFixedObject;
const unitVerticalMovement = heightFixedObject - heightLag;

// player will initially start on 3rd tile on the last row
const playerStartX = (widthFixedObject * 2); // x-pos for the 3rd tile
const playerStartY = startOfRowsYPos+( (totalRows-1) *(heightFixedObject-heightLag)); // y-pos for last row

// coordinates for the 3 main text display items
const lifeTextXPos = 350;
const lifeTextYPos = 50;

const difficultyTextXPos = 200;
const difficultyTextYPos = 50;

const scoreTextXPos = 20;
const scoreTextYPos = 50;

// the 4 different kinds of items that will be generated in the game play area
const specialItemTypes = ['Gem Blue','Gem Green','Gem Orange','Heart'];

// default starting value for lifes left and score
let lifes = 3;
let score = 0;

let defaultIconChoice = 'images/char-boy.png';

let initialStartOfGame = true;


// This is the base class for all the objects to be rendered in the game

class Component {

    constructor(xPos, yPos, width, height, imgName) {
      this.width = width;
      this.height = height;
      this.xPos = xPos;
      this.yPos = yPos;
      this.img = new Image();
      this.img.src = imgName;
    }
  
    updatePos() {
      context.drawImage(this.img, this.xPos, this.yPos, this.width, this.height);
    }


  // very basic implementation of collision detection
  crashWith(otherobj) {
    const myleft = this.xPos;
    const myright = this.xPos + (this.width);
    const mytop = this.yPos;
    const mybottom = this.yPos + (this.height);
    const otherleft = otherobj.xPos;
    const otherright = otherobj.xPos + (otherobj.width);
    const othertop = otherobj.yPos;
    const otherbottom = otherobj.yPos + (otherobj.height);

    let crash = false;
    if ((Math.abs(myleft - otherleft) < (this.width - 10))
    && Math.abs(othertop - mytop) < 20 ) {
      crash = true;
    }
    return crash;
  }
  
}

/* The Player class adds a few additional methods and properties specific to 
player functionality and also makes calls to the base Component class */

class Player extends Component {

  constructor(xPos, yPos, width, height, imgName) {
    super(xPos, yPos, width, height, imgName);
  }

  updatePos() {
    super.updatePos();
  }

  move(e) {

    //Move the player in all 4 directions in accordance to arrow key presses 

    if(e.key == "Right" || e.key == "ArrowRight") {
      this.xPos += unitHorizontalMovement;
      // Ensure that player does not move beyond the right boundary of the game area
      const rightBoundary = ((numFixedObjects-1) * widthFixedObject);
      if (this.xPos > rightBoundary) this.xPos = rightBoundary;
    } else if(e.key == "Left" || e.key == "ArrowLeft") {
      this.xPos -= unitHorizontalMovement;
      // Ensure that player does not move beyond the left boundary of the game area
      const leftBoundary = 0;
      if (this.xPos < leftBoundary) this.xPos = 0;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
      this.yPos += unitVerticalMovement;
      // Ensure that player does not move below the bottom boundary of the game area
      const bottomBoundary =  startOfRowsYPos + (totalRows-1) * (heightFixedObject - heightLag);
      if (this.yPos > bottomBoundary) this.yPos = bottomBoundary;
    } else if (e.key == "Up" || e.key == "ArrowUp") {
      this.yPos -= unitVerticalMovement;
      // Indicate end of game if player reaches the top boundary
      if (this.yPos < startOfRowsYPos+heightFixedObject-heightLag) {
        this.resetPosition();
        mainGameArea.doEndGame("YOU WIN !");
      }
    }  
    console.log("Player - x : " + this.xPos + " y : " + this.yPos);
  }

  // set the player back to the starting position of the game
  resetPosition() {
    this.xPos = playerStartX;
    this.yPos = playerStartY;
  }

}

/* The Enemy class adds an additional property specific to for its functionality, 
i.e. to move across to the right. It also makes calls to the base Component class*/

class Enemy extends Component {

  constructor(xPos, yPos, width, height, imgName,xMovement) {
    super(xPos, yPos, width, height, imgName);
    this.xMovement = xMovement;
  }
  // xMovement is responsible for the enemy movement across to the right
  updatePos() {
    super.updatePos();
    this.xPos += this.xMovement;
  }

}

/* The SpecialItem class adds an additional property that allows it to be 
identified so that appropriate action can be taken when the player collides with 
it
*/

class SpecialItem extends Component {

  constructor(xPos, yPos, width, height, imgName,itemName) {
    super(xPos, yPos, width, height, imgName);
    this.itemName = itemName;
  }

}

  /* This is the main object that keeps all the methods and variables relevant for
game play
 */
const mainGameArea = {

  updateInterval : null,
  generateEnemyInterval: null,
  generateItemInterval: null,
  stationaryComponents : [],
  enemies : [],



/*   The method that starts game play by initializing the appropriate variables
  and setting an interval timer to refresh the main game area, generate enemies
  and items periodically */

  start : function() {

    // need to bind function before calling as addEventListener and setInterval  
    // automatically resets this to undefined

    let boundPlayerMove = player.move.bind(player);
    document.addEventListener("keydown", boundPlayerMove, false);

    // Interval timer for refreshing main game play area
    let boundUpdateGameArea = mainGameArea.updateGameArea.bind(mainGameArea);
    this.updateInterval = setInterval(boundUpdateGameArea, refreshPeriod);

    // Interval timer for generating enemies periodically
    let boundGenerateEnemies = mainGameArea.generateEnemies.bind(mainGameArea);
    this.generateEnemyInterval = setInterval(boundGenerateEnemies, generateEnemyPeriod);

    // Interval timer for generating items periodically
    let boundGenerateItems = mainGameArea.generateItems.bind(mainGameArea);
    this.generateItemInterval = setInterval(boundGenerateItems, generateItemPeriod);

  },

  updateGameArea : function() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Provide the text for the lives left, score and difficulty level
    context.textAlign = "start";
    context.fillStyle = 'black';
    context.font = "30px Helvetica";
    context.fillText("Lives : " + lifes, lifeTextXPos, lifeTextYPos);
    context.fillText(currentDifficulty, difficultyTextXPos, difficultyTextYPos);
    context.font = "30px Helvetica";
    context.fillText("Score : " + score, scoreTextXPos, scoreTextYPos);

    /*    Draw the stationary background objects first so that everything else
    will subsequently appear over them */
    for (let component of this.stationaryComponents) 
      component.updatePos();

        // Next draw the player
      player.updatePos();  

      // Finally draw the enemies
      for (let pos = 0; pos < this.enemies.length; pos++) {
        this.enemies[pos].updatePos();

        // If the enemy collides with the player
        if (this.enemies[pos].crashWith(player)) {
          console.log("player died");
          lifes--;
          player.resetPosition();
          // when lives drop to 0, indicate game over
          if (lifes < 1)
            this.doEndGame("GAME OVER"); 
        }        
      }

      if (currentSpecialItem) {
        currentSpecialItem.updatePos();
        // The action to be taken when the player collides with 
        // a special item depends on the item itself
        if (currentSpecialItem.crashWith(player)) {
          // Increment lives if it is a heart
          if (currentSpecialItem.itemName == 'Heart')
            lifes++;
          // Increment score if it is a green gem  
          else if (currentSpecialItem.itemName == 'Gem Green')
            score++;            

          // remove the item
          currentSpecialItem = null;
        }

      }


  },


/*   Used for creating Component objects corresponding to all the background objects
  (water / stone / grass) */
  generateFixedObjects: function(startXPos, startYPos, numItems, numRows, width, height, imgToUse) {
    currentXPos = startXPos;
    currentYPos = startYPos;
    for (let rowNum = 0; rowNum < numRows; rowNum++) {
        for (let itemNum = 0; itemNum < numItems; itemNum++) {
          this.stationaryComponents.push (new Component(currentXPos, currentYPos, width, height, imgToUse));
          currentXPos += width;
        }
        currentYPos += (height-heightLag);
        currentXPos = startXPos;
    }
  },

 /*   Randomly generate an enemy on the left of any one of the 4 stony paths
  Also set it to move right at a random speed */
  generateEnemies: function() {
    const randomRow = Math.floor(Math.random() * 4) + 1;  // returns a random integer from 1 to 4
    const enemySpeed =  Math.floor(Math.random() * (fastestSpeed - slowestSpeed) ) + slowestSpeed;
    const enemyYPos = startOfRowsYPos+(randomRow *(heightFixedObject-heightLag)) - 10;
    this.enemies.push(new Enemy(0, enemyYPos, widthFixedObject, heightFixedObject, 'images/enemy-bug.png',enemySpeed));
  }, 

  /*   Randomly generate an item anywhere in the stony path area. 
  This can either be : 'Gem Blue','Gem Green','Gem Orange' or 'Heart'
  */
 generateItems: function() {
  const scaleFactor = 0.7;
  const xOffset = 10;
  const yOffset = 8;
  
  // returns a random integer from 1 to 4
  const randomRow = Math.floor(Math.random() * 4) + 1;  
  
  // returns a random integer from 0 to numFixedObjects-1
  const randomColumn = Math.floor(Math.random() * numFixedObjects);

  // returns a random integer from 0 to specialItemTypes.length-1
  const randomItem = Math.floor(Math.random() * specialItemTypes.length);
  // const randomItem = 2;

  const itemYPos = startOfRowsYPos+(randomRow *(heightFixedObject-heightLag))+yOffset;
  const itemXPos = (randomColumn*widthFixedObject)+xOffset;
  currentSpecialItem = new SpecialItem(itemXPos, itemYPos, widthFixedObject*scaleFactor, heightFixedObject*scaleFactor, 'images/'+specialItemTypes[randomItem]+'.png',specialItemTypes[randomItem]);

  // console.log(specialItemTypes[randomItem]);

  },

/*   Clearing all interval timers ensures that all
  object movement freezes at the end of the game. Also
  necessary housekeeping when restarting a game in the middle */
  clearAllTimers : function() {
    console.log("Clearing all interval timers");
    if (this.generateEnemyInterval)
      clearInterval(this.generateEnemyInterval);
    if (this.updateInterval)
      clearInterval(this.updateInterval);
    if (this.generateItemInterval)
      clearInterval(this.generateItemInterval);
  },

/*     Wait 0.5 seconds before resetting the interval timers
    to allow the score to refresh and player to be reset back to 
    bottom of game play area, then display the appropriate message  
 */
doEndGame: function(msg) {

  setTimeout(() => {
    this.clearAllTimers();
    context.font = "50px Comic Sans MS";
    if (msg === 'GAME OVER')
      context.fillStyle = "red";
    else
      context.fillStyle = "blue";
    context.textAlign = "center";
    context.fillText(msg, canvas.width/2, canvas.height/2); 
  }
  ,500);
},




}


/* Generate a new player object at the default starting position with the default icon. 
Only keep one player object active throughout subsequent restarts to avoid problems
with bound methods on a previous object instance
 */
let player = new Player(playerStartX, playerStartY, widthFixedObject,heightFixedObject,defaultIconChoice);
let currentSpecialItem = null; // only one special item at any time


// Create the first row of water blocks
mainGameArea.generateFixedObjects(0,startOfRowsYPos,numFixedObjects,1,widthFixedObject, heightFixedObject,'images/water-block.png');

// Follow this with 4 rows of stone blocks
mainGameArea.generateFixedObjects(0,startOfRowsYPos+heightFixedObject-heightLag,numFixedObjects,4,widthFixedObject,heightFixedObject,'images/stone-block.png');

// And finally the last 2 rows of grass blocks
mainGameArea.generateFixedObjects(0,startOfRowsYPos+(5*(heightFixedObject-heightLag)),numFixedObjects,2,widthFixedObject,heightFixedObject,'images/grass-block.png');

mainGameArea.start();