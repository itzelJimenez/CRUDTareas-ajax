
var api = {
  url: 'https://lab-api-test.herokuapp.com/tasks/'
};

var $tasksList = $("#tasks-list");
var $borrar = $(".borrar");
var $info = $(".info");

var cargarPagina = function () {
  cargarTareas();
  $("#tasks-list").on("click", $borrar, pruebaBorrar);
  $("#add-form").submit(agregarTarea);
  $("#tasks-list").on("click", $info, datosModal);
};

var cargarTareas = function () {
  $.getJSON(api.url, function (tareas) {
    tareas.forEach(crearTarea);

  });
}
            
var crearTarea = function (tarea) {
  var nombre = tarea.name;
  var estado = tarea.status[0];
  var id = tarea._id;
  var date = tarea.create_at;


  var plantillaNueva = plantilla.replace("__nombre-tarea__", nombre).replace("__estado-tarea__",estado).replace("__id__",id);
  $tasksList.append(plantillaNueva);

};

var agregarTarea = function (e) {
  e.preventDefault();
  var nombre = $("#nombre-tarea").val();
  $.post(api.url, {
    name: nombre
  }, function (tarea) {
    crearTarea(tarea);
    $("#myModal").modal("hide");
  });
};

var plantilla = '<tr data-clave="__id__">' +
                    '<td>__nombre-tarea__</td>' +
                    '<td>__estado-tarea__</td>' +
                   ' <td>'+
                      '<span class="glyphicon glyphicon-eye-open info" data-toggle="modal" data-target="#modalInfo" ></span>' +
                      '<span class="glyphicon glyphicon-pencil"></span>' +
                      '<span class="glyphicon glyphicon-trash borrar"></span>' +
                    '</td>'+
                  '</tr>';

function pruebaBorrar(e){
  var elemento = $(e.target);
  var padre = elemento.parent().parent();
 
  // console.log(id);
  var id = padre.data('clave');
  

   var url_id = api.url + id;
   console.log(url_id);
  $.ajax({
    url: url_id,
    type: "DELETE",
    success: function (data){
      padre.remove();
    }

  });
}

function datosModal(e){
   var elemento = $(e.target);
  var padre = elemento.parent().parent();
 
  // console.log(id);
  var id = padre.data('clave');
  padre.remove();

   var url_id = api.url + id;
  $.getJSON(url_id,function(response){
    console.log(response);

    var nombre_api = response.name;
    var _id = response._id;
    var date = response.created_at;
    var status = response.status[0];
    console.log(nombre_api, _id, date, status);



    imprimirInfo({
      nombre: nombre_api,
      clave: _id,
      date: date,
      status: status
    })

  })

} 

function imprimirInfo(objeto){
  var $nombre = $("#nombre");
  var $id = $("#id");
  var $fecha = $("#fecha");
  var $estado = $("#estado");

  $nombre.text(objeto.nombre);
  $id.text(objeto.clave);
  $fecha.text(objeto.date);
  $estado.text(objeto.status);
 
}

$(document).ready(cargarPagina);

