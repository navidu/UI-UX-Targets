var client = (function ($) {
    var currentTab = 0, map = {};

    $(document).ready(function () {
        var uploadBtn = $('button[rel="upload"]'),
            nextBtn = $('button[rel="next"]'),
            title1Text = $('li[rel="title1"]'),
            title2Text = $('li[rel="title2"]'),
            advice1Text = $('li[rel="advice1"]'),
            advice2Text = $('li[rel="advice2"]'),
            stillUploading = $('li[rel="stilluploading"]'),
            stillUploading2 = $('li[rel="stilluploading2"]'),
            selectLevel1 = $('li[rel="selectLevel1"]'),
            prevBtn = $('button[rel="prev"]'),
            copyBtn = $('button[rel="copy"]'),
            copiedPopup = $('div[rel="copied"]'),
            generateBtn = $('button[rel="generate"]'),
            form = $('form[rel="uploadForm"]');

        $('input[name="sampleFile"]').on('change', function () {
            if ($(this).val()) {
                uploadBtn.show();
                advice1Text.hide();
                advice2Text.show();
                title1Text.hide();
                title2Text.hide();
            } else {
                uploadBtn.hide();
                advice1Text.show();
                advice2Text.hide();
                title1Text.show();
                title2Text.show();
            }
        });

        uploadBtn.on('click', function () {
            stillUploading.show();
            var formdata = false;
            if (window.FormData) {
                formdata = new FormData(form[0]);
                stillUploading.show();
            }

            $.ajax({
                url: '/upload',
                data: formdata ? formdata : form.serialize(),
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (data) {
                    uploadBtn.on('click', function (){
                        stillUploading2.show();
                    });

                    $('input[name="sampleFile"]').val('');
                    uploadBtn.hide();

                    var html = '', element = $('div[rel="level' + currentTab + '"]');

                    data.forEach(function (fileName) {
                        if (currentTab === 0) {
                            html +=
                                '<div class="code-block" rel="field" data-value="' + fileName + '">' +
                                '<label>$' + fileName + ': </label>' +
                                '<select rel="field-value">' +
                                '<option value="1">Hex</option>' +
                                '<option value="2">RGBA</option>' +
                                '<option value="3">Gradient</option>' +
                                '<option value="4">Url</option>' +
                                '</select>' +
                                '<input data-ctrl="color" rel="1" type="text" style="display: none" class="form-control demo">' +
                                '<input data-ctrl="color" rel="2" type="text" style="display: none" class="form-control demo">' +
                                '<div data-ctrl="color" class="gradient-section" rel="3" data-value="' + fileName + '" style="display: none">' +
                                '<div class="gradient-select">' +
                                    '<input data-ctrl="gradient" type="radio" checked="checked" rel="' + fileName + '-linear-gradient" name="' + fileName + 'gradient"> Linear' +
                                    '<div data-ctrl="gradient-type" class="gradient-generator" rel="' + fileName + '-linear-gradient"></div>' +
                                '</div>' +
                                '<div class="gradient-select">' +
                                    '<input data-ctrl="gradient" type="radio" rel="' + fileName + '-radial-gradient" name="' + fileName + 'gradient"> Radial ' +
                                    '<div data-ctrl="gradient-type" class="gradient-generator" rel="' + fileName + '-radial-gradient" style="display: none;"></div>' +
                                '</div>' +
                                '<input rel="gradientValue" type="text">' +
                                '</div>' +
                                '<input data-ctrl="color" rel="4" type="text" placeholder="path/image.jpg" style="display: none"/>' +
                                ';</div>';
                        } else {
                            html += '<div class="code-block" rel="field" data-value="' + fileName + '">' +
                                '<label>$' + fileName + ' :</label>' +
                                '<select>';
                            for (var scssVar in map[currentTab - 1]) {
                                if (map[currentTab - 1].hasOwnProperty(scssVar)) {
                                    html += '<option value="' + scssVar + '">$' + scssVar + '</option>';
                                }
                            }
                            html += '</select>;</div>';
                        }
                    });

                    element.html(html);

                    if (currentTab === 0) {

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

                        $.each(element.find('div[rel="3"]'), function (i, v) {
                            var val = $(v).attr('data-value');
                            var lgp = new Grapick({el: $(v).find('div[rel="' + val + '-linear-gradient"]')[0]});

                            // Handlers are color stops
                            lgp.addHandler(0, 'red');
                            lgp.addHandler(100, 'blue');

                            // Do stuff on change of the gradient
                            lgp.on('change', function () {
                                $(v).find('input[rel="gradientValue"]').val(lgp.getValue());
                            });

                            $(v).find('input[rel="gradientValue"]').val(lgp.getValue());

                            var rgp = new Grapick({
                                el: $(v).find('div[rel="' + val + '-radial-gradient"]')[0],
                                type: 'radial'
                            });

                            // Handlers are color stops
                            rgp.addHandler(0, 'red');
                            rgp.addHandler(100, 'blue');

                            $(v).find('input[rel="gradientValue"]').val(rgp.getValue());

                            // Do stuff on change of the gradient
                            rgp.on('change', function () {
                                $(v).find('input[rel="gradientValue"]').val(rgp.getValue());
                            });
                        });

                        element.find('input[data-ctrl="gradient"]').on('click', function () {
                            if($(this).is(':checked')) {
                                $(this).parents('div[data-ctrl="color"]').find('div[data-ctrl="gradient-type"]').hide();
                                element.find('div[rel="' + $(this).attr('rel') + '"]').show();
                            }
                        });
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
                                    //selected.find('input[data-ctrl="gradient"]').trigger('click');
                                    break;
                                default:
                                    //e.parent('div').find('input[rel="' + val + '"').show();
                                    break;
                            }
                        });
                    }

                    _showHideButtons(true);
                    element.find('select[rel="field-value"]').trigger('change');
                }
            });
        });

        nextBtn.on('click', function () {
            _onNext();
        });

        prevBtn.on('click', function () {
            _onPrev();
        });

        copyBtn.on('click', function () {
            var copySCSS = $("<textarea>");
            $("body").append(copySCSS);
            copySCSS.val($('div[rel="level2"]').text().replace(/;/g, ';\n').replace(/----------------------/g, '---------------------\n')).select();
            document.execCommand("copy");
            copySCSS.remove();
            copiedPopup.show();
            copiedPopup.fadeOut(1000, 'easeInOutQuart');
        });

        generateBtn.on('click', function () {
            _onNext();

            var html = '';
            for (var level in map) {
                if (map.hasOwnProperty(level)) {
                    var l = parseInt(level, 10);
                    html += '<div class="code-block"><span>//--------------------- Level ' + (l + 1) + ' ---------------------- </span></div>';
                    for (var scssVar in map[level]) {
                        if (map[level].hasOwnProperty(scssVar)) {
                            html += '<div class="code-block">' +
                                '<span>$' + scssVar + ': </span>' +
                                '<span>' + (l !== 0 ? '$' : '') + map[level][scssVar].value + '</span>;' +
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

        function _onNext() {
            var element = _getCurrentTab();
            ;
            _saveScssVariables(element);
            element.hide();
            currentTab++;
            _fixStepIndicator(currentTab);
            var newElement = _getCurrentTab();
            _showScssVariables(newElement);
            newElement.show();
            _showHideButtons(false);
            $('strong[rel="tab"]').html(currentTab + 1);
        }

        function _onPrev() {
            var element = _getCurrentTab();
            element.hide();
            currentTab--;
            _fixStepIndicator(currentTab);
            var newElement = _getCurrentTab();
            _showScssVariables(newElement);
            newElement.show();
            $('strong[rel="tab"]').html(currentTab + 1);
        }

        function _getCurrentTab() {
            return $('div[rel="level' + currentTab + '"]');
        }

        function _showHideButtons(isUploaded) {
            var infoContainer = $('div[rel="info"]');
            infoContainer.find('> ul').hide();
            switch (currentTab) {
                case 0:
                    form.show();
                    if (isUploaded) {
                        nextBtn.show();
                        infoContainer.find('ul[rel="step2"]').show();
                    } else {
                        nextBtn.hide();
                        infoContainer.find('ul[rel="step1"]').show();
                    }
                    prevBtn.hide();
                    generateBtn.hide();
                    copyBtn.hide();
                    break;
                case 1:
                    form.show();
                    prevBtn.show();
                    if (isUploaded) {
                        generateBtn.show();
                        infoContainer.find('ul[rel="step4"]').show();
                    } else {
                        generateBtn.hide();
                        infoContainer.find('ul[rel="step3"]').show();
                    }
                    nextBtn.hide();
                    copyBtn.hide();
                    break;
                case 2:
                    form.hide();
                    prevBtn.show();
                    nextBtn.hide();
                    generateBtn.hide();
                    copyBtn.show();
                    infoContainer.find('ul[rel="step5"]').show();
                    break;
            }
        }

        function _saveScssVariables(element) {
            if (!map[currentTab]) {
                map[currentTab] = {};
            }
            $.each(element.find('div[rel="field"]'), function (i, v) {
                var fileName = $(v).attr('data-value');
                if (currentTab === 0) {
                    var s = $(v).find('select').val();
                    switch (s) {
                        case '3':
                            map[currentTab][fileName] = {
                                'type': s,
                                'value': $(v).find('input[rel="gradientValue"]').val()
                            };
                            break;
                        case '4':
                            map[currentTab][fileName] = {
                                'type': s,
                                'value': 'url("' + $(v).find('input[rel="' + s + '"]').val() + '")'
                            };
                            break;
                        default:
                            map[currentTab][fileName] = {'type': s, 'value': $(v).find('input[rel="' + s + '"]').val()};
                            break;
                    }
                    //map[currentTab][fileName] = $(v).find('input').val();
                } else {
                    map[currentTab][fileName] = {'value': $(v).find('select').val()};
                }
            });
            console.log(map);
        }

        function _showScssVariables(element) {
            var html = '';
            for (var key in map[currentTab]) {
                if (map[currentTab].hasOwnProperty(key)) {
                    if (currentTab === 0) {
                        html +=
                            '<div class="code-block" rel="field" data-value="' + key + '">' +
                            '<label>$' + key + ': </label>' +
                            '<select rel="field-value">' +
                            '<option value="1">Hex</option>' +
                            '<option value="2">RGB</option>' +
                            '<option value="3">Gradiant</option>' +
                            '<option value="4">Url</option>' +
                            '</select>' +
                            '<input data-ctrl="color" rel="1" type="text" style="display: none" class="form-control demo">' +
                            '<input data-ctrl="color" rel="2" type="text" style="display: none" class="form-control demo">' +
                            '<div data-ctrl="color" rel="3" data-value="' + key + '" style="display: none">' +
                            '<input data-ctrl="gradient" type="radio" checked="checked" rel="' + key + '-linear-gradient" name="' + key + 'gradient"> Linear ' +
                            '<input data-ctrl="gradient" type="radio" rel="' + key + '-radial-gradient" name="' + key + 'gradient"> Radial ' +
                            '<div data-ctrl="gradient-type" rel="' + key + '-linear-gradient" style="display: none;"></div>' +
                            '<div data-ctrl="gradient-type" rel="' + key + '-radial-gradient" style="display: none;"></div>' +
                            '<input rel="gradientValue" type="text">' +
                            '</div>' +
                            '<input data-ctrl="color" rel="4" type="text" style="display: none"/>' +
                            '</div>';
                    } else {
                        html += '<div class="code-block" rel="field" data-value="' + key + '">' +
                            '<label>$' + key + ' :</label>' +
                            '<select>';
                        for (var scssVar in map[currentTab - 1]) {
                            if (map[currentTab - 1].hasOwnProperty(scssVar)) {
                                html += '<option value="' + scssVar + '">' + scssVar + '</option>';
                            }
                        }
                        html += '</select>;</div>';
                    }
                }
            }

            element.html(html);

            if (currentTab === 0) {

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

                $.each(element.find('div[rel="3"]'), function (i, v) {
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

                element.find('input[data-ctrl="gradient"]').on('click', function () {
                    $(this).parent('div').find('div[data-ctrl="gradient-type"]').hide();
                    element.find('div[rel="' + $(this).attr('rel') + '"]').show();
                });

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

                element.find('select[rel="field-value"]').trigger('change');
            }

            for (var key in map[currentTab]) {
                if (map[currentTab].hasOwnProperty(key)) {
                    if (currentTab === 0) {

                    } else {
                        if (map[currentTab][key] && map[currentTab][key].value) {
                            element.find('div[data-value="' + key + '"]').find('select').val(map[currentTab][key].value);
                        }
                    }
                }
            }

            _showHideButtons(true);
        }

        function _fixStepIndicator(n) {
            var i, x = document.getElementsByClassName("step");
            for (i = 0; i < x.length; i++) {
                x[i].className = x[i].className.replace(" active", "");
            }
            x[n].className += " active";
        }

        //for normal color picker
        $('.demo').each(function () {
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
                change: function (value, opacity) {
                    if (!value) return;
                    if (opacity) value += ', ' + opacity;
                    if (typeof console === 'object') {
                        console.log(value);
                    }
                },
                theme: 'bootstrap'
            });
        });
    });
})(jQuery);
