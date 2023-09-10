


// CRUD Operations

var baseUrl="http://localhost:8080/jpa/api/v1/item"

//Search Customer Event
$("#txtItemCode").on("keypress",function (e){
    if(e.key=="Enter"){
        searchItem();
    }
});

//save Customer Event
$("#btnItemSave").click(function (){
    saveItem();
    location.reload();
});

//update Customer Event
$("#btnItemUpdate").click(function (){
    updateItem();
    location.reload();
});

//delete Customer Event
$("#btnItemDelete").click(function (){
    deleteItem();
    location.reload();
});

$("#btnItemClear").click(function (){
    clearForm();
});

loadAllItems();

function bindClickEvents(){
    $("#itemTB>tr").click(function (){
        let code=$(this).children().eq(0).text();
        let description=$(this).children().eq(1).text();
        let qty=$(this).children().eq(2).text();
        let price=$(this).children().eq(3).text();

        $("#txtItemCode").val(code);
        $("#txtItemName").val(description);
        $("#txtItemQTY").val(qty);
        $("#txtUnitPrice").val(price);
    });
}


//save customer
function saveItem(){
    var data=$("#itemForm").serialize();
    $.ajax({
        url: baseUrl,
        method: "POST",
        data:data,
        success:function (res){
            if (resp.status == 200) {
                alert("Item saved successfully!");
                loadAllItems();
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
function searchItem(){
    var itemId= $("#txtItemCode").val();

    $.ajax({
        url: baseUrl+"/"+itemId,
        method:"GET",
        success:function (res){
            console.log(res);
            if(res.code==200){
                var item=res.data;
                $("#txtItemCode").val(item.itemCode);
                $("#txtItemName").val(item.description);
                $("#txtItemQTY").val(item.qtyOnHand);
                $("#txtUnitPrice").val(item.unitPrice);
            }else{
                clearForm();
            }
        }
    })
}

//Load all items
function loadAllItems(){
    $("itemTB").empty();
    $.ajax({
        url: baseUrl,
        method: "GET",
        success:function (resp){
            for(const item of resp.data){
                let row = `<tr><td>${item.code}</td><td>${item.description}</td><td>${item.qtyOnHand}</td><td>${item.unitPrice}</td></tr>`;
                $("#itemTB").append(row);
            }
            bindClickEvents();
        }
    })
}

//update customer
function updateItem(){
    var itemOb = {
        id: $("#txtItemCode").val(),
        name: $("#txtItemName").val(),
        address: $("#txtItemQTY").val(),
        salary: $("#txtUnitPrice").val()
    }
    $.ajax({
        url: baseUrl,
        method: "PUT", //
        contentType: "application/json",
        data: JSON.stringify(itemOb),
        success: function (resp) {
            console.log(resp);
            clearForm();
        },
        error:function (ob,errorStatus){
            console.log(ob);
        }
    })
}

//delete customer
function deleteItem(){
    let itemCode= $("#txtItemCode").val();
    $.ajax({
        url:baseUrl+"?code="+itemCode,
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
    $("#txtItemCode").val("");
    $("#txtItemName").val("");
    $("#txtItemQTY").val("");
    $("#txtUnitPrice").val("");
    $("#txtItemCode").focus();
}





































/*
//crud


$("#item-click").click(function () {
    generateItemId();
    loadAllItems();
});

$("#btnItemSave").click(function () {
    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/item",
        method: "POST",
        data: $("#itemForm").serialize(),
        success: function (resp) {
            if (resp.status == 200) {
                clearAll();
                loadAllItems();
                generateItemId();
                loadAllItemCodes();
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


    /!* saveItem();
     clearAll();
     loadAllItems();
     generateItemId();
     loadAllItemCodes();*!/

});

/!*
function saveItem() {
    let itemCode = $("#txtItemCode").val();
    let itemName = $("#txtItemName").val();
    let itemQTY = $("#txtItemQTY").val();
    let unitPrice = $("#txtUnitPrice").val();

    //create Object
    /!* var itemObject = {
         code: itemCode,
         name: itemName,
         qTY: itemQTY,
         unitPrice: unitPrice
     };
 *!/
    var itemObject = new Item(itemCode, itemName, itemQTY, unitPrice);
    itemDB.push(itemObject);
}*!/


/!*_________Update Customer___________*!/
$("#btnItemUpdate").click(function () {
    var itemOb = {
        code: $("#txtItemCode").val(),
        description: $("#txtItemName").val(),
        qtyOnHand: parseInt($("#txtItemQTY").val()),
        unitPrice: parseInt($("#txtUnitPrice").val())
    }
    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/item",
        method: "PUT", // contentType: "application/json",
        data: JSON.stringify(itemOb),
        success: function (resp) {
            if (resp.status == 200) {
                loadAllItems();
                clearAll();   //Clear Input Fields
            } else if (resp.status == 400) {
                alert(resp.data);
            }
        }
    })

    /!*
        for (var i = 0; i < itemDB.length; i++) {
            if (itemDB[i].getItemCode() == itemId) {
                itemDB[i].setItemName(itemName);
                itemDB[i].setItemQTY(itemQty);
                itemDB[i].setUnitPrice(itemPrice);
            }
        }
        loadAllItems();
        clearAll();
        generateItemId();*!/
});

/!*_________Delete Item___________*!/


$("#btnItemDelete").click(function () {
    deleteItem();
});

/!*let getClickItemData = $("#txtItemCode").val();
for (let i = 0; i < itemDB.length; i++) {
    if (itemDB[i].getItemCode() == getClickItemData) {
        itemDB.splice(i, 1);
    }
}
loadAllItems();
clearAll();
generateItemId();*!/
function deleteItem() {
    var clickedRowIId = $("#txtItemCode").val();
    $.ajax({
        url: `http://localhost:8080/JavaEE_BackEnd/item?itemCode=${clickedRowIId}`,
        method: "DELETE",
        success: function (resp) {
            if (resp.status == 200) {
                generateItemId();
                clearAll();
                loadAllItems();
                clearAll();   //Clear Input Fields
            } else if (resp.status == 400) {
                alert(resp.data);
            }
        }
    });
}

/!*_________clear button___________*!/
$("#btnItemClear").click(function () {
    clearAll();
});


function bindItem() {
    /!*_________click Item Table ___________*!/
    $("#itemTB > tr").click(function () {
        let itemCode = $(this).children(":eq(0)").text();
        let itemName = $(this).children(":eq(1)").text();
        let itemQty = $(this).children(":eq(2)").text();
        let unitPrice = $(this).children(":eq(3)").text();

        /!*_________set data for text fields__________*!/
        $("#txtItemCode").val(itemCode);
        $("#txtItemName").val(itemName);
        $("#txtItemQTY").val(itemQty);
        $("#txtUnitPrice").val(unitPrice);

    });
}

function loadAllItems() {
    $("#itemTB").empty();
    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/item?option=GETALL",
        method: "GET",
        success: function (resp) {
            for (const item of resp.data) {
                let row = `<tr><td>${item.code}</td><td>${item.description}</td><td>${item.qtyOnHand}</td><td>${item.unitPrice}</td></tr>`;
                $("#itemTB").append(row);
                bindItem();
                deleteItem();
            }
        }
    });

    /!* for (var i of itemDB) {
         let row = `<tr><td>${i.getItemCode()}</td><td>${i.getItemName()}</td><td>${i.getItemQTY()}</td><td>${i.getUnitPrice()}</td></tr>`;
         $("#itemTB").append(row);

         bindItem();
         deleteItem();
     }*!/
}

$("#btnItemSearch").click(function () {

    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/item?option=SEARCH",
        method: "GET",
        data: {
            code: $("#btnItemSearch").val()
        },
        success: function (resp) {
            if (resp.status == 200) {

                $("#itemTB").empty();
                for (const item of resp.data) {
                    let row = `<tr><td>${item.code}</td><td>${item.description}</td><td>${item.qtyOnHand}</td><td>${item.unitPrice}</td></tr>`;
                    $("#itemTB").append(row);
                    bindItem();
                    deleteItem();
                }
            } else {
                alert(resp.data);
                loadAllItems();
                clearAll();
            }
        }
    });
    /!* var searchItemCode = $("#txtSearchItemCode").val();

     var response = searchItem(searchItemCode);
     if (response) {
         $("#txtItemCode").val(response.getItemCode());
         $("#txtItemName").val(response.getItemName());
         $("#txtItemQTY").val(response.getItemQTY());
         $("#txtUnitPrice").val(response.getUnitPrice());
     } else {
         clearAll();
         alert("No Such a item");
     }*!/
});

/!*
function searchItem(id) {
    for (let i = 0; i < itemDB.length; i++) {
        if (itemDB[i].id == id) {
            return itemDB[i];
        }
    }
}*!/

function clearAll() {
    $("#txtItemCode,#txtItemName,#txtItemQTY,#txtUnitPrice,#txtSearchItemCode").val("");    // Clear input Fields (Add)
}

function generateItemId() {

    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/item?option=GENID",
        method: "GET",
        success: function (resp) {
            if (resp.status == 200) {
                $("#txtItemCode").val(resp.data.code);
            } else {
                alert(resp.data);
            }
        }
    });
    /!*  let index = itemDB.length - 1;
      let id;
      let temp;
      if (index != -1) {
          id = itemDB[itemDB.length - 1].getItemCode();
          temp = id.split("-")[1];
          temp++;
      }

      if (index == -1) {
          $("#txtItemCode").val("I00-001");
      } else if (temp <= 9) {
          $("#txtItemCode").val("I00-00" + temp);
      } else if (temp <= 99) {
          $("#txtItemCode").val("I00-0" + temp);
      } else {
          $("#txtItemCode").val("I00-" + temp);
      }*!/
}
*/
