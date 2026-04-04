
let contador = 0; 
let currentUser = null; 
let tareas = []; 

// Función para iniciar sesión

function login() {
    
    // Obtener valores de los inputs
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validar que se hayan ingresado usuario y contraseña
    if (!username || !password) {
        document.getElementById('loginMessage').textContent = 'Por favor, ingresa usuario y contraseña.';
        return;
    }

    // Cargar usuarios existentes del localStorage o crear objeto vacío
    let users = JSON.parse(localStorage.getItem('users')) || {};
    // Si el usuario no existe, crearlo
    if (!users[username]) {
        users[username] = { password: password };
        localStorage.setItem('users', JSON.stringify(users));
    // Si existe, verificar contraseña
    } else if (users[username].password !== password) {
        document.getElementById('loginMessage').textContent = 'Contraseña incorrecta.';
        return;
    }

    // Establecer usuario actual y guardar en localStorage
    currentUser = username;
    localStorage.setItem('currentUser', username);
    // Ocultar login y mostrar app
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    // Cargar tareas del usuario
    cargarTareas();
}

// Función para cerrar sesión
function logout() {
    // Limpiar usuario actual
    currentUser = null;
    localStorage.removeItem('currentUser');
    // Mostrar login y ocultar app
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('app').style.display = 'none';
    // Limpiar campos
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginMessage').textContent = '';
}

// Función para agregar una nueva tarea
function agregarTarea() {
    // Obtener referencias a los elementos del formulario
    let input = document.getElementById("tareaInput");
    let categoria = document.getElementById("categoria").value;
    let prioridad = document.getElementById("prioridad").value;
    let fecha = document.getElementById("fecha").value;
    let texto = input.value.trim();

    // Validar que se haya escrito algo
    if (texto === "") {
        alert("Escribe una tarea");
        return;
    }

    // Crear objeto tarea con ID único basado en timestamp
    let tarea = {
        id: Date.now(),
        texto: texto,
        categoria: categoria,
        prioridad: prioridad,
        fecha: fecha,
        completada: false
    };

    // Agregar al array de tareas
    tareas.push(tarea);
    // Guardar en localStorage
    guardarTareas();
    // Mostrar tareas actualizadas
    mostrarTareas();
    // Limpiar inputs
    input.value = "";
    document.getElementById("fecha").value = "";
}

// Función para mostrar las tareas en la lista
function mostrarTareas(filtrar = false) {
    // Obtener referencia a la lista
    let lista = document.getElementById("listaTareas");
    // Limpiar lista
    lista.innerHTML = "";
    // Reiniciar contador
    contador = 0;

    // Determinar si filtrar o no
    let tareasFiltradas = tareas;
    if (filtrar) {
        // Obtener valores de filtros
        let filterCat = document.getElementById("filterCategoria").value;
        let filterPri = document.getElementById("filterPrioridad").value;
        // Filtrar tareas según categoría y prioridad
        tareasFiltradas = tareas.filter(t =>
            (!filterCat || t.categoria === filterCat) &&
            (!filterPri || t.prioridad === filterPri)
        );
    }

    // Iterar sobre las tareas filtradas
    tareasFiltradas.forEach(tarea => {
        // Crear elemento de lista con clases de Bootstrap
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        // Crear span para el texto de la tarea
        let span = document.createElement("span");
        span.textContent = `${tarea.texto} (${tarea.categoria}, ${tarea.prioridad}${tarea.fecha ? ', ' + tarea.fecha : ''})`;
        // Si está completada, agregar clases de Bootstrap
        if (tarea.completada) span.classList.add("text-decoration-line-through", "text-muted");

        // Evento para marcar/desmarcar como completada
        span.onclick = function() {
            tarea.completada = !tarea.completada;
            guardarTareas();
            mostrarTareas(filtrar);
        }

        // Crear contenedor para botones
        let divButtons = document.createElement("div");
        divButtons.className = "btn-group btn-group-sm";

        // Botón editar
        let editarBtn = document.createElement("button");
        editarBtn.textContent = "Editar";
        editarBtn.className = "btn btn-warning btn-sm";
        editarBtn.onclick = function() {
            editarTarea(tarea.id);
        }

        // Botón eliminar
        let boton = document.createElement("button");
        boton.textContent = "Eliminar";
        boton.className = "btn btn-danger btn-sm";
        boton.onclick = function() {
            // Filtrar tarea del array
            tareas = tareas.filter(t => t.id !== tarea.id);
            guardarTareas();
            mostrarTareas(filtrar);
        }

        // Agregar botones al contenedor
        divButtons.appendChild(editarBtn);
        divButtons.appendChild(boton);

        // Agregar elementos al li
        li.appendChild(span);
        li.appendChild(divButtons);
        // Agregar li a la lista
        lista.appendChild(li);
        // Incrementar contador
        contador++;
    });

    // Actualizar contador en la UI
    actualizarContador();
}

// Función para editar una tarea
function editarTarea(id) {
    // Buscar tarea por ID
    let tarea = tareas.find(t => t.id === id);
    if (!tarea) return;

    // Mostrar prompt para editar texto
    let nuevoTexto = prompt("Editar tarea:", tarea.texto);
    if (nuevoTexto !== null) {
        tarea.texto = nuevoTexto.trim();
        guardarTareas();
        mostrarTareas();
    }
}

// Función para filtrar tareas (llamada desde HTML)
function filtrarTareas() {
    mostrarTareas(true);
}

// Función para actualizar el contador de tareas
function actualizarContador() {
    document.getElementById("contador").textContent = contador + " tareas";
}

// Función para guardar tareas en localStorage
function guardarTareas() {
    localStorage.setItem(`tareas_${currentUser}`, JSON.stringify(tareas));
}

// Función para cargar tareas desde localStorage
function cargarTareas() {
    tareas = JSON.parse(localStorage.getItem(`tareas_${currentUser}`)) || [];
    mostrarTareas();
}

// Evento que se ejecuta al cargar la página
window.onload = function() {
    // Verificar si hay un usuario guardado
    if (localStorage.getItem('currentUser')) {
        currentUser = localStorage.getItem('currentUser');
        // Ocultar login y mostrar app
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        // Cargar tareas
        cargarTareas();
    }
}