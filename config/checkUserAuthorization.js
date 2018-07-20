////var mongoose = require('mongoose')
//
//
//
exports.isAuthorized =function (req,path,method,accion){
    return true;
    /*
    // req.user.permisos
    console.log("-7authorized-",req.route.path.toUpperCase(),authorized);
    return true;

    var authorized=false;

     if(req.route.path.toUpperCase()==path && req.originalMethod.toUpperCase()==method){
        console.log("** + - req.user.perfiles",req.user.perfiles);
        if (typeof req.user.perfiles === 'undefined' ){
             console.log("+-+-+-+- El usuario no tiene permisos asignados. *****")
            return new Error("El usuario no tiene permisos asignados.")
        }
         for (i = 0; i < user.perfiles.length; i++) {user.perfiles[i].populate("acciones");}
        for (var i = 0; i < req.user.perfiles.length; i++) {
              for (var j = 0; j < req.user.perfiles[i].acciones.length; j++) {
                  var vAccion=req.user.perfiles[i].acciones[j];
                   console.log("---- vAccion.code,accion.code ----","(",vAccion.code," - ",accion,")");
                   console.log("req.user.perfiles["+ i.toString()+"].acciones["+ j.toString()+"]",req.user.perfiles[i].acciones[j]);
                   if(vAccion.code==accion){
                        authorized=true;
                       console.log("* TRUE *");
                   }
            }
        }

    }


    return authorized;
     */
}
