let canvas;
let font;

let doodleClassifier;
let video;

let input, button, greeting;
let players = [];
let nPlayers = 2;

let game;

let scene = 0;
let round = 1;
let movement = 0;
let rPlayer = 0;
let actualScore = 0;

let startTime;
let seconds;
const countdown = 10;

let soundTime;

preload = () => {
	soundFormats("mp3", "ogg");
	soundTime = loadSound("drawing.mp3");

	font = loadFont("Cereal.ttf");
};

setup = () => {
	background("#58656D");
	canvas = createCanvas(1280, 720);

	video = createCapture(VIDEO);
	video.hide();

	frameRate(60);
	textFont(font);

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
};

draw = () => {
	background("#58656D");
	if (scene == 0) {
		escena_inicial();
		names();
	} else if (scene == 1) {
		scoreboard();
		if (movement == 0) {
			game.displayWord(movement);
		} else if (movement == 1) {
			game.displayWord(movement);
			seconds = startTime - millis() / 1000;
			textAlign(RIGHT, CENTER);
			textSize(50);
			fill(0, 0, 0);
			text("TEMPS: " + Math.round(seconds), 1240, 40);
			if (Math.round(seconds) < 0) {
				movement = 2;
			}
		} else if (movement == 2) {
			soundTime.pause();
			textAlign(RIGHT, CENTER);
			textSize(50);
			fill(0, 0, 0);
			text("REVISIÓ", 1240, 40);

			video.size(500, 375);
			image(video, 480, 200, 500, 375);
			doodleClassifier = ml5.imageClassifier("DoodleNet", modelReady);

			game.showName(rPlayer);
			textAlign(RIGHT, CENTER);
			textSize(40);
			fill(0, 0, 0);
			text("CERTESA: " + actualScore + " %", 1240, 120);
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
				soundTime.play();
				startTime = millis() / 1000 + countdown;
				movement = 1;
			} else if (movement == 1) {
				movement = 2;
			} else if (movement == 2) {
				if (rPlayer <= game.players.length - 2) {
					game.addScore(rPlayer, actualScore);
					actualScore = 0;
					rPlayer++;
				} else {
					game.addScore(rPlayer, actualScore);
					game.pickWord();
					if (game.round == 10) {
						scene = 2;
					} else {
						game.round++;
						rPlayer = 0;
						movement = 0;
					}
				}
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

//Model

const modelReady = () => {
	doodleClassifier.classify(video, gotResults);
};

const gotResults = (error, results) => {
	if (error) {
		console.error(error);
		return;
	}

	results.forEach((element) => {
		if (game.word == element.label) {
			let score = Math.round(1000 * element.confidence, 2);
			if (actualScore <= score) actualScore = score;
		}
	});
};
