// CRUD Operations

var baseUrl="http://localhost:8080/jpa/api/v1/customer"

//Search Customer Event
$("#txtCusID").on("keypress",function (e){
   if(e.key=="Enter"){
        searchCustomer();
   }
});

//save Customer Event
$("#btnSave").click(function (){
    saveCustomer();
    location.reload();
});

//update Customer Event
$("#btnUpdate").click(function (){
    updateCustomer();
    location.reload();
});

//delete Customer Event
$("#btnDelete").click(function (){
    deleteCustomer();
    location.reload();
});

$("#btnClear").click(function (){
    clearForm();
});

loadAllCustomers();
function bindClickEvents(){
    $("#customerTB>tr").click(function (){
        let id=$(this).children().eq(0).text();
        let name=$(this).children().eq(1).text();
        let address=$(this).children().eq(2).text();
        let salary=$(this).children().eq(3).text();

        $("#txtCusID").val(id);
        $("#txtCusName").val(name);
        $("#txtCusAddress").val(address);
        $("#txtCusSalary").val(salary);
    });
}


//save customer
function saveCustomer(){
    var data=$("#customerForm").serialize();
    $.ajax({
        url: baseUrl,
        method: "POST",
        data:data,
        success:function (res){
            if (resp.status == 200) {
                alert("Customer saved successfully!");
                loadAllCustomers();
            } else {
                alert(res.data)
            }
        },

        error: function (ob, textStatus, error) {
            console.log(ob);
            console.log(textStatus);
            console.log(error);
        }

    })
}

//search customer
function searchCustomer(){
    var customerId= $("#txtCusID").val();

    $.ajax({
        url: baseUrl+"/"+customerId,
        method:"GET",
        success:function (res){
            console.log(res);
            if(res.code==200){
                var customer=res.data;
                $("#txtCusID").val(customer.id);
                $("#txtCusName").val(customer.name);
                $("#txtCusAddress").val(customer.address);
                $("#txtCusSalary").val(customer.salary);
            }else{
                clearForm();
            }
        }
    })
}

//Load all customers
function loadAllCustomers(){
    $("customerTB").empty();
    $.ajax({
        url: baseUrl,
        method: "GET",
        success:function (resp){
            for(const customer of resp.data){
                let row = `<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.salary}</td></tr>`;
                $("#customerTB").append(row);
            }
            bindClickEvents();
        }
    })
}

//update customer
function updateCustomer(){
    var cusOb = {
        id: $("#txtCusID").val(),
        name: $("#txtCusName").val(),
        address: $("#txtCusAddress").val(),
        salary: $("#txtCusSalary").val()
    }
    $.ajax({
        url: baseUrl,
        method: "PUT", //
        contentType: "application/json",
        data: JSON.stringify(cusOb),
        success: function (resp) {
            console.log(res);
            clearForm();
        },
        error:function (ob,errorStatus){
            console.log(ob);
        }
    })
}

//delete customer
function deleteCustomer(){
    let customerId= $("#txtCusID").val();
    $.ajax({
        url:baseUrl+"?id="+customerId,
        method:"DELETE",

        success:function (res){
            console.log(res);
            clearForm();
        },
        error:function (ob,status,t){
            console.log(ob);
            console.log(status);
            console.log(t);
        }
    })
}

//clear form
function clearForm(){
    $("#txtCusID").val("");
    $("#txtCusName").val("");
    $("#txtCusAddress").val("");
    $("#txtCusSalary").val("");
    $("#txtCusID").focus();
}

/*$("#btnSave").click(function () {
    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/customer",
        method: "POST",
        data: $("#customerForm").serialize(),
        success: function (resp) {
            if (resp.status == 200) {
                clearAll();
                loadAllCustomers();
                generateId();
                loadAllCustomerIds();
            } else {
                alert(resp.data)
            }
        },
        error: function (ob, textStatus, error) {
            console.log(ob);
            console.log(textStatus);
            console.log(error);
        }
    });


});

//function saveCustomer() {

/!*let customerID = $("#txtCusID").val();
let customerName = $("#txtCusName").val();
let customerAddress = $("#txtCusAddress").val();
let customerSalary = $("#txtCusSalary").val();

//create Object
/!*  var customerObject = {
      id: customerID, name: customerName, address: customerAddress, salary: customerSalary
  };*!/
var customerObject = new Customer(customerID, customerName, customerAddress, customerSalary);

customerDB.push(customerObject);*!/

//}

$("#btnUpdate").click(function () {
    var cusOb = {
        id: $("#txtCusID").val(),
        name: $("#txtCusName").val(),
        address: $("#txtCusAddress").val(),
        salary: $("#txtCusSalary").val()
    }
    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/customer",
        method: "PUT", // contentType: "application/json",
        data: JSON.stringify(cusOb),
        success: function (resp) {
            if (resp.status == 200) {
                loadAllCustomers();
                clearAll();   //Clear Input Fields
            } else if (resp.status == 400) {
                alert(resp.data);
            }
        }
    })
    /!* for (var i = 0; i < customerDB.length; i++) {
         if (customerDB[i].getCustomerId() == customerID) {
             customerDB[i].setCustomerName(customerName);
             customerDB[i].setCustomerAddress(customerAddress);
             customerDB[i].setCustomerSalary(customerSalary);
         }

     }
     generateId();
     loadAllCustomers();*!/
});

$("#btnDelete").click(function () {
    deleteCustomer();
});

function deleteCustomer() {
    var clickedRowCId = $("#txtCusID").val();
    $.ajax({
        url: `http://localhost:8080/JavaEE_BackEnd/customer?customerID=${clickedRowCId}`,
        method: "DELETE",
        success: function (resp) {
            if (resp.status == 200) {
                generateId();
                clearAll();
                loadAllCustomers();
                clearAll();   //Clear Input Fields
            } else if (resp.status == 400) {
                alert(resp.data);
            }
        }
    });
}

/!*_________clear button___________*!/
$("#btnClear").click(function () {
    clearAll();
});


/!*_________click customer Table ___________*!/
function bindCustomer() {
    $("#customerTB > tr").click(function () {
        let customerID = $(this).children(":eq(0)").text();
        let customerName = $(this).children(":eq(1)").text();
        let customerAddress = $(this).children(":eq(2)").text();
        let customerSalary = $(this).children(":eq(3)").text();

        /!*_________set data for text fields__________*!/
        $("#txtCusID").val(customerID);
        $("#txtCusName").val(customerName);
        $("#txtCusAddress").val(customerAddress);
        $("#txtCusSalary").val(customerSalary);

    });
}

function loadAllCustomers() {

    $("#customerTB").empty();
    $.ajax({
        url: "http://localhost:8080/jpa/api/v1/customer?option=GETALL",
        method: "GET",
        success: function (resp) {
            for (const customer of resp.data) {
                let row = `<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.salary}</td></tr>`;
                $("#customerTB").append(row);

                bindCustomer();
                deleteCustomer();
            }
        }
    });
    /!* for (var i of customerDB) {
         let row = `<tr><td>${i.getCustomerId()}</td><td>${i.getCustomerName()}</td><td>${i.getCustomerAddress()}</td><td>${i.getCustomerSalary()}</td></tr>`;
         $("#customerTB").append(row);

         bindCustomer();
         deleteCustomer();

     }*!/
}

$("#btnSearch").click(function () {
    if (!$("#txtSearchCusID").val()) {
        loadAllCustomers();
        return;
    }

    // let btns = "<button class='btn btn-warning' data-bs-target='#updateCustomer' data-bs-toggle='modal'><i class='bi bi-arrow-clockwise'></i></button> <button class='btn btn-danger cus-delete'><i class='bi bi-trash'></i></button>";
    $.ajax({
        url: "http://localhost:8080/jpa/api/v1/customer?option=SEARCH", method: "GET",
        data: {
            id: $("#txtSearchCusID").val()
        }, success: function (resp) {
            if (resp.status == 200) {
                $("#customerTB").empty();
                for (const customer of resp.data) {
                    let row = `<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.salary}</td></tr>`;
                    $("#customerTB").append(row);
                    bindCustomer();
                    deleteCustomer();
                }
            } else {
                alert(resp.data);
                loadAllCustomers(); //load all customers
                clearAll();   //Clear Input Fields
            }
        }
    });

});

function clearAll() {
    $("#txtCusID,#txtCusName,#txtCusAddress,#txtCusSalary,#txtSearchCusID").val("");    // Clear input Fields (Add)
}

function generateId() {
    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/customer?option=GENID",
        method: "GET",
        success: function (resp) {
            if (resp.status == 200) {
                $("#txtCusID").val(resp.data.id);
            } else {
                alert(resp.data);
            }
        }
    });
    /!* let index = customerDB.length - 1;
     let id;
     let temp;
     if (index != -1) {
         id = customerDB[customerDB.length - 1].getCustomerId();
         temp = id.split("-")[1];
         temp++;
     }

     if (index == -1) {
         $("#txtCusID").val("C00-001");
     } else if (temp <= 9) {
         $("#txtCusID").val("C00-00" + temp);
     } else if (temp <= 99) {
         $("#txtCusID").val("C00-0" + temp);
     } else {
         $("#txtCusID").val("C00-" + temp);
     }*!/
}

//Validations

//validation started
// customer regular expressions
const cusIDRegEx = /^(C00-)[0-9]{1,3}$/;
const cusNameRegEx = /^[A-z ]{5,20}$/;
const cusAddressRegEx = /^[0-9/A-z. ,]{7,}$/;
const cusSalaryRegEx = /^[0-9]{1,}[.]?[0-9]{1,2}$/;


$('#txtCusID,#txtCusName,#txtCusAddress,#txtCusSalary').on('keydown', function (eventOb) {
    if (eventOb.key == "Tab") {
        eventOb.preventDefault(); // stop execution of the button
    }
});

$('#txtCusID,#txtCusName,#txtCusAddress,#txtCusSalary').on('blur', function () {
    formValid();
});

//focusing events
$("#txtCusID").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }

    if (eventOb.key == "Control") {
        var typedCustomerID = $("#txtCusID").val();
        var srcCustomer = searchCustomerFromID(typedCustomerID);
        $("#txtCusID").val(srcCustomer.getCustomerID());
        $("#txtCusName").val(srcCustomer.getCustomerName());
        $("#txtCusAddress").val(srcCustomer.getCustomerAddress());
        $("#txtCusSalary").val(srcCustomer.getCustomerSalary());
    }


});

$("#txtCusName").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }
});

$("#txtCusAddress").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }
});

$("#txtCusSalary").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }
});
// focusing events end
$("#btnCustomer").attr('disabled', true);

function clearAll() {
    $('#txtCusID,#txtCusName,#txtCusAddress,#txtCusSalary').val("");
    $('#txtCusID,#txtCusName,#txtCusAddress,#txtCusSalary').css('border', '2px solid #ced4da');
    $('#txtCusID').focus();
    $("#btnCustomer").attr('disabled', true);
    loadAllCustomers();
    $("#lblcusid,#lblcusname,#lblcusaddress,#lblcussalary").text("");
}

function formValid() {
    var cusID = $("#txtCusID").val();
    $("#txtCusID").css('border', '2px solid green');
    $("#lblcusid").text("");
    if (cusIDRegEx.test(cusID)) {
        var cusName = $("#txtCusName").val();
        if (cusNameRegEx.test(cusName)) {
            $("#txtCusName").css('border', '2px solid green');
            $("#lblcusname").text("");
            var cusAddress = $("#txtCusAddress").val();
            if (cusAddressRegEx.test(cusAddress)) {
                var cusSalary = $("#txtCusSalary").val();
                var resp = cusSalaryRegEx.test(cusSalary);
                $("#txtCusAddress").css('border', '2px solid green');
                $("#lblcusaddress").text("");
                if (resp) {
                    $("#txtCusSalary").css('border', '2px solid green');
                    $("#lblcussalary").text("");
                    return true;
                } else {
                    $("#txtCusSalary").css('border', '2px solid red');
                    $("#lblcussalary").text("Cus Salary is a required field : Pattern 100.00 or 100");
                    return false;
                }
            } else {
                $("#txtCusAddress").css('border', '2px solid red');
                $("#lblcusaddress").text("Cus Name is a required field : Mimum 7");
                return false;
            }
        } else {
            $("#txtCusName").css('border', '2px solid red');
            $("#lblcusname").text("Cus Name is a required field : Mimimum 5, Max 20, Spaces Allowed");
            return false;
        }
    } else {
        $("#txtCusID").css('border', '2px solid red');
        $("#lblcusid").text("Cus ID is a required field : Pattern C00-000");
        return false;
    }
}

function checkIfValid() {
    var cusID = $("#txtCusID").val();
    if (cusIDRegEx.test(cusID)) {
        $("#txtCusName").focus();
        var cusName = $("#txtCusName").val();
        if (cusNameRegEx.test(cusName)) {
            $("#txtCusAddress").focus();
            var cusAddress = $("#txtCusAddress").val();
            if (cusAddressRegEx.test(cusAddress)) {
                $("#txtCusSalary").focus();
                var cusSalary = $("#txtCusSalary").val();
                var resp = cusSalaryRegEx.test(cusSalary);
                if (resp) {
                    let res = confirm("Do you really need to add this Customer..?");
                    if (res) {
                        saveCustomer();
                        clearAll();
                    }
                } else {
                    $("#txtCusSalary").focus();
                }
            } else {
                $("#txtCusAddress").focus();
            }
        } else {
            $("#txtCusName").focus();
        }
    } else {
        $("#txtCusID").focus();
    }
}

function setButton() {
    let b = formValid();
    if (b) {
        $("#btnCustomer").attr('disabled', false);
    } else {
        $("#btnCustomer").attr('disabled', true);
    }
}

$('#btnCustomer').click(function () {
    checkIfValid();
});
//validation ended*/

