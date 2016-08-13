var app = app || {};
(function(app) {

  var vm = this; 

    var obj = {
        _listPath: "../json/cart.json",
    };


    vm.getList = function(url) {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                obj.products = JSON.parse(xhttp.responseText);
                if (obj.products) {
                    createView(obj.products);
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }


    vm.createView = function(products) {

        var list = [];
        var nodes = document.querySelectorAll(".list");
        removeNodes(nodes);
        for (var j = 0; j < products.productsInCart.length; j++) {
            var product = products.productsInCart[j];
            var z = document.createElement('li');
            z.className = "list";
            z.innerHTML = '<div class="col-lg-12">' +
                '<div class="row">' +
                '<div class="col-lg-3 col-md-3 col-sm-4 col-xs-6">' +
                '<img src="' + product.p_imagePath + '" alt="">' +
                ' </div>' +
                '<div class="col-lg-9 col-md-9 col-sm-8 col-xs-6">' +
                ' <div class="col-6 col-md-6 col-sm-6 col-xs-12 productInfo">' +
                '<h3>' +
                '<span class="h1-child1">' + product.p_variation + '</span> &nbsp;' +
                '<span class="h1-child2">' + product.p_name + '</span>' +
                '</h3>' +
                '<div class="stylecode">' +
                '<span>style#:' + product.p_style + '</span>' +
                '</div>' +
                '<div class="colorCode">' +
                '<span>color:' + product.p_selected_color.name + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 size">' +
                '<span class="visible-xs">size</span>' +
                '<span>' + product.p_selected_size.code + '</span>' +
                '</div>' +
                '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 qty">' +
                '<span class="visible-xs text-qty">QTY</span><span class="qty-in-list">' + product.p_quantity + '</span>' +
                '</div>' +
                '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 price">' +
                '<span>' + product.c_currency + product.p_price + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="col-lg-9 col-md-9 col-sm-9 col-xs-12 operation">' +
                '<a href="#!" class="edit" data-toggle="modal" data-target="#myModal" onclick="javascript:edit(' + product.p_id  + ')">Edit</a>|' +
                '<a href="#!" class="remove"  onclick="javascript:removeItem(' + product.p_id + ', true)"> X Remove</a>|' +
                '<a href="#!" class="save">Save for later</a>' +
                '</div>' +
                '</div></div>';
            document.getElementById("myList").appendChild(z);
        }
        grandTotal(products);
        coupans(products);
        updateCount(products);
        if (products.productsInCart.length == 0) {
            var emptyMsg = document.querySelector(".empty-cart"),
                billSection = document.querySelector(".help-section");
                emptyMsg.classList.add("show");
                billSection.classList.add("hide");
        }

    }

    vm.updateCount = function(products){   
       var itemCount = document.createElement('span');
           itemCount.innerHTML = products.productsInCart.length + ' ITEMS';
           document.querySelector(".itemCount").innerHTML="";
           document.querySelector(".itemCount").appendChild(itemCount);
    }

    vm.removeNodes = function(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].remove();
        }
    }

    vm.updateProduct = function(){
      
      var edit_color = document.querySelector('input[name="color"]:checked').value.split(","),
          edit_size =  document.querySelector('.editblock-size').value.split(","),
          edit_qty =  document.querySelector('.editblock-qty').value.split(",");
          var currentList = [];
              currentList.push(obj.products.productsInCart);
              var newList = currentList[0].filter(updateCurrentItem);

              function updateCurrentItem(cobj){
                
                if(cobj.p_id == obj.current_p_id){
                    cobj.p_selected_size.code = edit_size[0];
                    cobj.p_selected_size.name = edit_size[1];
                    cobj.p_quantity = edit_qty[0];
                    cobj.p_selected_color.name = edit_color[0];
                    cobj.p_selected_color.hexcode = edit_color[1];
                    return true;
                }else{
                   return true;
                }
              }
              var updatedList = [];
                  updatedList.productsInCart = {}
                  updatedList.productsInCart = newList;
                  
                  obj.products = updatedList;
                  console.log(obj.products);
                  createView(updatedList);
                  close();
    }

    vm.discountPrice = function(products, subTotal){
      var dPrice = 0;
        for(var i in products) {
           if(products.length == 3){
                 dPrice = subTotal *(5/100);
           }else if(products.length >3 && products.length<=6){
                  dPrice = subTotal *(10/100);
           }else if(products.length >10){
                   dPrice = subTotal *(25/100);
           }  
        }
        if(products.length>=3)
        document.querySelector(".coupan-price").innerHTML = '$'+ Math.round(dPrice * 100) / 100;
        return dPrice;
    }

    vm.grandTotal = function(products) {
        var subTotal = 0;
        for (var i in products.productsInCart) {
            subTotal = subTotal + products.productsInCart[i].p_quantity * products.productsInCart[i].p_price;
        }
        document.querySelector(".subtotal-price").innerHTML = "$" + subTotal;
        var dPrice = discountPrice(products.productsInCart, subTotal),
            estimatedTotal = subTotal - dPrice;
            document.querySelector('.estimated_total').innerHTML = '$'+estimatedTotal;
    }

    vm.coupans = function(products) {
      var products = products.productsInCart;
        if(products.length == 3){
           document.querySelector(".coupan-info").innerHTML="PROMOTION CODE JF5 APPLIED";
        } else if(products.length >3 && products.length<=6){
           document.querySelector(".coupan-info").innerHTML="PROMOTION CODE JF10 APPLIED";     
        }else if(products.length >10){
             document.querySelector(".coupan-info").innerHTML="PROMOTION CODE JF25 APPLIED";   
        }else{
           if(document.querySelector(".coupan-info")){
             document.querySelector(".coupan-info").remove();
             document.querySelector(".coupan-price").remove();
           }
        }
                                             
    }

    vm.removeItem = function(pid) {
        var currentList = [];
        currentList.push(obj.products.productsInCart);

        var newList = currentList[0].filter(filterByPID);

        function filterByPID(obj) {
            if (obj.p_id != pid) {
                return true;
            } else {
                return false;
            }
        }

        var updatedList = [];
        updatedList.productsInCart = {}
        updatedList.productsInCart = newList;
        obj.products = updatedList;
        createView(updatedList);
    }

    function close(){
      var modal = document.getElementById("myModal"),
            bg = document.querySelector(".modal-backdrop");
        //close moal
         modal.classList.remove("in");
         modal.style.display="none";

         bg.classList.remove("in")
         bg.classList.add("out");
         bg.style.display= "none";
    }

    vm.edit = function(product) {
      //open modal
        var modal = document.getElementById("myModal"),
            bg = document.querySelector(".modal-backdrop"),
            modal = document.querySelector(".modal");
            modal.classList.add("in");
            modal.style.display="block";
            document.querySelector(".close").onclick=close;
            //modal.onclick=close;
            //background style
             bg.classList.remove("out");
             bg.classList.add("in");
             bg.style.display= "block";
             //update edit modal
             updateModal(product);
             obj.current_p_id = product;
          

    }
    
    vm.updateModal = function(product_id){
      var currentList = [],
          editblock_image = document.querySelector('.editblock-image'),
          editblock_name = document.querySelector('.editblock-name'),
          editblock_size = document.querySelector('.editblock-size'),
          editblock_qty = document.querySelector('.editblock-qty'),
          editblock_color = document.querySelector('.editblock-colors');
          currentList.push(obj.products.productsInCart);

        var product = currentList[0].filter(currentproduct),
            edit_size = createOption(product[0].p_available_options.sizes, product[0].p_selected_size.code);
            edit_qty = createOption(product[0].p_available_options.quantity, product[0].p_quantity);
            edit_color = createRadio(product[0].p_available_options.colors, product[0].p_selected_color.name);

            editblock_image.setAttribute("src", product[0].p_imagePath);
            editblock_name.innerHTML = product[0].p_name;
            editblock_size.innerHTML = edit_size;
            editblock_qty.innerHTML = edit_qty;
            editblock_color.innerHTML = edit_color;

            function currentproduct(obj){
              if(obj.p_id == product_id){
                return true;
              }else{
                return false;
              }
            }
            function createOption(product, selectedOne){
              var options = "<option value=''>Size</option>";                
                
              for(var i in product){
                if(product[i].code==selectedOne){
                   options += "<option value='"+product[i].code+","+product[i].name+"' selected>"+product[i].name+"</option>";
                }else{  
                   options += "<option value='"+product[i].code+","+product[i].name+"'>"+product[i].name+"</option>";
                
                }
               }
              
              return options;
            }

            function createRadio(product, selectedOne){
              var radio="";                
                
              for(var i in product){
                if(product[i].name==selectedOne){
                   radio += "<span style='background:"+product[i].hexcode +"'><input type='radio' name='color' value='"+product[i].name+","+ product[i].hexcode+"' checked='checked'/ ></span>";
                }else{
                   radio += "<span style='background:"+product[i].hexcode +"'><input type='radio' name='color' value='"+product[i].name+","+ product[i].hexcode+"'/ ></span>";
                }
               }
              
              return radio;
            }
      

    }

    vm.save = function() {
        createView("Not implemented");
    }

    app.init = function() {
        getList(obj._listPath);
    }
})(app)

app.init();
