var selectedItemId;
var selectedCustomerId;

$("#order-click").click(function (){
    generateOrderId();
    setDate();
    disableEdit();
    loadAllCustomerIds();
    loadAllItemCodes();
});

//add to cart
$("#addBtn").click(function () {
    addItemToCart();
});

$("#btnPurchase").click(function () {
    purchaseOrder();
});


$("#cmb").change(function (e) {
    selectedCustomerId = $('#cmb').find(":selected").text();
    selectedCustomer(selectedCustomerId);

});

$("#idCmb").change(function () {
    selectedItemId = $('#idCmb').find(":selected").text();
    selectedItem(selectedItemId);
});

$("#dis").keyup(function (event) {
    discountCal();

});

$("#cash1").keyup(function (event) {
    // if (event.key == "Enter") {
    let subTotal = parseInt($("#lblSubTotal").text());
    let cash = parseInt($("#cash1").val());
    let balance = cash - subTotal;
    $("#balance").val(balance);
    // }

});


/* Load Customer ID's to Combo Box - Function */
function loadAllCustomerIds() {
    $("#cmb").empty();
    let cusHint = `<option disabled selected>Select Customer ID</option>`;
    $("#cmb").append(cusHint);
    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/order?option=LOADCUSIDS",
        method: "GET",
        success: function (resp) {
            if (resp.status == 200) {
                for (const customer of resp.data) {
                    let option = `<option value="${customer.id}">${customer.id}</option>`;
                    $("#cmb").append(option);
                }
            } else {
                alert(resp.data);
            }
        }
    });

    /*  let cusHint = `<option selected>Select Customer ID</option>`;
      $("#cmb").append(cusHint);

      for (let i in customerDB) {
          let option = `<option value="${customerDB[i].getCustomerId()}">${customerDB[i].getCustomerId()}</option>`;
          $("#cmb").append(option);
      }*/

}

/* Load Item ID's to Combo Box - Function */
function loadAllItemCodes() {
    $("#idCmb").empty();
    let itemHint = `<option disabled selected>Select Item Code</option>`;
    $("#idCmb").append(itemHint);
    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/order?option=LOADITEMIDS",
        method: "GET",
        success: function (resp) {
            if (resp.status == 200) {
                for (const item of resp.data) {
                    let option = `<option value="${item.code}">${item.code}</option>`;
                    $("#idCmb").append(option);
                }
            } else {
                alert(resp.data);
            }
        }
    });


    /*  let itemHint = `<option disabled selected>Select Item ID</option>`;
      $("#idCmb").append(itemHint);

      for (let i in itemDB) {
          let option = `<option value="${itemDB[i].getItemCode()}">${itemDB[i].getItemCode()}</option>`;
          $("#idCmb").append(option);
      }*/
}


function selectedCustomer(CustomerId) {
    $.ajax({
        url: `http://localhost:8080/JavaEE_BackEnd/order?option=SELECTEDCUSDETAILS&cusId=${CustomerId}`,
        method: "GET",
        success: function (resp) {
            if (resp.status == 200) {
                for (const customer of resp.data) {
                    $("#cusName").val(customer.name);
                    $("#salary").val(customer.salary);
                    $("#address").val(customer.address);
                }
            } else {
                alert(resp.data);
            }
        }
    });
    /* for (const i in customerDB) {
         if (customerDB[i].getCustomerId() == CustomerId) {
             let element = customerDB[i];
             $("#cusName").val(element.getCustomerName());
             $("#salary").val(element.getCustomerSalary());
             $("#address").val(element.getCustomerAddress());
         }
     }*/
}

/* Load Item Data To input Fields */
function selectedItem(ItemId) {
    $.ajax({
        url: `http://localhost:8080/JavaEE_BackEnd/order?option=SELECTEDITEMDETAILS&itemCode=${ItemId}`,
        method: "GET",
        success: function (resp) {
            if (resp.status == 200) {
                for (const item of resp.data) {
                    $("#itemName").val(item.itemName);
                    $("#qtyOnHand").val(item.qtyOnHand);
                    $("#price").val(item.unitPrice);
                }
            } else {
                alert(resp.data);
            }
        }
    });
    /* for (const i in itemDB) {
         if (itemDB[i].getItemCode() == ItemId) {
             let element = itemDB[i];
             $("#itemName").val(element.getItemName());
             $("#qtyOnHand").val(element.getItemQTY());
             $("#price").val(element.getUnitPrice());
         }
     }*/
}


function disableEdit() {
    $("#OID,#cusName,#salary,#address,#iDate").css("pointer-events", "none");
    $("#itemName,#qtyOnHand,#price").css("pointer-events", "none");
    $("#balance").css("pointer-events", "none");
}

function generateOrderId() {
    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/order?option=GENERATE_OID",
        method: "GET",
        success: function (resp) {
            if (resp.status == 200) {
                $("#OID").val(resp.data.oId);
            } else {
                alert(resp.data);
            }
        }

    });
    /*let index = orderDB.length - 1;
    let id;
    let temp;
    if (index != -1) {
        id = orderDB[orderDB.length - 1].getOrderId();
        temp = id.split("-")[1];
        temp++;
    }

    if (index == -1) {
        $("#txtOrderId").val("O00-001");
    } else if (temp <= 9) {
        $("#txtOrderId").val("O00-00" + temp);
    } else if (temp <= 99) {
        $("#txtOrderId").val("O00-0" + temp);
    } else {
        $("#txtOrderId").val("O00-" + temp);
    }*/
}

function setDate() {
    let d = new Date();
    let dd = d.toISOString().split("T")[0].split("-");
    $("#iDate").val(dd[0] + "-" + dd[1] + "-" + dd[2]);
    $("#iDate").text(dd[0] + "-" + dd[1] + "-" + dd[2]);
}

var fullTotal = 0;

function addItemToCart() {
    let id = selectedItemId;
    let iName = $("#itemName").val();
    let iQtyOnHand = $("#qtyOnHand").val();
    let iPrice = $("#price").val();
    let iOrderQTY = $("#oQty").val();

    let total = 0;

    // Check Qty Availability
    if (iQtyOnHand + 1 <= iOrderQTY) {
        alert("Enter Valid QTY");
        $("#oQty").val("");
        return;
    }
    iQtyOnHand = iQtyOnHand - iOrderQTY;
    //updateing qty
    for (let i = 0; i < itemDB.length; i++) {
        if (id == itemDB[i].getItemCode()) {
            itemDB[i].setItemQTY(iQtyOnHand);
        }
    }

    let newQty = 0;
    let newTotal = 0;

    if (checkDuplicates(id) == -1) {
        total = iOrderQTY * iPrice;
        fullTotal = fullTotal + total;
        let row =
            `<tr><td>${id}</td><td>${iName}</td><td>${iPrice}</td><td>${iOrderQTY}<td>${total}</td></tr>`;
        $("#OrderTB").append(row);
        $("#lblFullTotal").text(fullTotal + " LKR");
        clearInputItems();

    } else {

        let rowNo = checkDuplicates(id);
        newQty = iOrderQTY;
        let oldQty = parseInt($($('#OrderTB>tr').eq(rowNo).children(":eq(3)")).text());
        let oldTotal = parseInt($($('#OrderTB>tr').eq(rowNo).children(":eq(4)")).text());

        fullTotal = fullTotal - oldTotal;
        newQty = parseInt(oldQty) + parseInt(newQty);
        newTotal = newQty * iPrice;
        fullTotal = fullTotal + newTotal;

        //Update row
        $('#OrderTB tr').eq(rowNo).children(":eq(3)").text(newQty);
        $('#OrderTB tr').eq(rowNo).children(":eq(4)").text(newTotal);

        $("#lblFullTotal").text(fullTotal + " LKR");
        alert("test");
        clearInputItems();
    }

}

/* Check Duplicate Item */
function checkDuplicates(itemId) {
    for (let i = 0; i < $("#OrderTB > tr").length; i++) {
        if (itemId == $('#OrderTB').children().eq(i).children().eq(0).text()) {
            alert(i);
            return i;
        }

    }
    return -1;
}

/* Clear Input Field on Selected Item Area */
function clearInputItems() {
    $("#idCmb").val("");
    $("#itemName").val("");
    $("#qtyOnHand").val("");
    $("#price").val("");
    $("#oQty").val("");
}

function discountCal() {
    /* let discount = parseInt($("#cash").val());
    let discounted_price = parseInt((fullTotal - (total * discount / 100)));
    console.log(typeof discounted_price);
    // $("#lblSubTotal").text(discounted_price +" LKR");
    $("#lblSubTotal").text(discounted_price); */
    var discount = 0;
    var discounted_price = 0;
    var tempDiscount = 0;

    discount = parseInt($("#dis").val());
    tempDiscount = 100 - discount;
    discounted_price = (tempDiscount * fullTotal) / 100;
    console.log(typeof discounted_price);
    $("#lblSubTotal").text(discounted_price + " LKR");

}


function purchaseOrder() {
    var obj = {
        order: {
            orderId: $("#OID").val(),
            customer: selectedCustomerId,
            orderDate: $("#iDate").val(),
            discount: parseInt($("#discount").val()),
            total: $("#lblFullTotal").text().split(" ")[0],
            subTotal: $("#lblSubTotal").text().split(" ")[0]
        },
        orderDetail: []
    }

    for (let i = 0; i < $('#OrderTB tr').length; i++) {

        tblItemId = $('#OrderTB').children().eq(i).children().eq(0).text();
        tblItemName = $('#OrderTB').children().eq(i).children().eq(1).text();
        tblItemPrice = $('#OrderTB').children().eq(i).children().eq(2).text();
        tblItemQty = $('#OrderTB').children().eq(i).children().eq(3).text();
        tblItemTotal = $('#OrderTB').children().eq(i).children().eq(4).text();

        var details = {
            itemCode: tblItemId,
            itemName: tblItemName,
            itemPrice: tblItemPrice,
            itemQty: tblItemQty,
            itemTotal: tblItemTotal
        }
        obj.orderDetail.push(details);

    }
    console.log(JSON.stringify(obj));

    $.ajax({
        url: "http://localhost:8080/JavaEE_BackEnd/order",
        method: "POST",
        data: JSON.stringify(obj),
        success: function (resp) {
            if (resp.status == 200) {
                generateOrderId();
                clearInputItems();
            } else {
                alert(resp.data);
            }
        }
    });

    /* let orderId = $("#oId").val();
     let customer = selectedCustomerId;
     let orderDate = $("#iDate").val();
     let discount = parseInt($("#discount").val());
     let total = $("#lblFullTotal").text();
     let subTotal = $("#lblSubTotal").text();

     var orderObj = new Orders(orderId, customer, orderDate, discount, total, subTotal);
     orderDB.push(orderObj);

     for (let i = 0; i < $('#OrderTB tr').length; i++) {

         tblItemId = $('#OrderTB').children().eq(i).children().eq(0).text();
         tblItemName = $('#OrderTB').children().eq(i).children().eq(1).text();
         tblItemPrice = $('#OrderTB').children().eq(i).children().eq(2).text();
         tblItemQty = $('#OrderTB').children().eq(i).children().eq(3).text();
         tblItemTotal = $('#OrderTB').children().eq(i).children().eq(4).text();

         var orderDetailObj = new OrderDetails(orderId, tblItemId, tblItemName, tblItemPrice, tblItemQty, tblItemTotal);
         orderDetailsDB.push(orderDetailObj);
     }*/

}