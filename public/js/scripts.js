import crearTabla from "./tabla.js";
import agregarManejadorTR from "./tabla.js";
import Anuncio from "./anuncio.js";
import Anuncio_Auto from "./auto.js";

let listaAnuncio;
let staticList;
let newListaAnuncio;
let frmAnuncio;
let nextID;
let divTabla;
const btnEliminar = document.getElementById("btnEliminar");
const btnCancelar = document.getElementById("btnCancelar");
const btnAlta = document.getElementById("btnAlta");
const btnMod = document.getElementById("btnMod");
const btnOrdenar = document.getElementById("btnOrdenar");
const dropDown = document.getElementById('filterTransaccion');
const promedioAnunc = document.getElementById('promedioAnuncios');

const checkbox_Titulo = document.getElementById("colTitulo");
const checkbox_Trans = document.getElementById("colTrans");
const checkbox_Descr = document.getElementById("colDescr");
const checkbox_Precio = document.getElementById("colPrec");
const checkbox_Puertas = document.getElementById("colPuert");
const checkbox_kms = document.getElementById("colKms");
const checkbox_potencia = document.getElementById("colPotenc");

window.addEventListener("load", incializarManejadores);

btnEliminar.addEventListener("click", async (e) => {
  let idAnuncio = prompt("Indique ID del anuncio a borrar");
  if (idAnuncio) {
    const config = {
      method: "DELETE",
      headers: {
        "content-type": "application/json;charset=utf-8",
      },
    };

    try {
      const res = await axios(
        `http://localhost:3000/anuncios/${idAnuncio}`,
        config
      );
      console.log(
        `Se borro apropiadamente el anuncio con status: ${res.status}`
      );
      nextID--;
      listaAnuncio = listaAnuncio.filter((anuncio) => anuncio.id != idAnuncio);

      limpiarDatosForm();
      actualizarLista();
    } catch (error) {
      console.log(error);
    }
  } else {
    limpiarDatosForm();
  }
});

btnOrdenar.addEventListener("click", function (e) {
  //hacer ordenar
});

async function getListAnuncios() {
  try {
    const res = await axios.get("http://localhost:3000/anuncios");
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

async function incializarManejadores() {
  listaAnuncio = await getListAnuncios();
  newListaAnuncio = listaAnuncio;

  nextID = maxID() + 1;
  crearTabla(listaAnuncio);

  divTabla = document.getElementById("divTabla");

  actualizarLista();

  frmAnuncio = document.forms[0];

  filterTable(checkbox_Titulo, 'titulo');
  filterTable(checkbox_Descr, 'descripcion');
  filterTable(checkbox_Trans, 'transaccion');
  filterTable(checkbox_Precio, 'precio');
  filterTable(checkbox_Puertas, 'puertas');
  filterTable(checkbox_kms, 'kms');
  filterTable(checkbox_potencia, 'potencia');

  filtroDeTransaccion();

  localStoreSet();
  staticList = listlocalStoreGet();

  //ALTA
  frmAnuncio.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoAnuncio = obtenerAnuncios();
    if (nuevoAnuncio) {
      await saveAnuncio(nuevoAnuncio);

      actualizarLista();
      limpiarDatosForm();
    }
  });

  //boton MODIFICAR
  btnMod.addEventListener("click", async (e) => {
    e.preventDefault();

    const nuevoAnuncio = obtenerAnuncios();
    if (nuevoAnuncio) {
      await updatearAnuncio(nuevoAnuncio);
      actualizarLista();
      limpiarDatosForm();
    }
  });
}

async function updatearAnuncio(frm) {
  const idAnuncio = prompt(
    "Indique el ID del anuncio a Modificar y llene los campos antes de hacerlo"
  );
  const index = listaAnuncio.findIndex((a) => a.id == idAnuncio);

  if (index != -1) {
    frm.id = idAnuncio;
    const config = {
      method: "PUT",
      headers: {
        "content-type": "application/json;charset=utf-8",
      },
      data: JSON.stringify(frm),
    };

    try {
      const res = await axios(
        `http://localhost:3000/anuncios/${idAnuncio}`,
        config
      );
      listaAnuncio[index] = frm;
      console.log(`${res.status} Se updateo el anuncio correctamente`);
    } catch (error) {
      console.error(error);
    }
  } else alert("Anuncio Inexistente");
}

function maxID() {
  const maxId = listaAnuncio.reduce(
    (max, listaAnuncio) => (listaAnuncio.id > max ? listaAnuncio.id : max),
    listaAnuncio[0].id
  );
  return maxId;
}

function obtenerAnuncios() {
  const nuevoAnuncio = new Anuncio_Auto(
    nextID,
    frmAnuncio.titulo.value,
    frmAnuncio.trans.value,
    frmAnuncio.descripcion.value,
    frmAnuncio.precio.value,
    frmAnuncio.num_puertas.value,
    frmAnuncio.num_kms.value,
    frmAnuncio.num_potencia.value
  );

  return nuevoAnuncio;
}

async function saveAnuncio(newAnuncio) {
  if (newAnuncio) {
    const config = {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=utf-8",
      },
      data: JSON.stringify(newAnuncio),
    };

    try {
      const res = await axios("http://localhost:3000/anuncios", config);
      listaAnuncio.push(newAnuncio);
      console.log(`${res.status} Se agrego el anuncio correctamente`);
    } catch (error) {
      console.error(error);
    }
  }
}

function actualizarLista() {
  divTabla.innerHTML = "";
  document.getElementById("divTabla").innerHTML =
    '<img src="../images/37.gif" >';

  setTimeout(() => {
    divTabla.innerHTML = "";
    divTabla.appendChild(crearTabla(listaAnuncio));
  }, 700);
}

function refreshLista(list) {
  divTabla.innerHTML = "";
  divTabla.appendChild(crearTabla(list));
}

function limpiarDatosForm() {
  document.getElementById("txtTitulo").value = "";
  document.getElementById("txtDescripcion").value = "";
  document.getElementById("txtPrecio").value = "";
  document.getElementById("num_puertas").value = "";
  document.getElementById("num_kms").value = "";
  document.getElementById("num_potencia").value = "";
}

btnCancelar.addEventListener("click", (e) => {
  limpiarDatosForm();
});

const filterTable = (e, property) => {
  e.addEventListener("change", async () => {
    let auxList;

    if (e.checked) {
      switch(property){
        case 'titulo': auxList = listaAnuncio.filter((a) => delete a.titulo);break;
        case 'transaccion': auxList = listaAnuncio.filter((a) => delete a.transaccion);break;
        case 'descripcion': auxList = listaAnuncio.filter((a) => delete a.descripcion);break;
        case 'precio': auxList = listaAnuncio.filter((a) => delete a.precio);break;
        case 'puertas': auxList = listaAnuncio.filter((a) => delete a.num_puertas);break;
        case 'kms': auxList = listaAnuncio.filter((a) => delete a.num_KMs);break;
        case 'potencia': auxList = listaAnuncio.filter((a) => delete a.potencia);break;
      }

      refreshLista(auxList);
    } else {
      listaAnuncio = await getListAnuncios();
      refreshLista(listaAnuncio);
    }
  });
};



const filtroDeTransaccion = ()=>{
  dropDown.addEventListener('change', ()=>{
     
    if(dropDown.value == "todos"){
      let prom = listaAnuncio.map(myMap)
       prom = prom.reduce(myReduce)
       promedioAnunc.value = prom / listaAnuncio.length
    }
    else if(dropDown.value == "ventas"){
      let prom = listaAnuncio.map(myMapVentas)
   
      let prom1 = prom.reduce(myReduce)
       promedioAnunc.value = prom1 / prom.length
    }
    else if(dropDown.value == "alquiler"){
      let prom = listaAnuncio.map(myMapAlquileres)
      let prom1 = prom.reduce(myReduce)
       promedioAnunc.value = prom1 / prom.length
    }
  })
}


function myReduce(a, b) {
  let c = parseFloat(a);
  let d = parseFloat(b);
  return c + d;
}

  function myMap(a) {
  return a.precio;
}

 function myMapVentas(a) {

  if(a.transaccion == 'Venta'){
    return a.precio;
  }
  else{
    return 0
  }
  
}

 function myMapAlquileres(a) {

  if(a.transaccion == 'Alquiler'){
    return a.precio;
  }
  else{
    return 0
  }
  
}


const localStoreSet = () =>{
  const list = listaAnuncio.map(a => a.id) 
  localStore.setItem("listaStatic", list)
}

const localStoreGet = () =>{

  localStore.getItem("listaStatic")
}


var data = [
  {
    x: staticList,
    y: [60, 24, 53, 16],
    type: 'bar'
  }
];

Plotly.newPlot('plotlyChart', data);