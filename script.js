// script.js
console.log("Script Cargado.");

function mostrarSeccion(id) {
    var secciones = document.querySelectorAll('.content > section');
    for (var i = 0; i < secciones.length; i++) {
        secciones[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
}

function generarTabla() {
    // Selecciono el valor del campo que recoge el numero de datos a usar
    const numDatos = parseInt(document.getElementById('numDatos').value);

    // agarra todos los tbody de la tabla inputTable
    const inputTableBody = document.getElementById('inputTable').getElementsByTagName('tbody')[0];

    // borra todo el contenido que haya en tbody para generar una tabla nueva cada vez que se llame la funcion.
    inputTableBody.innerHTML = ''; // Limpiar contenido anterior

    // NO SE EXACTAMENTE
    let currentRow;
    let cellCount = 0;

    // Función para crear una nueva fila
    function crearNuevaFila() {
        // Crea un nuevo tr
        currentRow = document.createElement('tr');
        // Anade el tr al tbody
        inputTableBody.appendChild(currentRow);
        // Reinicia a 0 el contador de celdas
        cellCount = 0;
    }

    // Crear filas y celdas según numDatos
    crearNuevaFila(); // Empezar con la primera fila

    // Ciclo que itera dependiendo del numero de datos
    for (let i = 0; i < numDatos; i++) {

        // Condicional que verifica si la tabla llego a 5 columnas, que se cree una nueva
        if (cellCount === 5) {
            crearNuevaFila();
        }
        // createElement que crea un td (table data) nuevo.
        const td = document.createElement('td');
        // createElement que crea un nuevo input
        const input = document.createElement('input');

        // definimos que tendra el nuevo input
        input.type = 'number';
        input.className = 'form-control';
        input.placeholder = 'Dato';

        // anade el input al td
        td.appendChild(input);
        currentRow.appendChild(td);

        // Incremento para que itere otra vez.
        cellCount++;
    }
}

let histogramChart = null;
let frequencyPolygonChart = null;

function obtenerDatosIngresados() {
    const inputTableBody = document.getElementById('inputTable').getElementsByTagName('tbody')[0];
    const rows = inputTableBody.getElementsByTagName('tr');
    const datos = [];

    // Iterar sobre cada fila de la tabla
    for (let i = 0; i < rows.length; i++) {
        const inputs = rows[i].getElementsByTagName('input');

        // Iterar sobre cada input dentro de la fila actual
        for (let j = 0; j < inputs.length; j++) {
            const valor = parseFloat(inputs[j].value); // Obtener el valor del input como número (puedes usar parseFloat o parseInt según el tipo de dato)
            datos.push(valor); // Agregar el valor al array principal de datos
        }
    }

    return datos;
}

// GRAFICAS
function prueba() {
    // const data = [
    //     240, 240, 240, 440, 360, 320, 320, 280,
    //     440, 360, 320, 320, 360, 440, 320, 280,
    //     360, 400, 320, 320, 440, 440, 240, 320,
    //     440, 360, 280, 240, 360, 360, 320, 360,
    //     280, 320, 280, 320, 320, 320, 320, 240
    // ];

    // const data = [
    //     250, 170, 190, 127, 129, 90, 150,
    //     160, 114, 152, 142, 154, 210, 210,
    //     190, 140, 110, 120, 160, 115, 156,
    //     175, 145, 165, 117, 113, 240, 143,
    //     220, 180, 200, 190, 150, 177, 110
    // ];

    const data = [
        61,  134, 64,  45,  79,  85,  97,  140,
        119, 98,  36,  79,  88,  115, 102, 36,
        99,  88,  44,  118, 82,  80,  114, 120,
        52,  52,  86,  103, 112, 55,  100, 96,
        140, 101, 93,  74,  112, 112, 64,  60,
        35,  82,  86,  99,  66,  73,  41,  56,
        119, 98,  108, 33,  95,  61,  98,  87,
        50,  75,  114, 30,  33,  80,  85,  57,
        64,  90,  32,  84,  49,  95,  55,  75,
        105, 34,  35,  30,  115, 44,  79,  51,
        62,  117, 119, 77,  79,  44,  54,  82,
        117, 60,  86,  78,  32,  49,  63,  38,
        81,  66,  94,  31,  77,  32,  52,  69,
        61,  97,  54,  36,  87,  34,  112, 105,
        89,  39,  95,  48,  90,  39,     120, 30,
        92,  58,  102, 99,  46,  113, 94,  90,
        80,  94,  36,  71,  63,  45,  40,  62,
        74,  32,  107, 49,  45,  86,  114, 49,
        63,  39,  53,  39,  76,  125, 104, 64,
        60,  77,  47,  45,  105, 77,  76,  79,
        45,  78,  98,  112, 140, 38,  91,  98
    ]

    generarTablaDeFrecuencias(data);
}


function generarTablaDeFrecuencias(data) {
    // const datossss = obtenerDatosIngresados();

    // const N = datossss.length;
    const N = data.length;
    // const minimo = Math.min(...datossss); // Valor mínimo
    // const maximo = Math.max(...datossss); // Valor máximo
    
    const minimo = Math.min(...data); // Valor mínimo
    const maximo = Math.max(...data); // Valor máximo
    const rango = maximo - minimo;
    const k = (1 + 3.33 * Math.log10(N)).toFixed(4);
    const TIC = parseFloat((rango / k).toFixed(4));
    const RTIC = Math.ceil(TIC);
    const limitesClasesF = [];
    let Faa = 0;
    let Fad = N;

    let Fra = 0;
    let Frd = 1;

    // // salidas
    // console.log('N: ' + data.length)
    // console.log('N: ' + data.length)
    // console.log('Min: ' + minimo)
    // console.log('Max: ' + maximo)
    // console.log('Rango: ' + rango)
    // console.log('k: ' + k)
    // console.log('TIC: ' + TIC)
    // console.log('Redondeado: ' + RTIC)

    console.log(data.filter(dato => dato == 142).length);

    let arrayfad = [];
    let FrAnterior = 0;

    for (let i = 0; i < Math.floor(k); i++) {
        const LIC = minimo + i * RTIC;
        const LSC = minimo + (i + 1) * RTIC;

        // Contar frecuencia de datos que caen en el intervalo [limiteInferior, limiteSuperior)
        // const F = data.filter(dato => dato >= LIC && dato < LSC).length;

        let F = 0;

        if (i === Math.floor(k) - 1) {
            // Último intervalo: [LIC, LSC] → incluye el LSC
            F = data.filter(dato => dato >= LIC && dato <= LSC).length;
        } else {
            // Intervalo normal: [LIC, LSC) → excluye el LSC
            F = data.filter(dato => dato >= LIC && dato < LSC).length;
        }



        // Frecuencia acumulada\
        Faa = F+Faa;

        // Frecuencia acumulada descendente
        if (i === 0) {
            Fad = N;
        } else {
            Fad = Fad-arrayfad[i-1];
        }
        arrayfad.push(F);


        const Fr = F/N;
        Fra = Fr+Fra;

        
        
        if (i<1) {
            Frd = 1;
        } else {
            Frd = Frd - FrAnterior;
        }

        // Actualizamos el valor de FrAnterior para la siguiente iteración
        FrAnterior = Fr;
        
        const xi = (LIC+LSC)/2;

        

        limitesClasesF.push({ LIC, LSC, F, Faa, Fad, Fr, Fra, Frd, xi });
        // console.log(limitesClasesF);
    }

    const tbody = document.querySelector('#tablaEstadistica tbody');
    tbody.innerHTML = '';

    limitesClasesF.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.LIC}</td>
            <td>${row.LSC}</td>
            <td>${row.F}</td>
            <td>${row.Faa}</td>
            <td>${row.Fad}</td>
            <td>${row.Fr.toFixed(3)}</td>
            <td>${row.Fra.toFixed(3)}</td>
            <td>${row.Frd.toFixed(3)}</td>
            <td>${row.xi}</td>
        `;
        tbody.appendChild(tr);
    });

    generarHistograma(limitesClasesF);
    generarPoligonoDeFrecuencia(limitesClasesF);
}

function generarHistograma(limitesClasesF) {
    const ctx = document.getElementById('histogramChart').getContext('2d');
    if (histogramChart) {
        histogramChart.destroy();
    }

    const labels = limitesClasesF.map(row => `${row.LIC}`);
    const data = limitesClasesF.map(row => row.F);

    histogramChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frecuencia',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Histograma'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Limites de Clase'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frecuencia'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function generarPoligonoDeFrecuencia(limitesClasesF) {
    const ctx = document.getElementById('frequencyPolygonChart').getContext('2d');
    if (frequencyPolygonChart) {
        frequencyPolygonChart.destroy();
    }

    const labels = [0, ...limitesClasesF.map(row => `${row.xi}`), 0];
    const data = [0, ...limitesClasesF.map(row => row.F), 0];

    frequencyPolygonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frecuencia',
                data: data,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Poligono de Frecuencia'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'xi'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frecuencia'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}