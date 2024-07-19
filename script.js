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

        
        function datos() {
            const datossss = [
                240, 240, 240, 440, 360, 320, 320, 280,
                440, 360, 320, 320, 360, 440, 320, 280,
                360, 400, 320, 320, 440, 440, 240, 320,
                440, 360, 280, 240, 360, 360, 320, 360,
                280, 320, 280, 320, 320, 320, 320, 240
            ];
            generarTablaDeFrecuencias(datossss);
        }

        function generarTablaDeFrecuencias(datossss) {
            // const datossss = obtenerDatosIngresados();

            const N = datossss.length;
            const minimo = Math.min(...datossss); // Valor mínimo
            const maximo = Math.max(...datossss); // Valor máximo
            const rango = maximo - minimo;
            const k = (1 + 3.33 * Math.log10(N)).toFixed(4);
            const TIC = parseFloat((rango / k).toFixed(4));

            const limitesClasesF = [];
            let Faa = 0;
            let Fad = N;

            let Fra = 0;
            let Frd = N;

            // salidas
            console.log('N: ' + datossss.length)
            console.log('Min: ' + minimo)
            console.log('Max: ' + maximo)
            console.log('Rango: ' + rango)
            console.log('k: ' + k)
            console.log('TIC: ' + TIC)
            console.log('Redondeado: ' + TIC.toFixed())

            for (let i = 0; i <= k; i++) {
                const LIC = minimo + i * TIC.toFixed();
                const LSC = minimo + (i + 1) * TIC.toFixed();
        
                // Contar frecuencia de datos que caen en el intervalo [limiteInferior, limiteSuperior)
                const F = datossss.filter(dato => dato >= LIC && dato < LSC).length;
        
                // Frecuencia acumulada\
                Faa = F+Faa;
        
                // Frecuencia acumulada descendente
                if (i<1) {
                    Fad = N;
                } else {
                    Fad = Fad-F;
                }
        
                const Fr = F/N;
                Fra = Fr+Fra;
        
                if (i<1) {
                    Frd = 1;
                } else {
                    Frd = Frd-Fr;
                }
                const xi = (LIC+LSC)/2;

                limitesClasesF.push({ LIC, LSC, F, Faa, Fad, Fr, Fra, Frd, xi });
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