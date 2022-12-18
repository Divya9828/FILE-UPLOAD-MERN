const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require('body-parser');
const mysql=require('mysql')
const db=require('./db/connection');
const { query } = require("./db/connection");
 
const app = express();
 
app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
app.post("/upload", (req, res) => {
  const newpath = __dirname + "/files/";
  const file = req.files.file;
  const filename = file.name;
  
  const select="select * from fileup where filename=?"
  db.query(select,[filename],(err,result)=>{
    if(err)
    {
      // throw err
      res.status(200).send({ message: "File Already Uploaded", code: 200 });

    }


  })

  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    const insert="insert into fileup(filename,date) values(?,curdate())";
    db.query(insert,[filename],(err,result)=>{
      if(err)
      {
        throw err
      }
      // console.log(result)
    res.status(200).send({ message: "File Uploaded", code: 200 });

    })
  });
});
 
app.listen(2000, () => {
  console.log("Server running successfully on 2000");
});