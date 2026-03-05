let contador = 0;

function agregarTarea(){

let input = document.getElementById("tareaInput");
let texto = input.value.trim();

if(texto === ""){
alert("Escribe una tarea");
return;
}

let li = document.createElement("li");

let span = document.createElement("span");
span.textContent = texto;

span.onclick = function(){
span.classList.toggle("completada");
}

let boton = document.createElement("button");
boton.textContent = "Eliminar";
boton.className = "eliminar";

boton.onclick = function(){
li.remove();
contador--;
actualizarContador();
}

li.appendChild(span);
li.appendChild(boton);

document.getElementById("listaTareas").appendChild(li);

contador++;
actualizarContador();

input.value="";
}

function actualizarContador(){
document.getElementById("contador").textContent = contador + " tareas";
}