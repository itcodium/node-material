var crypto = require('crypto')

exports.EncriptarTexto= function () {

    this.algorithm = 'aes-256-ctr';
    this.password = '#d6F3Efeq$';

    this.encrypt=function(text){
        var cipher = crypto.createCipher(this.algorithm,this.password)
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    this.decrypt=function (text){
        var decipher = crypto.createDecipher(this.algorithm,this.password)
        var dec = decipher.update(text,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    }
}

