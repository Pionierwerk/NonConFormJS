var Class = easejs.Class;

// -------------------------------------------------------------------------------------------------
// Class definitions
// -------------------------------------------------------------------------------------------------

// **************************************************************
// The list of players
// **************************************************************
var ncfPlayers = Class(
{
    'private static playerlist' : null,

    'public static init': function()
    {
        this.playerlist={};
    },
    'public static addPlayer' : function(player)
    {
        console.log(player.id.toString());
        this.playerlist['1']=player;
    },
    'public static getPlayer' : function(key)
    {
        return this.playerlist[key];
    }
} );

// **************************************************************
// A player
// **************************************************************
var ncfPlayer = Class(
{
    'public id' : 0,
    'public name': '',

    'public __construct': function(playername,id)
    {
        this.name = playername;
        this.id = id
        
        ncfPlayers.addPlayer(this);
        
    },

    'public getName': function()
    {
        return this.name;
    }
} );

// **************************************************************
// A score
// **************************************************************
var ncfScore = Class(
{
    'public points' : 0,
 
    'public __construct': function(score)
    {
        this.points=score;
    },
 
    'public getPoints' : function()
    {
        return this.points;
    }
} );

// **************************************************************
// A score of a player
// **************************************************************
var ncfResult = Class(
{
    'private score' : null,
    'private player' : null,                // ID of the player

    'public __construct': function(score,player)
    {
        this.score=score;
        this.player=player;
    },

   'public getScore': function() 
    {   
        return this.score.points;
    },
    'public setScore' : function(score)
    {
        this.score=score
    },
    'public getPlayer': function() 
    {   
        return this.player;
    },
    'public setPlayer' : function(player)
    {
        this.player=player
    }
} );

// **************************************************************
// a list of results
// **************************************************************
var ncfScoreboard = Class(
{
    'public __construct': function()
    {
    },
    
    'public results': [],
    
    'public showText' : function()
    {
        Ncf.log("-------------------------------------------------------");
        Ncf.log("Leaderboard");
        Ncf.log("-------------------------------------------------------");
        
        for(var i=0;i<10;i++)
        {
            Ncf.log((i+1) +") "+leaderboard.results[i].getPlayer().getName() + " - " + leaderboard.results[i].getScore());
        }
        
        Ncf.log("");
    }
    
} );
