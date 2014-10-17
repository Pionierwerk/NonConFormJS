// -----------------------------------------------------------------------------
// State diagramm
// -----------------------------------------------------------------------------

/*
Start
|(t) init highscore
Menu
-> Options (menuiteration=0)
-> Highscore (menuiteration=1)
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

// Transition to Options
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

// Transition to Highscore
var tShowHighscore = new NcfTransition("ShowHighscore","Highscore",function() {});
stGame.addTransition(tShowHighscore);

// Leave Function: put higscore into leaderboard
stGame.setLeaveFunction(function() { 
    Ncf.log("Game leave function")
    var gamescore = new ncfScore(Math.floor(Math.random() * 10));
    if(gamescore.points > leaderboard.results[9].getScore())
    {
        leaderboard.results[9].setScore(gamescore);
        leaderboard.results.sort(
            function(a, b)
            {
                return a.getScore()-b.getScore();
            }
        );
        leaderboard.results.reverse();
    }    
} ); 

Ncf.addState(stGame);

// -----------------------------------------------------------------------------
// Highscore state
// -----------------------------------------------------------------------------

var stHighscore = new NcfState("Highscore");

// Transition to Menu
var tGameOver = new NcfTransition("GameOver","Menu",function() {});
stHighscore.addTransition(tGameOver);

Ncf.addState(stHighscore);

