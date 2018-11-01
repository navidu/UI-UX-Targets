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
                                '<input rel="1" type="text" style="display: none" class="form-control demo">' +
                                '<input rel="2" type="text" style="display: none" class="form-control demo">' +
                                '<input rel="3" type="text" style="display: none"/>' +
                                '<input rel="4" type="text" style="display: none"/>' +
                                ';</div>';
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

                        element.find('select[rel="field-value"]').on('change', function () {
                            var e = $(this), val = e.val(), input = e.parent('div[rel="field"]').find('input[rel="' + val + '"]');
                            e.parent('div[rel="field"]').find('input').hide();
                            e.parent('div[rel="field"]').find('div.minicolors').hide();
                            input.show();
                            switch (val) {
                                case '1':
                                    input.parent('div.minicolors').show();
                                    break;
                                case '2':
                                    input.parent('div.minicolors').show();
                                    break;
                                case '4':
                                    break;
                                default:
                                    //e.parent('div').find('input[rel="' + val + '"').show();
                                    break;
                            }
                        });

                        element.find('select[rel="field-value"]').trigger('change');
                    }
                }
            });
        });

        $('button[rel="next"]').on('click', function(){
            _onNext();
        });

        $('button[rel="generate"]').on('click', function(){
            _onNext();

            var html = '';
            for(var level in map){
                if(map.hasOwnProperty(level)){
                    var l = parseInt(level, 10);
                    html += '<div class="code-block"><span>//----------------------Level ' + (l + 1) + '--------------------- </span></div>';
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

        function _onNext(){
            var element = $('div[rel="level' + currentTab + '"]');
            _saveScssVariables(element);
            element.hide();
            currentTab++;
            _fixStepIndicator(currentTab);
            $('div[rel="level' + currentTab + '"]').show();
            if(currentTab === 1){
                $('button[rel="next"]').hide();
                $('button[rel="prev"]').show();
                $('button[rel="generate"]').show();
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
        var $ex1 = $(".ex1");
        var $ex2 = $(".ex2");
        var $ex3 = $(".ex3");
        $("#ex1").gradientPicker({
            change: function(points, styles) {
                for (i = 0; i < styles.length; ++i) {
                    $ex1.css("background-image", styles[i]);
                }
            },
            fillDirection: "45deg",
            controlPoints: ["green 0%", "yellow 50%", "green 100%"]
        });

        $("#ex2").gradientPicker({
            change: function(points, styles) {
                for (i = 0; i < styles.length; ++i) {
                    $ex2.css("background-image", styles[i]);
                }
            },
            controlPoints: ["green 0%", "orange 100%"]
        });

        $("#ex3").gradientPicker({
            type: "radial",
            change: function(points, styles) {
                for (i = 0; i < styles.length; ++i) {
                    $ex3.css("background-image", styles[i]);
                }
            },
            controlPoints: ["blue 0%", "yellow 100%"]
        });
    });
})(jQuery);