var urlservicios = "http://localhost:8984/solr/productsCore/";
var images = new Array();
var idTemp = 1;

function printProductData(jsonData, headers, canEdit, divName, parametro, page, numeroElementos) {
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
		var rowCellText = document.createTextNode(element.externalIdentifier);
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
		$(imageDetail).attr("data-idproducer", element.idProducer);
		$(imageDetail).attr("data-price", element.price);
		$(imageDetail).attr("data-externalIdentifier", element.externalIdentifier);
		$(imageDetail).attr("data-description", element.description);
		$(imageDetail).attr("data-images", element.images.join("~separador~"));
		$(imageDetail).attr("data-idimages", element.idImages.join("~separador~"));
		$(imageDetail).attr("data-id", element.id);
		$(imageDetail).attr("data-status", element.status);
		$(imageDetail).attr("data-idstatus", element.idStatus);
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
			$(imageEdit).attr("data-idproducer", element.idProducer);
			$(imageEdit).attr("data-price", element.price);
			$(imageEdit).attr("data-externalIdentifier", element.externalIdentifier);
			$(imageEdit).attr("data-description", element.description);
			$(imageEdit).attr("data-images", element.images.join("~separador~"));
			$(imageEdit).attr("data-idimages", element.idImages.join("~separador~"));
			$(imageEdit).attr("data-id", element.id);
			$(imageEdit).attr("data-status", element.status);
			$(imageEdit).attr("data-idstatus", element.idStatus);
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
	$(divTableContainer).html(table);
	var div = document.getElementById(divName);
	$(div).addClass("active");
	$(div).html(divTableContainer);

	printPaginator(page, numeroElementos, 10, "result-content", parametro);
	setCargando(0);
}

function getProducts(start, rows, parametro, divResult, page)
{
	setCargando(1);
	$.getJSON(urlservicios + "select?indent=on&q=" + parametro + "&wt=json&sort=id asc&rows=" + rows + "&start=" + start, function(result){
	    var jsonResponse = JSON.parse(JSON.stringify(result));
	    if (jsonResponse.responseHeader.status == 0) {
	    	if (jsonResponse.response.numFound > 0) {
	    		printProductData(jsonResponse.response.docs, ["id", "Nombre", "Descipcion", "Precio", "Identificador Externo", "Fabricante", "Estado"], true, divResult, parametro, page, jsonResponse.response.numFound);
	    	} else {
	    		$("#result-content").html("La consulta no obtuvo resultados");
	    	}
	    } else {
	    	$("#result-content").html("Error realizando consulta");
	    }
  	});
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
				parametro += " and name:*" + nombre + "*";
			} else {
				parametro = "name:*" + nombre + "*";	
			}
		}

		var descripcion = $("#descripcionProducto").val();
		if (descripcion != "") {
			if (parametro != "*:*") {
				parametro += " and description:*" + descripcion + "*";
			} else {
				parametro = "description:*" + descripcion + "*";	
			}
		}
		getProducts(0, 10, parametro, "result-content", 0);
	});

	$(document).on("click", ".detailProduct", function(){
		$("#productCodeLabel").html($(this).data("id"));
		$("#divName").html($(this).data("name"));
		$("#divProducer").html($(this).data("producer"));
		$("#divPrice").html(($(this).data("price")).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
		$("#divExternalIdentifier").html($(this).data("externalidentifier"));
		$("#divStatus").html($(this).data("status"));
		$("#divDescription").html($(this).data("description"));
		
		var imagenes = ($(this).data("images")).split("~separador~");
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
		$("#agregarImagen").removeClass("active-fila");
		$("#eliminarImagen").removeClass("active-fila");

		$("#btnGuardarProducto").addClass("btn-hide");
	});

	$(document).on("click", ".editProduct", function(){
		$("#txtIdProdcut").val($(this).data("id"));
		$("#productCodeLabel").html($(this).data("id"));
		$("#divName").html("<input type='text' class='form-control' id='txtName' name='txtName' value='" + $(this).data("name") + "'/>");
		$("#divProducer").html("<input type='text' class='form-control' id='txtProducer' name='txtProducer' />");
		$("#divPrice").html("<input type='text' class='form-control' id='txtPrice' name='txtPrice' value='" + $(this).data("price") + "'/>");
		$("#divExternalIdentifier").html("<input type='text' class='form-control' id='txtExternalIdentifier' name='txtExternalIdentifier' value='" + $(this).data("externalidentifier") + "'/>");
		var selectActivo = "";
		var selectInactivo = "";
		if ($(this).data("idstatus") == 1) {
			selectActivo = "selected";
		} else {
			selectInactivo = "selected";
		}
		$("#divStatus").html("<select class='form-control' id='txtStatus' name='txtStatus'><option value='1' " + selectActivo + ">Activo</option><option value='2' " + selectInactivo + ">Inactivo</option></select>");
		$("#divDescription").html("<textarea class='form-control' rows='5' id='txtDescription' name='txtDescription'>" + $(this).data("description") + "</textarea>");
		
		var imagenes = ($(this).data("images")).split("~separador~");
		var contador = 0;
		var clase = "image active-image";
		$("#productImages").html("");
		images[$("#txtIdProdcut").val()] = new Array();
		var imagesid = ($(this).data("idimages")).toString().split("~separador~");
		imagenes.forEach(function(element){
			var idactual = imagesid[contador];
			images[$("#txtIdProdcut").val()][idactual] = element;
			contador++;
			if (contador != 1) {
				clase = "image";
			}
			$("#productImages").append("<div class='" + clase + "' id='image" + contador + "' data-idimage='" + idactual + "'><img class='img-thumbnail' src='" + element + "' /> </div>");

		});
		$("#productImages").data("actual", 1);
		$("#productImages").data("max", contador);
		$("#productImages").data("min", 1);
		$("#agregarImagen").addClass("active-fila");
		$("#eliminarImagen").addClass("active-fila");

		$("#btnGuardarProducto").removeClass("btn-hide");

		$("#txtProducer").typeahead({
	  		source: [
	  			{id: 1, name: "Cartceivridge"},
	  			{id: 2, name: "Tweetwoofra"},
	  			{id: 3, name: "Relifigaar"},
	  			{id: 4, name: "Mictectplscope"},
	  			{id: 5, name: "Playjector"},
	  			{id: 6, name: "Subtopentor"},
	  			{id: 7, name: "Comceivicscope"},
	  			{id: 8, name: "Cabculplphone"},
	  			{id: 9, name: "Bibandor"},
	  			{id: 10, name: "Comleommridge"},
	  			{id: 11, name: "Montaor"}
		  	],
		  	autoSelect: true
		});

		$("#txtProducer").val($(this).data("producer")).typeahead("lookup");

	});

	$(document).on("click", "#addProduct", function(){
		$("#txtIdProdcut").val(0);
		$("#productCodeLabel").html("");
		$("#divName").html("<input type='text' class='form-control' id='txtName' name='txtName' />");
		$("#divProducer").html("<input type='text' data-provide='typeahead' autocomplete='off' class='form-control' id='txtProducer' name='txtProducer'/>");
		$("#divPrice").html("<input type='text' class='form-control' id='txtPrice' name='txtPrice'/>");
		$("#divExternalIdentifier").html("<input type='text' class='form-control' id='txtExternalIdentifier' name='txtExternalIdentifier'/>");
		$("#divStatus").html("<select class='form-control' id='txtStatus' name='txtStatus'><option value='1'>Activo</option><option value='2'>Inactivo</option></select>");
		$("#divDescription").html("<textarea class='form-control' rows='5' id='txtDescription' name='txtDescription'></textarea>");
		
		$("#productImages").data("actual", 0);
		$("#productImages").data("max", 0);
		$("#productImages").data("min", 0);
		$("#agregarImagen").addClass("active-fila");
		$("#eliminarImagen").addClass("active-fila");

		$("#productImages").html("");

		images[$("#txtIdProdcut").val()] = new Array();

		$("#btnGuardarProducto").removeClass("btn-hide");
		$("#txtProducer").typeahead({
	  		source: [
	  			{id: 1, name: "Cartceivridge"},
	  			{id: 2, name: "Tweetwoofra"},
	  			{id: 3, name: "Relifigaar"},
	  			{id: 4, name: "Mictectplscope"},
	  			{id: 5, name: "Playjector"},
	  			{id: 6, name: "Subtopentor"},
	  			{id: 7, name: "Comceivicscope"},
	  			{id: 8, name: "Cabculplphone"},
	  			{id: 9, name: "Bibandor"},
	  			{id: 10, name: "Comleommridge"}
		  	],
		  	autoSelect: true
		});
	});

	$(document).on("click", "#btnGuardarProducto", function(){
		var name = $("#txtName").val();
		var producer = $('#txtProducer').typeahead("getActive").id;
		var precio = $("#txtPrice").val();
		var externalidentifier = $("#txtExternalIdentifier").val();
		var estado = $("#txtStatus").val();
		var descripcion = $("#txtDescription").val();
		var codigo = $("#txtIdProdcut").val();
		
		if (name == "" || producer == "" || precio == "" || externalidentifier == "" || estado == "" || descripcion == "") {
			alert("Ningun campo debe estar vacio");
		} else {
			alert("se fue");
		}

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

	$(document).on("click", "#btnImageDelete", function(){
		var cantidad = $("#productImages").data("max");
		if (cantidad > 0) {
			if (confirm("¿Esta seguro de eliminar esta imagen?")) {	
				var actual = $("#productImages").data("actual");
				var minima = $("#productImages").data("min");
				var imagen = $("#image" + actual).data("idimage");
				if (images[$("#txtIdProdcut").val()][imagen] != null && images[$("#txtIdProdcut").val()][imagen] != undefined) {
					images[$("#txtIdProdcut").val()].splice(imagen, 1);
				}

				$("#image" + actual).remove();
				var primero = true;

				actual++;
				if (actual <= cantidad) {
					while (actual <= cantidad) {
						$("#image" + actual).attr("id", "image" + (actual - 1));
						if (primero) {
							$("#image" + (actual - 1)).addClass("active-image");
							primero = false;
						}
						actual++;
					}
				} else {
					$("#image" + minima).addClass("active-image");
				}

				$("#productImages").data("max", (cantidad - 1));
			}
		}
	});

	$(document).on("click", "#btnImageAdd", function(){
		var input = document.getElementById("imgInp");
		if (input.files && input.files[0]) {
	        var reader = new FileReader();
	        var cantidad = $("#productImages").data("max");
	        reader.onload = function (e) {
	        	if (cantidad > 0) {
	        		$(".image").removeClass("active-image");
	        	}
	        	cantidad++;
	        	images[$("#txtIdProdcut").val()][parseInt(idTemp)] = e.target.result;
	        	$("#productImages").append("<div class='image active-image' id='image" + cantidad + "' data-idimage='" + idTemp + "'><img class='img-thumbnail' src='" + e.target.result + "' /> </div>");
	            idTemp++;
	            $("#productImages").data("actual", cantidad);
				$("#productImages").data("max", cantidad);
				$("#productImages").data("min", 1);
	        }

	        reader.readAsDataURL(input.files[0]);

	        $(input).val("");
	    }
	});

	$(document).on("click", ".btn-paginator, #previusPage, #nextPage", function(){
		var page = $(this).data("page");
		if (page != 0) {
			var parametro = $(this).data("parametro");
			getProducts(((page * 10) -10), 10, parametro, "result-content", page);	
		}
	});
});
