var urlservicios = "http://localhost:8984/solr/productsCore/";
var buscar = true;
var productos = new Array();
$(document).ready(function(){
	$("#addCampaign").click(function(){
		$("#txtIdCampaign").val(0);
		$("#campaignCodeLabel").html("");
		$("#divInitialDate").addClass('input-group');
		$("#divInitialDate").html("<input type='text' class='form-control datepicker' id='txtInitialDate' name='txtInitialDate' data-date-format='dd/mm/yyyy' /> <span class='input-group-addon'><span class='glyphicon glyphicon-calendar'></span></span>");
		$("#divFinalDate").addClass('input-group');
		$("#divFinalDate").html("<input type='text' class='form-control datepicker' id='txtFinalDate' name='txtFinalDate' data-date-format='dd/mm/yyyy'/> <span class='input-group-addon'><span class='glyphicon glyphicon-calendar'></span></span>");
		$("#divDescripcion").html("<textarea rows='5' class='form-control' id='txtDescripcion' name='txtDescripcion'></textarea>");
		$("#divProductos").addClass("input-group");
		$("#divProductos").html("<input type='text' data-provide='typeahead' autocomplete='off' class='form-control' id='txtProducts' name='txtProducts'/><span class='input-group-addon' id='btnAddProduct' name='btnAddProduct'><span class='glyphicon glyphicon-plus'></span></span>");

		$("#btnSaveCampaign").removeClass("btn-hide");
		$("#txtProducts").typeahead();
		$("#productsList").addClass("no-list");
		$("#productsList").html("");

		$(".datepicker").datepicker({
			autoclose: true,
			zIndexOffset: 1050
		});
	});

	$(document).on("keyup", "#txtProducts", function(){
		var texto = $(this).val();
		if (buscar && texto != "") {
			buscar = false;
			getProductsList(texto);
		}
	});

	$(document).on("click", "#btnAddProduct", function(){
		if ($("#txtProducts").val() != "") {
			var seleccion = $('#txtProducts').typeahead("getActive").name;
			var seleccionId = $('#txtProducts').typeahead("getActive").id;
			if (seleccion != null && seleccion != undefined && seleccionId != null && seleccionId != undefined) {
				$("#productsList").append("<li class='tmargin-5' id='listaProducto" + seleccionId + "'> <button class='btn-custom btn-sm btn-danger btnDeleteProduct' type='button' id='deleteProduct" + seleccionId + "' name='deleteProduct" + seleccionId + "' data-idproduct='" + seleccionId + "'><span class='glyphicon glyphicon-minus'></span></button> " + seleccion + " </li>");
				$("#txtProducts").data('typeahead').source = [];
				$("#txtProducts").val("");
				productos[seleccionId] = seleccionId;	
			}
		}
		
	});

	$(document).on("click", ".btnDeleteProduct", function(){
		var idProduct = $(this).data("idproduct");
		productos.splice(idProduct, 1);
		$("#listaProducto" + idProduct).remove();
	});
});

function getProductsList(text) {
	var parametro = "name:*" + text + "*";
	var resultado = new Array();
	var contador = 0;
	$.getJSON(urlservicios + "select?indent=on&q=" + parametro + "&wt=json&sort=id asc&rows=10&start=0", function(result){
	    var jsonResponse = JSON.parse(JSON.stringify(result));
	    if (jsonResponse.responseHeader.status == 0) {
	    	if (jsonResponse.response.numFound > 0) {
	    		jsonResponse.response.docs.forEach(function(element){
	    			resultado[contador] = {id: element.id, name: element.name};
	    			contador++;
	    		});
				$("#txtProducts").data('typeahead').source = resultado;
				$("#txtProducts").typeahead("lookup");
	    	}
	    } else {
	    	console.log("Error consultando en Solr");
	    }
	    buscar = true;
  	});
}