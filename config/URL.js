//var HOST="http://localhost:1616";
//var HOST="http://192.168.70.18:1616";

var HOST_WEB="http://181.211.36.247";

// http://181.211.36.247:8080
exports.HOST_PENTAHO="181.211.36.247";
exports.HOST_PENTAHO_PORT="8080";



exports.URL_PRECARGA=HOST_WEB+"/precargasignin";
exports.URL_PRECARGA_SIGNIN=HOST_WEB+"/precargasignin";
exports.URL_MODIFICAR_PASSWORD=HOST_WEB+"/modificarpassword";
exports.PATH_MIGRA_CONVENIOS="C:\\Users\\pablo.haddad\\aplicaciones\\mpp\\app\\mailer\\templates\\convenio\\Solicitud de Proceso Carga CONVENIOS (002).html";


exports.LDAP={
    URL:'ldap://192.168.70.19:389',
    PASSWORD:"snap2015.",
    USUARIOS:'ou=Users',
    ROOT:"dc=snap,dc=ec",
    GROUPS:'ou=Groups',
    getConection: function() {return 'cn=Manager,'+this.ROOT;}
}


exports.FTP={
    HOST:"181.211.36.247",
    PORT:"22",
    USUARIO: "pentaho",
    PASSWORD: "pentaho2015.",
    PATH:"/home/pentaho/pims/tramites/fact/procesar"
}



