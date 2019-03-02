var inquirer = require("inquirer");
var mysql = require("mysql");
var itemIds

console.log('Hi, welcome to Node Bamazon');

var conn = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Japonica343",
  database: "bamazon"
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + conn.threadId + "\n");
  displayInventory()
});

// display the inventory to the user when "node bamazonCustomer.js" is typed in". 
function displayInventory(){
  console.log('displaying inventory...\n');
  conn.query('SELECT * from products', function(err, res) {
    if (err) console.log(err);
    // Log all results of the SELECT statement
    itemIds = res.map(function(response){ return response.item_id.toString(); })
    name = res.map(function(response){ return response.product_name.toString(); });
    prompt(res);

  })
}
function prompt(productInventory) {
  console.log(itemIds);
  // prompt to see which product the customer would like to buy. 
  inquirer.prompt([
    {
      type: "list",
      name: "selectID",
      message: "Please select the ID of the product you would like to buy",
      // code to display the name, id, quantity and price
      choices: itemIds
    },
    {
      type: "input",
      name: "units",
      message: "How many units of the product would you like to buy?"
    }
    // if the number of items requested is less than what is in stock
  ]).then(answers => {

    var idNumber = parseInt(answers.selectID)
    var price = productInventory[idNumber--].price
    var amount = (parseInt(answers.units)) * productInventory[idNumber--].price

    if (productInventory[idNumber--].stock_quantity > parseInt(answers.units)){
      var newQuant = productInventory[idNumber--].stock_quantity - parseInt(answers.units)
      conn.query("UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: newQuant
          },
          {
            item_id: answers.selectID
          }
        ], function(err, res){
          if (err) console.log(err);
          console.log(res.affectedRows + " products updated!\n")
          console.log(res)
        })
        // display the totals, new qantity 
      console.log("stock availble " + newQuant)
      console.log("here is your total " + amount)
    }else{
      console.log("Insufficient quantity!")
    }
    prompt(productInventory)
   });
}
