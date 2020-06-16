
let btnAtkSimple;     // simple attack button
let btnAtkSpec;     // special attack button (under construction)
let btnGenPlayer;     // generate Pokemon for Player
let btnGenOpponent;     // generate Pokemon for Opponent
let btnHealPlayer;  // heal button
let btnHealOpponent // heal button
let btnLevelup;     // level up pokemon button
let btnClearLog;     // clear battle logs
let btnChoosePokemon   
let btnHideUp;
let btnHideDown;

let divHideUp;
let divHideDown;

let imgPlayer;  // picture of Pokemon 
let imgOpponent;    //

let descrPlayer;    // stats description
let descrOpponent   // stats description

let logId = 0;
let gameLogs;

let progressHpPlayer;
let progressHpOpponent;

const apiLink = 'https://pokeapi.co/api/v2/pokemon/'

let $pokemonPlayer;     // Pokemon object 
let $pokemonOpponent;   // 

// Pokemon class fields
let number;
let name;
let level;
let img;
let hp;
let attack;
let defense;
let attackSp;
let defenseSp;
let speed;
let stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    attackSp: 0,
    defenseSp: 0,
    speed: 0
};

// Pokemon status
let attackerAlive = true;
let defenderAlive = true;

const main = () => {
    prepareDOMElements();
    prepareDOMEvents();
};

const prepareDOMElements = () => {
    btnAtkSimple = document.querySelector('.btn-atk-simple');
    btnAtkSpecial = document.querySelector('.btn-atk-special');

    btnGenPlayer = document.querySelector('.btn-generate-player');
    btnGenOpponent = document.querySelector('.btn-generate-opponent');
    btnHealPlayer = document.querySelector('.btn-heal-player');
    btnHealOpponent = document.querySelector('.btn-heal-opponent');
    btnLevelup = document.querySelector('.btn-levelup');
    btnClearLog = document.querySelector('.btn-clear-log');
    
    btnHideUp = document.querySelector('.btn-hide-up');
    btnHideDown = document.querySelector('.btn-hide-down');

    divHideUp = document.querySelector('.hide-up');
    divHideDown = document.querySelector('.hide-down');
    
    imgList = document.querySelector('.img-list');

    imgPlayer = document.querySelector('.img-player');
    imgOpponent = document.querySelector('.img-opponent');

    descrOpponent = document.querySelector('.descr-opponent');
    descrPlayer = document.querySelector('.descr-player');

    progressHpPlayer = document.querySelector('.progress-player');
    progressHpOpponent = document.querySelector('.progress-opponent');

    gameLogs = document.querySelector('.game-logs');
}


class Pokemon {
    constructor(number,name,img,hp,attack,defense,attackSp,defenseSp,speed){
        this.number = number;
        this.name = name;
        this.level = 1;
        this.img = img;

        this.stats = {
            hp: hp*2,
            attack: attack,
            defense: defense,
            attackSp: attackSp,
            defenseSp: defenseSp,
            speed: speed,
            hpLeft: hp*2
        }
    }

    // level up the winner Pokemon by increasing stats +10%
    levelUp() {
        
        if (typeof (stats != 'undefined')) {

            this.level++;
            this.stats.hp = Math.floor(this.stats.hp * 1.1);
            this.stats.attack = Math.floor(this.stats.attack * 1.1);
            this.stats.defense = Math.floor(this.stats.defense * 1.1);
            this.stats.attackSp = Math.floor(this.stats.attackSp * 1.1);
            this.stats.defenseSp = Math.floor(this.stats.defenseSp * 1.1);
            this.stats.speed = Math.floor(this.stats.speed * 1.1);
            this.stats.hpLeft = Math.floor(this.stats.hpLeft * 1.1);

            updateDescription(this);

            updateBattleLogs(`${this.name} has just leveled up! Gained +10% in all stats<br>`);
        } 
    }

    // you can cheat by giving hp potion
    heal(){
        let newHp = this.stats.hpLeft + 50;
        (newHp > this.stats.hp) ? newHp = this.stats.hp : newHp = newHp;
        updateBattleLogs(`Trainer heals pokemon from: ${this.stats.hpLeft} to ${newHp}hp<br>`);
        this.stats.hpLeft = newHp;

        updateHpBar(this);
        updateDescription(this);
    }
}

// generate empty Pokemon 
$pokemonPlayer = new Pokemon(0,'Generate Player before fight','',100,10,100,100,100,100);
$pokemonOpponent = new Pokemon(0,'Generate Opponent before fight','',100,10,100,100,100,100);


// get All Pokemons 
const getAllPokemons = () => {

    for (let i = 1 ; i < 152 ; i++){

        let img = document.createElement('img');
        // HQ images
        // img.setAttribute('src',`https://pokeres.bastionbot.org/images/pokemon/${i}.png`);
        // LQ images
        img.setAttribute('src',`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`);
        img.setAttribute('id',i);
        img.setAttribute('width','50px');
        
        let div = document.createElement('div');
        div.className = 'col-sm-1';

        div.appendChild(img);
        imgList.appendChild(div);

    }
}



const setButtonsOnImages = () => {
    for (let i = 1 ; i < 152 ; i++){    
    btnChoosePokemon = document.getElementById(i);

    btnChoosePokemon.addEventListener('click', () => {
        console.log('Player chooses Pokemon number: '+ i)
        generatePlayer(i);
    }) 
    }
}


// create Pokemon from API
const getOnePokemon = id => {
    return new Promise( (resolve, reject) => {

        axios.get(apiLink+id)
            .then(res => {

                number = res.data.id
                name = res.data.name;
                
                stats = Object.assign({},res.data.stats)
                for (let i in stats){
                    if (i == 0 ){
                        hp = stats[i].base_stat;
                    } else if ( i == 1){
                        attack = stats[i].base_stat;
                    } else if (i==2){
                        defense = stats[i].base_stat;
                    } else if (i==3){
                        attackSp = stats[i].base_stat;
                    } else if (i==4){
                        defenseSp = stats[i].base_stat;
                    } else if (i==5){
                        speed = stats[i].base_stat;
                    }
                }

                img = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
                
                const newPokemon = new Pokemon(number,name,img,hp,attack,defense,attackSp,defenseSp,speed);
                resolve(newPokemon);
            })
            .catch( err => {
                console.log(err);
                reject(err);
            })
    })
}

// generate Pokemon controlled by Player
async function generatePlayer(pokemonId){
        
    if (pokemonId == 0 || pokemonId == undefined || pokemonId == null) {
        pokemonId = Math.floor(Math.random() * 151)+1;
    } 
    
    try {
        $pokemonPlayer = await getOnePokemon(pokemonId);
        console.log($pokemonPlayer);

        imgPlayer.setAttribute('width','150px')
        imgPlayer.setAttribute('src',img)

        updateDescription($pokemonPlayer)
        updateHpBar($pokemonPlayer)

        // revive all Pokemons
        setAliveAllPokemons()

        // hide upper menu and show down menu
        if (!divHideUp.classList.contains('hide-up')){
            switchShowHideUpContainer();
        } 
        if (divHideDown.classList.contains('hide-down')){
            switchShowHideDownContainer();
        };

    } catch(err) {
        console.log(err)
    }
}

// generate Pokemon controlled by Opponent
async function generateOpponent(pokemonId){
    
    if (pokemonId == 0 || pokemonId == undefined || pokemonId == null) {
        pokemonId = Math.floor(Math.random() * 152);
    } 

    try {
        $pokemonOpponent = await getOnePokemon(pokemonId);
        console.log($pokemonOpponent);

        imgOpponent.setAttribute('width','150px')
        imgOpponent.setAttribute('src',img)

        updateDescription($pokemonOpponent)
        updateHpBar($pokemonOpponent)
        
        setAliveAllPokemons();
    } catch(err) {
        console.log(err)
    }
}





// main fight method 
const attack = (attackType) =>{

    let attacker;
    let defender;
    let att;
    let def;
    let damage;

    const checkWhoIsFaster = () => {
        if ( $pokemonPlayer.stats.speed >= $pokemonOpponent.stats.speed ){
            attacker = $pokemonPlayer;
            defender = $pokemonOpponent;
        } else {
            attacker = $pokemonOpponent
            defender = $pokemonPlayer;
        }
        updateBattleLogs(`${attacker.name} is faster - it will attack first<br>`)
    }

    const generateAttack = (attackType) => {

        if (attackType == 'special') {
            attack = attacker.stats.attackSp;
            defense = defender.stats.defenseSp
        } else if (attackType == 'simple') {
            attack = attacker.stats.attack;
            defense = defender.stats.defense;
        }

        att = Math.floor(Math.random() * attack /2);
        def = Math.floor(Math.random() * defense /2);
        damage = (att - def >= 0) ? att - def : 0; 
        updateBattleLogs(`${attacker.name} use ${attackType} attack and deals ${damage} damages (${att} attacks vs ${def} defends)<br>`)
    }

    const takeDamage = damage => {
        const hpLeft = defender.stats.hpLeft - damage;

        if (hpLeft > 0){
            defender.stats.hpLeft = hpLeft;
            updateBattleLogs(`${defender.name} has ${defender.stats.hpLeft} hp<br>`)
        } else {
            defender.stats.hpLeft = 0;
            updateBattleLogs(`${defender.name} has ${defender.stats.hpLeft} hp<br>`)

            defenderAlive = false;
            updateDescription(defender);
            updateHpBar(defender);
            updateBattleLogs(`<u>The winner is: ${attacker.name}</u><br>`);
            (defender == $pokemonOpponent) ? $pokemonPlayer.levelUp() : $pokemonOpponent.levelUp();
        }
    }

    // after 1st attack, defender has right to attack
    const counterAttack = () => {
        if (attacker == $pokemonPlayer) {
            attacker = $pokemonOpponent;
            defender = $pokemonPlayer;
        } else {
            attacker = $pokemonPlayer;
            defender = $pokemonOpponent;
        }
    }

    // do fight - 1st phase
    if (attackerAlive && defenderAlive){
        updateBattleLogs(`- - - - - New round - - - - -<br>`)
        checkWhoIsFaster();
        shakeScreenAfterAttack();
        generateAttack(attackType);
        takeDamage(damage);
        updateDescription(defender)
        updateHpBar(defender)
        
        // do fight - 2nd phase
        if (defenderAlive){
            counterAttack()
            generateAttack(attackType);
            takeDamage(damage);
            updateDescription(defender)
            updateHpBar(defender)
            updateBattleLogs(`- - - - - End of round - - - - -<br>`)
        }
    } else {
        updateBattleLogs(`<u>Fight is over, choose new Pokemon</u><br><br>`)


    }

    // when Opponent is dead
    if ($pokemonOpponent.stats.hpLeft == 0){
        setTimeout ( askForAnotherFight , 750 )
    }
}

const shakeScreenAfterAttack = () => {
    const length = 400;
    const amplitude = 2;
    
    const shake = () => {
        for(let i = 0; i < length; i++){
            window.moveBy(amplitude,0);
            window.moveBy(0,amplitude);
            window.moveBy(-amplitude,0);
            window.moveBy(0,-amplitude);
        }
    }
    shake();
}

const askForAnotherFight = () => {

    if (confirm(`The fight is over, do you want to fight with another Pokemon?`)){
        generateOpponent(0);
    } 
}



const updateDescription = pokemon => {
    // const newDescription = `Name: ${pokemon.name}
    //     Level: ${pokemon.level}
    //     Attack: ${pokemon.stats.attack}
    //     Defense: ${pokemon.stats.defense}
    //     Hp: ${pokemon.stats.hpLeft}
    //     Max Hp: ${pokemon.stats.hp}`;

        const newDescription = 
        `<h5>Name: ${pokemon.name}</h5> 
        <table class="table table-sm table-bordered w-auto">
            <tr>
                <th>Level</th>
                <th>Attack</th>
                <th>Defense</th>
                <th>Attack<br>Special</th>
                <th>Defense<br>Special</th>
                <th>Hp<br>left</th>
                <th>Hp<br>max</th>
                <th>Speed</th>
            </tr>
            <tr>
                <td>${pokemon.level}</td>
                <td>${pokemon.stats.attack}</td>
                <td>${pokemon.stats.defense}</td>
                <td>${pokemon.stats.attackSp}</td>
                <td>${pokemon.stats.defenseSp}</td>
                <td>${pokemon.stats.hpLeft}</td>
                <td>${pokemon.stats.hp}</td>
                <td>${pokemon.stats.speed}</td>
            </tr>
        </table>`;

        (pokemon == $pokemonPlayer) ? 
            descrPlayer.innerHTML = newDescription : 
            descrOpponent.innerHTML = newDescription;
}

const updateHpBar = (pokemon) => {
    let hpPercage = Math.floor(pokemon.stats.hpLeft/pokemon.stats.hp * 100);

    (pokemon == $pokemonPlayer) ? progressHpPlayer.style.width = `${hpPercage}%` : progressHpOpponent.style.width = `${hpPercage}%`
}

// after Fight, set all Pokemons to alive status
const setAliveAllPokemons = () => {
    attackerAlive = true;
    defenderAlive = true;
}


const updateBattleLogs = string => gameLogs.innerHTML = ` (${logId++}) - ${string + gameLogs.innerHTML}`;

const clearBattleLogs = () => gameLogs.innerText = '';

const switchShowHideUpContainer = () => divHideUp.classList.toggle('hide-up');

const switchShowHideDownContainer = () => divHideDown.classList.toggle('hide-down');

const prepareDOMEvents = () => {
    btnAtkSimple.addEventListener('click', () => attack('simple'));
    btnAtkSpecial.addEventListener('click', () => attack('special'));
    btnGenPlayer.addEventListener('click', () => generatePlayer(0));
    btnGenOpponent.addEventListener('click', () => generateOpponent(0));
    btnHealPlayer.addEventListener('click', () => $pokemonPlayer.heal());
    btnHealOpponent.addEventListener('click', () => $pokemonOpponent.heal());
    btnLevelup.addEventListener('click', () => $pokemonPlayer.levelUp());
    btnClearLog.addEventListener('click', clearBattleLogs);

    btnHideUp.addEventListener('click', switchShowHideUpContainer);
    btnHideDown.addEventListener('click', switchShowHideDownContainer);

    // set up 
    generateOpponent();
    getAllPokemons();
    setButtonsOnImages();
    switchShowHideUpContainer();
}

document.addEventListener('DOMContentLoaded', main);