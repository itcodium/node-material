var  crypto = require('crypto')


exports.encrypt=function (text){
    var cipher = crypto.createCipher('aes-256-cbc',KEY)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

var KEY='bp4';
exports.decrypt=function (text){
    var decipher = crypto.createDecipher('aes-256-cbc',KEY)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

exports.hello=function (){
    return "Hello decrypt ";
}