var urlservicios = "http://localhost:8984/solr/productsCore/";

function printProductData(jsonData, headers, canEdit, divName, parametro) {
	console.log(jsonData);
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

	var th = document.createElement("TH");
	var cellText = document.createTextNode("Opciones");
	th.appendChild(cellText);
	tr.appendChild(th);
	thead.appendChild(tr);

	var tbody = document.createElement("TBODY");

	jsonData.forEach(function(element){
		var rowtr = document.createElement("TR");
		$(rowtr).attr("data-productid", element.id[0]);
		
		var tdId = document.createElement("TD");
		var rowCellText = document.createTextNode(element.id);
		tdId.appendChild(rowCellText);
		rowtr.appendChild(tdId);
		
		var tdName = document.createElement("TD");
		var rowCellText = document.createTextNode(element.name);
		tdName.appendChild(rowCellText);
		rowtr.appendChild(tdName);

		var tdDescription = document.createElement("TD");
		var rowCellText = document.createTextNode(element.description);
		tdDescription.appendChild(rowCellText);
		rowtr.appendChild(tdDescription);

		var tdPrice = document.createElement("TD");
		var rowCellText = document.createTextNode((element.price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
		tdPrice.appendChild(rowCellText);
		rowtr.appendChild(tdPrice);

		var tdEI = document.createElement("TD");
		var rowCellText = document.createTextNode(element.externalidentifier);
		tdEI.appendChild(rowCellText);
		rowtr.appendChild(tdEI);

		var tdProducer = document.createElement("TD");
		var rowCellText = document.createTextNode(element.producer);
		tdProducer.appendChild(rowCellText);
		rowtr.appendChild(tdProducer);

		var tdStatus = document.createElement("TD");
		var rowCellText = document.createTextNode(element.status);
		tdStatus.appendChild(rowCellText);
		rowtr.appendChild(tdStatus);

		var td = document.createElement("TD");

		var tablaopciones = document.createElement("table");
		$(tablaopciones).attr("align", "center")
		var tropciones = document.createElement("tr");
		
		var tdopciondetalle = document.createElement("td");
		var imageDetail = document.createElement("BUTTON");
		$(imageDetail).addClass("btn-custom btn-info btn-sm rmargin-5 detailProduct");
		$(imageDetail).attr("data-toggle", "modal");
		$(imageDetail).attr("data-target", "#formModal");
		$(imageDetail).attr("data-name", element.name);
		$(imageDetail).attr("data-producer", element.producer);
		$(imageDetail).attr("data-price", element.price);
		$(imageDetail).attr("data-externalidentifier", element.externalidentifier);
		$(imageDetail).attr("data-description", element.description);
		$(imageDetail).attr("data-images", element.images);
		$(imageDetail).attr("data-id", element.id);
		$(imageDetail).attr("data-status", element.status);
		var spanDetail = document.createElement("SPAN");
		$(spanDetail).addClass("glyphicon glyphicon-eye-open");
		imageDetail.appendChild(spanDetail);

		tdopciondetalle.appendChild(imageDetail);
		tropciones.appendChild(tdopciondetalle);

		if (canEdit) {
			var tdopcioneditar = document.createElement("td");
			var imageEdit = document.createElement("BUTTON");
			$(imageEdit).addClass("btn-custom btn-success btn-sm rmargin-5 editProduct");
			$(imageEdit).attr("data-toggle", "modal");
			$(imageEdit).attr("data-target", "#formModal");
			$(imageEdit).attr("data-name", element.name);
			$(imageEdit).attr("data-producer", element.producer);
			$(imageEdit).attr("data-price", element.price);
			$(imageEdit).attr("data-externalidentifier", element.externalidentifier);
			$(imageEdit).attr("data-description", element.description);
			$(imageEdit).attr("data-images", element.images);
			$(imageEdit).attr("data-id", element.id);
			$(imageEdit).attr("data-status", element.status);
			var spanEdit = document.createElement("SPAN");
			$(spanEdit).addClass("glyphicon glyphicon-pencil");
			imageEdit.appendChild(spanEdit);

			tdopcioneditar.appendChild(imageEdit);
			tropciones.appendChild(tdopcioneditar);
		}

		tablaopciones.appendChild(tropciones);
		td.appendChild(tablaopciones);
		rowtr.appendChild(td);
		tbody.appendChild(rowtr);
	});

	table.appendChild(thead);
	table.appendChild(tbody);
	var div = document.getElementById(divName);
	$(div).addClass("active");
	$(div).html(table);

	getPaginator(parametro, 1, 10);
}

function getProducts(start, rows, parametro, divResult)
{
	$.getJSON(urlservicios + "select?indent=on&q=" + parametro + "&wt=json&sort=id asc&wt=json&rows=" + rows + "&start=" + start, function(result){
	    var jsonResponse = JSON.parse(JSON.stringify(result));
	    if (jsonResponse.responseHeader.status == 0) {
	    	if (jsonResponse.response.numFound > 0) {
	    		printProductData(jsonResponse.response.docs, ["id", "Nombre", "Descipcion", "Precio", "Identificador Externo", "Productor", "Estado"], true, divResult, parametro);
	    	} else {
	    		return "La consulta no obtuvo resultados";
	    	}
	    } else {
	    	return "Error realizando consulta";
	    }
  	});
}

function getPaginator(parametro, currentPage, itemsToShow)
{
	$.getJSON(urlservicios + "select?indent=on&q=" + parametro + "&wt=json&sort=id asc&wt=json", function(result){
	    var jsonResponse = JSON.parse(JSON.stringify(result));
	    if (jsonResponse.responseHeader.status == 0) {
	    	if (jsonResponse.response.numFound > 0) {
	    		printPaginator(currentPage, jsonResponse.response.numFound, itemsToShow, "result-content");
	    	} else {
	    		return "La consulta no obtuvo resultados";
	    	}
	    } else {
	    	return "Error realizando consulta";
	    }
  	});	
}

function printPaginator(currentPage, totalItems, numberItemsToShow, divPaginator)
{
	var table = document.createElement("table");
	$(table).attr("align", "center")
	var tr = document.createElement("tr");

	var tdPrevius = document.createElement("td");
	var btnPrevius = document.createElement("button");
	$(btnPrevius).addClass("btn-custom btn-sm");
	var iconPrevius = document.createElement("span");
	$(iconPrevius).addClass("glyphicon glyphicon-chevron-left");
	btnPrevius.appendChild(iconPrevius);
	tdPrevius.appendChild(btnPrevius);
	tr.appendChild(tdPrevius);

	var cantidad = Math.ceil(totalItems/numberItemsToShow);
	var contador = 1;
	if ((currentPage - 2) > 2) {
		contador = (currentPage - 2);
		var tdPage = document.createElement("td");
		var btnPage = document.createElement("button");
		$(btnPage).addClass("btn-custom btn-sm");
		var text = document.createTextNode("...");
		btnPage.appendChild(text);
		tdPage.appendChild(btnPage);
		tr.appendChild(tdPage);
	}
	var banderaSalir = false;
	var contadorPaginas = 0;
	while (cantidad >= contador) {
		if (contadorPaginas == 5 && (cantidad - contador) > 2) {
			banderaSalir = true;
			break;
		}
		var tdPage = document.createElement("td");
		var btnPage = document.createElement("button");
		$(btnPage).addClass("btn-custom btn-sm");
		if (contador == currentPage) {
			$(btnPage).addClass("disabled");
		}
		var text = document.createTextNode(contador.toString());
		btnPage.appendChild(text);
		tdPage.appendChild(btnPage);
		tr.appendChild(tdPage);
		contador++;
		contadorPaginas++;
	}

	if (banderaSalir) {
		var tdPage = document.createElement("td");
		var btnPage = document.createElement("button");
		$(btnPage).addClass("btn-custom btn-sm");
		var text = document.createTextNode("...");
		btnPage.appendChild(text);
		tdPage.appendChild(btnPage);
		tr.appendChild(tdPage);

		var tdPage = document.createElement("td");
		var btnPage = document.createElement("button");
		$(btnPage).addClass("btn-custom btn-sm");
		var text = document.createTextNode(cantidad);
		btnPage.appendChild(text);
		tdPage.appendChild(btnPage);
		tr.appendChild(tdPage);
	}

	var tdNext = document.createElement("td");
	var btnNext = document.createElement("button");
	$(btnNext).addClass("btn-custom btn-sm");
	var iconNext = document.createElement("span");
	$(iconNext).addClass("glyphicon glyphicon-chevron-right");
	btnNext.appendChild(iconNext);
	tdNext.appendChild(btnNext);
	tr.appendChild(tdNext);
	table.appendChild(tr);

	var div = document.getElementById(divPaginator);
	div.appendChild(table);
}

$(document).ready(function(){
	$("#findProducts").click(function(){
		var parametro = "*:*";
		var codigo = $("#codigoProducto").val();
		if (codigo != "") {
			parametro = "id:" + codigo;
		}

		var nombre = $("#nombreProducto").val();
		if (nombre != "") {
			if (parametro != "*:*") {
				parametro += " and name:" + nombre;
			} else {
				parametro = "name:" + nombre;	
			}
		}

		var descripcion = $("#descripcionProducto").val();
		if (descripcion != "") {
			if (parametro != "*:*") {
				parametro += " and description:" + descripcion;
			} else {
				parametro = "description:" + descripcion;	
			}
		}
		getProducts(0, 10, parametro, "result-content");
	});

	$(document).on("click", ".detailProduct", function(){
		$("#divName").html($(this).data("name"));
		$("#divProducer").html($(this).data("producer"));
		$("#divPrice").html(($(this).data("price")).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
		$("#divExternalIdentifier").html($(this).data("externalidentifier"));
		$("#divStatus").html($(this).data("status"));
		$("#divDescription").html($(this).data("description"));
		
		var imagenes = ($(this).data("images")).split(",");
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
		$("#eliminarImagen").removeClass("active-fila");

		$("#btnGuardarProducto").addClass("btn-hide");
	});

	$(document).on("click", ".editProduct", function(){
		$("#divName").html("<input type='text' class='form-control' id='txtName' name='txtName' value='" + $(this).data("name") + "'/>");
		$("#divProducer").html("<input type='text' class='form-control' id='txtProducer' name='txtProducer' value='" + $(this).data("producer") + "'/>");
		$("#divPrice").html("<input type='text' class='form-control' id='txtPrice' name='txtPrice' value='" + $(this).data("price") + "'/>");
		$("#divExternalIdentifier").html("<input type='text' class='form-control' id='txtExternalIdentifier' name='txtExternalIdentifier' value='" + $(this).data("externalidentifier") + "'/>");
		$("#divStatus").html("<input type='text' class='form-control' id='txtStatus' name='txtStatus' value='" + $(this).data("status") + "'/>");
		$("#divDescription").html("<textarea class='form-control' rows='5' id='txtDescription' name='txtDescription'>" + $(this).data("description") + "</textarea>");
		
		var imagenes = ($(this).data("images")).split(",");
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
		$("#eliminarImagen").addClass("active-fila");

		$("#btnGuardarProducto").removeClass("btn-hide");
	});

	$(document).on("click", "#btnGuardarProducto", function(){
		alert("si");
	});

	$(document).on("click", "#image-to-left", function(){
		var actual = $("#productImages").data("actual");
		var max = $("#productImages").data("max");
		var min = $("#productImages").data("min");

		$("#image" + actual).removeClass("active-image");

		if ((actual - 1) < min) 
		{
			actual = max;
		} else {
			actual = actual - 1;
		}
		
		$("#image" + actual).addClass("active-image");
		$("#productImages").data("actual", actual);
	});

	$(document).on("click", "#image-to-right", function(){
		var actual = $("#productImages").data("actual");
		var max = $("#productImages").data("max");
		var min = $("#productImages").data("min");
		
		$("#image" + actual).removeClass("active-image");

		if ((actual + 1) > max) 
		{
			actual = min;
		} else {
			actual = actual + 1;
		}

		$("#image" + actual).addClass("active-image");
		$("#productImages").data("actual", actual);
	});
});