class Game {
	constructor(players) {
		this.players = new Array(players.length);
		players.forEach((element, i) => {
			this.players[i] = [element, 0];
		});
		console.log(this.players);
		this.round = 1;
		this.word = "";
	}

	displayScores() {
		rectMode(CORNER);
		fill("#F19E8E");
		noStroke();
		rect(0, 0, 200, 720);

		textAlign(CENTER, CENTER);
		textSize(30);
		fill(0, 0, 0);
		text("JUGADORS", 100, 30);

		textSize(18);
		fill(0, 102, 153);
		this.players.forEach((element, i) => {
			textAlign(LEFT, CENTER);
			text(element[0], 20, 60 * (i + 1) + 30);
			textAlign(RIGHT, CENTER);
			text(element[1], 180, 60 * (i + 1) + 30);
		});
	}

	finalScores() {
		textAlign(CENTER, CENTER);
		textSize(50);
		fill(0, 0, 0);
		text("PUNTUACIONS FINALS", 640, 50);

		rectMode(CENTER);
		fill(255, 255, 255);
		noStroke();
		rect(640, 655, 400, 70, 5);

		textAlign(CENTER, CENTER);
		textSize(20);
		fill(0, 0, 0);
		text("CLICA EL BOTÓ PER TORNAR A JUGAR", 640, 650);

		this.players.sort(function (a, b) {
			return b[1] - a[1];
		});

		this.players.forEach((element, i) => {
			textSize(40);
			textAlign(CENTER, CENTER);
			text(element[0], 550, 90 * (i + 1) + 150);
			textAlign(RIGHT, CENTER);
			text(element[1], 800, 90 * (i + 1) + 150);
		});
	}

	displayRound() {
		textAlign(LEFT, CENTER);
		textSize(50);
		fill(0, 0, 0);
		if (movement == 2)
			text("RONDA " + this.round + " - " + this.word.toUpperCase(), 240, 40);
		else text("RONDA " + this.round, 240, 40);
	}

	displayWord(movement) {
		textAlign(CENTER, CENTER);
		textSize(120);
		fill(0, 0, 0);
		text(this.word.toUpperCase(), 740, 360);

		if (movement == 0) {
			textSize(40);
			text("Cliqueu el botó per començar el temps", 740, 600);
		}
	}

	pickWord() {
		this.word = words[Math.floor(Math.random() * words.length)];
	}

	resetScores() {
		this.players.forEach((element) => {
			element[1] = 0;
		});
	}

	showName(position) {
		textAlign(CENTER, CENTER);
		textSize(40);
		fill(0, 0, 0);
		text(this.word.toUpperCase(), 740, 120);

		textSize(60);
		text(this.players[position][0].toUpperCase(), 740, 650);
	}

	addScore(position, score) {
		this.players[position][1] += score;
	}
}
