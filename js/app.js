// access to the main canvas and its context
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// period for refreshing the game play area
const refreshPeriod = 50;

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

let defaultIconChoice = 'images/char-boy.png';


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
  
}

/* The Player class adds a few additional methods and properties specific to 
player functionality and also makes calls to the base Component class */

class Player extends Component {



}


  /* This is the main object that keeps all the methods and variables relevant for
game play
 */
const mainGameArea = {

  updateInterval : null,
  stationaryComponents : [],


/*   The method that starts game play by initializing the appropriate variables
  and setting an interval timer to refresh the main game area, generate enemies
  and items periodically */

  start : function() {

    // need to bind function before calling as addEventListener and setInterval  
    // automatically resets this to undefined

    // Interval timer for refreshing main game play area
    let boundUpdateGameArea = mainGameArea.updateGameArea.bind(mainGameArea);
    this.updateInterval = setInterval(boundUpdateGameArea, refreshPeriod);


  },

  updateGameArea : function() {
    context.clearRect(0, 0, canvas.width, canvas.height);

 /*    Draw the stationary background objects first so that everything else
    will subsequently appear over them */
    for (let component of this.stationaryComponents) 
      component.updatePos();

        // Next draw the player
      player.updatePos();  
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
}


/* Generate a new player object at the default starting position with the default icon. 
Only keep one player object active throughout subsequent restarts to avoid problems
with bound methods on a previous object instance
 */
let player = new Player(playerStartX, playerStartY, widthFixedObject,heightFixedObject,defaultIconChoice);

// Create the first row of water blocks
mainGameArea.generateFixedObjects(0,startOfRowsYPos,numFixedObjects,1,widthFixedObject, heightFixedObject,'images/water-block.png');

// Follow this with 4 rows of stone blocks
mainGameArea.generateFixedObjects(0,startOfRowsYPos+heightFixedObject-heightLag,numFixedObjects,4,widthFixedObject,heightFixedObject,'images/stone-block.png');

// And finally the last 2 rows of grass blocks
mainGameArea.generateFixedObjects(0,startOfRowsYPos+(5*(heightFixedObject-heightLag)),numFixedObjects,2,widthFixedObject,heightFixedObject,'images/grass-block.png');

mainGameArea.start();