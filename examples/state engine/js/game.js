// *********************************************************************************************
// Graphics
// *********************************************************************************************
// initialize Canvas
var screenwidth=1280;
var screenhigh=800;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = screenwidth;
canvas.height = screenhigh;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "img/himmel.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "img/spaceship.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "img/kristal_3.png";

// Monster2 image
var monster2Ready = false;
var monster2Image = new Image();
monster2Image.onload = function () {
	monster2Ready = true;
};
monster2Image.src = "img/kristal_2.png";

// Monster3 image
var monster3Ready = false;
var monster3Image = new Image();
monster3Image.onload = function () {
	monster3Ready = true;
};
monster3Image.src = "img/kristal_1.png";

// energy_white image
var energywhiteReady = false;
var energywhiteImage = new Image();
energywhiteImage.onload = function () {
	energywhiteReady = true;
};
energywhiteImage.src = "img/Orb_white.png";

// energyblack image
var energyblackReady = false;
var energyblackImage = new Image();
energyblackImage.onload = function () {
	energyblackReady = true;
};
energyblackImage.src = "img/Orb_black.png";

// *********************************************************************************************
// Variables
// *********************************************************************************************

var monsterphases= new Array();
monsterphases[0]=monsterImage
monsterphases[1]=monster2Image
monsterphases[2]=monster3Image
monsterphases[3]=energyblackImage

var whiteenergy=new Array();
var blackenergy=new Array();
var monsters= new Array();
var monstersCaught = 0;
var movespeed=2

// *********************************************************************************************
// Game objects
// *********************************************************************************************

var hero = {
	speed: 256, // movement in pixels per second
	move: false,
	gotoPos: {},
	x: 0,
	y: 0
};

// *********************************************************************************************
// Mouse
// *********************************************************************************************

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

addEventListener("mousedown", function (e) {
	hero.gotoPos[0]=e.offsetX;
	hero.gotoPos[1]=e.offsetY;

	hero.movex=hero.x+(heroImage.width/2)-hero.gotoPos[0];
	hero.movey=hero.y+(heroImage.height/2)-hero.gotoPos[1];

	if (Math.abs(hero.movex)>Math.abs(hero.movey)) {
		if (hero.movex>0) {
			hero.mx=movespeed;
		}
		else {
			hero.mx=-movespeed;
		}
		hero.my=Math.abs(hero.movey)/Math.abs(hero.movex);
		if(hero.movey<0) {
			hero.my*=-1
		}
		hero.movecounter=Math.abs(hero.movex);
	}
	else {
		if (hero.movey>0) {
			hero.my=movespeed;
		}
		else {
			hero.my=-movespeed;
		}
		hero.mx=Math.abs(hero.movex)/Math.abs(hero.movey);
		if(hero.movex<0) {
			hero.mx*=-1
		}
		hero.movecounter=Math.abs(hero.movey);

	}

	hero.movecounter*=2
	hero.move=true;
},false);

// *********************************************************************************************
// Reset the game when the player catches a monster
// *********************************************************************************************
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	hero.move=false;
	movecounter=0;

	monstersCaught=0
	monsters=new Array();

	newMonster();
};

// *********************************************************************************************
// add Monster
// *********************************************************************************************
var newMonster = function() {
	var monster = {};
	monster.phase=0;
	monster.x = monsterImage.width + (Math.random() * (canvas.width - monsterImage.width*2));
	monster.y = monsterImage.height + (Math.random() * (canvas.height - monsterImage.height*2));
	monsters.push(monster);
}

// *********************************************************************************************
// Update game objects
// *********************************************************************************************
var update = function (modifier) {
	if (hero.move==true) {
		hero.x+=hero.mx;
		if(hero.x<0) {
			hero.x=0;
			hero.mx*=-1;
		}
		else if(hero.x>screenwidth-(heroImage.width)) {
			hero.x=screenwidth-(heroImage.width);
			hero.mx*=-1;
		}

		hero.y+=hero.my;
		if(hero.y<0) {
			hero.y=0;
			hero.my*=-1;
		}
		else if(hero.y>screenhigh-(heroImage.height)) {
			hero.y=screenhigh-(heroImage.height);
			hero.my*=-1;
		}

		hero.movecounter--;
		if (hero.movecounter==0) {
			hero.x=Math.ceil(hero.x)
			hero.y=Math.ceil(hero.y)
			hero.move=false

			for(var i=0;i<monsters.length;i++) {
				if(monsters[i].phase<3) {
					monsters[i].phase++;
				}
			}

			newMonster();
		}
	}

	// Are they touching?
	for(var i=0;i<monsters.length;i++) {
		if (
			hero.x <= (monsters[i].x + monsterImage.width)
			&& monsters[i].x <= (hero.x + heroImage.width)
			&& hero.y <= (monsters[i].y + monsterImage.height)
			&& monsters[i].y <= (hero.y + heroImage.height)
			) 
		{
			if(monsters[i].phase<3) {
				++monstersCaught;
				monsters.splice(i,1);
			}
			else {
				reset();
			}
		}
	}
};

// *********************************************************************************************
// Draw everything
// *********************************************************************************************
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady && monster2Ready && monster3Ready && energyblackReady ) {
		for(var i=0;i<monsters.length;i++) {
			ctx.drawImage(monsterphases[monsters[i].phase], monsters[i].x, monsters[i].y);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + monstersCaught, 32, 32);
};

// *********************************************************************************************
// The main game loop
// *********************************************************************************************
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 10);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
