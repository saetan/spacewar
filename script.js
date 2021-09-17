//game round
//attack alien
//if ship survive attack me
//if i survive attack again
// go on

//if destory ship, can attack next ship or run
//if retreat game over
//win if i destory all
//lose if i got destory
function randomNumber(minNumber, maxNumber) {
        return Math.floor((Math.random() * (maxNumber - minNumber + 1) + minNumber));
}

function displayStats(objName, messageType, targetName) {
        if (messageType == "attack") {
            alert(`${objName.name} has dealt ${objName.firepower} dmg on ${targetName.name}`);
        }

        if (messageType == "health") {
            alert(`${objName.name}'s current hull is ${objName.hull}`);
        }

        if (messageType == "destoryed") {
            alert(`${objName.name} is ${messageType} by ${targetName.name}`);
        }

        if (messageType == "dead") {
             alert(`${objName.name} is ${messageType}`);
        }

        if (messageType == "Won") {
             alert(`${objName.name} win!`);
        }
}

class Ship {
    constructor(name, hull, firepower, accuracy) {
        this.name = name;
        this.hull = hull;
        this.firepower = firepower;
        this.accuracy = accuracy;
        this.isDead = false;
        this.type = "enemy";
    }

    attack(target) {
        let attackChance = randomNumber(0, 1);
        if (attackChance <= this.accuracy) {
            target.hull -= this.firepower;
            displayStats(this, "attack", target);
            return;
        } else {
            alert(`${this.name}: Missed`);
        }
    }


    getRandomStats() {
        this.hull = randomNumber(3, 6);
        this.firepower = randomNumber(2, 4);
        this.accuracy = (randomNumber(6, 8))/10;
    }

}

class Game {
    constructor() {
        this.playerShip = new Ship("player", 20, 5, 0.7);
        this.playerShip.type = "player";
        this.enemyShipArr = [];
        this.action = 0;
        this.isRunning = true;
        this.hasWon = false;
        this.currEnemyShip = null;
    }

    isDestory(target) {
        if (target.hull <= 0) {
            target.isDead = true;
            return true;
        }
    }

    checkDestoryPhase(target, source) {
        this.isDestory(target);
        if (target.isDead) {
            displayStats(target, "destoryed", source);
            if (target.type == "enemy") {
                this.currEnemyShip = null;
                return;
            }

            if (target.type == "player") {
                this.hasEnded();
                return;
            }
        } else {
            displayStats(target, "health");
        }
    }

    attackPhase() {
        this.checkAlienShips();
        this.playerShip.attack(this.currEnemyShip);
        this.checkDestoryPhase(this.currEnemyShip, this.playerShip);
        if (this.currEnemyShip) {
            this.currEnemyShip.attack(this.playerShip);
            this.checkDestoryPhase(this.playerShip, this.currEnemyShip);
            return;
        }
        this.checkAlienShips();
    }

    spawnAlienShip() {
        let alienCount = randomNumber(6, 10);
        for (let i = 1; i <= alienCount; i++) {
            let tempAlienShip = new Ship(`alienship${i}`);
            tempAlienShip.getRandomStats();
            this.enemyShipArr.push(tempAlienShip);
        }

        this.currEnemyShip = this.enemyShipArr.pop();
        console.log(this.enemyShipArr);
    }

    Won() {
        this.hasWon = true;
    }

    hasEnded() {
        if (this.playerShip.isDead || this.hasWon) {
            if (this.playerShip.isDead) {
                displayStats(this.playerShip, "dead");
            } else {
                displayStats(this.playerShip, "Won");
            }

            this.isRunning = false;
        }
    }

    checkAlienShips() {
        if (!this.currEnemyShip) {
            if (this.enemyShipArr.length) {
                //if array not empty, pop out one for the list
                this.currEnemyShip = this.enemyShipArr.pop();
            } else {
                //array empty means all gone, win and end game
                this.Won();
                this.hasEnded();
            }
        } 
    }

    promptPhase() {
        let action = 0;

        while (this.isRunning) {
            action = prompt(`Current Amount of Alien: ${this.enemyShipArr.length ? this.enemyShipArr.length : 1 } Current HP: ${this.playerShip.hull} Your action, 1) Attack ${this.currEnemyShip.name}, 2)Run, 3)Exit`);
            switch (parseInt(action)) {
                case 1:
                    this.attackPhase();
                    break;
                case 2:
                    alert("No running");
                    break;
                case 3:
                    this.isRunning = false;
                    break;
                default:
                    alert("Numbers Only");
                    this.promptPhase();
            }
        }
    }

    startGame() {
        this.spawnAlienShip();
        this.promptPhase();
    }
}

const newGame = new Game();
newGame.startGame();