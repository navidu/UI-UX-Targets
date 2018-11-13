var client = (function($){
    var currentTab = 0, map = {};

    $( document ).ready(function() {
        $('button#upload').on('click', function () {
            var form = $(this).parent('form');
            var formdata = false;
            if (window.FormData) {
                formdata = new FormData(form[0]);
            }

            $.ajax({
                url: '/upload',
                data: formdata ? formdata : form.serialize(),
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (data) {
                    var html = '', element = $('div[rel="level' + currentTab + '"]');

                    data.forEach(function(fileName){
                        if(currentTab === 0) {
                            html +=
                                '<div class="code-block" rel="field" data-value="' + fileName + '">' +
                                '<label>$' + fileName + ': </label>' +
                                '<select rel="field-value">' +
                                '<option value="1">Hex</option>' +
                                '<option value="2">RGB</option>' +
                                '<option value="3">Gradiant</option>' +
                                '<option value="4">Url</option>' +
                                '</select>' +
                                '<input data-ctrl="color" rel="1" type="text" style="display: none" class="form-control demo">' +
                                '<input data-ctrl="color" rel="2" type="text" style="display: none" class="form-control demo">' +
                                '<div data-ctrl="color" rel="3" data-value="' + fileName + '" style="display: none">' +
                                    '<input data-ctrl="gradient" type="radio" checked="checked" rel="' + fileName + '-linear-gradient" name="' + fileName + 'gradient"> Linear ' +
                                    '<input data-ctrl="gradient" type="radio" rel="' + fileName + '-radial-gradient" name="' + fileName + 'gradient"> Radial ' +
                                    '<div data-ctrl="gradient-type" rel="' + fileName + '-linear-gradient" style="display: none;"></div>'+
                                    '<div data-ctrl="gradient-type" rel="' + fileName + '-radial-gradient" style="display: none;"></div>'+
                                    '<input rel="gradientValue" type="text">'+
                                    //'<div class="ra-btn">' +
                                    //    '<input data-ctrl="gradient" type="radio" checked="checked" rel="linear" name="gradient"> Linear ' +
                                    //    '<input data-ctrl="gradient" type="radio" rel="radial" name="gradient"> Radial ' +
                                    //'</div>' +
                                    //'<div data-ctrl="gradient-type" class="grad_ex" rel="linear" style="display: none"><input type="text" class="details" placeholder="0"></div>' +
                                    //'<div data-ctrl="gradient-type" class="grad_ex" rel="radial" style="display: none"></div>' +
                                '</div>'+
                                '<input data-ctrl="color" rel="4" type="text" style="display: none"/>' +
                                '</div>';
                        }else{
                            html += '<div class="code-block" rel="field" data-value="' + fileName + '">' +
                                '<label>$' + fileName + ' :</label>' +
                                '<select>';
                            for(var scssVar in map[currentTab - 1]){
                                if(map[currentTab - 1].hasOwnProperty(scssVar)){
                                    html += '<option value="' + scssVar + '">' + scssVar + '</option>';
                                }
                            }
                            html += '</select>;</div>';
                        }
                    });

                    element.html(html);

                    if(currentTab === 0) {
                        
                        element.find('input[rel="1"]').minicolors({
                            control: 'hue',
                            defaultValue: '#ff6161',
                            format: 'hex',
                            opacity: false,
                            position: 'bottom left',
                            theme: 'default'
                        });

                        element.find('input[rel="2"]').minicolors({
                            control: 'rgb',
                            defaultValue: 'rgba(52, 64, 158, 0.5)',
                            format: 'rgb',
                            opacity: true,
                            position: 'bottom left',
                            theme: 'default'
                        });

                        $.each(element.find('div[rel="3"]'), function(i, v){
                            var val = $(v).attr('data-value');
                            var lgp = new Grapick({el: $(v).find('div[rel="' + val + '-linear-gradient"]')[0]});

                            // Handlers are color stops
                            lgp.addHandler(0, 'red');
                            lgp.addHandler(100, 'blue');

                            // Do stuff on change of the gradient
                            lgp.on('change', function () {
                                $(v).find('input[rel="gradientValue"]').val(lgp.getValue());
                            });

                            var rgp = new Grapick({el: $(v).find('div[rel="' + val + '-radial-gradient"]')[0], type: 'radial'});

                            // Handlers are color stops
                            rgp.addHandler(0, 'red');
                            rgp.addHandler(100, 'blue');

                            // Do stuff on change of the gradient
                            rgp.on('change', function () {
                                $(v).find('input[rel="gradientValue"]').val(rgp.getValue());
                            });
                        });

                        element.find('input[data-ctrl="gradient"]').on('click', function(){
                            $(this).parent('div').find('div[data-ctrl="gradient-type"]').hide();
                            element.find('div[rel="' + $(this).attr('rel') + '"]').show();
                        });

                        //element.find('div[rel="linear"]').gradientPicker({
                        //    change: function(points, styles) {
                        //        for (var i = 0; i < styles.length; ++i) {
                        //            element.find('div[rel="linear"]').css("background-image", styles[i]);
                        //        }
                        //    },
                        //    fillDirection: "45deg",
                        //    controlPoints: ["green 0%", "yellow 50%", "green 100%"]
                        //});
                        //
                        //element.find('div[rel="radial"]').gradientPicker({
                        //    type: "radial",
                        //    change: function(points, styles) {
                        //        for (var i = 0; i < styles.length; ++i) {
                        //            element.find('div[rel="radial"]').css("background-image", styles[i]);
                        //        }
                        //    },
                        //    controlPoints: ["blue 0%", "yellow 100%"]
                        //});

                        element.find('select[rel="field-value"]').on('change', function () {
                            var e = $(this), val = e.val(), selected = e.parent('div[rel="field"]').find('[rel="' + val + '"]');
                            e.parent('div[rel="field"]').find('[data-ctrl="color"]').hide();
                            e.parent('div[rel="field"]').find('div.minicolors').hide();
                            selected.show();
                            switch (val) {
                                case '1':
                                    selected.parent('div.minicolors').show();
                                    break;
                                case '2':
                                    selected.parent('div.minicolors').show();
                                    break;
                                case '3':
                                    selected.find('input[data-ctrl="gradient"]').trigger('click');
                                    break;
                                default:
                                    //e.parent('div').find('input[rel="' + val + '"').show();
                                    break;
                            }
                        });

                        _showHideButtons(true);
                        element.find('select[rel="field-value"]').trigger('change');
                    }
                }
            });
        });

        $('button[rel="next"]').on('click', function(){
            _onNext();
        });

        $('button[rel="copy"]').on('click', function(){
            //var copyText = $('div[rel="level2"]').text()
            //console.log(copyText);
            //copyText.select();
            //document.execCommand("copy");
            //alert("Copied the text: " + copyText.value);

            var copySCSS = $("<textarea>");
            $("body").append(copySCSS);
            copySCSS.val($('div[rel="level2"]').text().replace(/;/g, ';\n').replace(/----------------------/g, '---------------------\n')).select();
            //copySCSS.val($('div[rel="level2"]').text().replace(/----------------------/g, '----------------------\n')).select();
            //var result = copySCSS.replace(/\;/g,';<br/>');
            document.execCommand("copy");
            copySCSS.remove();
            //alert("Copied the text: " + copySCSS.val);
        });

        $('button[rel="generate"]').on('click', function(){
            _onNext();

            var html = '';
            for(var level in map){
                if(map.hasOwnProperty(level)){
                    var l = parseInt(level, 10);
                    html += '<div class="code-block"><span>//--------------------- Level ' + (l + 1) + ' ---------------------- </span></div>';
                    for(var scssVar in map[level]){
                        if(map[level].hasOwnProperty(scssVar)){
                            html += '<div class="code-block">' +
                                '<span>$' + scssVar + ': </span>' +
                                '<span>' + (l !== 0 ? '$' : '') +  map[level][scssVar] + '; </span>' +
                                '</div>';
                        }
                    }
                }
            }
            var element = $('div[rel="level' + currentTab + '"]');
            element.html(html);
        });

        _fixStepIndicator(0);
        _showHideButtons(false);

        function _onNext(){
            var element = $('div[rel="level' + currentTab + '"]');
            _saveScssVariables(element);
            element.hide();
            currentTab++;
            _fixStepIndicator(currentTab);
            $('div[rel="level' + currentTab + '"]').show();
            _showHideButtons(false);
        }
        
        function _showHideButtons(isUploaded){
            switch(currentTab) {
                case 0:
                    if (isUploaded) {
                        $('button[rel="next"]').show();
                    } else {
                        $('button[rel="next"]').hide();
                    }
                    $('button[rel="prev"]').hide();
                    $('button[rel="generate"]').hide();
                    break;
                case 1:
                    $('button[rel="prev"]').show();
                    $('button[rel="generate"]').show();
                    $('button[rel="next"]').hide();
                    break;
                case 2:
                    $('button[rel="prev"]').show();
                    $('button[rel="next"]').hide();
                    $('button[rel="generate"]').hide();
                    break;
            }
        }

        function _saveScssVariables(element){
            if(!map[currentTab]){
                map[currentTab] = {};
            }
            $.each(element.find('div[rel="field"]'), function(i, v){
                var fileName = $(v).attr('data-value');
                if(currentTab === 0){
                    var s = $(v).find('select').val();
                    switch (s){
                        case '3':
                            map[currentTab][fileName] = $(v).find('input[rel="gradientValue"]').val();
                            break;
                        case '4':
                            map[currentTab][fileName] = 'url("' + $(v).find('input[rel="' + s + '"]').val() + '")';
                            break;
                        default:
                            map[currentTab][fileName] = $(v).find('input[rel="' + s + '"]').val();
                            break;
                    }
                    //map[currentTab][fileName] = $(v).find('input').val();
                }else{
                    map[currentTab][fileName] = $(v).find('select').val();
                }
            });
            console.log(map);
        }

        function _fixStepIndicator(n) {
            var i, x = document.getElementsByClassName("step");
            for (i = 0; i < x.length; i++) {
                x[i].className = x[i].className.replace(" active", "");
            }
            x[n].className += " active";
        }

        //for normal color picker
        $('.demo').each( function() {
            $(this).minicolors({
                control: $(this).attr('data-control') || 'hue',
                defaultValue: $(this).attr('data-defaultValue') || '',
                format: $(this).attr('data-format') || 'hex',
                keywords: $(this).attr('data-keywords') || '',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom',
                swatches: $(this).attr('data-swatches') ? $(this).attr('data-swatches').split('|') : [],
                change: function(value, opacity) {
                    if( !value ) return;
                    if( opacity ) value += ', ' + opacity;
                    if( typeof console === 'object' ) {
                        console.log(value);
                    }
                },
                theme: 'bootstrap'
            });
        });

        //for gradient color picker
        //var $ex1 = $(".ex1");
        //var $ex2 = $(".ex2");
        //var $ex3 = $(".ex3");
        //$("#ex1").gradientPicker({
        //    change: function(points, styles) {
        //        for (i = 0; i < styles.length; ++i) {
        //            $ex1.css("background-image", styles[i]);
        //        }
        //    },
        //    fillDirection: "45deg",
        //    controlPoints: ["green 0%", "yellow 50%", "green 100%"]
        //});
        //
        //$("#ex2").gradientPicker({
        //    change: function(points, styles) {
        //        for (i = 0; i < styles.length; ++i) {
        //            $ex2.css("background-image", styles[i]);
        //        }
        //    },
        //    controlPoints: ["green 0%", "orange 100%"]
        //});
        //
        //$("#ex3").gradientPicker({
        //    type: "radial",
        //    change: function(points, styles) {
        //        for (i = 0; i < styles.length; ++i) {
        //            $ex3.css("background-image", styles[i]);
        //        }
        //    },
        //    controlPoints: ["blue 0%", "yellow 100%"]
        //});
    });
})(jQuery);
