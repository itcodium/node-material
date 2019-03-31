var async = require('async')
    , _ = require('underscore');


exports.render = function (req, res) {
    console.log("2. index.render ", req.user)
    ObjUpdate = {};

    ObjUpdate = {};
    ObjUpdate.perfiles = [];
    ObjUpdate.idUsuario = 54;
    ObjUpdate.nombre = 'desa';
    ObjUpdate.email = 'test@hotmail.com';
    ObjUpdate.name = 'admin';
    ObjUpdate.idPerfil = 4;
    ObjUpdate.codigo_perfil = 'SUPERVISOR';
    ObjUpdate.nivelSeguridad = 1;
    ObjUpdate.username = "desa";
    ObjUpdate.modificado_por = "admin";
    ObjUpdate.fecha_modificacion = new Date();

    if (req.body.perfiles) {
        ObjUpdate.perfiles.push(req.body.perfiles);
    }


    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : "null"
    })
};
