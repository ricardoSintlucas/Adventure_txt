// JavaScript Document
$(document).ready(function () {


	$.getJSON('script/environment.json', function (data) {
		// Now you can use your data
		processData(data);
	})
		.fail(function (jqXHR, textStatus, error) {
			console.error('Error:', error);
		});


	function processData(data) {
		//process the data
		data.rooms.forEach(room => {
			let tempName = room.name;
			tempName = tempName.replace(/\s/g, '');
			let tempItems = [];
			for (let i = 0; i < room.items.length; i++) {
				let item = room.items[i];
				if (item.portable) {
					tempItems.push(new PortableItem(item.name, item.description));
				} else {
					tempItems.push(new StaticItem(item.name, item.description));
				}
			}
			//console.log(tempItems);
			gameObjects[tempName] = new Room(room.name, room.description, tempItems);
		});

		console.log(gameObjects.LivingRoom);
	}


	let gameObjects = {};

	/////////////////
	//set variables
	/////////////////
	"use strict";
	let mainStory1_01;
	let whatIsTyped;
	//If a function needs to return two answers
	let answers;
	//Set variable item 
	let item

	//setup all the objects names

	//doors
	var doorLivingroomToKitchen;
	var doorLivingroomToHallway;
	var doorHallwayToOutside;

	//other Items
	var coffeeTable;

	//keys
	let keyLivingroomToHallway;
	let keyHallwaytoOutside;

	//Items 
	let ball;
	let apple;

	//Persons
	let person;

	//spaces
	let livingRoom;
	let kitchen;
	let hallway;
	let outside;

	//set the main story here 
	mainStory1_01 = "You wake up in a room on the floor.<br>And you don't know where you are...";
	$("#mainStory").html(mainStory1_01);

	//test classes with making objects

	doorLivingroomToKitchen = new Door("wooden door",
		"You can go from the livinging room to the kitchen and back");

	doorLivingroomToHallway = new Door("wooden green door",
		"You can go from the livinging room to the hallway and back",
		123);
	doorHallwayToOutside = new Door("front door",
		"You can go outside the house and back",
		213);

	apple = new PortableItem("apple",
		"A tasty red apple");

	person = new Character("Jim",
		"He is standing in the corner. Looks like a nice guy",
		[apple],
		[["which key fits in the door", "I think it was the rusty key."],
		["what are you doing here", "I don't know."]
		]);

	keyLivingroomToHallway = new Key("rusty key",
		"This is the key that opens the door to the hallway",
		123);
	keyHallwaytoOutside = new Key("blue key",
		"This is the key that opens the front door",
		213);
	ball = new PortableItem("ball",
		"A small rubber ball");

	coffeeTable = new StaticItem("coffee table",
		"A small coffee table",
		[keyLivingroomToHallway, keyHallwaytoOutside, ball]);


	livingRoom = new Room("living room",
		"It's a well lite room and there are two doors opposite of eachother. One wooden door and a green wooden door. There's a man and there is a coffee table.",
		[doorLivingroomToKitchen, doorLivingroomToHallway, coffeeTable, person]);

	kitchen = new Room("kitchen",
		"The kitchen... Only one door. the wooden one.",
		[doorLivingroomToKitchen]);

	hallway = new Room("hallway",
		"This is the hallway. You see light comming in through the glass window next to the front door. And there is the green woodendoor to the living room.",
		[doorLivingroomToHallway, doorHallwayToOutside]);

	outside = new StaticItem("outside",
		"It's a forrest and it's a sunny day",
		[doorHallwayToOutside]);


	//set the rooms that are connected to this door. First room where you in then the room that goes to.
	doorLivingroomToKitchen.setSpaces(livingRoom, kitchen);
	doorLivingroomToHallway.setSpaces(livingRoom, hallway);
	doorHallwayToOutside.setSpaces(hallway, outside);

	//set current space to room
	currentSpace = livingRoom;


	//List of random default answer
	let defaultAnswer = ["be more specific. Don't understand: ",
		"That's not posible... ",
		"You're just babbling... "];




	//Checks on keydown if "enter" is pressed 
	$("#typeHere").on("keydown", function (keyPressed) {
		if (keyPressed.which === 13) {
			//set variable with the value of the input field
			whatIsTyped = $("#typeHere").val();
			//make the input field empty
			$("#typeHere").val("");
			//check the switch function is there is something that is typed right
			checkWhatIsTyped(whatIsTyped);
		}
	});

	function setAnswer(placeholder, answer, cursor, input) {
		//make the response div empty 
		$(placeholder).empty();

		//remove all .typed-cursor that is set bij the Typed script 
		$(".typed-cursor").remove();


		//execute Typed function in the #responseBlok div with the $answer
		let typed = new Typed(placeholder, {
			strings: [answer],
			typeSpeed: 20,
			backSpeed: 0,

		});

	}




	/*
	//	//Functions that are triggered by certain phrases
	//
	*/
	function lookAround() {
		let answer;
		answer = currentSpace.getDescription();
		return answer;
	}

	function checkContainer(container) {
		let answer;
		/*console.log(container);
		if (container == undefined) {
			answer = "there are no items";
			console.log("there are no items");
		} else {
			answer = "there are items";
			console.log("there are items");
		}
		*/
		if (container.objects.length <= 0 || container.objects.length == undefined) {
			answer = "There are no items."
		} else {
			answer = "You see at the ";
			answer = answer + container.getName() + ": ";
			for (let i = 0; i < container.objects.length; i++) {
				if (i === 0) {
					answer = answer + container.objects[i].getName();
				} else if (i < container.length - 1) {
					answer = answer + ", " + container.objects[i].getName();
				} else {
					let name = container.objects[i].getName();
					let firstLetter = name[0].toLowerCase();
					if (firstLetter === "a" || firstLetter === "o" || firstLetter === "u" || firstLetter === "i" || firstLetter === "e") {
						answer = answer + " and an " + name;
					} else {
						answer = answer + " and a " + name;
					}
				}

			}
		}
		return answer;

	}


	function getItem(nameItem, container) {
		let answer;
		if (container !== undefined) {
			for (let i = 0; i < container.objects.length; i++) {
				if (container.objects[i].getName() === nameItem) {
					container.objects[i].pickUp();
					container.objects.splice(container.objects.indexOf(container.objects[i]), 1);
					answer = "You pick up the " + nameItem + " from the " + container.getName();
					break;
				} else {
					answer = "There is no " + nameItem + "  on " + container.getName();
				}
			}
		} else {
			answer = "There is no " + nameItem + " in this space";
		}
		return answer;
	}

	function destroyItemInventory(nameItem) {
		if (currentInventory.length !== 0) {
			for (let i = 0; i < currentInventory.length; i++) {
				if (currentInventory[i].getName() === nameItem) {
					item = currentInventory[i];
					currentInventory.splice(currentInventory.indexOf(item), 1);
					break;
				}
			}
		}
	}

	function checkItemInventory(nameItem) {
		let answer;
		if (currentInventory.length !== 0) {
			for (let i = 0; i < currentInventory.length; i++) {
				if (currentInventory[i].getName() === nameItem) {
					answer = currentInventory[i];
					break;
				} else {
					answer = "There is no " + nameItem;
				}
			}
		}
		return answer;
	}

	function checkItemInCurrentRoom(nameItem) {
		let answer;
		for (let i = 0; i < currentSpace.objects.length; i++) {
			if (currentSpace.objects[i].getName() === nameItem) {
				answer = currentSpace.objects[i].getDescription();
				break;
			} else {
				answer = "There is no " + nameItem + " in this room";
			}
		}
		return answer;
	}

	function checkCharacterInRoom(person) {
		let answer;
		for (let i = 0; i < currentSpace.objects.length; i++) {
			if (currentSpace.objects[i].getName() === nameItem) {
				answer = true;
				break;
			} else {
				answer = false;
			}
		}
	}

	function giveRandomAnswer(listAnswers) {
		let answer;
		let totalAnswers = listAnswers.length;
		let randomNumer = Math.floor(Math.random() * totalAnswers);
		answer = listAnswers[randomNumer];
		return answer;
	}



	function checkWhatIsTyped(typed) {

		let convertType = typed.toLowerCase();

		switch (convertType) {
			case includes("look around"):
				//give description of the space.
				setAnswer("#responseBlok", lookAround(), true);

			case "stand up":
			case "get up":
				setAnswer("#responseBlok", "You get up", true);
				break;
			case includes("to wooden door"):
				setAnswer("#responseBlok", checkItemInCurrentRoom("wooden door"), true);
				break;
			case includes("to green door"):
				setAnswer("#responseBlok", checkItemInCurrentRoom("wooden green door"), true);
				break;
			case "walk to man":
			case "go to man":
				setAnswer("#responseBlok", checkItemInCurrentRoom("Jim"), true);
				break;
			case "open door":
				setAnswer("#responseBlok", "Which door? ", true);
				break;
			case includes("coffee table"):
				setAnswer("#responseBlok", checkContainer(currentSpace.objects[2]), true);
				break;
			case includes("rusty key"):
				setAnswer("#responseBlok", getItem("rusty key", currentSpace.objects[2]), true);
				break;
			case includes("what is your name"):
				if (checkCharacterInRoom("Jim")) {
					setAnswer("#responseBlok", "Nobody here...", true);
				} else {
					setAnswer("#responseBlok", person.getName(), true);
				}
				break;
			case includes("which key fits in the door"):
				if (checkCharacterInRoom("Jim")) {
					setAnswer("#responseBlok", person.getAnswer("which key fits in the door"), true);
				} else {
					setAnswer("#responseBlok", "There is nodbody in the room...", true);
				}
				break;
			case includes("what are you doing here"):
				setAnswer("#responseBlok", person.getAnswer("what are you doing here"), true);
				break;
			case includes("blue key"):
				setAnswer("#responseBlok", getItem("blue key", currentSpace.objects[2]), true);
				break;
			case includes("ball"):
				setAnswer("#responseBlok", getItem("ball", currentSpace.objects[2]), true);
				break;
			case "pick up apple":
			case "pick up the apple":
			case "pick up an apple":
				setAnswer("#responseBlok", getItem("apple", currentSpace.objects[2]), true);
				break;
			case "open door with key":
			case "use key on door":
				setAnswer("#responseBlok", "Which door?", true);
				break;
			case "open green wooden door":
			case "open green door":
				answers = doorLivingroomToHallway.openDoor();
				if (jQuery.type(answers) === "array") {
					setAnswer("#mainStory", answers[1], true);
					setAnswer("#responseBlok", answers[0], true);
				} else {
					setAnswer("#responseBlok", answers, true);
				}
				break;
			case "open wooden door":
				answers = doorLivingroomToKitchen.openDoor();

				if (jQuery.type(answers) === "array") {
					setAnswer("#mainStory", answers[1], true);
					setAnswer("#responseBlok", answers[0], true);
				} else {
					setAnswer("#responseBlok", answers, true);
				}
				break;

			case "use rusty key on green door":
			case "open green door with rusty key":
				item = checkItemInventory("rusty key");
				if (item !== undefined) {
					doorLivingroomToHallway.setItemKeyID(item.unLock());
					doorLivingroomToHallway.toggleLock();
				}

				answers = doorLivingroomToHallway.openDoor();
				if (jQuery.type(answers) === "array") {
					setAnswer("#mainStory", answers[1], true);
					setAnswer("#responseBlok", answers[0], true);
				} else {
					setAnswer("#responseBlok", answers, true);
				}
				break;
			case "use blue key on green door":
			case "open green door with blue key":
				item = checkItemInventory("blue key");
				if (item !== undefined) {
					doorLivingroomToHallway.setItemKeyID(item.unLock());
					doorLivingroomToHallway.toggleLock();
				}

				answers = doorLivingroomToHallway.openDoor();

				if (jQuery.type(answers) === "array") {
					setAnswer("#mainStory", answers[1], true);
					setAnswer("#responseBlok", answers[0], true);
				} else {
					setAnswer("#responseBlok", answers, true);
				}

				break;
			case "use blue key on front door":
			case "open front door with blue key":
				item = checkItemInventory("blue key");
				if (item !== undefined) {
					doorHallwayToOutside.setItemKeyID(item.unLock());
					doorHallwayToOutside.toggleLock();
				}

				answers = doorHallwayToOutside.openDoor();
				if (jQuery.type(answers) === "array") {
					setAnswer("#mainStory", answers[1], true);
					setAnswer("#responseBlok", answers[0], true);
				} else {
					setAnswer("#responseBlok", answers, true);
				}
				break;
			case "use rusty key on front door":
			case "open front door with rusty key":
				item = checkItemInventory("rusty key");
				console.log(item);
				if (item !== undefined) {
					doorHallwayToOutside.setItemKeyID(item.unLock());
					doorHallwayToOutside.toggleLock();
				}

				answers = doorHallwayToOutside.openDoor();
				if (jQuery.type(answers) === "array") {
					setAnswer("#mainStory", answers[1], true);
					setAnswer("#responseBlok", answers[0], true);
				} else {
					setAnswer("#responseBlok", answers, true);
				}
				break;
			case "open front door":
				answers = doorHallwayToOutside.openDoor();

				if (jQuery.type(answers) === "array") {
					setAnswer("#mainStory", answers[1], true);
					setAnswer("#responseBlok", answers[0], true);
				} else {
					setAnswer("#responseBlok", answers, true);
				}
				break;
			case "check my inventory":
			case "check inventory":
				setAnswer("#responseBlok", checkContainer(currentInventory), true);
				break;
			case "eat apple":
				item = checkItemInventory("apple");
				if (item !== undefined) {
					setAnswer("#responseBlok", item.getName(), true);
				} else {
					setAnswer("#responseBlok", "You don't have an apple", true);
				}
				break;
			default:
				setAnswer("#responseBlok", giveRandomAnswer(defaultAnswer) + convertType, true);
		}
	}

});