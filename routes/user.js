/**
 * Created by Ray on 2016/11/20.
 */
var express = require('express');
var router = express.Router();
var speakeasy = require("speakeasy");
var passwordHash = require("password-hash");
var query = require("../config/mysqlConfig").queryAsync;

router.put("/register",function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    var secret_key = speakeasy.generateSecret().base32;
    var token = speakeasy.generateSecret().base32;
    var url = speakeasy.otpauthURL({ secret: secret_key, label: 'Ray-TomKK-WYH', algorithm: 'sha1' });
    var hashedPassword = passwordHash.generate(password,{algorithm:"sha512",saltLength:20});

    query("INSERT INTO user(username,password,secret_key,token,token_create_time) VALUE(?,?,?,?,?)",[username,hashedPassword,secret_key,token,new Date()])
        .then(function (data) {
            res.send(data);
        })
});

router.post("/login",function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    query("SELECT * FROM user WHERE username=?",[username]).then(function (data) {
        if(data[0] && data[0][0] && passwordHash.verify(password, data[0][0].password)){
            res.send(data[0][0])
        }
        else{
            res.send("密码错误");
        }
    }).error(function (data) {
        res.send(data);
    })
});


module.exports = router;