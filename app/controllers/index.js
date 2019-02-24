var async = require('async')
    , _ = require('underscore');


exports.render = function(req, res){
    
    ObjUpdate.perfiles.push(req.body.perfiles);
    
    ObjUpdate={};
    ObjUpdate.perfiles = [];
    ObjUpdate.idUsuario= 54;
    ObjUpdate.nombre= 'desa';
    ObjUpdate.email= 'test@hotmail.com';
    ObjUpdate.name= 'admin';
    ObjUpdate.idPerfil= 4;
    ObjUpdate.codigo_perfil= 'SUPERVISOR';
    ObjUpdate.nivelSeguridad= 1;
    ObjUpdate.username = "desa";
    ObjUpdate.modificado_por = "admin";
    ObjUpdate.fecha_modificacion = new Date();


    res.render('index', {
        user: ObjUpdate ? JSON.stringify(ObjUpdate) : "null"
    })
};
