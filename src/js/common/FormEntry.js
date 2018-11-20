// select date 
$(function () {
    if ($('#js-select-date').length) {
        var Year = $('#year'),
            Month = $('#month'),
            Day = $('#day'),
            daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            thisYear = new Date().getFullYear();
        // $(document).click(function(){
        // alert(thisYear);
        // })
        var reCruitFrom = thisYear - 60,
            reCruitTo = thisYear - 20,
            listYear = [],
            isLeapYear = function (year) {
                return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
            },
            appendOption = function (elm, value) {
                var value = value || '';
                elm.append(`<option value="${value}" >${value}</option>`);
            },
            changeMonth = function () {
                var yealVal = Year.val(),
                    monthVal = Month.val(),
                    dayVal = Day.val(),
                    totalDay;

                if (monthVal == 2) {
                    isLeapYear(yealVal) ? daysInMonth[1] = 29 : daysInMonth[1] = 28;
                }
                totalDay = daysInMonth[monthVal - 1];

                if (!monthVal) {
                    return;
                } else {
                    //selected < days in month
                    var lastOptionVal = Day.find('option').last().val();
                    if (lastOptionVal < totalDay) {
                        while (lastOptionVal < totalDay) {
                            appendOption(Day, ++lastOptionVal)
                        }
                    } else if (lastOptionVal > totalDay) {
                        while (lastOptionVal > totalDay) {
                            Day.find('option').last().remove();
                            lastOptionVal--;
                        }
                    }
                    return;
                }
            },
            testSelectDate = function () {
                $('body').append('<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>');
                setTimeout(() => {
                    var yealVal = Year.val(),
                        monthVal = Month.val(),
                        dayVal = Day.val(),
                        date = moment(`${dayVal}.${monthVal}.${yealVal}`, 'DD.MM.YYYY');
                    console.log('test select :', date.isValid());
                }, 500);
            };

        for (var i = reCruitFrom; i <= reCruitTo; i++) {
            listYear.push(i);
        }


        //init render:
        Year.empty();
        Month.empty();
        Day.empty();
        //-render year
        appendOption(Year);
        listYear.forEach(function (item, index) {
            //render year
            appendOption(Year, item);
        })

        //-render month
        appendOption(Month);
        for (let i = 1; i <= 12; i++) {
            appendOption(Month, i)
        }

        //-render day
        appendOption(Day);
        for (let i = 1; i <= 31; i++) {
            appendOption(Day, i)
        }

        //handle
        Year.on('change', changeMonth);
        Month.on('change', changeMonth);

        //test
        // $('#year, #month, #day').on('change', testSelectDate);

    }
})
//recruit-form
$(function () {
    var Postal_code = require('japan-postal-code'),
        code,
        code1 = $('#first3'),
        code2 = $('#last4'),
        Prefecture = $('#prefecture'),
        City = $('#city'),
        // area = $('#area'),
        // listPrefecture = ['愛知県', '秋田県', '青森県', '千葉県', '愛媛県', '福井県', '福岡県', '福島県', '岐阜県', '群馬県', '広島県', '北海道', '兵庫県', '茨城県', '石川県', '岩手県', '香川県', '鹿児島県', '神奈川県', '高知県', '熊本県', '京都府', '三重県', '宮城県', '宮崎県', '長野県', '長崎県', '奈良県', '新潟県', '大分県', '岡山県', '沖縄県', '大阪府', '佐賀県', '埼玉県', '滋賀県', '島根県', '静岡県', '栃木県', '徳島県', '東京都', '鳥取県', '富山県', '和歌山県', '山形県', '山口県', '山梨県'],
        listPrefecture = ['北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島', '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川', '新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山', '鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知', '福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄'],

        $job, $name, $name_kata, $birthday, $gender, $email, $phone, $zipCode, $pref, $city, $addr;

    function setPreview() {
        function getVal(name) {
            return $(`input[name="${name}"]`).val();
        }

        function setText(id, text) {
            $(`#preview-${id}`).text(`${text}`);
            // console.log(id, " : ", text);
        };

        //re turn number like: 123-1234-1234
        function numberFormat(number, slice, sepatate) {
            var arr = [],
                temp = number.split('').reverse();
            temp.forEach(function (el, i) {
                (i + 1) % slice == 0 && i != 0 ? arr.push(el) && arr.push(sepatate) : arr.push(el)
            })
            return arr.reverse().join('');
        }

        $job = getVal('job');
        $name = getVal('firstname_kanji') + " " + getVal('lastname_kanji');
        $name_kata = getVal('firstname_kata') + " " + getVal('lastname_kata');
        $gender = $('input[name="gender"]:checked').val();
        $birthday = $('#year').val() + "年" + $('#month').val() + "月" + $('#day').val() + "日";
        $email = getVal('email');
        $phone = getVal('phone');
        $phone = numberFormat(($phone), 4, '-');
        $zipCode = getVal('first3') + getVal('last4');
        $zipCode = numberFormat(($zipCode), 4, '-');
        $pref = Prefecture.val();
        $city = getVal('city');
        $addr = getVal('address');


        ['job', 'name', 'name_kata', 'birthday', 'gender', 'email', 'phone', 'zipCode', 'pref', 'city', 'addr']
        .forEach(item => setText(item, eval(`$${item}`)))
    }


    function goStep(nth, e) {
        // var pos = $('.js-tabnav').offset().top;
        var pos = 0;
        $('html, body').scrollTop(pos);
        e && e.preventDefault ? e.preventDefault() : '';

        var targetHref = `.tab${nth}`;
        var targetHrefHash = `#tab${nth}`;
        var target = $(targetHref);
        target.siblings().removeClass('in');
        setTimeout(function () {
            target.siblings().removeClass('active');
        }, 100);
        setTimeout(function () {
            target.addClass('active');
            target.addClass('in');
        }, 100);

        // $(`a[href='${target}']`).trigger('click');
        var nav = $('.js-tabnav');
        $(nav).find('.active').removeClass('active');
        nav.find(`a[href="${targetHrefHash}"]`).parent().addClass('active')
    }

    if (Prefecture.find('option').length < 47) {
        listPrefecture.map(function (item) {
            Prefecture.append(`<option value="${item}">${item}</option>`);
        });
    }

    jQuery.validator.addMethod("fullWidthJpnChar", function (value, element) {
        return this.optional(element) || /^[ぁ-ん一-龥]+$/.test(value);
    }, 'full width required');
    jQuery.validator.addMethod("kataFullWidth", function (value, element) {
        return this.optional(element) || /^[ァ-ン]+$/.test(value);
    }, 'kata required');
    $("#recruit-form").validate({
        focusInvalid: false,
        ignore: '#first3, #last4',
        rules: {
            //key is name of input
            job: "required",
            firstname_kanji: {
                required: true,
                fullWidthJpnChar: true
            },
            lastname_kanji: {
                required: true,
                fullWidthJpnChar: true
            },
            firstname_kata: {
                required: true,
                kataFullWidth: true
            },
            lastname_kata: {
                required: true,
                kataFullWidth: true
            },
            year: "required",
            month: "required",
            day: "required",
            gender: "required",
            email: {
                required: true,
                email: true,
                maxlength: 255
            },
            re_email: {
                required: true,
                equalTo: "#email"
            },
            phone: {
                required: true,
                number: true
            },
            prefecture: "required",
            city: "required",
            address: "required"
        },
        messages: {},
        errorElement: "span",
        errorContainer: '.notice-error',
        errorPlacement: function (error, element) {},
        highlight: function (element, errorClass, validClass) {
            if ($(element).prop("type") === "radio") {
                $(element).parent().parent().addClass("has-error");
            }
            $(element).addClass("has-error");
        },
        unhighlight: function (element, errorClass, validClass) {
            if ($(element).prop("type") === "radio") {
                $(element).parent().parent().removeClass("has-error");
            } else {
                $(element).removeClass("has-error")
            }
        },
        submitHandler: function () {
            // console.log('is validated');

            $('#recruit-form-submit .fa.form-check').addClass('fa-spinner fa-spin');
            $.ajax({
                url: window.location.href.replace(window.location.href.split("/").slice(-2).join('/'), "") + "gmail.php", //get parent's folder
                method: 'POST',
                data: {
                    recruit_form: true,
                    $job,
                    $name,
                    $name_kata,
                    $gender,
                    $birthday,
                    $email,
                    $phone,
                    $zipCode,
                    $pref,
                    $city,
                    $addr
                },
                success: function (res) {

                    $('#recruit-form-submit .fa').removeClass('fa-spinner fa-spin');
                    $('.contact-thanks p').html('後ほど担当者よりご連絡を <br class="show-sp"/> 差し上げますので <br/> しばらくお待ちください');
                    document.getElementById("recruit-form").reset();
                    goStep(3)
                },
                error: function (xhr, status, err) {
                    $('#recruit-form-submit .fa').removeClass('fa-spinner fa-spin');
                    $('.contact-thanks p').html('something wrong!');
                    goStep(3)
                    // console.log(xhr, status, err);
                }
            })
            return false;
        }
    });

    //handle event--------------------------

    //get address from postal-code
    $('.js-find-addr').click(function (e) {
        e.preventDefault();
        code = code1.val() + code2.val();

        Postal_code.get(code, function (address) {
            // console.log(address)
            address.prefecture = address.prefecture.replace('県', '');
            if (Prefecture.find(`option[value="${address.prefecture}"]`)) {
                Prefecture.find(`option[value="${address.prefecture}"]`).prop('selected', true);
            } else {
                Prefecture.append(`<option value="${address.prefecture}" selected >${address.prefecture}</option>`)
            }
            City.val(address.city + " " + address.area + " " + address.street);
        });
    })
    // prevent paste 
    $('#re_email').on("cut copy paste", function (e) {
        e.preventDefault();
    });
    //step nav
    $('.step-nav').on('click', "a:not(.link)", function (e) {
        var href = $(this).attr('href');
        var nth = href.replace('#tab', '');
        goStep(nth, e)
    })
    $('#firstsubmit').click(function (e) {
        if ($("#recruit-form").valid()) {
            setPreview();
            goStep(2, e);
        }
    })
    $('#first3').on('keyup', function (e) {
        if ($(this).val().length >= 3) {
            $('#last4').trigger('select')
        }
    })
    $('#last4').on('keyup', function (e) {
        this.value = this.value.split('').slice(0, 4).join('');
    })

})