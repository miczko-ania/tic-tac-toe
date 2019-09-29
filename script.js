function TicTacToeGame() {
    this.gameContainer = document.querySelector('#game-container') //szukamy w calym dokumencie game-container (diva z dokumentu html)
    this.xUser = 'x';
    this.oUser = 'o';
    this.currentUser = this.xUser;
    this.win = false;

}

TicTacToeGame.prototype.init = function() {
    const xUser = document.querySelector('#x-user').value;
    const oUser = document.querySelector('#o-user').value;
    if(xUser != oUser && !this.win) {
        this.xUser = xUser;
        this.oUser = oUser;
        const table = this.createTable();
        this.gameContainer.innerHTML = ''; //usunięcie wszystkiego zanim rozpoczniemy nową tablicę
        this.gameContainer.appendChild(table);
        this.currentUser = this.xUser;
    } else if(this.win){
        this.win = false;
        this.init;
    } else { 
        this.modal = new Modal('Wprowadź dwa różne imiona.')
    }
    

}

TicTacToeGame.prototype.createTable = function() {
    const table = document.createElement('table');
    ['1','2','3'].forEach(function(rowId) {
        const row = this.createRow(rowId);
        table.appendChild(row)
    }.bind(this));
    return table;
};

TicTacToeGame.prototype.createRow = function(rowId) {
    const row = document.createElement('tr'); //stworzylismy wiersz
    ['a','b','c'].forEach(function (col) { //tworzymy funkcje ktora wypelnie je komorkami
        const cell = this.createCell(col + rowId); // tworzymy komókę poprzez funkcję ponizej
        row.appendChild(cell);
    }.bind(this)); //bindujemy funkcje do globalnego zakresu, mówimy jej, jak bedziesz wywolana to badz widoczna w globalnym zakresie
    return row;
};


TicTacToeGame.prototype.createCell = function(id) {
    const cell = document.createElement('td'); //tworzymy komórkę
    cell.className = 'cell'; //tworzymy klasę komórki
    cell.id = id;
    cell.dataset.value = '';
    cell.addEventListener('click',this.cellClickHandler.bind(this));
    return cell; //zwracamy komórkę aby móc ją później wykorzystać
};

TicTacToeGame.prototype.cellClickHandler = function (event) {
    const cell = event.target;
    if(cell.innerHTML != '' || this.win) {
        return;
    }
    if(this.currentUser === this.xUser) {
        cell.innerHTML = '&times;';
        cell.dataset.value = 'x';
    } else {
        cell.innerHTML = '&cir;';
        cell.dataset.value = 'o';
    }
    this.win = this.checkResults();
    if(this.win) {
        this.modal = new Modal('Wygrał(a) ' + this.currentUser + ' !',this.init.bind(this));
    } else {
        this.currentUser = this.currentUser == this.xUser ? this.oUser: this.xUser;
    }
};

TicTacToeGame.prototype.results = [
    ['a1','b1','c1'],
    ['a2','b2','c2'],
    ['a3','b3','c3'],
    ['a1','a2','a3'],
    ['b1','b2','b3'],
    ['c1','c2','c3'],
    ['a1','b2','c3'],
    ['c1','b2','c3']
]

TicTacToeGame.prototype.checkResults = function () {
    let win = false;
    for(let idx = 0; idx < this.results.length; idx++) {
        const resRow = this.results[idx];
        const result = resRow.map(function(id){
            const cell = document.querySelector('#' + id);
            return cell.dataset.value;
        }).join('');
        if(result === 'xxx' || result === 'ooo' && !this.win) {
            win = true;
            break;
        }    
    }
    return win
}

function Modal(message, closeCallBack) { //stworzylismy funkcje modal
    this.closeCallBack = closeCallBack;
    this.modalEl = document.createElement('div'); //przekazujemy argument message - ktory bedzie tekstem ktory chcemy wyswietlic
    this.modalEl.className ='modal'; //nadalismy mu klase modal
    this.modalEl.innerHTML = '<p>' + message + '</p>'; // traktowane jest jako html a nie jako tekst
    const closeButton = document.createElement('button'); //tworzenie elementu button - przycisk do zamykania
    closeButton.innerText = "x"; //etykieta buttona
    closeButton.addEventListener('click', this.close.bind(this)); //drugie this wskazuje w jakim zakresie ma dzialac funkcja czyli zakres całego obiektu
    this.modalEl.appendChild(closeButton);
    document.documentElement.appendChild(this.modalEl); 

}
Modal.prototype.close = function() { //tworzymy funkcję o własnym zakresie odwołującą się do istniejącego oiektu
    this.modalEl.remove(); //usuwa stworzony wczesniej element html z dokumentu
    if(this.closeCallBack != undefined) {
        this.closeCallBack();
    }

};

const gameTable = new TicTacToeGame();
const button = document.querySelector('#start-game');

function checkName() {
    if(xUser.value != '' && oUser.value != '') {
        button.disabled = false
    }
}
xUser = document.querySelector('#x-user');
oUser = document.querySelector('#o-user');

xUser.addEventListener('input',checkName);
oUser.addEventListener('input', checkName);

document.querySelector('#start-game').addEventListener('click',function() {
    gameTable.init();
});

