var difficulty = 'easy';
var array;
var minesCount;
var timeStatus = 0;
var miliSecond = 0;
var second = 0;
var minute = 0;

$('.playBtn').click(function() {
    generateField();
});

$('#medium').click(function() {
    difficulty = 'medium';
});
$('#hard').click(function() {
    difficulty = 'hard';
});
$('#insane').click(function() {
    difficulty = 'insane';
});
$('#easy').click(function() {
    difficulty = 'easy';
});

function generateField(){
    timeStatus = 1;
    var menu = document.querySelector('.startMenu');
    menu.setAttribute('style', 'display: none!important;');
    var field = document.querySelector('.gameField');
    if(field){
        field.parentNode.removeChild(field);
    }
    switch(difficulty){
        case 'easy':
            array = 10;
            minesCount = array * array * 0.2;
            spawn();
            randomize();
        break;
        case 'medium':
            array = 20;
            minesCount = array * array * 0.2;
            spawn();
            randomize();
        break;
        case 'hard':
            array = 30;
            minesCount = array * array * 0.2;
            spawn();
            randomize();
        break;
        case 'insane':
            array = 40;
            minesCount = array * array * 0.2;
            spawn();
            randomize();
        break;
    }
}

function spawn(){
    var body = document.createElement('div');
    var game = document.createElement('div');
    var counter = document.createElement('div');
    var mines = document.createElement('p');
    var currentTime = document.createElement('p');
    mines.className = 'mines';
    currentTime.className = 'time';
    counter.className = 'counter d-flex';
    mines.innerHTML = '<img src="img\/flag.bmp" /> ';
    mines.innerHTML += ' ' + minesCount;
    currentTime.innerHTML = '<img src="img\/clock.bmp" /> ';
    currentTime.innerHTML += ' 0:00:00';
    game.className = 'game d-flex';
    body.className = 'gameField d-flex';
    for(let i = 0; i < array; ++i){
        var div = document.createElement('div');
        div.className = 'row';
        div.id = i;
        for(let j = 0; j < array; ++j){
            var btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            btn.className = "fieldBtn";
            div.appendChild(btn);
        }
        body.appendChild(div);
    }
    counter.appendChild(currentTime);
    counter.appendChild(mines);
    game.appendChild(counter);
    game.appendChild(body);
    document.querySelector('body').insertBefore(game, document.querySelector('.startMenu'));
    
}

function randomize(){
    var buttons = new Array(array);
    for(let i = 0; i < buttons.length; ++i){
        buttons[i] = new Array(array);
        for(let j = 0; j < array; ++j){
            buttons[i][j] = document.querySelector('.fieldBtn');
            buttons[i][j].className = 'fieldButton';
        }
    }
    for(var i = 0; i < (array * array) * 0.2; ++i){
        var tmpX = Math.round(Math.random()*(array - 1));
        var tmpY = Math.round(Math.random()*(array - 1));
        if(buttons[tmpX][tmpY].className.includes('mined')){
            --i;
        }
        else{
            buttons[tmpX][tmpY].className += " mined";
        }
    }
    var tmp = setInterval(function() {countTime();}, 100);
    count(buttons); 
}

function count(buttons){
    for(let i = 0; i < buttons.length; ++i){
        for(let j = 0; j < buttons[i].length; ++j){
            var tmp = 0;
            for(let k = i - 1; k <= i + 1; ++k){
                for(let p = j - 1; p <= j + 1; ++p){
                    if(((k) >= 0) && ((k) < buttons.length) && ((p) >= 0) && ((p) < buttons.length) && ((k != i) || (p != j))){
                        if(buttons[k][p].className.includes('mined')){
                            tmp++;
                        }
                    }
                }
            }
            buttons[i][j].className += ' ' + tmp;
        }
    }
    for(let i = 0; i < buttons.length; ++i){
        for(let j = 0; j < array; ++j){
            var listener = function(){reveal(buttons, i, j);}
            var listener2 = function() {flag(this);}
            buttons[i][j].addEventListener('click', listener, false);
            buttons[i][j].addEventListener('contextmenu', listener2, false);
        }
    }
}

function reveal(buttons, i, j){
    if(buttons[i][j].className.includes('flagged')){
        return false;
    }
    else if(buttons[i][j].className.includes('mined')){
        alert("You Lost!");
        timeStatus = 0;
        buttons[i][j].innerHTML = '<img src="img\/mine_red.bmp" />';
        buttons[i][j].className += ' ptr';
        revealAll(buttons);
        return false;
    }
    else if(buttons[i][j].className.includes('0')){
        if(!(buttons[i][j].innerHTML)){
        buttons[i][j].innerHTML = '<img src="img\/zero.bmp" />';
        buttons[i][j].className += ' rev';
            (function (){
                for(let k = i - 1; k <= i + 1; ++k){
                    for(let p = j - 1; p <= j + 1; ++p){
                        if(((k) >= 0) && ((k) < buttons.length) && ((p) >= 0) && ((p) < buttons.length) && ((k != i) || (p != j))){
                            reveal(buttons, k, p);
                        }
                    }
                }
            })();
        }
    }
    else if(buttons[i][j].className.includes('1')){
        buttons[i][j].innerHTML = '<img src="img\/one.bmp" />';
        buttons[i][j].className += ' rev';
        if(countFlags(buttons, i, j) == 1){
            var li = function(){
                for(let k = i - 1; k <= i + 1; ++k){
                    for(let p = j - 1; p <= j + 1; ++p){
                        if(((k) >= 0) && ((k) < buttons.length) && ((p) >= 0) && ((p) < buttons.length) && ((k != i) || (p != j))){
                            reveal(buttons, k, p);
                        }
                    }
                }
            };
            buttons[i][j].addEventListener('click', li,);
        }
    }
    else if(buttons[i][j].className.includes('2')){
        buttons[i][j].innerHTML = '<img src="img\/two.bmp" />';
        buttons[i][j].className += ' rev';
        if(countFlags(buttons, i, j) == 2){
            var li = function(){
                for(let k = i - 1; k <= i + 1; ++k){
                    for(let p = j - 1; p <= j + 1; ++p){
                        if(((k) >= 0) && ((k) < buttons.length) && ((p) >= 0) && ((p) < buttons.length) && ((k != i) || (p != j))){
                            reveal(buttons, k, p);
                        }
                    }
                }
            };
            buttons[i][j].addEventListener('click', li,);
        }
    }
    else if(buttons[i][j].className.includes('3')){
        buttons[i][j].innerHTML = '<img src="img\/three.bmp" />';
        buttons[i][j].className += ' rev';
        if(countFlags(buttons, i, j) == 3){
            var li = function(){
                for(let k = i - 1; k <= i + 1; ++k){
                    for(let p = j - 1; p <= j + 1; ++p){
                        if(((k) >= 0) && ((k) < buttons.length) && ((p) >= 0) && ((p) < buttons.length) && ((k != i) || (p != j))){
                            reveal(buttons, k, p);
                        }
                    }
                }
            };
            buttons[i][j].addEventListener('click', li,);
        }
    }
    else if(buttons[i][j].className.includes('4')){
        buttons[i][j].innerHTML = '<img src="img\/four.bmp" />';
        buttons[i][j].className += ' rev';
        if(countFlags(buttons, i, j) == 4){
            var li = function(){
                for(let k = i - 1; k <= i + 1; ++k){
                    for(let p = j - 1; p <= j + 1; ++p){
                        if(((k) >= 0) && ((k) < buttons.length) && ((p) >= 0) && ((p) < buttons.length) && ((k != i) || (p != j))){
                            reveal(buttons, k, p);
                        }
                    }
                }
            };
            buttons[i][j].addEventListener('click', li,);
        }
    }
    if(buttons[i][j].className.includes('5')){
        buttons[i][j].innerHTML = '<img src="img\/five.bmp" />';
        buttons[i][j].className += ' rev';
        if(countFlags(buttons, i, j) == 5){
            var li = function(){
                for(let k = i - 1; k <= i + 1; ++k){
                    for(let p = j - 1; p <= j + 1; ++p){
                        if(((k) >= 0) && ((k) < buttons.length) && ((p) >= 0) && ((p) < buttons.length) && ((k != i) || (p != j))){
                            reveal(buttons, k, p);
                        }
                    }
                }
            };
            buttons[i][j].addEventListener('click', li,);
        }
    }
    if(buttons[i][j].className.includes('6')){
        buttons[i][j].innerHTML = '<img src="img\/six.bmp" />';
        buttons[i][j].className += ' rev';
        if(countFlags(buttons, i, j) == 6){
            var li = function(){
                for(let k = i - 1; k <= i + 1; ++k){
                    for(let p = j - 1; p <= j + 1; ++p){
                        if(((k) >= 0) && ((k) < buttons.length) && ((p) >= 0) && ((p) < buttons.length) && ((k != i) || (p != j))){
                            reveal(buttons, k, p);
                        }
                    }
                }
            };
            buttons[i][j].addEventListener('click', li,);
        }
    }
    if(buttons[i][j].className.includes('7')){
        buttons[i][j].innerHTML = '<img src="img\/seven.bmp" />';
        buttons[i][j].className += ' rev';
        if(countFlags(buttons, i, j) == 7){
            var li = function(){
                for(let k = i - 1; k <= i + 1; ++k){
                    for(let p = j - 1; p <= j + 1; ++p){
                        if(((k) >= 0) && ((k) < buttons.length) && ((p) >= 0) && ((p) < buttons.length) && ((k != i) || (p != j))){
                            reveal(buttons, k, p);
                        }
                    }
                }
            };
            buttons[i][j].addEventListener('click', li,);
        }
    }
    if(buttons[i][j].className.includes('8')){
        buttons[i][j].innerHTML = '<img src="img\/eight.bmp" />';
        buttons[i][j].className += ' rev';
        if(countFlags(buttons, i, j) == 8){
            var li = function(){
                for(let k = i - 1; k <= i + 1; ++k){
                    for(let p = j - 1; p <= j + 1; ++p){
                        if(((k) >= 0) && ((k) < buttons.length) && ((p) >= 0) && ((p) < buttons.length) && ((k != i) || (p != j))){
                            reveal(buttons, k, p);
                        }
                    }
                }
            };
            buttons[i][j].addEventListener('click', li,);
        }
    }
    if(check(buttons)){
        alert("You won!");
        timeStatus = 0;
        location.reload();
        return false;
    }
}

function flag(object){
    var counter = document.querySelector('.mines');
    if(!(object.innerHTML)){
        if(minesCount > 0){
        object.innerHTML = '<img src="img\/flag.bmp" />';
        object.className += ' flagged';
        minesCount--;
        counter.innerHTML = '<img src="img\/flag.bmp" /> ' + minesCount;
        }
    }
    else if(object.className.includes('rev')){
        return false;
    }
    else if(object.className.includes('flagged')){
        if(object.className.includes('mined')){
        var temp = object.className.substr(0, 19);
        }
        else{
        var temp = object.className.substr(0, 13);
        }
        object.className = temp;
        object.removeChild(object.firstChild);
        minesCount++;
        counter.innerHTML = '<img src="img\/flag.bmp" /> ' + minesCount;
    }
}

function countFlags(buttons, i, j){
    var temp = 0;
    for(let k = i - 1; k <= i + 1; ++k){
        for(let p = j - 1; p <= j + 1; ++p){
            if(((k) >= 0) && ((k) < buttons.length) && ((p) >= 0) && ((p) < buttons.length) && ((k != i) || (p != j))){
                if(buttons[k][p].className.includes('flagged')){
                    temp++;
                }
            }
        }
    }
    return temp;
}

function revealAll(buttons){
    for(let i = 0; i < array; ++i){
        for(let j = 0; j < array; ++j){
            if(buttons[i][j].className.includes('0')){                
                if(buttons[i][j].className.includes('flagged')){
                    buttons[i][j].innerHTML = '<img src="img\/flag_fake.bmp" />'; 
                }
                else if(buttons[i][j].className.includes('rev')){
                    continue;
                }
                else{
                    buttons[i][j].innerHTML = '<img src="img\/zero.bmp" />';
                }
            }
            else if(buttons[i][j].className.includes('1')){                
                if(buttons[i][j].className.includes('flagged')){
                    buttons[i][j].innerHTML = '<img src="img\/flag_fake.bmp" />'; 
                }
                else if(buttons[i][j].className.includes('rev')){
                    continue;
                }
                else{
                    buttons[i][j].innerHTML = '<img src="img\/one.bmp" />';
                }
            }
            else if(buttons[i][j].className.includes('2')){                
                if(buttons[i][j].className.includes('flagged')){
                    buttons[i][j].innerHTML = '<img src="img\/flag_fake.bmp" />'; 
                }
                else if(buttons[i][j].className.includes('rev')){
                    continue;
                }
                else{
                    buttons[i][j].innerHTML = '<img src="img\/two.bmp" />';
                }
            }
            else if(buttons[i][j].className.includes('3')){                
                if(buttons[i][j].className.includes('flagged')){
                    buttons[i][j].innerHTML = '<img src="img\/flag_fake.bmp" />'; 
                }
                else if(buttons[i][j].className.includes('rev')){
                    continue;
                }
                else{
                    buttons[i][j].innerHTML = '<img src="img\/three.bmp" />';
                }
            }
            else if(buttons[i][j].className.includes('4')){                
                if(buttons[i][j].className.includes('flagged')){
                    buttons[i][j].innerHTML = '<img src="img\/flag_fake.bmp" />'; 
                }
                else if(buttons[i][j].className.includes('rev')){
                    continue;
                }
                else{
                    buttons[i][j].innerHTML = '<img src="img\/four.bmp" />';
                }
            }
            else if(buttons[i][j].className.includes('5')){                
                if(buttons[i][j].className.includes('flagged')){
                    buttons[i][j].innerHTML = '<img src="img\/flag_fake.bmp" />'; 
                }
                else if(buttons[i][j].className.includes('rev')){
                    continue;
                }
                else{
                    buttons[i][j].innerHTML = '<img src="img\/five.bmp" />';
                }
            }
            else if(buttons[i][j].className.includes('6')){                
                if(buttons[i][j].className.includes('flagged')){
                    buttons[i][j].innerHTML = '<img src="img\/flag_fake.bmp" />'; 
                }
                else if(buttons[i][j].className.includes('rev')){
                    continue;
                }
                else{
                    buttons[i][j].innerHTML = '<img src="img\/six.bmp" />';
                }
            }
            else if(buttons[i][j].className.includes('7')){                
                if(buttons[i][j].className.includes('flagged')){
                    buttons[i][j].innerHTML = '<img src="img\/flag_fake.bmp" />'; 
                }
                else if(buttons[i][j].className.includes('rev')){
                    continue;
                }
                else{
                    buttons[i][j].innerHTML = '<img src="img\/seven.bmp" />';
                }
            }
            else if(buttons[i][j].className.includes('8')){                
                if(buttons[i][j].className.includes('flagged')){
                    buttons[i][j].innerHTML = '<img src="img\/flag_fake.bmp" />'; 
                }
                else if(buttons[i][j].className.includes('rev')){
                    continue;
                }
                else{
                    buttons[i][j].innerHTML = '<img src="img\/eight.bmp" />';
                }
            }
            if(buttons[i][j].className.includes('mined')){
                if(buttons[i][j].className.includes('flagged')){
                    buttons[i][j].removeChild(buttons[i][j].firstChild);
                    buttons[i][j].innerHTML = '<img src="img\/flag.bmp" />'; 
                }
                else if(!(buttons[i][j].className.includes('ptr'))){
                    if(!(buttons[i][j].className.includes('flagged'))){
                        buttons[i][j].removeChild(buttons[i][j].firstChild);
                        buttons[i][j].innerHTML = '<img src="img\/mine.bmp" />';
                    }
                    else{
                        continue;
                    }
                }
                else{
                    buttons[i][j].removeChild(buttons[i][j].firstChild);
                    buttons[i][j].innerHTML = '<img src="img\/mine_red.bmp" />';
                }
            }
        }
    }
    setTimeout(function() {location.reload();}, 3000);
}

function check(buttons){
    var temp = 0;
    for(let i = 0; i < array; ++i){
        for(let j = 0; j < array; ++j){
            if(!(buttons[i][j].className.includes('rev'))){
                if(!(buttons[i][j].className.includes('mined'))){
                    if(!(buttons[i][j].className.includes('flagged'))){
                        if(buttons[i][j].className.includes('rev')){
                        temp++;
                        }
                    }
            }
            else if(buttons[i][j].className.includes('mined')){
                temp++;
            }
        }
    }
}
    if(temp == (array * array)){
        console.log('Win!');
        return true;
    }
    return false;
}

function countTime(){
    if(timeStatus){
    var time = document.querySelector('.time');
    ++miliSecond;
    if(miliSecond == 10){
        miliSecond = 0;
        ++second;
    }
    if(second == 60){
        ++minute;
        second = 0;
    }
    time.innerHTML = '<img src="img\/clock.bmp" /> ' + minute + ':' + second + ':' + miliSecond;
}
}