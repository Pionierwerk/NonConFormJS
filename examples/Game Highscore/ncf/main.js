// set debug mode 
Ncf.setDebugMode(true);

// *****************************************************************************
// Game objects
// *****************************************************************************

// A leaderboard 
var results = []
var leaderboard = new ncfScoreboard(results);

// *****************************************************************************
// Start Ncf state engine
// *****************************************************************************
Ncf.init(50,"Menu",function() {
    // Create a list of players
    ncfPlayers.init();

    // Create a player
    new ncfPlayer("ThorN",1);


    // 10 Results are in the leaderboard
    for(var i=0;i<10;i++)
    {
        leaderboard.results[i]=new ncfResult();
    }
    
    // Create a bunch of score
    for (i=0;i<10;i++)
    {
        var score=new ncfScore(1);
        leaderboard.results[i].setPlayer(ncfPlayers.getPlayer("1"));
        leaderboard.results[i].setScore(score);
    }
} );