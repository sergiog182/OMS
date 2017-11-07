function printPaginator(currentPage, totalItems, numberItemsToShow, divPaginator, parametro)
{
	var table = document.createElement("table");
	$(table).attr("align", "center")
	var tr = document.createElement("tr");

	var tdPrevius = document.createElement("td");
	var btnPrevius = document.createElement("button");
	$(btnPrevius).addClass("btn-custom btn-sm btn-paginator");
	if ((currentPage - 1) > 0) {
		$(btnPrevius).data("page", (currentPage - 1));	
	} else {
		$(btnPrevius).data("page", 0);
	}
	$(btnPrevius).data("parametro", parametro);
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
		$(btnPage).addClass("btn-custom btn-sm btn-paginator");
		$(btnPage).data("page", 1);
		$(btnPage).data("parametro", parametro);
		$(btnPage).attr("type", "button");
		var text = document.createTextNode("1");
		btnPage.appendChild(text);
		tdPage.appendChild(btnPage);
		tr.appendChild(tdPage);

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
		$(btnPage).addClass("btn-custom btn-sm btn-paginator");
		if (contador == currentPage) {
			$(btnPage).addClass("disabled");
		}
		var text = document.createTextNode(contador.toString());
		$(btnPage).data("page", contador);
		$(btnPage).data("parametro", parametro);
		$(btnPage).attr("type", "button");
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
		$(btnPage).addClass("btn-custom btn-sm btn-paginator");
		$(btnPage).data("page", cantidad);
		$(btnPage).data("parametro", parametro);
		var text = document.createTextNode(cantidad);
		btnPage.appendChild(text);
		tdPage.appendChild(btnPage);
		tr.appendChild(tdPage);
	}

	var tdNext = document.createElement("td");
	var btnNext = document.createElement("button");
	$(btnNext).addClass("btn-custom btn-sm btn-paginator");
	if ((currentPage + 1) <= cantidad) {
		$(btnNext).data("page", (currentPage + 1));
	} else {
		$(btnNext).data("page", 0);
	}
	$(btnNext).data("parametro", parametro);
	var iconNext = document.createElement("span");
	$(iconNext).addClass("glyphicon glyphicon-chevron-right");
	btnNext.appendChild(iconNext);
	tdNext.appendChild(btnNext);
	tr.appendChild(tdNext);
	table.appendChild(tr);

	var div = document.getElementById(divPaginator);
	div.appendChild(table);
}

function validateEmail(email) {
	regExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	return regExp.test(email);
}

function setCargando(estado) {
	if (estado == 1) {
		$("#divCargando").addClass('active');
	} else {
		$("#divCargando").removeClass('active');
	}
}