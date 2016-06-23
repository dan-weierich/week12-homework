var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var PORT = process.env.PORT||3000;

app.listen(PORT, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

var connection = mysql.createConnection({
    host: 'rcbexperimental.cpondcnopjzo.us-east-1.rds.amazonaws.com',
    user: 'tempuser',
    password: 'tempPassword1234!',
    database: 'bamazonDb'
});

connection.connect(function (err) {
    if (err) throw err
    console.log('connected to Bamazon Database as id ' + connection.threadId);
});


app.get('/customer', function (request, response) {
    var resultArray = [];
    var showAll = 'SELECT * FROM productTable ORDER BY itemID ASC';
    connection.query(showAll, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            resultArray.push([res[i].itemID, res[i].productName, res[i].departmentName, res[i].price, res[i].stockQuantity]);
        };
        response.send(resultArray);
    });

})