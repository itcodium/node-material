
var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.categoriasGetAll= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.Categorias_Traer').then(function(recordset) {
            res.jsonp(recordset[0])
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};

exports.conveniosGetAll= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.convenios_traer').then(function(recordset) {
            res.jsonp(recordset[0])
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};

exports.categoriaConvenioGetAll= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.categoriaConvenio_traer').then(function(recordset) {
            res.jsonp(recordset[0])
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};



exports.GetById= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idCodigo', sql.Int, req.params.idCodigo)
            .execute('dbo.Categorias_TraerSeleccion').then(function(Item) {
                if(Item[0].length==0){
                    throw new Error("No se encontro el registro buscado.");
                }
                res.jsonp(Item[0][0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


exports.traerPorCategoriaCod= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idCodigo', sql.Int, req.params.idCodigo)
            .execute('dbo.categoriaConvenio_traerPorCategoriaCod').then(function(Item) {
            if(Item[0].length==0){
                throw new Error("No se encontraron registros.");
            }
            res.jsonp(Item[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.traerPorConvenio= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('convenio', sql.Int, req.params.convenio)
            .execute('dbo.categorias_traerPorConvenio').then(function(Item) {
                if(Item[0].length==0){
                    throw new Error("No se encontraron registros.");
                }
                res.jsonp(Item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};



exports.updateCategoriaConvenio= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idCategoriaConvenio', sql.Int, req.params.idCategoriaConvenio)
            .input('prioridad', sql.VarChar, req.body.prioridad)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.categoriasConvenio_Actualizar').then(function(item) {
                res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.insertCategoriaConvenio= function(req, res){
    console.log("insertCategoriaConvenio +++",req.body);
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('categoria', sql.VarChar, req.body.categoria )
            .input('convenio', sql.VarChar, req.body.convenio )
            .input('codSistema', sql.VarChar, req.body.codSistema )
            .input('prioridad', sql.Int,req.body.prioridad )
            .input('usuario', sql.VarChar,req.body.usuario )
            .execute('dbo.categoriaConvenio_insertar').then(function(item) {
                // console.log("insertCategoriaConvenio +++, OK",item);
                res.jsonp(item[0])
            }).catch(function(err) {
                console.log("insertCategoriaConvenio +++", err);
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


exports.delete= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idCodigo', sql.Int, req.params.idCodigo)
            .input('fecBaja', sql.Date, req.body.fecBaja)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.Categorias_Bajar').then(function(item) {
            res.jsonp(item[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};



exports.deleteConvenioCategoria= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idCategoriaConvenio', sql.Int, req.params.idCategoriaConvenio)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.categoriasConvenio_Bajar').then(function(item) {
                res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


exports.update= function(req, res){
    // console.log("req.body",req.body);
    var conveniosPrioridades=[];
    req.body.conveniosPrioridades.forEach(function(item) {
        conveniosPrioridades.push(
            {
                "idCategoriaConvenio": item.idCategoriaConvenio,
                "categoria":req.body.codigo,
                "convenio":item.convenio,
                "codigo":item.sistema,
                "prioridad":item.prioridad,
                "usuario":req.body.usuario
            });
    });

    this.conveniosPrioridades=conveniosPrioridades;
    // console.log("this.conveniosPrioridades",this.conveniosPrioridades);
    _this=this;

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idCodigo', sql.Int, req.params.idCodigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.Categorias_Actualizar').then(function(item) {
                var respuesta =item[0];
            // res.jsonp(item[0])
                // Modificar conveniosCategorias

                console.log("item",_this.conveniosPrioridades);
                var rp=new CategoriaConvenioBus(req,res);
                rp.setItems(_this.conveniosPrioridades)
                rp.setCallbackParams({});
                rp.setEndCallback(function(p){
                    console.log("5. PASOS EndCallback +++",respuesta);
                    res.jsonp(respuesta );
                });
                rp.initUpdate();

                //--------------------------------------------------------

        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};


exports.insert= function(req, res){
    var conveniosPrioridades=[];
    req.body.conveniosPrioridades.forEach(function(item) {
        conveniosPrioridades.push(
            {
                "idCategoriaConvenio":null,
                "sistema":req.body.codigo,
                "convenio":item.convenio,
                "codigo":item.sistema,
                "prioridad":item.prioridad,
                "usuario":req.body.usuario
            });
    });


    this.conveniosPrioridades=conveniosPrioridades;
    _this=this;

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.body.codigo)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.Categorias_ControlDuplicado').then(function(resp) {
                // console.log("VALID _this.conveniosPrioridades",_this.conveniosPrioridades);
            var connectionTwo = new sql.Connection(process.config.sql, function(err) {
                        new sql.Request(connectionTwo)
                            .input('codigo', sql.VarChar, req.body.codigo)
                            .input('descripcion', sql.VarChar, req.body.descripcion)
                            .input('usuario', sql.VarChar, req.body.usuario)
                            .execute('dbo.Categorias_Insertar').then(function(item) {
                                var respuesta =item[0];
                            // Insertar conveniosCategorias
                                console.log("item",_this.conveniosPrioridades);
                                var rp=new CategoriaConvenioBus(req,res);
                                rp.setItems(_this.conveniosPrioridades)
                                rp.setCallbackParams({});
                                rp.setEndCallback(function(p){
                                    console.log("5. PASOS EndCallback +++",respuesta);
                                    res.jsonp(respuesta );
                                });
                                rp.init();
                            //--------------------------------------------------------


                        })
            });
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};




var CategoriaConvenioBus= function (req,res) {
    // var pasos=[];
    var items=[];
    this.setItems=function(data) {
        console.log("** SET **",data)
        for(var i = data.length-1;   i>=0; i--){
            items.push(data[i]);
        }

    }
    var fin=function() {
        console.log("**** fin ****")
    }
    this.setEndCallback=function(p){
        end_callback=p;
    }
    this.setCallbackParams=function(pParams) {
        callbackParams=pParams;
    }
    this.init=function() {
        execute();
    }
    var execute=function() {
        if (items.length==0){
            end_callback(callbackParams);
            return;
        }
        var item=items.pop();
        run(item);
    }



    var run=function(item){
        console.log("RUN -> categoriaConvenio_insertar");
        var _item=item;
        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('idCategoriaConvenio', sql.Int, _item.idCategoriaConvenio )
                .input('categoria', sql.VarChar, _item.sistema )
                .input('convenio', sql.VarChar, _item.convenio )
                .input('codSistema', sql.VarChar, _item.codigo )
                .input('prioridad', sql.Int,_item.prioridad )
                .input('usuario', sql.VarChar,_item.usuario )
                .execute('dbo.categoriaConvenio_insertar').then(function (recordset) {
                    console.log("** RESPONSE recordset",recordset);
                    execute();
                }).catch(function (err) {
                    //console.log("PROC: RUN -",nombre,err)
                    //res.status(500).send(ErrorSQL.getError(err));
                    if(err.class != 14) {
                        console.log("1", err)
                        res.status(500).send(ErrorSQL.getError(err));
                    }else {
                        console.log("1", err)
                        res.status(207).send(ErrorSQL.getError(err));
                    }

                });
        });
    }

    var executeUpdate=function() {
        if (items.length==0){
            end_callback(callbackParams);
            return;
        }
        var item=items.pop();
        runUpdate(item);
    }
    this.initUpdate=function() {
        executeUpdate();
    }
    var runUpdate=function(item){

        var _item=item;
        console.log("RUN Update -> ", _item.idCategoriaConvenio,_item.categoria , _item.convenio, _item.codigo,_item.prioridad ,_item.usuario );

        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('idCategoriaConvenio', sql.Int, _item.idCategoriaConvenio )
                .input('categoria', sql.VarChar, _item.categoria )
                .input('convenio', sql.VarChar, _item.convenio )
                .input('codSistema', sql.VarChar, _item.codigo )
                .input('prioridad', sql.Int,_item.prioridad )
                .input('usuario', sql.VarChar,_item.usuario )

                .execute('dbo.categoriaConvenio_insertar').then(function (recordset) {
                    console.log("** RESPONSE recordset",recordset);
                    executeUpdate();
                }).catch(function (err) {
                    //console.log("PROC: RUN -",nombre,err)
                    //res.status(500).send(ErrorSQL.getError(err));
                    if(err.class != 14) {
                        console.log("1", err)
                        res.status(500).send(ErrorSQL.getError(err));
                    }else {
                        console.log("1", err)
                        res.status(207).send(ErrorSQL.getError(err));
                    }

                });
        });
    }
}
