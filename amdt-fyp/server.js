//app.js
//load the things we need
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
var port = 3000;



app.use(express.static('dist'));

app.listen(port, function () {
    console.log('This app is on http://localhost:' + port);
});

app.use(fileUpload());

app.post('/upload', function(req, res) {
    if (Object.keys(req.files).length == 0) {
        res.status(400).json({
                'msg' : 'No files were uploaded.'}
        );
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    //console.log(sampleFile);
    let files = [];
    sampleFile.forEach(function(file){
        if(file.name.lastIndexOf('.psd') > 0){
            files.push(file.name.substring(0, file.name.lastIndexOf('.psd')));
        }else if(file.name.lastIndexOf('.ai') > 0){
            files.push(file.name.substring(0, file.name.lastIndexOf('.ai')));
        }
    });

    res.status(200).json(files);
});