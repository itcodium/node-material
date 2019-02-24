
/*
 *  Generic require login routing middleware
 */

//console.log("- originalMethod -",req.originalMethod.toUpperCase());
// console.log("- path-",req.route.path.toUpperCase());

/*
    var  UserAuthorization= require('../checkUserAuthorization');

    En la carpeta  config/routes.js de la aplicacion se encuentra la configuracion de la ruta
    para la acordeon del tramite

    Ruta:
          app.post('/TramitePortal', auth.requiresLogin, vTramitePortal.create)

    Para poder hacer un POST y cargar un tramite el usuario tienen que tener asignada
    la accion que en este ejemplo es TRAMITE_CARGA_MANUAL

    En el caso de que el usuario no tenga permisos se envia un mensaje.
*/

exports.requiresLogin = function (req, res, next) {
    /*
    if (!req.isAuthenticated()) {
        if (req.session) {
            req.session._garbage = undefined;
            req.logout();
            req.session.destroy(function (err) {
                res.redirect(500, '/signin');
            });
        }
        else {
            res.redirect(500, '/signin');
        }
    }
    else {
        next()
    }
    */
   next()
};


exports.requiresLoginSql = function (req, res, next) {
    /*
    if (req.query.token != 'aa4b5a08e686243bbf06c424c01d5fa93f61f6252da6e4b738342249ee9d0e90bad809') {
        res.end('Unauthorized');
    }
    */
    next()
};


/*
 *  User authorizations routing middleware
 */


exports.user = {
    hasAuthorization : function (req, res, next) {
    /*  if (req.profile.id != req.user.id) {
        return res.redirect('/users/'+req.profile.id)
      } */
      next()
    }
    
}


/*
 *  Article authorizations routing middleware
 */

// exports.article = {
//     hasAuthorization : function (req, res, next) {
//       if (req.article.user.id != req.user.id) {
//         return res.redirect('/articles/'+req.article.id)
//       }
//       next()
//     }
// }
