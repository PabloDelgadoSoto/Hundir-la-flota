let table;
let ocupado = [];
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
    '1': [9, 10],
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
            //document.getElementById(i + '-' + j).addEventListener('mouseenter', cambiarCursor);
            //document.getElementById(i + '-' + j).addEventListener('mouseleave', restablecer);
            document.getElementById(i + '-' + j).addEventListener('click', hacerClic);
        }
    }
};

const ponerBarcos = function () {
    prohibir = [];
    for (let i = 0; i < cantidad; i++) {
        barcos[i][0][0] = calcularEspacio(longitudes[i] - 1);
        barcos[i][0][1] = false;
        let n = Math.floor(Math.random() * 4);
        console.log(barcos[i][0][0]);
        for (let j = 1; j < longitudes[i]; j++) {
            continuar(i, j, n);
        }
        console.log('a');
        prohibir = [];
    }
};
//[][]elegir barco barco,    [][][]que parte del barco
//impedir que salga negativo

const continuar = function (i, j, n) {
    let b = barcos[i][j-1][0].split('-');
    b[segundo[n][0]] = parseInt(b[segundo[n][0]]) + parseInt(segundo[n][1]);
    let id = parseInt(b[0]) + '-' + parseInt(b[1]);
    barcos[i][j][0] = id;
    barcos[i][j][1] = false;
    console.log(barcos[i][j][0]);
    
}

const calcularEspacio = function (l) {
    let escogido = colocar();
    let marca = escogido.split('-');
    let fila = marca[0];
    let columna = marca[1];
    //contarBarcos();
    if (reservarFila(fila, l) && reservarColumna(columna, l)) {
        return escogido;
    }
    calcularEspacio();
};

const reservarFila = function (fila, l) {
    for (i = fila - l; i < fila; i++) {
        if (ocupado.includes(i + '-' + fila)) {
            return false;
        }
    }
    for (i = fila; i < fila + 1; i++) {
        if (ocupado.includes(i + '-' + fila)) {
            return false;
        }
    }
    return true;
};

const reservarColumna = function (columna, l) {
    for (i = columna - l; i < columna; i++) {
        if (ocupado.includes(columna + '-' + i)) {
            return false;
        }
    }
    for (i = columna; i < columna + l; i++) {
        if (inArray(ocupado, columna + '-' + i)) {
            return false;
        }
    }
    return true;
};

const contarBarcos = function () {
    for (let i = 0; i < barcos.length; i++) {
        for (let j = 0; j < barcos[i].length; j++) {
            ocupado = barcos[i][j][0];
        }
    }
};

const colocar = function () {
    return Math.floor(Math.random() * tablero) + '-' + Math.floor(Math.random() * tablero);
}

const cambiarCursor = function () {
    this.setAttribute('class', 'cursor');
};

const restablecer = function () {
    let res = document.getElementsByClassName('cursor');
    res[0].setAttribute('class', '');
};

const desbordar = function (num) {
    if (num < 0) {
        return false;
    } else if (num > tablero) {
        return false;
    }
    return true;
};

const hacerClic = function (event) {
    marcarXClic(event.target.getAttribute('id'));
    visitados = [];
};

const marcarXClic = function (id) {
    let marca = document.getElementById(id);
    if (inArray(ocupado, id)) {
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

const recorrer = function (lugar) {
    let mostrar = [];
    let id = lugar.getAttribute('id');
    let p = id.split('-');
    let u = parseInt(p[0]);
    let d = parseInt(p[1]);
    visto.push(id);
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let ph1 = u + i;
            let ph2 = d + j;
            let resultado = desbordar(ph1) + '-' + desbordar(ph2);
            let quitar = false;
            visto.forEach(cas => {
                if (cas == resultado) {
                    quitar = true;
                }
            });
            if (!quitar) {
                visto.push(resultado);
                mostrar.push(resultado);
            }
        }
    }
    return mostrar;
};

const calcularAlrededor = function (id) {
    let cont = 0;
    let vistos = [];
    let p = id.split('-');
    let u = parseInt(p[0]);
    let d = parseInt(p[1]);
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let ph1 = u + i;
            let ph2 = d + j;
            let resultado = desbordar(ph1) + '-' + desbordar(ph2);
            if (inArray(ocupado, resultado) && !inArray(vistos, resultado)) {
                cont++;
                vistos.push(resultado);
            }
        }
    }
    return cont;
};

//i+1 j     i-1 j   i j+1   i j-1

const perder = function () {
    ocupado.forEach(mina => {
        let m = document.getElementById(mina);
        m.setAttribute('style', 'background-color:black');
        escrito.innerHTML = "Has perdido.";
        perdido = true;
    });
};

const rehacer = function (event) {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    escrito.innerHTML = '';
    perdido = false;
    hacerTabla();
};

const inArray = function (arr, e) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == e) return true;
    }
    return false;
};

const ganar = function () {
    if (clicado.length == 0) {
        escrito.innerHTML = 'Enhorabuena';
    }
}