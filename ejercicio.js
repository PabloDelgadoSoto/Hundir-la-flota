let table;
let prohibir = [];
let cantidad = 4;
let longitudes = [2, 3, 4, 3];
let barcos = [[[], []],[[], [], []],[[], [], [], []],[[], [], []]];
var clicado = [];

const segundo = {
    0: [0, 1, "barcoDown"],
    1: [0, -1, "barcoUp"],
    2: [1, 1, "barcoRight"],
    3: [1, -1, "barcoLeft"]
}
var tablero = 10;

window.onload = function () {
    escrito = document.getElementById('perder');
    table = document.getElementById('table');
    hacerTabla();
};

const hacerTabla = function () {
    for (let i = 0; i <= tablero; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j <= tablero; j++) {
            let td = document.createElement('td');
            td.setAttribute('id', i + '-' + j);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    ponerBarcos();
    for (let i = 0; i <= tablero; i++) {
        for (let j = 0; j <= tablero; j++) {
            document.getElementById(i + '-' + j).addEventListener('click', hacerClic);
        }
    }
};

const ponerBarcos = function () {
    prohibir = [];
    for (let i = 0; i < cantidad; i++) {
        let n = Math.floor(Math.random() * 4);
        for (let j = 0; j < longitudes[i]; j++) {
            do{
                barcos[i][j][0] = colocar();
                if(n==3 || n==1){
                    barcos[i][j][2] = segundo[n-1][2];
                }else{
                    barcos[i][j][2] = segundo[n+1][2];
                }
            }while(prohibir.includes(barcos[i][j][0]));
            prohibir.includes(barcos[i][j][0])?"":prohibir.push(barcos[i][j][0]);
            if (j > 0) {
                if (!continuar(i, j, n)) {
                    j = -1;
                }
                barcos[i][0][1] = false;
            }
        }
        barcos[i].forEach(posicion => {
            prohibir.includes(posicion[0])?"":prohibir.push(posicion[0]);
        });
    }
};

const continuar = function (i, j, n) {
    let b = barcos[i][j - 1][0].split('-');
    if(j!=1){
        if(n==2 || n==3){
            barcos[i][j-1][2] = "barcoHorizontal";
        }else{
            barcos[i][j-1][2] = "barcoVertical";
        }
    }
    b[segundo[n][0]] = parseInt(b[segundo[n][0]]) + parseInt(segundo[n][1]);
    let id = b[0] + '-' + b[1];
    if (desbordar(b[0]) || desbordar(b[1]) || prohibir.includes(id)) {
        return false;
    }
    barcos[i][j][0] = id;
    barcos[i][j][1] = false;
    barcos[i][j][2] = segundo[n][2];
    return true;
};

const colocar = function () {
    return Math.floor(Math.random() * tablero) + '-' + Math.floor(Math.random() * tablero);
}

const desbordar = function (num) {
    if (num < 0) {
        return true;
    } else if (num > tablero) {
        return true;
    }
    return false;
};

const hacerClic = function (event) {
    marcarXClic(event.target.getAttribute('id'));
    visitados = [];
};

const marcarXClic = function (id) {
    let marca = document.getElementById(id);
    if(verBarcos(id)){
        marca.setAttribute('style', 'background-image:url(explosion.jpg);background-size:100% 100%;');
        comprobarDestruido();
        return;
    }
    marca.setAttribute('style', 'background-color:white');
};

const verBarcos = function (hit) {
    let comprobar = false;
    barcos.forEach(barco => {
        barco.forEach(posicion => {
            if(posicion[0]==hit){
                posicion[1] = true;
                comprobar = true;
            }
        });
    });
    return comprobar;
}

const comprobarDestruido = function(){
    let ganar = true;
    barcos.forEach(barco => {
        let destruido = true;
        barco.forEach(posicion => {
            if(!posicion[1]){
                destruido = false;
                ganar = false;
            }
        });
        if(destruido){
            barco.forEach(posicion => {
                let marca = document.getElementById(posicion[0]);
                marca.setAttribute('style', 'background-image:url('+posicion[2]+'.png);background-size:100% 100%;');
            });
            if(barco[barco.length]){
                ganar = false;
            }
        }
    });
    if(ganar){
        victoria();
    }
}

function victoria(){
    alert('Enhorabuena');
}