// JavaScript Document
$(document).ready(function () {


    // store the game objects in a dictionary
    let gameObjects = {};
    //If a function needs to return two answers
    let whatIsTyped;
    //Set variable item 
    let item;

    //conditions and responses
    let conditions = {};
    let responses = {};

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
            let itemWithin = [];
            //store the items in the room
            for (let i = 0; i < room.items.length; i++) {
                let item = room.items[i];
                itemWithin = item.items;
                if (itemWithin !== undefined) {

                    for (let j = 0; j < itemWithin.length; j++) {
                        let itemInItem = itemWithin[j];
                        if (itemInItem.portable) {
                            tempItems.push(new PortableItem(itemInItem.name, itemInItem.description, itemInItem.items));
                        } else {
                            tempItems.push(new StaticItem(itemInItem.name, itemInItem.description, itemInItem.items));
                        }
                    }
                }
                if (item.portable) {
                    tempItems.push(new PortableItem(item.name, item.description, itemWithin));
                } else {
                    tempItems.push(new StaticItem(item.name, item.description, itemWithin));
                }
            }
            //store the doors in the room
            for (let i = 0; i < room.doors.length; i++) {
                let door = room.doors[i];
                //door.setSpaces(gameObjects[tempName], gameObjects[door.leadsTo]);
                let newDoor = new Door(door.name, door.description, door.keycode);
                newDoor.setSpaces(gameObjects[tempName], gameObjects[door.leadsTo]);
                tempItems.push(newDoor);
            }
            //store the characters in the room
            for (let j = 0; j < room.persons.length; j++) {
                let person = room.persons[j];
                tempItems.push(new Character(person.name, person.description, person.items, person.dialogue));
            }

            gameObjects[tempName] = new Room(room.name, room.description, tempItems);
            console.log(tempItems);

        });

        /*
        for (let i = 0; i < gameObjects["LivingRoom"].objects.length; i++) {
            let object = gameObjects["LivingRoom"].objects[i];
            if (object instanceof Door) {
                console.log(object.getName() + ' is a Door');
            } else if (object instanceof Character) {
                console.log(object.getName() + ' is a Character');
            } else if (object instanceof Key) {
                console.log(object.getName() + ' is a Key');
            } else if (object instanceof PortableItem) {
                console.log(object.getName() + ' is a PortableItem');

            } else if (object instanceof StaticItem) {
                console.log(object.getName() + ' is a StaticItem');
            } else {
                console.log(object.getName() + ' is an unknown type');
            }
        }*/
        function respondToInput(input) {
            input = input.toLowerCase();
            for (let condition in conditions) {
                console.log(conditions[condition]);
                if (conditions[condition].every(word => input.includes(word))) {
                    return responses[condition];
                }
            }

            return responses.default;
        }


        currentSpace = gameObjects.LivingRoom;
        console.log(currentSpace);
    }

    //List of random default answer
    let defaultAnswer = ["be more specific. Don't understand: ",
        "That's not posible... ",
        "You're just babbling... "];


    // Set the placeholder attribute to "type here"
    $("#typeHere").attr("placeholder", "Type here");

    // Clear the input field when it's selected
    $("#typeHere").on("focus", function () {
        $(this).val("");
    });


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
        if (container.objects.length <= 0 || container.objects.length == undefined) {
            answer = "There are no items.";
        } else {
            answer = "You see at the ";
            answer = answer + container.getName() + ": ";
            for (let i = 0; i < container.objects.length; i++) {
                if (i === 0) {
                    answer = answer + container.objects[i].getName();
                } else if (i < container.objects.length - 1) {
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


    function checkInventory() {
        let answer;
        if (currentInventory.length <= 0 || currentInventory.length == undefined) {
            answer = "There are no items.";
        } else {
            answer = "You have in your inventory: ";

            for (let i = 0; i < currentInventory.length; i++) {
                if (i === 0) {
                    answer = answer + currentInventory[i].getName();
                } else if (i < currentInventory.length - 1) {
                    answer = answer + ", " + currentInventory[i].getName();
                } else {
                    let name = currentInventory[i].getName();
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

    //first line to show in the adventure
    //set the main story here 
    let mainStory1_01 = "You wake up in a room on the floor.<br>And you don't know where you are...";
    $("#mainStory").html(mainStory1_01);




    //set the answers
    function checkWhatIsTyped(typed) {

        let convertType = typed.toLowerCase();
        let item;
        let answers;
        switch (convertType) {
            case "look around":
            case "look space":
                //give description of the space.
                setAnswer("#responseBlok", lookAround(), true);
                break;
            case "stand up":
            case "get up":
                setAnswer("#responseBlok", "You get up", true);
                break;
            case "walk to wooden door":
            case "go to wooden door":
                setAnswer("#responseBlok", checkItemInCurrentRoom("wooden door"), true);
                break;
            case "walk to wooden green door":
            case "go to wooden green door":
            case "walk to green door":
            case "go to green door":
                setAnswer("#responseBlok", checkItemInCurrentRoom("wooden green door"), true);
                break;
            case "walk to person":
            case "go to person":
                setAnswer("#responseBlok", checkItemInCurrentRoom("Jim"), true);
                break;
            case "open door":
                setAnswer("#responseBlok", "Which door? ", true);
                break;
            case "look at coffee table":
            case "see coffee table":
            case "check coffee table":

                setAnswer("#responseBlok", checkContainer(coffeeTable), true);
                break;
            case "take rusty key":
            case "get rusty key":
            case "grab rusty key":
            case "pick up rusty key":
                setAnswer("#responseBlok", getItem("rusty key", currentSpace.objects[2]), true);
                break;
            case "what is your name?":
            case "what is your name":
                if (checkCharacterInRoom("Jim")) {
                    setAnswer("#responseBlok", "Nobody here...", true);
                } else {
                    setAnswer("#responseBlok", person.getName(), true);
                }
                break;
            case "which key fits in the door?":
            case "which key fits in the door":
                if (checkCharacterInRoom("Jim")) {
                    setAnswer("#responseBlok", person.getAnswer("which key fits in the door"), true);
                } else {
                    setAnswer("#responseBlok", "There is nodbody in the room...", true);
                }
                break;
            case "what are you doing here?":
            case "what are you doing here":
                setAnswer("#responseBlok", person.getAnswer("what are you doing here"), true);
                break;
            case "take blue key":
            case "get blue key":
            case "grab blue key":
            case "pick up blue key":
                setAnswer("#responseBlok", getItem("blue key", currentSpace.objects[2]), true);
                break;
            case "take ball":
            case "get ball":
            case "grab ball":
            case "pick up ball":
                setAnswer("#responseBlok", getItem("ball", currentSpace.objects[2]), true);
                break;
            case "take apple":
            case "get apple":
            case "grab apple":
            case "pick up appple":
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
                    setAnswer("#mainstoryText", answers[1], true);
                    setAnswer("#responseBlok", answers[0], true);
                } else {
                    setAnswer("#responseBlok", answers, true);
                }
                break;
            case "open wooden door":
                answers = doorLivingroomToKitchen.openDoor();

                if (jQuery.type(answers) === "array") {
                    setAnswer("#mainstoryText", answers[1], true);
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
                    setAnswer("#mainstoryText", answers[1], true);
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
                    setAnswer("#mainstoryText", answers[1], true);
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
                    setAnswer("#mainstoryText", answers[1], true);
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
                    setAnswer("#mainstoryText", answers[1], true);
                    setAnswer("#responseBlok", answers[0], true);
                } else {
                    setAnswer("#responseBlok", answers, true);
                }
                break;
            case "open front door":
                answers = doorHallwayToOutside.openDoor();

                if (jQuery.type(answers) === "array") {
                    setAnswer("#mainstoryText", answers[1], true);
                    setAnswer("#responseBlok", answers[0], true);
                } else {
                    setAnswer("#responseBlok", answers, true);
                }
                break;
            case "check my inventory":
            case "check inventory":
                setAnswer("#responseBlok", checkInventory(), true);
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
