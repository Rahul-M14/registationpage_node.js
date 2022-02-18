//----------all require modules---------//
const express = require("express");
const mysql = require ('mysql');
const app = express();
const port = 3004;
const { check, validationResult } = require('express-validator');
const path = require('path');

//-------------my db Connection-------------//
// var mysqlConn = mysql.createConnection ({
//   host: 'localhost',
//   user: 'rahul',
//   password: 'Temp12345#',
//   database: 'rahul'
// });


var mysqlConn = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});
mysqlConn.connect((err)=>{
  if(err) console.log('connection failed!' ,err);
});

//-----------render HTML pages-------------//
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/home",(req, res) => {
  res.sendFile(path.join(__dirname+'/user.html'));
})

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/login",(req, res) => {
  res.sendFile(path.join(__dirname+'/login.html'));
})


// -------------------server site validation for user-from--------------------//
app.post('/userData', [
        check('name','Name is required').not().isEmpty(),
        check('phone', 'phone_no is required').not().isEmpty().isMobilePhone().isLength({ min: 10 , max:10 }),
        check('email','email is require').isEmail().normalizeEmail(),
        check('password', 'Password is requried').isLength({ min: 8 , max:20 })
       ],       (req, res) => {
        console.log(req.ip);
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
           res.send(errors);
         }else{
//------------inseart values in db ----------//
          var name=req.body.name;
          var phone=req.body.phone;
          var email=req.body.email;
          var password= req.body.password;
          let sql = `SELECT * FROM alluser WHERE email = '${email}' AND phone = '${phone}'`
          mysqlConn.query(sql,(err, result) => {
          if(result && result[0]){
           res.send ("Duplicate Data Found!");
          }else{

              var que=`INSERT INTO alluser (name,phone,email,password) VALUES ("${name}","${phone}","${email}","${password}")`;
               mysqlConn.query(que,(err, result) => {
              res.send("data submitted");
               });
          }
          
       });   
     }
});

//------------running my port-----------//
app.listen(port, () => {
  console.log(`Admin listening on port ${port}!`);
});