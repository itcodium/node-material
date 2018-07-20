var async = require('async')
    , _ = require('underscore')

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var sql = require('mssql');

var env = process.env.NODE_ENV || 'desconocido' ;
var APP_CONFIG=require('../../../config/config.js');

var EnviarEmail = function () {

    this.mailOptions = {
        from: APP_CONFIG.Email.from,
        to: '',
        cc:'',
        subject: '',
        html: '',
        text: "plaintext",
        attachments: []
    };
    this.transporter = nodemailer.createTransport(smtpTransport(APP_CONFIG.Email.config));
    this.set_callback=function(param){
        this.callBack=param;
    }
    this.send=function(to,copia,subject,data,attachments){
        this.mailOptions.to=to;
        this.mailOptions.subject=subject;
        this.mailOptions.cc=copia;
        this.mailOptions.html=data;
        if (attachments){
            this.mailOptions.attachments.push(attachments);
        }
        this.transporter.sendMail(this.mailOptions, this.callBack);
    }

}



exports.Email=EnviarEmail;
