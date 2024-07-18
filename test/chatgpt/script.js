// script.js
console.log("Script Cargado.");

function mostrarSeccion(id) {
    var secciones = document.querySelectorAll('.content > section');
    for (var i = 0; i < secciones.length; i++) {
        secciones[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
}

const ctx = document.getElementById('myChart');
const tabla = document.getElementById('tabla');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }, {
            type: 'line',
            label: 'Line Dataset',
            data: [12, 19, 3, 5, 2, 3],
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function generarTabla() {
    const numDatos = document.getElementById('numDatos').value;
    const inputTableBody = document.getElementById('inputTable').getElementsByTagName('tbody')[0];
    inputTableBody.innerHTML = '';

    for (let i = 0; i < numDatos; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="number" class="form-control" placeholder="LIC"></td>
            <td><input type="number" class="form-control" placeholder="LSC"></td>
            <td><input type="number" class="form-control" placeholder="F"></td>
        `;
        inputTableBody.appendChild(tr);
    }
}

// Función para calcular las frecuencias relativas y las acumuladas
function calcularFrecuencias(datos) {
    const totalFrecuencia = datos.reduce((sum, row) => sum + row.F, 0);
    datos.forEach(row => {
        row.Fr = row.F / totalFrecuencia;
    });

    datos.sort((a, b) => a.F - b.F);
    datos.forEach((row, index) => {
        row.F_asc = datos.slice(0, index + 1).reduce((sum, row) => sum + row.F, 0);
        row.Fr_asc = datos.slice(0, index + 1).reduce((sum, row) => sum + row.Fr, 0);
    });

    datos.sort((a, b) => b.F - a.F);
    datos.forEach((row, index) => {
        row.F_desc = datos.slice(0, index + 1).reduce((sum, row) => sum + row.F, 0);
        row.Fr_desc = datos.slice(0, index + 1).reduce((sum, row) => sum + row.Fr, 0);
    });
}

// Llenar la tabla con los datos calculados
function llenarTabla(datos) {
    const tbody = document.querySelector('#tablaEstadistica tbody');
    tbody.innerHTML = '';

    datos.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.LIC}</td>
            <td>${row.LSC}</td>
            <td>${row.F}</td>
            <td>${row.Fr.toFixed(2)}</td>
            <td>${row.F_asc}</td>
            <td>${row.F_desc}</td>
            <td>${row.Fr_asc.toFixed(2)}</td>
            <td>${row.Fr_desc.toFixed(2)}</td>
            <td>${(row.LIC + row.LSC) / 2}</td>
        `;
        tbody.appendChild(tr);
    });
}

function calcularYMostrarFrecuencias() {
    const inputTableBody = document.getElementById('inputTable').getElementsByTagName('tbody')[0];
    const rows = inputTableBody.getElementsByTagName('tr');
    const datos = [];

    for (let i = 0; i < rows.length; i++) {
        const inputs = rows[i].getElementsByTagName('input');
        const LIC = parseFloat(inputs[0].value);
        const LSC = parseFloat(inputs[1].value);
        const F = parseFloat(inputs[2].value);

        if (!isNaN(LIC) && !isNaN(LSC) && !isNaN(F)) {
            datos.push({ LIC, LSC, F });
        }
    }

    calcularFrecuencias(datos);
    llenarTabla(datos);
}
