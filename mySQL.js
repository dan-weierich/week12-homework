var mysql=require('mysql');
var promptly=require('promptly');

var connection=mysql.createConnection({

	host:"localhost",
	port: 3306,
	user:"dweierich", //username
	password:"-----", //password
	database:"Bamazon"})

connection.connect(function(err){
	if(err){
		console.error("error connecting: "+err.stack);}
	makeTable();})

var makeTable=function(){
	connection.query('SELECT * FROM products',function(err,res){
		if(err)throw err;
		var tab="\t";
		console.log("ItemID\tProduct Name\tDepartment Name\tPrice\t# In Stock");
		console.log("--------------------------------------------------------");
		for(var i=0;i<res.length;i++){
			console.log(res[i].ItemID+tab+res[i].ProductName+tab+res[i].DepartmentName+tab+res[i].Price+tab+res[i].StockQuantity);}
		console.log("--------------------------------------------------------");
		promptCustomer(res);})}



var promptCustomer=function(res){
	promptly.prompt('What would you like to purchase? [Quit with Q]',function(err,val){
		var correct=false;
		for(var i=0;i<res.length;i++){
			if(res[i].ProductName==val){
				var correct=true;
				var product=val;
				var id=i;
				promptly.prompt("How many would you like to buy?",function(err,val){
					if((res[id].StockQuantity-val)>0){
						connection.query("UPDATE products SET StockQuantity='"+(res[id].StockQuantity-val)+"' WHERE ProductName='"+product+"'", function(err, res2){
							if(err)throw err;
							console.log("PRODUCT BOUGHT!");
							makeTable();})}
					else{
						console.log("NOT A VALID SELECTION!");
						promptCustomer(res);}})}
			if(val=="Q"||val=="q"){process.exit()}}
		if(i==res.length&&correct==false){
			console.log("NOT A VALID SELECTION");
			promptCustomer(res);}
		})}