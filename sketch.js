let canvas;
let font;

let doodleClassifier;
let video;

let input, button, greeting;
let players = [];
let nPlayers = 3;

let game;

let scene = 0;
let round = 1;
let movement = 0;
let rPlayer = 0;

let startTime;
let seconds;
const countdown = 5;

preload = () => {
	font = loadFont("Cereal.ttf");
};

setup = () => {
	canvas = createCanvas(1280, 720);
	textFont(font);
	frameRate(144);
	video = createCapture(VIDEO);
	video.hide();

	//Inputs
	input = createInput();
	input.position(150, 40);
	input.parent("#input");

	button = createButton("Afegir");
	button.position(150, 70);
	button.mousePressed(saveName);
	button.parent("#input");

	greeting = createElement("h2", "Entra el teu nom");
	greeting.position(150, 5);
	greeting.parent("#input");

	textAlign(CENTER);
	textSize(50);
	background("#58656D");
};

draw = () => {
	background("#58656D");
	if (scene == 0) {
		escena_inicial();
		names();
	} else if (scene == 1) {
		scoreboard();
		if (movement == 0) {
			game.displayWord();
		} else if (movement == 1) {
			game.displayWord();
			seconds = startTime - millis() / 1000;
			textAlign(RIGHT, CENTER);
			textSize(50);
			fill(0, 0, 0);
			text("TEMPS: " + Math.round(seconds), 1240, 40);
			if (Math.round(seconds) < 0) {
				movement = 2;
			}
		} else if (movement == 2) {
			textAlign(RIGHT, CENTER);
			textSize(50);
			fill(0, 0, 0);
			text("REVISIÓ", 1240, 40);

			image(video, 450, 200, width, height);
		}
	} else if (scene == 2) {
		finalScoreboard();
	}
};

saveName = () => {
	let name =
		input.value() == "" ? "Player " + (players.length + 1) : input.value();
	players.push(name);
	console.log(input.value());
	input.value("");

	if (players.length >= nPlayers) {
		input.hide();
		button.hide();
		greeting.hide();
		game = new Game(players);
		game.pickWord();
		scene = 1;
	}
};

const names = () => {
	rectMode(CORNER);
	fill("#F19E8E");
	noStroke();
	rect(0, 0, 200, 720);

	textAlign(CENTER, CENTER);
	textSize(30);
	fill(0, 0, 0);
	text("JUGADORS", 100, 30);

	textAlign(LEFT, CENTER);
	textSize(18);
	fill(0, 102, 153);
	players.forEach((element, i) => {
		text(element, 20, 60 * (i + 1) + 30);
	});
};

//Escena 1
const escena_inicial = () => {
	textAlign(CENTER, CENTER);
	textSize(50);
	fill(0, 0, 0);
	text("ENTRA EL NOM DELS \nJUGADORS PER COMENÇAR A JUGAR", 740, 250);
};

//

//Escena partida
const scoreboard = () => {
	background("#58656D");
	game.displayScores();
	game.displayRound(movement);
};

//Escena Puntuacions finals
const finalScoreboard = () => {
	background("#98756F");
	game.finalScores();
};

//Key Pressed
keyPressed = () => {
	if (scene == 1) {
		if (keyCode === LEFT_ARROW) {
			if (movement == 0) {
				console.log("start time");
				startTime = millis() / 1000 + countdown;
				movement = 1;
			} else if (movement == 1) {
				console.log("time stop");
				movement = 2;
			} else if (movement == 2) {
				console.log("check draws");
				game.pickWord();
				if (game.round == 5) scene = 2;
				game.round++;
				movement = 0;
			}
		}
	} else if (scene == 2) {
		if (keyCode === LEFT_ARROW) {
			scene = 1;
			game.round = 1;
			movement = 0;
			game.resetScores();
		}
	}
};
