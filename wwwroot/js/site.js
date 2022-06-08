var ShoppingCartList;

$(document).ready(function () {
    VerCompras();
});

function BlockScreen(message) {
    Swal.fire({
        html: '<img src="/img/site/loader.gif"  class="img-fluid" alt="Wait.." style="width:50%;" /><br /><br /><span style="text-align:justify;">' + message + '</span>',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false
    });
}

function MensajeUsuario(clase, titulo, mensaje) {
    try {
        Swal.fire({
            icon: clase,
            title: titulo,
            html: '<p style="text-align:center;">' + mensaje + '</p>',
            allowEscapeKey: false,
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 2000
        });
    }
    catch {
    }
}

function VerCompras() {
    BlockScreen("Por favor espere...");
    $.ajax({
        url: $("#Url_ListaCompras").val(),
        type: "POST",
        data: { data: ShoppingCartList }
    }).done(function (result) {
        $("#divMain").html(result);
        Swal.fire({ timer: 1 });
    }).fail(function (xhr, textStatus, errorThrown) {
        Swal.fire({ timer: 1 });
    });
}

function NuevaCompra() {
    $.ajax({
        url: $("#Url_NuevaCompra").val(),
        type: "POST",
        data: { data: ShoppingCartList }
    }).done(function (result) {
        $("#divMain").html(result);
    }).fail(function (xhr, textStatus, errorThrown) {
    });
}

function VerCompra(id) {
    $.ajax({
        url: $("#Url_VerCompra").val(),
        type: "POST",
        data: { data: ShoppingCartList, id: id }
    }).done(function (result) {
        $("#divMain").html(result);
        MostrarItems(id);
    }).fail(function (xhr, textStatus, errorThrown) {
    });
}

function EliminarCompra(id) {
    

    Swal.fire({
        //title: '¿Está seguro de guardar los datos?',
        text: "¿Está seguro de eliminar la compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            BlockScreen("Eliminando compra, por favor espere...");
            $.ajax({
                url: $("#Url_EliminarCompra").val(),
                type: "POST",
                data: { data: ShoppingCartList, id: id }
            }).done(function (result) {
                $("#divMain").html(result);
                Swal.fire({ timer: 1 });
            }).fail(function (xhr, textStatus, errorThrown) {
                Swal.fire({ timer: 1 });
            });
        }
    });
}

function MostrarItems(id) {
    //Mostrar el listado
    $.ajax({
        url: $("#Url_ListaItems").val(),
        type: "POST",
        data: { data: ShoppingCartList, id: id }
    }).done(function (result) {
        $("#divItems").html(result);
        $("#itemNombre").val("");
        $("#itemCantidad").val("");
        $("#itemPrecio").val("");
        $("#itemNombre").focus();
    }).fail(function (xhr, textStatus, errorThrown) {
    });
}

function NuevoItem(id) {
    if ($('#itemNombre').val() == "") {
        MensajeUsuario("error", "Error", "Escriba el nombre del item");
        return false;
    }
    if (isNaN($('#itemCantidad').val()) || $('#itemCantidad').val() === "") {
        MensajeUsuario("error", "Error", "La catidad debe ser un valor númerico válido");
        return false;
    }
    if (isNaN($('#itemPrecio').val()) || $('#itemPrecio').val() === "") {
        MensajeUsuario("error", "Error", "El precio debe ser un valor númerico válido");
        return false;
    }
    let newItem = {
        Nombre: $("#itemNombre").val(),
        Cantidad: $("#itemCantidad").val(),
        Precio: $("#itemPrecio").val()
    };
    //Agregar nuevo item
    $.ajax({
        url: $("#Url_NuevoItem").val(),
        type: "POST",
        data: { data: ShoppingCartList, item: newItem, id: id }
    }).done(function (result) {
        ShoppingCartList = JSON.parse(result);
        MostrarItems(id);
    }).fail(function (xhr, textStatus, errorThrown) {
    });
}

function QuitarItem(id) {
    Swal.fire({
        //title: '¿Está seguro de guardar los datos?',
        text: "¿Está seguro de eliminar el item?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            
            BlockScreen("Eliminando item, por favor espere...");

            $("#divItems").html("");
            $.ajax({
                url: $("#Url_ElimiarItem").val(),
                type: "POST",
                data: { data: ShoppingCartList, id: id }
            }).done(function (result) {
                ShoppingCartList = JSON.parse(result);
                MostrarItems($("#txtidCompra").val());
                Swal.fire({ timer: 1 });
            }).fail(function (xhr, textStatus, errorThrown) {
                Swal.fire({ timer: 1 });
            });
        }
    });
}

function TotalItems(id) {
    BlockScreen("Por favor espere...");
    $.ajax({
        url: $("#Url_TotalItems").val(),
        type: "POST",
        data: { data: ShoppingCartList, id: id }
    }).done(function (result) {        
        Swal.fire({
            icon: "success",
            title: "Total items",
            html: '<p style="text-align:center;">La compra tiene ' + result + ' item(s).</p>',
        });
    }).fail(function (xhr, textStatus, errorThrown) {
        Swal.fire({ timer: 1 });
    });
}

function TotalCompra(id) {
    BlockScreen("Por favor espere...");
    $.ajax({
        url: $("#Url_TotalCompra").val(),
        type: "POST",
        data: { data: ShoppingCartList, id: id }
    }).done(function (result) {
        Swal.fire({
            icon: "success",
            title: "Total items",
            html: '<p style="text-align:center;">El total de la compra es ' + result + '.</p>',
        });
    }).fail(function (xhr, textStatus, errorThrown) {
        Swal.fire({ timer: 1 });
    });
}