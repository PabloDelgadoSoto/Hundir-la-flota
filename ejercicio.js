let table;
let prohibir = [];
let cantidad = 4;
let longitudes = [2, 3, 4, 3];
let barcos = [
    [[], []],
    [[], [], []],
    [[], [], [], []],
    [[], [], []]
];
var clicado = [];

const segundo = {
    0: [0, 1],
    1: [0, -1],
    2: [1, 1],
    3: [1, -1],
}

const dificultad = {
    '1': [10, 10],
    '2': [16, 40],
    '3': [21, 99]
};
var dif = '1';
var tablero = dificultad[dif][0];
var minas = dificultad[dif][1];

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
                barcos[i][j][0] = colocar();
                prohibir.push(barcos[i][j][0]);
            while (calcularEspacio(barcos[i][0][0], barcos[i].length-1)){
                barcos[i][j][0] = colocar();
                prohibir.push(barcos[i][j][0]);
            }
            
            if(j > 0){
                if(!continuar(i, j, n)){
                    j=-1;
                }
                barcos[i][0][1] = false;
            }
        }
    }
    verBarcos(); 
};
//[][]elegir barco,    [][][]que parte del barco
//impedir que salga negativo

const continuar = function (i, j, n) {
    //ubicacion anterior
    let b = barcos[i][j - 1][0].split('-');
    b[segundo[n][0]] = parseInt(b[segundo[n][0]]) + parseInt(segundo[n][1]);
    let id = b[0] + '-' + b[1];
    if(desbordar(b[0]) || desbordar(b[1]) || prohibir.includes(id)){
        return false;
    }
    barcos[i][j][0] = id;
    barcos[i][j][1] = false;
    prohibir.push(barcos[i][j][0]);
    return true;
};

const verBarcos = function(){
    barcos.forEach(barco => {
        barco.forEach(posicion => {
            let ph = document.getElementById(posicion[0]);
            ph.setAttribute('style', 'background-color:pink')
        });
    });
}

const calcularEspacio = function (escogido, l) {
    let marca = escogido.split('-');
    let fila = marca[0];
    let columna = marca[1];
    let fT = reservarFila(fila, l);
    let cT = reservarColumna(columna, l);
    //si no se hace asi por alguna razon no ejecuta ambas
    prohibir.push(escogido);
    if (cT && fT) {
        return true;
    }
    return false;
};

const reservarFila = function (fila, l) {
    fila = parseInt(fila);
    for (i = fila - l; i < fila; i++) {
        if (prohibir.includes(i + '-' + fila) || desbordar(i)) {
            return false;
        }
    }
    for (i = fila + 1; i <= fila + l; i++) {
        if (prohibir.includes(i + '-' + fila) || desbordar(i)) {
            return false;
        }
    }
    return true;
};

const reservarColumna = function (columna, l) {
    columna = parseInt(columna);
    for (i = columna - l; i < columna; i++) {
        if (prohibir.includes(columna + '-' + i) || desbordar(i)) {
            return false;
        }
    }
    for (i = columna + 1; i <= columna + l; i++) {
        if (prohibir.includes(columna + '-' + i) || desbordar(i)) {
            return false;
        }
    }
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
    if (inArray(prohibir, id)) {
        perder();
        return;
    }
    if (inArray(rojos, id)) {
        marca.setAttribute('style', 'background-color:red');
        marca.innerHTML = calcularAlrededor(id);
        contarCasilla(id);
        ganar();
        return;
    }
    marca.setAttribute('style', 'background-color:green');
    visitados.push(id);
    contarCasilla(id);
    let mostrar = recorrer(marca);
    for (let i = 0; i < mostrar.length; i++) {
        if (!inArray(visitados, mostrar[i])) {
            marcarXClic(mostrar[i]);
            visitados.push(mostrar[i]);
        }
    }
    ganar();
    visto = [];
};