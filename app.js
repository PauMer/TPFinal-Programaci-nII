//Libros
const $titulo = document.getElementById("titulo");
const $autor = document.getElementById("autor");
const $btnAñadirLibro = document.getElementById("btnAñadirLibro");
const $btnModificarLibro = document.getElementById("btnModificarLibro");
const $mostrarLibros = document.getElementById("mostrarLibros");
//Alumnos
const $dni = document.getElementById("dni");
const $nombre = document.getElementById("nombre");
const $direccion = document.getElementById("direccion");
const $btnAgregarAlumno = document.getElementById("btnAñadirAlumno");
const $btnactualizarAlumno = document.getElementById("btnModificarAlumno");
const $mostrarAlumnos = document.getElementById("mostrarAlumnos");
//Prestamo
const $titulos = document.getElementById("titulos");
const $alumnoID = document.getElementById("dniAlumnos");
const $fechaEntrega = document.getElementById("fechaEntrega");
const $fechaDevulucion = document.getElementById("fechaDevolucion");
const $mostrarPrestamos = document.getElementById("mostrarPrestamos");
const $mostrarLibrosEntregados = document.getElementById("mostrarLibrosEntregados");
const $devolucion = document.getElementById("devolucion");
const $datos = document.getElementById("datos");

//variables para validaciones de caracteres
const pattern = new RegExp("^[A-Z\\s]+$", "i");

//variable auxiliar
let auxiliar;

//llamado de funciones al cargar la página
listarLibros();
cargarSelect();
listarAlumnos();
listarPrestamo();
listarPresEntregados();

//validaciones de Libro
async function validarBorrado(id) {
  let bandera = false;
  try {
    resp = await axios.get("http://localhost:3000/prestamo");
    resp.data.forEach((element) => {
      if (element.libroId == id) {
        bandera = true;
      }
    });
  } catch (error) {
    console.log(error);
  }
  return bandera;
}

async function validarLibro() {
  let bandera = false;

  if ($titulo.value == "") {
    bandera = true;
    alert("Debe ingresar un titulo");
  }

  if ($autor.value == "") {
    bandera = true;
    alert("Debe ingresar un autor");
  }

  if ($titulo.value.length > 20) {
    bandera = true;
    alert("El titulo es demasiado largo");
  }

  resp = await axios.get("http://localhost:3000/libros/");
  resp.data.forEach((element) => {
    if ($titulo.value == element.titulo) {
      bandera = true;
      alert("El titulo ingresado ya existe en la base de datos");
    }
  });

  if (!pattern.test($autor.value)) {
    bandera = true;
    alert("En el imput autor solo podrá ingresar nombres");
  }

  return bandera;
}

//LIBROS-CRUD--------------------------------------------------------------------------------------------------------

async function añadirLibro() {
  try {
    if (!(await validarLibro())) {
      resp = await axios.post("http://localhost:3000/libros/", {
        titulo: $titulo.value,
        autor: $autor.value,
        disponible: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
  cargarSelect();
  listarLibros();
}

async function borrarLibro(id) {
  try {
    if (!(await validarBorrado(id))) {
      resp = await axios.delete("http://localhost:3000/libros/" + id);
      listarLibros();
    } else {
      alert("El libro ya fue prestado alguna vez");
    }
  } catch (error) {
    console.log(error);
  }
}

async function mostrarLibro(id) {
  $btnModificarLibro.hidden = false;
  $btnAñadirLibro.hidden = true;
  auxiliar = id;
  resp = await axios.get("http://localhost:3000/libros/" + id);
  ($titulo.value = resp.data.titulo), ($autor.value = resp.data.autor);
}

async function actualizarLibro() {
  libro = await axios.get("http://localhost:3000/libros/" + auxiliar);
  resp = await axios.put("http://localhost:3000/libros/" + auxiliar, {
    titulo: $titulo.value,
    autor: $autor.value,
    disponible: libro.data.disponible,
  });
}
async function listarLibros() {
  resp = await axios.get("http://localhost:3000/libros");
  $mostrarLibros.innerHTML = `
  <table>
  <tr>
  <th id="PF">Titulo del libro</th>
  <th id="SF">Autor</th>
  <th id="TF">Disponible</th>
  <th id="CF">Acción</th>
  </tr></table>`;
  resp.data.forEach((element) => {
    $mostrarLibros.innerHTML += `
<table>
<tr>

<td id="PF">${element.titulo}</td>
<td id="SF">${element.autor}</td>
<td id="TF">${element.disponible}</td>
<td id="CF">
<button onclick="borrarLibro(${element.id})">Dar de baja</button>
<button onclick="mostrarLibro(${element.id})">Editar</button>
</td></table>`;
  });
}

//ALUMNOS-CRUD--------------------------------------------------------------------------------------------------------


// validaciones de Alumno
async function deudaAlumno(id) {
  let bandera = false;
  let resp = await axios.get("http://localhost:3000/prestamos");
  resp.data.forEach((e) => {
    if (e.alumnosId == id && e.fechaDevolucion == "") {
      bandera = true;
    }
  });

  return bandera;
}

async function validarAlumno() {
  let bandera = false;

  if ($nombre.value == "") {
    bandera = true;
    alert("Debe ingresar un nombre");
  }

  if ($dni.value == "") {
    bandera = true;
    alert("Debe ingresar un dni");
  }

  if ($direccion.value == "") {
    bandera = true;
    alert("Debe ingresar una direccion");
  }

  resp = await axios.get("http://localhost:3000/alumnos/");
  resp.data.forEach((element) => {
    if ($dni.value == element.dni) {
      bandera = true;
      alert("El DNI ingresado ya existe en la base de datos");
    }
  });
  

  if (!pattern.test($nombre.value)) {
    bandera = true;
    alert("Solo puede ingresar nombres de personas en nombres.");
  }
 
  if ($dni.value.length > 8) {
    bandera = true;
    alert("Numero de DNI es demasiado largo");
  }

  return bandera;
}

async function añadirAlumno() {
  if (!(await validarAlumno())) {
    resp = await axios.post("http://localhost:3000/alumnos/", {
      dni: $dni.value,
      nombre: $nombre.value,
      direccion: $direccion.value,
      debeLibros: false,
    });
    listarAlumnos();
    cargarSelect();
  }
}

async function listarAlumnos() {
  resp = await axios.get("http://localhost:3000/alumnos/");
  $mostrarAlumnos.innerHTML = `
  <table>
  <tr>
  <th id="FP">Nombre</th>
  <th id="FS">DNI</th>
  <th id="FT">Dirección</th>
  <th id="FC">Deuda</th>
  <th id="FQ">Acción</th>
  </tr></table>`;

  resp.data.forEach((element) => {
    $mostrarAlumnos.innerHTML += `
    <table> 
    <tr>
    
    <td id="FP">${element.nombre} </td>
    <td id="FS">${element.dni}</td>
    <td id="FT">${element.direccion}</td>
    <td id="FC">${element.debeLibros}</td>
    <td id="FQ">
    <button onclick="borrarAlumnos(${element.id})">Dar de baja</button>
    <button onclick="mostrarAlumnos(${element.id})">Editar</button>
    </td>`;
  });
}

async function borrarAlumnos(id) {
  resp = await axios.get("http://localhost:3000/alumnos/" + id);
  if (resp.data.debeLibros == false) {
    try {
      await axios.delete("http://localhost:3000/alumnos/" + id);
    } catch (error) {
      alert("error al borrar");
    }
  } else {
    alert("El alumno aún debe libros");
  }
  listarAlumnos();
}

async function mostrarAlumnos(id) {
  $btnactualizarAlumno.hidden = false;
  $btnAgregarAlumno.hidden = true;
  auxiliar = id;
  resp = await axios.get("http://localhost:3000/alumnos/" + id);
  $dni.value = resp.data.dni;
  $nombre.value = resp.data.nombre;
  $direccion.value = resp.data.direccion;
}

async function actualizarAlumno() {
  $btnactualizarAlumno.hidden = true;
  $btnAgregarAlumno.hidden = false;
  alumno = await axios.get("http://localhost:3000/alumnos/" + auxiliar);
  resp = await axios.put("http://localhost:3000/alumnos/" + auxiliar, {
    dni: $dni.value,
    nombre: $nombre.value,
    direccion: $direccion.value,
    debeLibros: alumno.data.debeLibros,
  });
}

//PRESTAMOS----------------------------------------------------------------------------------------------------

//validaciones de prestamos
async function validarPrestamo() {
  let bandera = false;

  if ($titulos.value == "") {
    bandera = true;
    alert("Debe ingresar un Titulo");
  }

  if ($alumnoID.value == "") {
    bandera = true;
    alert("Debe ingresar un dni");
  }

  if ($fechaEntrega.value == "") {
    bandera = true;
    alert("Debe ingresar una fecha de Entrega");
  }

  if (await debeLibro($alumnoID.value)) {
    bandera = true;
    alert("Alumno con deuda");
  }

  if (await libroNoDisponible($titulos.value)) {
    bandera = true;
    alert("El libro no está disponible");
  }
  return bandera;
}

async function debeLibro(id) {
  let bandera = false;
  // axlaryIdSecundary = id;
  resp = await axios.get("http://localhost:3000/prestamo");
  resp.data.forEach((element) => {
    if (element.alumnoId == id && element.fechaDevolucion == "") {
      bandera = true;
    }
  });
  return bandera;
}


async function libroNoDisponible(id) {
  let bandera = false;
  resp = await axios.get("http://localhost:3000/prestamo");
  resp.data.forEach((element) => {
    if (element.libroId == id && element.fechaDevolucion == "") {
      bandera = true;
    }
  });
  return bandera;
}


//Agregar Prestamo
async function prestarLibros() {
  try {
    if (!(await validarPrestamo())) {
      resp = await axios.get("http://localhost:3000/libros/" + $titulos.value);
      let tituloLibro = resp.data.titulo;
      resp = await axios.get("http://localhost:3000/alumnos/" + $alumnoID.value);
      let nombreAlumno = resp.data.nombre;
      resp = await axios.post("http://localhost:3000/prestamo/", {
        fechaEntrega: $fechaEntrega.value,
        fechaDevolucion: "",
        libroId: $titulos.value,
        alumnoId: $alumnoID.value,
        alumno: nombreAlumno,
        libro: tituloLibro,
        pendiente: true,
      });
      alumno = await axios.get(
        "http://localhost:3000/alumnos/" + $alumnoID.value
      );
      resp = await axios.put(
        "http://localhost:3000/alumnos/" + $alumnoID.value,
        {
          dni: alumno.data.dni,
          nombre: alumno.data.nombre,
          direccion: alumno.data.direccion,
          debeLibros: true,
        }
      );
      libro = await axios.get("http://localhost:3000/libros/" + $titulos.value);
      resp = await axios.put("http://localhost:3000/libros/" + $titulos.value, {
        titulo: libro.data.titulo,
        autor: libro.data.autor,
        disponible: !true,
      });
    }
  } catch (error) {
    console.log(error);
  }
  listarPrestamo();
  listarPresEntregados();
  listarAlumnos();
  listarLibros();
}

//mostrar Prestamo
async function listarPrestamo() {
  resp = await axios.get("http://localhost:3000/prestamo");
  $mostrarPrestamos.innerHTML = "<h3>Libros sin entregar: </h3><br>";
  resp.data.forEach((element) => {
    if (element.pendiente == true) {
      $mostrarPrestamos.innerHTML +=
        "Nombre del libro: " +
        element.libro +
        "<br>" +
        "Identificador del libro: " +
        element.libroId +
        "<br>" +
        "Nombre del alumno: " +
        element.alumno +
        "<br>" +
        "Identificador del alumno: " +
        element.alumnoId +
        "<br>" +
        "Fecha de entrega: " +
        element.fechaEntrega +
        "<br>" +
        // "Fecha de devolución: " +
        // element.fechaDevolucion +
        // "<br>" +
        "<button onclick='devolver(" +
        element.id +
        ")'>Devolver</button>" +
        "<br><br>";
    }
  });
}

async function cargarSelect() {
  resp = await axios.get("http://localhost:3000/libros");
  $titulos.innerHTML = `<option disabled selected>Selecciona una opción</option>
`;
  resp.data.forEach((element) => {
    $titulos.innerHTML +=
      "<option value=" + element.id + ">" + element.titulo + "</option>";
  });
  resp = await axios.get("http://localhost:3000/alumnos");
  $alumnoID.innerHTML = `<option disabled selected>Selecciona una opción</option>`;
  resp.data.forEach((element) => {
    $alumnoID.innerHTML +=
      "<option value=" + element.id + ">" + element.dni + " - " + element.nombre + "</option>";
  });
}
//Esconder las opciones de prestamo y guardar ID
async function devolver(id) {
  $devolucion.hidden = false;
  $datos.hidden = true;
  auxiliar = id;
}

async function finalizarDevolucion() {
  prestamo = await axios.get("http://localhost:3000/prestamo/" + auxiliar);
  alumno = prestamo.data.alumnoId;
  libro = prestamo.data.libroId;
  valoresPorDefecto(libro, alumno);
  resp = await axios.put("http://localhost:3000/prestamo/" + auxiliar, {
    fechaEntrega: prestamo.data.fechaEntrega,
    fechaDevolucion: $fechaDevulucion.value,
    libroId: prestamo.data.libroId,
    alumnoId: prestamo.data.alumnoId,
    alumno: prestamo.data.alumno,
    libro: prestamo.data.libro,
    pendiente: false,
  });
  listarAlumnos();
  listarLibros();
  listarPrestamo();
  listarPresEntregados();
}

async function valoresPorDefecto(id1, id2) {
  libro = await axios.get("http://localhost:3000/libros/" + id1);
  alumno = await axios.get("http://localhost:3000/alumnos/" + id2);
  resp = await axios.put("http://localhost:3000/alumnos/" + id2, {
    dni: alumno.data.dni,
    nombre: alumno.data.nombre,
    direccion: alumno.data.direccion,
    debeLibros: false,
  });
  resp = await axios.put("http://localhost:3000/libros/" + id1, {
    titulo: libro.data.titulo,
    autor: libro.data.autor,
    disponible: true,
  });
}

async function listarPresEntregados() {
  resp = await axios.get("http://localhost:3000/prestamo");
  $mostrarLibrosEntregados.innerHTML = "<h3>Libros entregados: </h3><br>";
  resp.data.forEach((element) => {
    if (element.pendiente == false) {
      $mostrarLibrosEntregados.innerHTML +=
        "Nombre del libro: " +
        element.libro +
        "<br>" +
        "Nombre del alumno: " +
        element.alumno +
        "<br>" +
        "Identificador del alumno: " +
        element.alumnoId +
        "<br>" +
        "Fecha de entrega: " +
        element.fechaEntrega +
        "<br>" +
        "Identificador del libro: " +
        element.libroId +
        "<br>" +
        "Fecha de devolución: " +
        element.fechaDevolucion +
        "<br><br>";
    }
  });
}
