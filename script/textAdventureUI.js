// JavaScript Document
 $(document).ready(function(){
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
	 
	
	//set the main story here 
	mainStory1_01 = "You wake up in a room on the floor.<br>And you don't know where you are...";
	 
	 
	//List of random default answer
	let defaultAnswer = ["be more specific. Don't understand: ",
						"That's not posible... ",
						"You're just babbling... "];
	
	
	$("#mainstoryText").html(mainStory1_01);
	
	//Checks on keydown if "enter" is pressed 
	$( "#typeHere" ).on( "keydown", function( keyPressed ) {
		if(keyPressed.which === 13){
			//set variable with the value of the input field
			whatIsTyped = $("#typeHere").val();
			//make the input field empty
			$( "#typeHere" ).val("");
			//check the switch function is there is something that is typed right
			checkWhatIsTyped(whatIsTyped);
		}
	});
	
	function setAnswer(placeholder,answer, cursor){
		//make the response div empty 
		$(placeholder).empty();

		//remove all .typed-cursor that is set bij the Typed script 
		$( ".typed-cursor" ).remove();

		//execute Typed function in the #response div with the $answer
		let typed = new Typed(placeholder, {
			strings: [answer],
			typeSpeed:20,
			backSpeed: 0,
			showCursor:cursor
		});
	}

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
				   [	["which key fits in the door", "I think it was the rusty key."],
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
						  [keyLivingroomToHallway,keyHallwaytoOutside, ball]);
	

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

	
/*
//	//Functions that are triggered by certain phrases
//
*/
	 function lookAround(){
		 let answer;
		 answer = currentSpace.getDescription();
		 return answer; 
	 }
	 
	 function checkContainer(container){
		 let answer;
		 
		 if(container.length <= 0 || container.length == undefined){
			 answer = "You don't carry anything with you."
		 }else{
			answer = "You see: ";
			for(let i= 0; i<container.length; i++){
				if(i===0){
					answer = answer+container[i].getName();
				}else if(i<container.length-1){
					answer = answer + ", " + container[i].getName();
				}else{
					let name = container[i].getName();
					let firstLetter = name[0].toLowerCase();
					if(firstLetter === "a" || firstLetter === "o" || firstLetter === "u" || firstLetter === "i" || firstLetter === "e"){
						answer = answer + " and an " + name;
					}else{
						answer = answer + " and a " + name;
					}
				}
				
			} 
		 }
		 return answer;
	 }
	 
	 
	 function getItem(nameItem, container){
		 let answer;
		 if(container !== undefined){
			 for(let i=0; i < container.objects.length; i++){
				 if(container.objects[i].getName() === nameItem){
					 container.objects[i].pickUp();
					 container.objects.splice(container.objects.indexOf(container.objects[i]),1);
					 answer = "You pick up the " + nameItem + " from the " + container.getName();
					 break;
				 }else{
					 answer = "There is no " + nameItem + "  on " + container.getName();
				 }
			 }
		 }else{
			 answer = "There is no " + nameItem + " in this space";
		 }
		 return answer;
	 }
	 
	 function destroyItemInventory(nameItem){
		 if(currentInventory.length !== 0 ){
			 for(let i=0; i< currentInventory.length; i++){
				 if(currentInventory[i].getName() === nameItem){
					 item = currentInventory[i];
					 currentInventory.splice(currentInventory.indexOf(item),1);
					 break;
				 }
			 }
		 }
	 }
	 
	 function checkItemInventory(nameItem){
		 let answer;
		 if(currentInventory.length !== 0 ){
			 for(let i=0; i< currentInventory.length; i++){
				 if(currentInventory[i].getName() === nameItem){
					 answer = currentInventory[i];
					 break;
				 }else{
					 answer = "There is no " + nameItem;
				 }
			 }
		 }
		 return answer;
	 }
	 
	 function checkItemInCurrentRoom(nameItem){
		 let answer;
		 for(let i=0; i<currentSpace.objects.length; i++){
			 if(currentSpace.objects[i].getName() === nameItem){
				 answer = currentSpace.objects[i].getDescription();
				 break;
			 }else{
				 answer = "There is no " + nameItem + " in this room";
			 }
		 }
		 return answer;
	 }
	 
	 function checkCharacterInRoom(person){
		 let answer;
		 for(let i=0; i<currentSpace.objects.length; i++){
			 if(currentSpace.objects[i].getName() === nameItem){
				 answer = true;
				 break;
			 }else{
				 answer = false;
			 }
		 }
	 }
	 
	 function giveRandomAnswer(listAnswers){
		 let answer;
		 let totalAnswers = listAnswers.length;
		 let randomNumer = Math.floor(Math.random()*totalAnswers);
		 answer = listAnswers[randomNumer];
		 return answer;
	 }
	 
	 
	 
	 function checkWhatIsTyped(typed){
		 
		 let convertType = typed.toLowerCase();
		
		 switch(convertType){
			case "look around":
			case "look space":
				//give description of the space.
				setAnswer("#response",lookAround(), true);
				break;
			case "stand up":
			case "get up":
				setAnswer("#response","You get up", true);
				break;
			case "walk to wooden door":
			case "go to wooden door":
				setAnswer("#response",checkItemInCurrentRoom("wooden door"), true);
				break;
			case "walk to wooden green door":
			case "go to wooden green door":
			case "walk to green door":
			case "go to green door":
				setAnswer("#response",checkItemInCurrentRoom("wooden green door"), true);
				break;
			case "walk to person":
			case "go to person":
				setAnswer("#response",checkItemInCurrentRoom("Jim"), true);
				break;
			case "open door":
				setAnswer("#response","Which door? ", true);
				break;
			case "look at coffee table":
			case "see coffee table":
			case "check coffee table":
				setAnswer("#response",checkContainer(coffeeTable.objects), true);
				break;
			case "take rusty key":
			case "get rusty key":
			case "grab rusty key":
			case "pick up rusty key":
				setAnswer("#response",getItem("rusty key", currentSpace.objects[2]), true);
				break;		
			case "what is your name?":
			case "what is your name":
				 if(checkCharacterInRoom("Jim")){
					setAnswer("#response","Nobody here...", true);
				 }else{
					  setAnswer("#response",person.getName(), true);
				 }
				break;		
			case "which key fits in the door?":
			case "which key fits in the door":
				 if(checkCharacterInRoom("Jim")){
					setAnswer("#response",person.getAnswer("which key fits in the door"), true);
				 }else{
					 setAnswer("#response","There is nodbody in the room...", true);
				 }
				break;		
			case "what are you doing here?":
			case "what are you doing here":
				setAnswer("#response",person.getAnswer("what are you doing here"), true);
				break;		
			case "take blue key":
			case "get blue key":
			case "grab blue key":
			case "pick up blue key":
				setAnswer("#response",getItem("blue key",  currentSpace.objects[2]), true);
				break;		
			case "take ball":
			case "get ball":
			case "grab ball":
			case "pick up ball":
				setAnswer("#response",getItem("ball",  currentSpace.objects[2]), true);
				break;		
			case "take apple":
			case "get apple":
			case "grab apple":
			case "pick up appple":
				setAnswer("#response",getItem("apple",  currentSpace.objects[2]), true);
				break;		
			case "open door with key": 
			case "use key on door": 
				setAnswer("#response","Which door?", true);
				break;
			case "open green wooden door":
			case "open green door":
				answers = doorLivingroomToHallway.openDoor();
				if(jQuery.type(answers) === "array"){
					setAnswer("#mainstoryText",answers[1], true);
					setAnswer("#response",answers[0], true);
				}else{
					setAnswer("#response",answers, true);
				}
				break;
			case "open wooden door":
				answers = doorLivingroomToKitchen.openDoor();
				
				if(jQuery.type(answers) === "array"){
					setAnswer("#mainstoryText",answers[1], true);
					setAnswer("#response",answers[0], true);
				}else{
					setAnswer("#response",answers, true);
				}
				break;
			
			case "use rusty key on green door": 
			case "open green door with rusty key":
				 item = checkItemInventory("rusty key");
				 if(item !== undefined){
					 doorLivingroomToHallway.setItemKeyID(item.unLock());
					 doorLivingroomToHallway.toggleLock();
				 }
				 
				answers = doorLivingroomToHallway.openDoor();
				if(jQuery.type(answers) === "array"){
					setAnswer("#mainstoryText",answers[1], true);
					setAnswer("#response",answers[0], true);
				}else{
					setAnswer("#response",answers, true);
				}
				break;
			case "use blue key on green door": 
			case "open green door with blue key":
				 item = checkItemInventory("blue key");
				 if(item !== undefined){
					 doorLivingroomToHallway.setItemKeyID(item.unLock());
					 doorLivingroomToHallway.toggleLock();
				 }
				 
				answers = doorLivingroomToHallway.openDoor();
				
				if(jQuery.type(answers) === "array"){
					setAnswer("#mainstoryText",answers[1], true);
					setAnswer("#response",answers[0], true);
				}else{
					setAnswer("#response",answers, true);
				}
				
				break;
			case "use blue key on front door": 
			case "open front door with blue key": 
				 item = checkItemInventory("blue key");
				 if(item !== undefined){
					 doorHallwayToOutside.setItemKeyID(item.unLock());
					 doorHallwayToOutside.toggleLock();
				 }
				 
				answers = doorHallwayToOutside.openDoor();
				if(jQuery.type(answers) === "array"){
					setAnswer("#mainstoryText",answers[1], true);
					setAnswer("#response",answers[0], true);
				}else{
					setAnswer("#response",answers, true);
				}
				break;
			case "use rusty key on front door": 
			case "open front door with rusty key": 
				 item = checkItemInventory("rusty key");
				  console.log(item);
				 if(item !== undefined){
					 doorHallwayToOutside.setItemKeyID(item.unLock());
					 doorHallwayToOutside.toggleLock();
				 }
				 
				answers = doorHallwayToOutside.openDoor();
				if(jQuery.type(answers) === "array"){
					setAnswer("#mainstoryText",answers[1], true);
					setAnswer("#response",answers[0], true);
				}else{
					setAnswer("#response",answers, true);
				}
				break;
			case "open front door": 
				answers = doorHallwayToOutside.openDoor();
				
				if(jQuery.type(answers) === "array"){
					setAnswer("#mainstoryText",answers[1], true);
					setAnswer("#response",answers[0], true);
				}else{
					setAnswer("#response",answers, true);
				}
				break;
			case "check my inventory": 
			case "check inventory": 
				setAnswer("#response",checkContainer(currentInventory), true);
				break;
			case "eat apple": 
				item = checkItemInventory("apple");
				if(item !== undefined){
					setAnswer("#response",item.getName(), true);
				}else{
					setAnswer("#response","You don't have an apple", true);
				}
				break;
			default:
				setAnswer("#response",giveRandomAnswer(defaultAnswer)+ convertType, true);
		 }
	 } 
	 
 });