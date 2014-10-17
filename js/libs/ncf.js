var Class = easejs.Class;

/**
 * @module NonConForm Base
 */

var Ncf = Class( 'Ncf',
{
	/**
	* Implements a State Engine and a Main Loop
	*
	* @class Ncf
	* @static
	*/

    /**
     * The interval ID that is necessary to start the javascript main loop.
     * 
     * @property intervalID
     * @private
     * @type {int}
     */
     
    'private static intervalID' : null,
    
    /**
    * the frames per seconf of the main loop
    * 
    * @property fps
    * @private
    * @static
    * @type {int}
    */
    
    'private static fps' : 0,
    
    /**
    * the controller function to process inside the main loop. This is the controller function of the actual state.
    * 
    * @property controller
    * @private
    * @static
    * @type {function}
    */
    
    'private static controller' : null,
    
    /**
    * the view function to process inside the main loop. This is the view function of the actual state.
    * 
    * @property view
    * @private
    * @static
    * @type {function}
    */
    
    'private static view' : null,
    
    /**
    * The states.
    * 
    * @property states
    * @private
    * @static
    * @type {Hashtable}
    */
    
    'private static states' : {},
    
    /**
    * The actual state.
    * 
    * @property actualstate
    * @private
    * @static
    * @type {NcfState}
    */
    
    'private static actualstate' : null,
    
    /**
    * When the debugmode is true, debugmessages will be written to the javascript console. 
    * @example         
    * Ncf.setDebugMode(true);
    * Ncf.log("initialize NonConForm");
    * 
    * @property debugmode
    * @private
    * @static
    * @type {boolean}
    */
    
    'private static debugmode': false,
	
	/**
	* @method init
	* @static
    * @param {int} fps Frames Per Second of the Main Loop.
    * @param {string} firststatename Name of the first stage. The out of the box "Start" state will go to this first state.
    * @example
	* -------------------------------------------------<br/>
	* declare states<br/>
	* -------------------------------------------------<br/>
	* var stGame = new NcfState("Game");<br/>
	* var tFinishFromGame = new NcfTransition("FinishFromGame","End",function() {});<br/>
	* stGame.addTransition(tFinishFromGame);<br/>
	* Ncf.addState(stGame);<br/>
	* <br/>
	* -------------------------------------------------<br/>
	* define view<br/>
	* -------------------------------------------------<br/>
	* Ncf.getState("Game").setView(<br/>
	*   function() {<br/>
	*       Ncf.log("View");<br/>
	*       Ncf.transit("FinishFromGame");<br/>
	*   }<br/>
    * )<br/>
	* -------------------------------------------------<br/>
	* define controller<br/>
	* -------------------------------------------------<br/>
	* Ncf.getState("Game").setController(<br/>
	*   function() {<br/>
	*       Ncf.log("Controller");<br/>
	*       Ncf.transit("FinishFromGame");<br/>
	*   }<br/>
    * )<br/>
	* -------------------------------------------------<br/>
	* start engine<br/>
	* -------------------------------------------------<br/>
	* Ncf.setDebugMode(true);<br/>
	* Ncf.init(50,"Game");<br/>	
	*/
	
    'public static init' : function(fps,firststatename,initfunction)
    {
        this.log("initialize NonConForm");
        // Mainloop Parameters
        this.fps=fps;

        // State engine initialization
        var _stStart = new NcfState("Start");
        var _tGoFirst = new NcfTransition("GotoFirstState",firststatename,function() {initfunction();} );
        _stStart.addTransition(_tGoFirst);
        this.addState(_stStart);
        
        var _stEnd = new NcfState("End"); 
        _stEnd.setEnterFunction(function() { 
            Ncf.log("-----------------------------");
            Ncf.log('finishing NonConForm'); 
            Ncf.log("-----------------------------");
            Ncf.exit();
        } ); 
        this.addState(_stEnd);

        this.log("-----------------------------");
        this.log("start NonConForm state engine");
        this.log("-----------------------------");

        // set first state and transit to this stage
        this.$('actualstate',this.getState("Start"));
        this.transit("GotoFirstState");
        
        
        this.start();
    },
    
    /**
     * Exit the NonConForm State Engine
     *
     * @method exit
     * @static
     */
     
    'public static exit' : function()
    {
        clearInterval(this.intervalID);    
        this.log("NonConForm main loop stopped");
    },
    
    /**
     * Add a State to the list of states
     * 
     * @method addState
     * @static
     * @param {NcfState} state The new state that is added to the list of states
     */
     
    'public static addState' : function (state)
    {
        this.$('states')[state.getName()]=state;  
    },
    
    /**
     * Get a state from the list of states
     * 
     * @method getState
     * @static
     * @param {string} statename the name of the state
     * @return {NcfState} the state
     */
     
    'public static getState' : function(statename)
    {
        return this.$('states')[statename];  
    },
    
    /**
     * Do a transition to given state
     * 
     * @method transit
     * @static
     * @param {string} transitionname the name of the new state
     */
     
    'public static transit' : function(transitionname)
    {
        var source = this.$('actualstate');
        var transition = source.getTransition(transitionname);
        var destination = this.$('states')[transition.getDestinationname()];

        if ((typeof(source.leave) !== 'undefined') && (source.leave !== null)) 
        {
            source.leave();
        };
        this.log("|------------------Transit to------------------|:" + destination.getName());
        transition.fire();
        if ((typeof(destination.enter()) !== 'undefined') && (destination.enter() !== null))
        {
            this.log("entering....");
            destination.enter();
        }
        
        // Set new Stage & Controller & View function
        this.$('actualstate',destination);
        this.controller=destination.getController();
        this.view=destination.getView();
    },
    
    /**
     * The main loop. First calls a controller function and then a viewing function. This loop is called by the framework.
     * 
     * @method loop
     * @static
     */
     
    'public static loop' : function()
    {
        Ncf.log("Main Loop")

        if ((typeof(this.view) !== 'undefined') && (this.view !== null)) 
        {
            this.view();
        };

        if ((typeof(this.controller) !== 'undefined') && (this.controller !== null)) 
        {
            this.controller();
        };
    },
    
    /**
     * starts the processing of the main loop
     * 
     * @method start
     * @static
     */
     
    'public static start' : function() 
    {
        this.intervalID=setInterval(Ncf.loop, 1000 / this.$('fpts'));      
        this.log("NonConForm main loop started");
    },
    
    /**
     * Set the debugmode 
     * 
     * @method setDebugMode
     * @static
     * @param mode the new value (true | false)
     */
     
     'public static setDebugMode' : function(mode)
     {
         this.debugmode=mode;
     },
    
    /**
     * Print a nessage to the console. If debugmode=true the message will be send to the javascript console.
     * 
     * @method log
     * @static
     * @param message the message to print to the javascript console. 
     */
     
     'public static log' : function(message)
     {
         if(this.debugmode === true) 
         {
             console.log(message);
         }
     }
} );

var NcfState = Class (
{
 	/**
	* A state inside the state engine. 
	*
	* @class NcfState
	* @constructor
	* @param {string} name Set the name of the new state
	* @example
	* var stGame = new NcfState("Game");<br/>
	* var tFinishFromGame = new NcfTransition("FinishFromGame","End",function() {});<br/>
	* stGame.addTransition(tFinishFromGame);<br/>
	* Ncf.addState(stGame);<br/>
	*/
	
    'public __construct' : function(name) 
    {
        this.name=name;
    },

    /**
    * The list of transitions of a state
    * 
    * @property transitions
    * @private
    * @type {Hashtable}
    */
    
    'private transitions' : {},
    
    /**
    * The name of the state
    * 
    * @property name
    * @private
    * @type {string}
    */
    
    'private name' : null,
    
    /**
     * The function called when the state is entered
     * 
     * @property enterfunction
     * @private
     * @type {Function}
     * @default writing a message into the javascript console 
     */
     
    'private enterfunction'  : function() { Ncf.log( "Entering:" + this.name);},
    
    /**
     * The function called when the state transits to another state
     * 
     * @property leavefunction
     * @private
     * @type {Function}
     * @default writing a message into the javascript console 
     */
     
    'private leavefunction'  : function() { Ncf.log( "Leaving:" + this.name);},
    
    /**
     * The function called when the controller function in the main loop is called
     * 
     * @property controllerfunction
     * @private
     * @type {Function}
     */
     
    'private controllerfunction'  : null,
    
    /**
     * The function called when the view function in the main loop is called
     * 
     * @property viewfunction
     * @private
     * @type {Function}
     */
     
    'private viewfunction' : null,
    
    /**
     * Get the name of the state
     * 
     * @method getName
     * @return {string} the name of the state
     */
     
    'public getName' : function()
    {
        return this.name;
    },
    
    /**
     * Call the enter function. This will happen automaticaly when a transition to the state happenes
     * 
     * @method enter
     */
     
    'public enter' : function()
    {
        this.enterfunction();
    },
    
    /**
     * Call the leave function. This will happen automaticaly when a transition away from the state happenes
     * 
     * @method enter
     */
     
    'public leave' : function()
    {
        this.leavefunction();  
    },
    
    /**
     * Add a transition to the state. 
     * 
     * @method addTransition
     * @param {NcfTransition} transition
     */
     
    'public addTransition' : function(transition)
    {
        this.transitions[transition.getName()]=transition;
    },
    
    /**
     * Return the transition of the state with the given transitionname
     * 
     * @method getTransition
     * @param {string} transitionname
     * @return {NcfTransition} the transition
     */
     
    'public getTransition' : function(transitionname)
    {
       return this.transitions[transitionname];  
    },
    
    /**
     * Set the enter function. This function will be called automaticaly when a transition to the state happends
     * 
     * @method setEnterFunction
     * @param {function} enterfunction the enterfuncton
     */
     
    'public setEnterFunction' : function(enterfunction)
    {
        this.enterfunction=enterfunction;
    },
    
    /**
     * Set the leave function. This function will be called automaticaly when a transition formthe state happends
     * 
     * @method setLeaveFunction
     * @param {function} leavefunction the leave function
     */
     
    'public setLeaveFunction' : function(leavefunction)
    {
        this.leavefunction=leavefunction;
    },
    
    /**
     * Set the controller function. This function will be called automaticaly during the main loop, its the controller of a state.
     * 
     * @method setController
     * @param {function} controllerfunction the controller function
     */
     
    'public setController' : function(controllerfunction)
    {
        this.controllerfunction=controllerfunction;
    },
    
    /**
     * Set the view function. This function will be called automaticaly during the main loop, its the view of a state.
     * 
     * @method setRunder
     * @param {function} viewfunction the view function
     */
     
    'public setView' : function(viewfunction)
    {
        this.viewfunction=viewfunction;
    },
    
    /**
     * Return the controller function of the state
     * 
     * @method getController
     * @return {function} controllerfunction the controller function
     */
     
    'public getController' : function()
    {
        return this.controllerfunction;
    },
    
    /**
     * Return the view function of the state
     * 
     * @method getView
     * @return {function} viewfunction the view function
     */
     
    'public getView' : function()
    {
        return this.viewfunction;
    }
} );

var NcfTransition = Class (
{
 	/**
	* A transition inside the state engine. 
	*
	* @class NcfTransition
	* @constructor
	* @param {string} name Set the name of the new transition
	* @param {string} name of the destination state
	* @param {function} funct The function that will be called when the transition is triggered
	* @example
	* var stGame = new NcfState("Game");<br/>
	* var tFinishFromGame = new NcfTransition("FinishFromGame","End",function() {});<br/>
	* stGame.addTransition(tFinishFromGame);<br/>
	*/
	
    'public __construct' : function(name,destinationname,funct) 
    {
        this.name=name;
        this.destinationname=destinationname;
        this.funct=funct;
    },
    
    /**
    * The name of the transition
    * 
    * @property name
    * @private
    * @type {string}
    */
    
    'private name' : null,
    
    /**
    * The name of the destination state
    * 
    * @property destinationname
    * @private
    * @type {string}
    */
    
    'private destinationname' : null,
    
    /**
    * The functinion that is called during the transition
    * 
    * @property funct
    * @private
    * @type {function}
    */
    
    'private funct' : null,
    
    /**
     * Return the name of the transition
     * 
     * @method getName
     * @return {string} name The name of the transition
     */
     
     'public getName' : function()
    {
        return this.name;
    },
    
    /**
     * Return the destination name of the transition
     * 
     * @method getDestinationname
     * @return {string} destinationname The destinationname of the transition
     */
     
     'public getDestinationname' : function()
    {
        return this.destinationname;
    },
    
    /**
     * Calls the function of the transition
     * 
     * @method fire
     */
     
     'public fire' : function()
    {
        Ncf.log("Firing transition function")
        this.funct();
    }
} );