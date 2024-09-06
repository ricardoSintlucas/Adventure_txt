$(document).ready(function () {
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