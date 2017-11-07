var urlservicio = "http://localhost:8081/DataServiceWeb/service/Customer/";

$(document).ready(function(){
	$("#findClient").click(function(){
		alert("Buscar");
	});

	$("#addClient").click(function(){
		$("#btnGuardarCliente").removeClass("btn-hide");
		$("#txtIdCustomer").val(0);
		$("#customerCodeLabel").html("");
		$("#divName").html("<input type='text' class='form-control' id='txtName' name='txtName'/>");
		$("#divLastName").html("<input type='text' class='form-control' id='txtLastName' name='txtLastName'/>");
		$("#divIdentificacion").html("<input type='text' class='form-control' id='txtIdentification' name='txtIdentification'/>");
		$("#divEmail").html("<input type='email' class='form-control' id='txtEmail' name='txtEmail'/>");
		$("#divPhoneNumber").html("<input type='text' class='form-control' id='txtPhoneNumber' name='txtPhoneNumber'/>");
		$("#divStatus").html("<select class='form-control' id='cmbStatus' name='cmbStatus'><option value='1'>Activo</option><option value='2'>Inactivo</option></select>");
		$("#divCustomerType").html("<select class='form-control' id='cmbCustomerType' name='cmbCustomerType'><option value='2'>Platino</option><option value='3'>Dorado</option><option value='4'>Plateado</option></select>");
	});

	$(document).on("click", "#btnGuardarCliente", function(){
		var id = $("#txtIdCustomer").val();
		var name = $("#txtName").val().toString();
		var lastname = $("#txtLastName").val().toString();
		var identificacion = $("#txtIdentification").val();
		var email = $("#txtEmail").val().toString();
		var phonenumber = $("#txtPhoneNumber").val().toString();
		var status = $("#cmbStatus").val();
		var customertype = $("#cmbCustomerType").val();

		if (name == "" || lastname == "" || identificacion == "" || email == "" || phonenumber == "") {
			alert("Todos los campos deben diligenciarse");
		} else {
			if (!validateEmail(email)) {
				alert("Valida el correo electronico que ingresaste");
			} else {
				setCargando(1);
				$.ajax({
					url: urlservicio,
					headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
					method: "post",
					dataType: "json",
					data: '{"name": "' + name + '", "lastName": "' + lastname + '", "email": "' + email + '", "phoneNumber": "' + phonenumber + '", "login": "' + email + '", "password": "' + identificacion + '", "status": {"idStatus": ' + status + '}, "rol": {"idRol": 1}, "customerType": {"idCustomerType": ' + customertype + '}}',
					success: function(response){
						setCargando(0);
						console.log("exito");
					}, 
					error: function(error){
						setCargando(0);
						console.log("Ocurrio un error al conectarse con el servidor: " + error.responseText);
					}
				});
			}
		}
	});
});