// *****************************************************************************
// Game
// *****************************************************************************

Ncf.getState("Menu").setController(
    function() {
        Ncf.log("Menu Controller");
        
        if(menuiteration==0) {
            Ncf.transit("ShowOptions")
        }
        else if(menuiteration==1) {
            Ncf.transit("ShowHighscores");
        }
        else if(menuiteration==2) {
            Ncf.transit("StartGame");
        }
        else if(menuiteration==3) {
            Ncf.transit("FinishFromMenu");
        };
        
        menuiteration++;
    }
)

Ncf.getState("Options").setController(
    function() {
        Ncf.log("Options Controller");
        
        Ncf.transit("BackToMenu")
    }
)

Ncf.getState("Game").setController(
    function() {
        Ncf.log("Game Controller");
        
        Ncf.transit("ShowHighscore")
    }
)

Ncf.getState("Highscore").setController(
    function() {
        Ncf.log("Higscore Controller");
        
        // **************************************************************
        // Show leaderboard
        // **************************************************************
        leaderboard.showText();
        
        Ncf.transit("GameOver")
    }
)