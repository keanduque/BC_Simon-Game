/**
 *
 * Title : Simon Game
 * Author: Kean Duque
 *
 */

"use strict";

class SimonGame {
	gamePattern = [];
	buttonColours = ["red", "blue", "green", "yellow"];
	userClickedPattern = [];
	gameStarted = false;
	level = 0;
	counterClick = 0;
	levelTitle = $("#level-title");
	gameOver = false;
	eventActivate = false;

	constructor() {
		this.init();
	}
	init() {
		this.events();
	}
	events() {
		this.keyPress();
		this.btnClick();
	}
	keyPress() {
		const self = this;
		$(document).keypress(function (event) {
			if (!self.gameStarted) {
				if (event.key === "a" || event.key === "A") {
					self.gameStart();
				}
			}
			if (self.gameOver) {
				if (event.keyCode === 32) {
					self.eventActivate = true;
					self.gameStart();
					self.gameOver = false;
				}
			}
		});
	}
	gameStart() {
		console.log("Simon Game Started...");
		this.levelTitle.text(`Level ${this.level}`);
		this.nextSequence();
		this.gameStarted = true;
		this.eventActivate = true;
	}
	btnClick() {
		const self = this;

		$(".btn").click(function (e) {
			if (self.eventActivate) {
				let userChosenColour = $(this).attr("id");

				self.userClickedPattern.push(userChosenColour);
				self.playSound(userChosenColour);
				self.animatePress(userChosenColour);

				self.counterClick = self.userClickedPattern.length - 1;

				self.checkAnswer(self.counterClick);
			}
		});
	}
	checkAnswer(currentLevel) {
		const self = this;

		let gamePattern = this.gamePattern[currentLevel];
		let userClickedPattern = this.userClickedPattern[currentLevel];

		if (gamePattern === userClickedPattern) {
			if (this.userClickedPattern.length === this.gamePattern.length)
				setTimeout(function () {
					self.nextSequence();
				}, 500);
			console.log("success");
		} else {
			this.playSound("wrong");
			this.addRemoveClass("body", "game-over", 200);
			this.levelTitle.text("Game Over, Press Space to Restart");
			this.startOver();
			this.keyPress();

			this.gameOver = true;
		}
	}
	// reset level, gamePattern and started variables.
	startOver() {
		this.level = 0;
		this.gamePattern = [];
		this.gameStarted = false;
		this.gameOver = false;
		this.eventActivate = false;
	}
	nextSequence() {
		this.userClickedPattern = [];
		this.level += 1;

		this.levelTitle.text(`Level ${this.level}`);

		let randomNumber = this.randomNumber();
		let randomChosenColour = this.buttonColours[randomNumber];
		this.gamePattern.push(randomChosenColour);

		this.playSound(randomChosenColour);
		$(`#${randomChosenColour}`).fadeIn(100).fadeOut(100).fadeIn(100);

		console.log("gamePattern:", this.gamePattern);
	}
	animatePress(color) {
		let idColor = $(`#${color}`);
		idColor.fadeIn(100).fadeOut(100).fadeIn(100);
		this.addRemoveClass(idColor, "pressed", 50);
	}
	addRemoveClass(el, className, duration) {
		$(el).addClass(className);
		setTimeout(function () {
			$(el).removeClass(className);
		}, duration);
	}
	playSound(name) {
		let colorSoundSrc = `sounds/${name}.mp3`;
		let colorAudio = new Audio(colorSoundSrc);
		colorAudio.play();
	}
	randomNumber() {
		let randomNumber = Math.random();
		randomNumber = Math.floor(randomNumber * 4);
		return randomNumber;
	}
}
const initialize = new SimonGame();
