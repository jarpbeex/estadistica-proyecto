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