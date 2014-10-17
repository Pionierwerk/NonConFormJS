// *****************************************************************************
// Declare Ncf states
// *****************************************************************************

var stGame = new NcfState("Game");
var tFinishFromGame = new NcfTransition("FinishFromGame","End",function() {});
stGame.addTransition(tFinishFromGame);
Ncf.addState(stGame);

