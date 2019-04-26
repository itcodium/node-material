
var _ = require('underscore');

var MSSQLError=require('../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();
 
exports.videoContentFilterGetAll = function (req, res) {
    var params=[ 
               req.query.periodo,
               typeof req.query.convenio=='undefined'? '':  req.query.convenio,
                req.query.limit,
               req.query.page,
               req.query.order
           ];
      console.log("-----------------------------------------")
      console.log("param",params)
      console.log("-----------------------------------------")
      process.database.query('call video_contentFilter_getAll(?,?,?,?,?)', params,function (error,data, fields) {
           if (error) {
               res.status(500).send(ErrorSQL.getError(error));
           }
           console.log("data[0]",data[0][0].rows);
           res.jsonp({"rows": data[0][0].rows,
                       "data":data[1],
                       "convenios":data[2]
                       });
       });
};