// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mysql = require('mysql');
// const events = require('./events');
//
// const connection = mysql.createConnection({
//   host     : '192.168.64.2',
//   user     : 'thiyagu',
//   password : 'thiyagu',
//   database : 'game_data'
// });
//
// connection.connect();
//
// const port = 8888;
//
// const app = express()
//   .use(cors())
//   .use(bodyParser.json())
//   .use(events(connection));
//
// app.listen(port, () => {
//   console.log(`Express server listening on port ${port}`);
//   connection.query('INSERT INTO users SET ?', ["test","9999555555"], (err, res) => {
//     if(err) throw err;
//   });
// });



//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();

//Create connection
const conn = mysql.createConnection({
  host: '192.168.64.2',
  user: 'thiyagu',
  password: 'thiyagu',
  database: 'game_data'
});

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set public folder as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//route for homepage
// app.get('/',(req, res) => {
//   let sql = "SELECT * FROM product";
//   let query = conn.query(sql, (err, results) => {
//     if(err) throw err;
//     res.render('product_view',{
//       results: results
//     });
//   });
// });

//route for insert data
app.post('/add_user',(req, res) =>
{
  console.log("test");
  console.log(req.body.name);
    console.log(req.body.phone_number);
  let data = {name: req.body.name, phone_number: req.body.phone_number};
  let sql = "INSERT INTO users SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err)
{

    throw err;
      res.send({ status: 'error' });
}

else {
  res.send({ status: 'success' });
}

    //res.redirect('/');
  });
});



app.post('/update_score',(req, res) =>
{
//  console.log("test");
//  console.log(req.body.name);
  //  console.log(req.body.phone_number);
  let data = {player_name: req.body.player_name
, current_score: req.body.current_score
, high_score: req.body.high_score
  };
  //let sql = "UPDATE score_data SET ?";
  //let sql = "UPDATE score_data SET current_score='"+req.body.current_score+"', high_score='"+req.body.high_score+"' WHERE player_name='"+req.body.player_name+"'";

  let sql = "INSERT INTO score_data SET ?";

console.log(sql);
  let query = conn.query(sql, data,(err, results) => {
    if(err)
{

    throw err;
      res.send({ status: 'error' });
}

else {
  res.send({ status: 'success' });
}

    //res.redirect('/');
  });
});










//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM product WHERE product_id="+req.body.product_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/');
  });
});

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
