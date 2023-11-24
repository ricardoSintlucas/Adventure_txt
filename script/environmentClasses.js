// JavaScript Document

//set globalID
"use strict";
let globalID = null;

//set current space var
let currentSpace;

//current inventory
let currentInventory = [];


function GiveUniqueID(){
	if(globalID === null){
		globalID = 0;
	}else{
		globalID++;
	}
	return globalID;
}

//parent class voor all objects that are static
function StaticItem(name, description, objects){
	//public attributes
	this.name = name;
	this.description = description;
	this.objects = objects;
	this.id = GiveUniqueID();

	//operations
	this.getName = function(){
		return this.name;
	};

	this.getDescription = function(){
		return this.description;
	};

	this.getID = function(){
		return this.id;
	};
	
	this.getObjects = function(){
		console.log("Objects in the room:");
		for(let i = 0; i<this.objects.length; i++){
			console.log(i+". "+objects[i].getName());
		}
	};
}

function PortableItem(name, description, objects){
	//public attributes
	//get the vars that are setup in the parent class
	StaticItem.call(this, name, description, objects);
	this.pickedUp = false;

	this.pickUp = function(){
		if(!this.pickedUp){
			this.pickedUp = true;
			currentInventory.push(this);
		}else{
			this.pickedUp = false;
			currentInventory.splice(currentInventory.indexOf(this),1);
		}

	};

}
//PortableItem is child of StaticItem
PortableItem.prototype = new StaticItem();
PortableItem.prototype.constructor = PortableItem;


function Door(name, description, doorKeyID){
	//public attributes
	//get the vars that are setup in the parent class
	StaticItem.call(this, name, description);

	this.doorKeyID = doorKeyID;

	this.newSpace = undefined;
	this.tempSpace = undefined;


	//if Door object doesn't have doorKeyID it can't be locked and is open
	if(doorKeyID === undefined){
		this.locked = false;
	}else{
		this.locked = true;
	}

	//private attributes
	var itemKeyID = "";

	//operations
	this.openDoor = function(){
		if(!this.locked){
			
			//set global current space to the new space (you enterd a new room);
			currentSpace = this.newSpace;
			//set the door new space to old place where you come from
			this.newSpace = this.tempSpace;
			this.tempSpace = currentSpace;
			
			//Set up two answers in return
			let answers= [];
			answers[0] = "You entered: " + currentSpace.getName();
			answers[1] = currentSpace.getDescription();
			return answers;
			
		}else{
			return "This door is locked. You need to find a key or the right key";
		}
	};

	this.toggleLock = function(){
		if(itemKeyID ===  doorKeyID){
			this.locked = false;
		}else{
			this.locked = true;
		}
	};

	this.setItemKeyID = function(numberID){
		itemKeyID = numberID || ""; 
	};


	//set the two spaces where the door is the gateway to/from
	this.setSpaces = function(currentSpace, goToSpace){
		this.newSpace = goToSpace ;
		this.tempSpace = currentSpace;
	};

}

//Door is child of StaticItem
Door.prototype = new StaticItem();
Door.prototype.constructor = Door;


function Key(name, description, itemKeyID){
	PortableItem.call(this, name, description);
	this.itemKeyID = itemKeyID;

	this.unLock = function(){
		return this.itemKeyID;
	};
}
//Key is child of PortableItem
Key.prototype = new PortableItem();
Key.prototype.constructor = Key; 


//Room 
function Room(name, description, objects){ 
	//public attributes
	//get the vars that are setup in the parent class
	StaticItem.call(this, name, description,objects);
	
}

//Room is child of StaticItem
Room.prototype = new StaticItem();
Room.prototype.constructor = Room; 


//Character 
function Character(name, description, objects, questionsAnswers){ 
	//public attributes
	//get the vars that are setup in the parent class
	StaticItem.call(this, name, description, objects);

	
	this.questionsAnswers = questionsAnswers;
	
	this.getAnswer = function(question){
		for(let i=0; i<this.questionsAnswers.length; i++){
			if(question === this.questionsAnswers[i][0]){
				return this.questionsAnswers[i][1];
				break;
			}
		}
	};
	
	
	
}

//Character is child of StaticItem
Character.prototype = new StaticItem();
Character.prototype.constructor = Character; 







