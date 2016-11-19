var express = require('express');
var router = express.Router();
var speakeasy = require("speakeasy");
var passwordHash = require("password-hash");

router.get('/', function(req, res, next) {
    var secret = speakeasy.generateSecret();
    console.log(secret.base32);
    var url = speakeasy.otpauthURL({ secret: secret.base32, label: 'Ray', algorithm: 'sha1' });
    res.render('index', { title: secret,qrcode: "http://qr.liantu.com/api.php?&w=400&text=" + url });
});


router.post("/verify",function (req, res, next) {
    var code = req.body.code;
    //这个key就是上面的secret.base32
    var secretKey = "O56TMLSJMRLWKV2LLIUE423IEU4TUPZVIVTXILSUOY7FQPRJKIXQ";

    var tokenValidates = speakeasy.totp.verify({
        secret: secretKey,
        token: code
    });
    res.send({result:tokenValidates});
});


router.post("/register",function (req, res, next) {
    var password = req.body.password;
    var hashedPassword = passwordHash.generate(password,{algorithm:"sha512",saltLength:20});
    console.log(hashedPassword);

    console.log("检测密码是否正确" + passwordHash.verify('password123', hashedPassword));

    console.log("检测密码是否正确" + passwordHash.verify(password, hashedPassword));

    res.send({hashedPassword:hashedPassword});
});


module.exports = router;
