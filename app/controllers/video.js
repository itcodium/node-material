
var _ = require('underscore');

var MSSQLError=require('../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();
 
exports.videoContentFilterGetAllV1 = function (req, res) {

    console.log("req.query: ", req.query)
    var order={};
    var index=req.query.order[0];
    console.log("req.query.order[2].dir: ", req.query.order)
    var name=req.query.columns[index].name;

    if(name){
        try {
            order=JSON.parse("{\""+name +"\":\""+ req.query.order[2].dir+"\"}");
        }
        catch(err) {
            res.status(500).jsonp({"message":err.message});
        }
    }
    console.log("++ order +++ : ", order);
    var perPage=parseInt(req.query.length);
    var page=parseInt(req.query.start);

    var new_order="";
    new_order=req.query.order[2].dir=='asc' ?"+":"-";

    if(!name){
        new_order=new_order+"id";
    }else{
        new_order=new_order+name;
    }
    var params=[ 
        req.query.periodo,
        typeof req.query.convenio=='undefined'? '':  req.query.convenio,
        perPage,
        page,
        new_order
    ];
    console.log("+ params + ",params)
    process.database.query('call video_contentFilter_getAll(?,?,?,?,?)', params,function (error,data, fields) {
        if (error) {
            res.status(500).send(ErrorSQL.getError(error));
            
        }
        console.log("data[0]",data[0][0].rows);
                    res.jsonp(
                        {   data: data[1],
                            current: page,
                            draw: req.query.draw,
                            recordsTotal: data[0][0].rows,
                            recordsFiltered: data[0][0].rows
                        }
                    );

    });

};

 

exports.videoContentFilterGetAllV0 = function (req, res) {
    console.log("req.query: ", req.query);
    var new_order=req.query.sort_order=='asc' ?"+":"-";
    if(!req.query.sort_field){
        new_order=new_order+"id";
    }else{
        new_order=new_order+req.query.sort_field;
    }
    var params=[ 
        req.query.periodo,
        typeof req.query.convenio=='undefined'? '':  req.query.convenio,
        req.query.quantity,
        req.query.from,
        new_order
    ];
    process.database.query('call video_contentFilter_getAll(?,?,?,?,?)', params,function (error,data, fields) {
        if (error) {
            res.status(500).send(ErrorSQL.getError(error));
        }
        console.log("data[0]",data[0][0].rows);
                    res.jsonp(
                        [  { filters: data[1],
                            current: req.query.start,
                            parameters: req.query,
                            total: data[0][0].rows,
                            totalFiltered: data[0][0].rows}
                        ]
                    );
    });
};

exports.contentSimple = function (req, res) {
    var params=[ 
              req.query.periodo,
              typeof req.query.convenio=='undefined'? '':  req.query.convenio,
               req.query.limit,
              req.query.page * req.query.limit,
              req.query.order
          ];
     console.log("-----------------------------------------")
     console.log("param",params);
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
 
exports.contentReorder = function (req, res) {
  
    console.log("req.body: ",req.body );
    var paramsSql=[req.body.idOrigen,req.body.idDest];
    console.log("paramsSql: ",paramsSql);
    
    process.database.query('call video_contentFilter_ChangeOrder(?,?)', paramsSql,function (error,data, fields) {
        if (error) {
            console.log("error 0",error);
             res.jsonp({"status":"ERROR","message": error.sqlMessage });
        }else{
            console.log("ok",data);
            res.jsonp({"rows": 22});
        }
    });
};

 



    /*
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
       */