const cors = require('cors');
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
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});

//set views file
app.set('views', path.join(__dirname, 'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}));
//set public folder as static folder for static file
app.use('/assets', express.static(__dirname + '/public'));

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

app.get('/get_all_users', (req, res) => {
    let sql = "SELECT DISTINCT name, block_flag FROM users";
    console.log(sql);
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send({
            results
        });
        console.log("getting player list");
    });
});

app.get('/get_score', (req, res) => {
    let sql = "SELECT * FROM score_data ORDER BY high_score DESC";
    console.log(sql);
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send({
            results
        });
        console.log("getting score list");
    });
});




app.post('/check_block', (req, res) => {
    let data = {
        name: req.body.name,
        phone_number: req.body.phone_number
    };
    let sql = "select block_flag from users WHERE name=" + "'" + req.body.player_name + "'";
    console.log(sql);

    let query = conn.query(sql, (err, results) => {
        if (err) throw err;

        if (results[0].block_flag == "false") {

            console.log("blocked");
        } else {
            console.log("not blocked");

        }

        res.send({
            results
        });
        console.log("checking block");
    });
});




//route for insert data
app.post('/add_user', (req, res) => {
    console.log("test");
    console.log(req.body.name);
    console.log(req.body.phone_number);
    let data = {
        name: req.body.name,
        phone_number: req.body.phone_number
    };
    let sql = "INSERT INTO users SET ?";
    console.log(sql);
    let query = conn.query(sql, data, (err, results) => {
        if (err) {

            throw err;
            res.send({
                status: 'error'
            });
        } else {
            res.send({
                status: 'success'
            });
        }

        //res.redirect('/');
    });
});



app.post('/update_score', (req, res) => {




    let data = {
        name: req.body.name,
        phone_number: req.body.phone_number
    };
    let sql = "select block_flag from users WHERE name=" + "'" + req.body.player_name + "'";
    console.log(sql);
    let query = conn.query(sql, (err, results) => {
        if (err) 
        {
            throw err;
            res.send({
                status: 'err-something-wrong'
            });

        } else 

        {

           if (!results.length) 
          {
console.log("null");
res.send({
                status: 'serverDown!'
            });

          }
          
           if (results.length) 
          {


          if(results[0].block_flag == "true")
          {
console.log("true")
     console.log("blocked");
                res.send({
                    status: 'user-quarantined'
                });

          }
          else if(results[0].block_flag == "false")
          {
console.log("false")

     let data = {
                    player_name: req.body.player_name,
                    current_score: req.body.current_score,
                    high_score: req.body.high_score
                };

                let sql = "INSERT INTO score_data SET ?";

                console.log(sql);
                let query = conn.query(sql, data, (err, results) => {
                    if (err) {

                        //throw err;
                        res.send({
                            status: 'error'
                        });
                    } else {
                        res.send({
                            status: 'update-success'
                        });
                    }

                    //res.redirect('/');
                });

                console.log("not blocked");

          }
          else
          {
console.log("undetermined")

          }

          }

       

        }




    });
});

//thiyagu_block_user

// app.post('/thiyagu_block_user', (req, res) => {

//     checkuserexist(req.body.name);
//     let sql = "UPDATE users SET block_flag='" + "false" + "' WHERE name=" + "'" + req.body.name + "'";
//     console.log(sql);
//     let query = conn.query(sql, (err, results) => {
//         if (err) {
//             throw err;
//             res.send({
//                 status: 'error'
//             });

//         } else {
//             res.send({
//                 status: 'success'
//             })

//         }
//     });
// });

app.post('/block_user', (req, res) => {

    checkuserexist(req.body.name);
    let sql = "UPDATE users SET block_flag='" + "true" + "' WHERE name=" + "'" + req.body.name + "'";
    console.log(sql);
    let query = conn.query(sql, (err, results) => {
        if (err) {
            throw err;
            res.send({
                status: 'error'
            });

        } else {
            res.send({
                status: 'success'
            })

        }
    });
});





function checkuserexist(name) {

    //SELECT distinct 1 name FROM users WHERE name = 'player1'
    let sql = "SELECT distinct 1 name FROM users WHERE name=" + "'" + name + "'";
    console.log(sql);
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results[0])
        //res.redirect('/');
    });

}


//route for update data
app.post('/update', (req, res) => {
    let sql = "UPDATE product SET product_name='" + req.body.product_name + "', product_price='" + req.body.product_price + "' WHERE product_id=" + req.body.id;
    console.log(sql);
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//route for delete data
app.post('/delete', (req, res) => {
    let sql = "DELETE FROM product WHERE product_id=" + req.body.product_id + "";
    console.log(sql);
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//server listening
app.listen(8000, () => {
    console.log('Server is running at port 8000');
});