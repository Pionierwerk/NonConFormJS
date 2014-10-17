// -----------------------------------------------------------------------------
// State diagramm
// -----------------------------------------------------------------------------

/*
Start
|(t) init highscore
Menu
-> Options (menuiteration=0)
-> Highscore (menutiteration=1)
-> end (menuiteration=2)
| (menuiteration=3)
Game
(l) enter highscore
|
Highscore
|
End
*/

// *****************************************************************************
// Declare Game variables
// *****************************************************************************
var menuiteration=0;    

// *****************************************************************************
// Declare Ncf states
// *****************************************************************************

// -----------------------------------------------------------------------------
// Menu state
// -----------------------------------------------------------------------------
var stMenu = new NcfState("Menu");

// Transition to Options
var tShowOptions = new NcfTransition("ShowOptions","Options",function() {});
stMenu.addTransition(tShowOptions);

// Transition to Game
var tShowHighscores = new NcfTransition("ShowHighscores","Highscore",function() {});
stMenu.addTransition(tShowHighscores);

// Transition to Game
var tStartGame = new NcfTransition("StartGame","Game",function() {});
stMenu.addTransition(tStartGame);

// Transition to End
var tFinishFromMenu = new NcfTransition("FinishFromMenu","End",function() {});
stMenu.addTransition(tFinishFromMenu);

Ncf.addState(stMenu);

// -----------------------------------------------------------------------------
// Options state
// -----------------------------------------------------------------------------
var stOptions = new NcfState("Options");

// Transition to Menu
var tBackToMenu = new NcfTransition("BackToMenu","Menu",function() {});
stOptions.addTransition(tBackToMenu);

Ncf.addState(stOptions);

// -----------------------------------------------------------------------------
// Game state
// -----------------------------------------------------------------------------
var stGame = new NcfState("Game");

// Leave Function: put higscore into leaderboard
stGame.setLeaveFunction(function() { 
    Ncf.log("Game leave function");
} );

// Transition to Highscore
var tShowHighscore = new NcfTransition("ShowHighscore","Highscore",function() {});
stGame.addTransition(tShowHighscore);

Ncf.addState(stGame);

// -----------------------------------------------------------------------------
// Highscore state
// -----------------------------------------------------------------------------

var stHighscore = new NcfState("Highscore");

// Transition to Menu
var tGameOver = new NcfTransition("GameOver","Menu",function() {});
stHighscore.addTransition(tGameOver);

Ncf.addState(stHighscore);

