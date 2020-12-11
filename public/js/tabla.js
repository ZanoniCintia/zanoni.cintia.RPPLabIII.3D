
export default function crearTabla(list){
    const table = document.createElement('table');
    table.className = 'table table-dark table-striped table-xl';
    table.setAttribute('id', "myTable")
    table.appendChild(crearCabecera(list[0]));
    table.appendChild(crearCuerpo(list));

    return table;
}


function crearCabecera(item){
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    for (const key in item){
        const th = document.createElement('th');

        const texto = document.createTextNode(key);
        th.appendChild(texto);
        //th.textContent = key;

        tr.appendChild(th);
    }

    thead.appendChild(tr);
    return thead;
}

function crearCuerpo(list){
    const tbody = document.createElement('tbody');
    
    list.forEach(element => {
        const tr = document.createElement('tr');
        
        for(const key in element){
            const td = document.createElement('td');
            const texto = document.createTextNode(element[key]);
            td.appendChild(texto);
            tr.appendChild(td);
        }
        //buscar el property del Json, osea las Keys ej first_name, id, etc
        if(element.hasOwnProperty('id')){
             tr.setAttribute('data-id', element['id']);
           // tr.dataset.id = element['id'];
            }
        myEvent(tr); //agrego el manejador al elemento TR
        tbody.appendChild(tr);
    });

    return tbody;
}


function myEvent(elem){
    if(elem){
        elem.addEventListener('click', function(e){
            //alert(e.target.getAttribute('data-id'));

            // Sea lo que sea es dataset.id ya sea que necesite un name, lastname, etc
            console.log(e.path[1].dataset.id);
            e.stopPropagation();
        }, true);
    }
}