// *****************************************************************************
// Game
// *****************************************************************************

Ncf.getState("Game").setController(
    function() {
        Ncf.log("Controller");
        Ncf.transit("FinishFromGame");
    }
)