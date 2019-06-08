

# Frogger

Frogger is a simple variant on the classic namesake where the player attempts to move a character to the top boundary of the game play area while simultaneously maneuvering to avoid a variety of enemies moving horizontally at different speeds.

## Table of Contents

- [Game premise](#Game-premise)
- [Game instructions](#Game-instructions)
- [Additional features](#Additional-features)
- [Item effects](#Item-effects)
- [Running the game](#Running-the-game)
- [Dependencies](#Dependencies)
- [Resources](#Resources-used)
- [Tests](#Tests)
- [Contributing](#Contributing)
- [License](#License)


## Game premise

The player controls a character which must be moved to the top boundary of the game play area. Enemies are generated at the left boundary of the game play area periodically and move at random speeds horizontally across the game play area.

The character starts off with 3 lives; colliding with a enemy results in the loss of a life.

The game ends when either the character reaches the top of the game play area (considered to be a win) or when the number of lives reaches 0 (considered to be a loss).

There is also a running score which is incremented whenever the player interacts with certain items that are generated randomly in the game play area. The goal would be to win the game with the highest score possible.


## Game instructions


1. Click the Start button to start the game. You will be prompted to choose an icon for your character among several options available.
2. Use the arrow keys (up, left, bottom, right) to control the movement of the player.
3. Avoid colliding with the enemies that move from the left across the game play area.
4. Items are randomly generated in the game play area. Try to collide with them to help increase your score.
5. Head towards the top boundary of the game play area to complete and win the game. You may wish to increase your score in the meantime before this occurs. 
6. Click the Restart button at any time to restart the current game. Your score will be reset.
7. Click the Difficulty button to change the difficulty level at any time (more information on this below). Your game will be restarted and the score will be reset as well

## Additional features

1. *Difficulty levels*: There are three levels possible: Easy, Hard and Insane. They differ in terms of the speed of enemies as well as the frequency of their generation in the game play area

2. *Icon selection*: The player has a choice of selecting the character icon when the game is started from amongst the options shown below:

<img src="images/char-boy.png" width="50" height="50" />
<img src="images/char-cat-girl.png" width="50" height="50" />
<img src="images/char-horn-girl.png" width="50" height="50" />
<img src="images/char-pink-girl.png" width="50" height="50" />
<img src="images/char-princess-girl.png" width="50" height="50" />


3. *Item interaction*: Random items are generated in the game play area periodically. Colliding with them results in different effects which are dependent on the specific item as explained below

## Item effects

1. <img src="images/Heart.png" width="30" height="30" /> Number of lives increases by 1
2. <img src="images/Gem Green.png" width="30" height="30" /> Score increases by 1 
3. <img src="images/Gem Blue.png" width="30" height="30" /> Score increases by the number of enemies in the active game play area. All these enemies are removed as well
4. <img src="images/Gem Orange.png" width="30" height="30" /> Player enters a power up mode for a temporary duration where enemies are destroyed and score is increased upon collision with the player. The player icon is rendered within an external orange rectangle to indicate when the power up mode is active.

## Running the game

Open `index.html` directly in a browser (preferably the latest version of Chrome or Firefox) and you are all set to go !


## Dependencies

The game is implemented in [HTML5](https://www.w3schools.com/html/), [CSS](https://www.w3schools.com/css/default.asp), [Javascript](https://www.w3schools.com/js/default.asp) and [HTML5 Canvas](https://www.w3schools.com/html/html5_canvas.asp). There were no additional libraries used


## Resources used

The following CSS resources were referenced and  modified in the styling of the following components in the game:

* [Modal boxes](https://www.w3schools.com/howto/howto_css_modals.asp)



## Tests
There are no unit tests as of yet. This is work-in-progress.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)