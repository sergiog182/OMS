var urlServicio = "http://192.168.1.2:8081/OrderManagementSystemWeb/oms/OrderManagementSystemServices/getProductRanking";
var urlGetProduct = "http://192.168.1.2:8081/DataServiceWeb/service/Products/";

$(document).ready(function(){
	$(".datepicker").datepicker({
		autoclose: true,
		zIndexOffset: 1050
	});

	$("#generateReport").click(function(){
		var fechaInicial = $("#txtFechaInical").val();
		var fechaFinal = $("#txtFechaFinal").val();
		if (fechaInicial == "" || fechaFinal == "") {
			alert("Debes ingresar un rango de fechas");
		} else {
			setCargando(1);
			$.ajax({
				url: urlServicio,
				method: "GET",
				data: {"initalPage": 0, "finalPage": 10, "initialDate": fechaInicial, "finalDate": fechaFinal},
				headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: "json",
			    success: function(response){
					var jsonResponse = JSON.parse(JSON.stringify(response));
					printRankingData(jsonResponse, ["Producto", "Cantidad vendida", "Valor Unitario", "Total vendido", "Detalle Producto"], "result-content", 0);
				}, 
				error: function(error){
					setCargando(0);
					alert("Ocurrio un error consultando el ranking");
					console.log("Ocurrio un error al conectarse con el servidor: " + error.responseText);
				}
			});
		}
	});

	$(document).on("click", ".detailProduct", function(){
		setCargando(1);
		$.ajax({
			url: urlGetProduct + $(this).data("id"),
			method: "GET",
			headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
		    dataType: "json",
		    success: function(response){
				var jsonResponse = JSON.parse(JSON.stringify(response));
				if (jsonResponse.response) {
					var producto = jsonResponse.listProducts[0];
					$("#productCodeLabel").html(producto.id);
					$("#divName").html(producto.name);
					$("#divProducer").html(producto.producer.producer);
					$("#divPrice").html((producto.price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
					$("#divExternalIdentifier").html(producto.externalIdentifier);
					$("#divStatus").html("Activo");//producto.status.status);
					$("#divDescription").html(producto.description);
					
					var imagenes = producto.images;
					var contador = 0;
					var clase = "image active-image";
					$("#productImages").html("");
					imagenes.forEach(function(element){
						contador++;
						if (contador != 1) {
							clase = "image";
						}
						$("#productImages").append("<div class='" + clase + "' id='image" + contador + "'><img src='" + element + "' /> </div>");
					});
					$("#productImages").data("actual", 1);
					$("#productImages").data("max", contador);
					$("#productImages").data("min", 1);	
				}
				setCargando(0);
			}, 
			error: function(error){
				setCargando(0);
				alert("Ocurrio un error consultando el ranking");
				console.log("Ocurrio un error al conectarse con el servidor: " + error.responseText);
			}
		});
	});

	$(document).on("click", "#image-to-left", function(){
		var actual = $("#productImages").data("actual");
		var max = $("#productImages").data("max");
		var min = $("#productImages").data("min");
		if (max > 0) {
			$("#image" + actual).removeClass("active-image");

			if ((actual - 1) < min) 
			{
				actual = max;
			} else {
				actual = actual - 1;
			}
			
			$("#image" + actual).addClass("active-image");
			$("#productImages").data("actual", actual);
		}
	});

	$(document).on("click", "#image-to-right", function(){
		var actual = $("#productImages").data("actual");
		var max = $("#productImages").data("max");
		var min = $("#productImages").data("min");
		if (max > 0) {
			$("#image" + actual).removeClass("active-image");

			if ((actual + 1) > max) 
			{
				actual = min;
			} else {
				actual = actual + 1;
			}

			$("#image" + actual).addClass("active-image");
			$("#productImages").data("actual", actual);
		}
	});
});

function printRankingData(jsonData, headers, divName, page) {
	var divTableContainer = document.createElement("DIV");
	$(divTableContainer).addClass("table-container");
	var table = document.createElement("TABLE");
	$(table).addClass("table table-bordered table-hover");
	var thead = document.createElement("THEAD");
	var tr = document.createElement("TR");
	var contador = 0;
	headers.forEach(function(element){
		var th = document.createElement("TH");
      	var cellText = document.createTextNode(element);
      	th.appendChild(cellText);
     	tr.appendChild(th);
     	contador++;
	});

	thead.appendChild(tr);

	var tbody = document.createElement("TBODY");
	var contador = 0;
	jsonData.forEach(function(element){
		var rowtr = document.createElement("TR");
		$(rowtr).attr("data-productid", element.id);
		
		var tdName = document.createElement("TD");
		var rowCellText = document.createTextNode(element.name);
		tdName.appendChild(rowCellText);
		rowtr.appendChild(tdName);

		var tdQuantity = document.createElement("TD");
		var rowCellText = document.createTextNode(element.quantity);
		tdQuantity.appendChild(rowCellText);
		rowtr.appendChild(tdQuantity);

		var tdPrice = document.createElement("TD");
		var rowCellText = document.createTextNode("$" + (element.price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
		tdPrice.appendChild(rowCellText);
		rowtr.appendChild(tdPrice);

		var tdTotalVendido = document.createElement("TD");
		var rowCellText = document.createTextNode("$" + (parseInt(element.quantity) * parseFloat(element.price)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
		tdTotalVendido.appendChild(rowCellText);
		rowtr.appendChild(tdTotalVendido);

		var tdopciondetalle = document.createElement("td");
		var imageDetail = document.createElement("BUTTON");
		$(imageDetail).addClass("btn-custom btn-info btn-sm rmargin-5 detailProduct");
		$(imageDetail).attr("data-toggle", "modal");
		$(imageDetail).attr("data-target", "#formModal");
		$(imageDetail).attr("data-id", element.id);
		var spanDetail = document.createElement("SPAN");
		$(spanDetail).addClass("glyphicon glyphicon-eye-open");
		imageDetail.appendChild(spanDetail);
		tdopciondetalle.appendChild(imageDetail);
		rowtr.appendChild(tdopciondetalle);

		tbody.appendChild(rowtr);
		contador++;
	});

	table.appendChild(thead);
	table.appendChild(tbody);
	$(divTableContainer).html(table);
	var div = document.getElementById(divName);
	$(div).addClass("active");
	$(div).html(divTableContainer);

	//printPaginator(page, numeroElementos, 10, "result-content", parametro);
	setCargando(0);
}