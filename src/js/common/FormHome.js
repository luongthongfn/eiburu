//contact-form
// import { numberFormat} from '../helper/helper.js';

$(function () {
    var Postal_code = require('japan-postal-code'),
        code, addressResponse,
        Prefecture = $('#prefecture'),
        Address = $('#address');

    $("#contact--form").validate({
        focusInvalid: true,
        ignore: '',
        rules: {
            //key is name of input
            name: "required",
            phone: {
                required: true,
                number: true
            },
            email: {
                required: true,
                email: true,
                maxlength: 255
            },
            re_email: {
                required: true,
                equalTo: "#email"
            },
            question: {
                required: true,
                minlength: 2
            }
        },
        errorPlacement: function (error, element) {
            return;
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("has-error");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass("has-error")
        },
    });
    //get address from postal-code
    $('.get-zipcode').click(function (e) {
        e.preventDefault();
        code = $('#zipcode').val(),
            Postal_code.get(code, function (address) {
                // console.log(address)
                addressResponse = address.prefecture + ', ' + address.city + ', ' + address.street;
                addressResponse = addressResponse.replace(/,\s*$/, ""); // remove last comma
                Address.val(addressResponse);
            });
    })
})