function formatNumber(nro,mil,decimal){
    if(nro==null){
        return nro;
    }

    var res= nro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, mil);
    var aNro=res.split(decimal)
    var decimalPadding;
    if(typeof aNro[1]=='undefined'){
        aNro[1]=0
    }
    decimalPadding=paddingRight(aNro[1],"0",2)

    return aNro[0]+decimal+decimalPadding;
}

function paddingRight(s, c, n) {
    s=s.toString();
    if (! s || ! c || s.length >= n) {
        return s;
    }
    var max = (n - s.length)/c.length;
    for (var i = 0; i < max; i++) {
        s += c;
    }
    return s;
}



var Componentes= (function () {
    function Grilla($http,$filter,Toast) {
        var _this=this;
        _this.config= {
            url:"",
            promise:{},
            showNoRegister:false,
            filterShow:false,
            filtered:{},
            columns:{},
            filter: {
                options: { debounce: 500 }
            },
            query: {
                limit: 5,
                order: '',
                page: 1,
                where: ''
        },
            count: 0,
            queryParams:function(param){
                if (typeof param!='undefined'){
                    var params="";
                    var data={};
                    var obj=this.query;
                    var params=   "codigo="+ obj.codigo;
                    params=params+"&limit="+ obj.limit;
                    params=params+"&page="+ obj.page;
                    params=params+"&order="+ obj.order;
                    params=params+"&where="+ obj.where;

                    data.codigo=obj.codigo;
                    data.limit=obj.limit;
                    data.page=obj.page;
                    data.order= obj.order;
                    data.where= obj.where;
                    return data;
                }else{
                    return this.query;
                }
            }
        }
        this.onPaginate= function(page, limit,codigo) {
            if(_this.paginadoDb){
                console.log("onPaginate _this.paginadoDb",_this.paginadoDb)
                _this.config.query.page= page;
                _this.config.query.limit= limit;
                _this.HttpGet();
            }

        };
        this.onReorder=function(order){
            if (_this.paginadoDb){
                _this.config.query.order=order;
                _this.HttpGetFromDB();
            } else {
                var reverse= (order[0]=='-');
                if(order[0]=='-')
                    order=order.replace("-","")
                _this.config.query.order=order;
                _this.data =$filter('orderObjectBy')(_this.data , order,reverse);
            }
        }

        this.callback= function(res){
            // esta funcion espera un array[2], array[0]=datos de la tabla , array[1]= cantidad de filas
           // console.log("CALLBACK -> ", res.data.length," rows -> ",res.data[1][0].rows)
            if (res.data.length>1){
                _this.data=res.data[0];
                if (_this.data.length > 1){
                    _this.config.count = res.data[1][0].rows;
                }
                //Se agrego para mostrar los totales
                if (_this.config.dataFootTable)
                    _this.footData = res.data[_this.config.dataFootTable];
            }else{
                _this.data=res.data[0];
                _this.config.showNoRegister=true;
                _this.config.count = res.data[0].length;
            }
        }
        this.onCheck=function(index,param){
            // console.log("index,param, _this.multipleSelect ",_this.multipleSelect ,index,param)

            if(_this.multipleSelect!=true){
                for(var i=0;i<_this.data.length;i++){
                    if(!Object.is(_this.data[i], param)){
                        _this.data[i].selected=false;
                    }else{
                        if(_this.data[i].selected){
                            _this.selectedItem=_this.data[i];
                        }else{
                            _this.selectedItem=undefined;
                        }
                    }
                }
            }
            this.onAfterCheck(param);

        }
        this.onAfterCheck=function(){}

        this.HttpGet=function(callback){
            if(typeof callback!='undefined') {
                this.callback=callback  ;
            }

            _this.config.filtered=true;
            _this.config.showNoRegister=false;
            _this.config.promise=$http({url: _this.config.url,method: "GET",params: _this.config.queryParams()}).then(
                _this.callback , function(error){
                Toast.showError("Error al obtener datos de la grilla, "+error.data.message,'Error');
            });
        }

        this.HttpGetFromDB=function(param){
            _this.config.filtered=true;
            _this.config.showNoRegister=false;
            _this.config.loading=true;
            _this.config.promise=$http({url: _this.config.url,method: "GET",params: _this.config.queryParams(param)}).then(function(res){
                console.log("1")
                if (res.data.length>1){
                    console.log("2")
                    _this.data=res.data[0];
                    if (_this.data.length > 1) {
                        console.log("3")
                        _this.config.count = res.data[1][0].rows;

                    }
                    _this.config.showNoRegister=true;
                    _this.config.loading=false;
                }else{
                    console.log("4")
                    _this.data=res.data[0];
                    _this.config.loading=false;
                    _this.config.showNoRegister=true;
                }
            }, function(error){
                _this.config.loading=false;
                Toast.showError("Error al obtener datos de la grilla, "+error.data.message,'Error');
            });
        }

        this.showVal = function(value, filter) {
            if(value==null || typeof value=='undefined'){
                return "";
            }
            if (filter == 'date') {
                var fechaUpdate;

                if (typeof value!='object'){
                    fechaUpdate= value.replace("Z"," ").replace("T"," ");
                }else{
                    fechaUpdate=value;
                }
                return (moment(fechaUpdate).utc()._isValid) ? moment(fechaUpdate).local().format('DD/MM/YYYY') : fechaUpdate;
            }


            if (filter == 'jsondate'){

                if (value!=null){
                    var fecha=value.replace("Z"," ").replace("T"," ");
                    return moment(fecha).local().format('DD/MM/YYYY');
                }
                return null
            }



            if (filter == 'number'){
                // return  value.toLocaleString('en-IN');
                // $filter('number')(value, 2)
                // return value;
                 return formatNumber(parseFloat(value),",",".");
            }

            if (filter == 'int'){
                return $filter('number')(value, 0); //$filter('number')(value, 2);
            }
            if (filter == 'currency'){
                //return typeof value;
                return $filter('currency')(value,'',2)
            }
            if (filter == 'coef'){
                return $filter('number')(value, 4);
            }
            return value;
        };
        this.filtering = function (element) {
            return true;
        }

    }
    function ToolBar() {

    }

    return { Grilla: Grilla,
            ToolBar:ToolBar
    }
})()

app.component('grilla', {
    templateUrl: 'app.partials/componentes/grilla.html',
    bindings: {
        data: '=',
        orderByDB:'=',
        footData: '=',
        mostrarPaginacion:'=',
        paginadoDb:'=',
        selectedGrid:'=',
        multipleSelect:'='

    },
    controller: function($scope) {
        if( typeof this.data!='undefined'){
            $scope.grilla=this.data;
        }else{
            $scope.grilla={};
        }
        $scope.grilla.paginadoDb=(typeof  this.paginadoDb=='undefined'?false:this.paginadoDb);
        $scope.grilla.selectedGrid=this.selectedGrid;

        $scope.grilla.multipleSelect=(typeof  this.multipleSelect=='undefined'?true:this.multipleSelect);
        $scope.mostrarPaginacion= (typeof  this.mostrarPaginacion=='undefined'?true:this.mostrarPaginacion);
        $scope.orderByDB= (typeof  this.orderByDB=='undefined'?false:this.orderByDB);

    }
});

/*

Pasar tooltipo al boton:

    show_download:{tooltip:"Dolares"},
    show_download:true; por defecto se puestra el tooltip: "Exportar Excel"

*/

app.component('toolbar', {
    templateUrl: 'app.partials/componentes/toolbar.html',
    bindings: {
        data: '='
    },
    controller: function($scope) {
        $scope.toolbar={};

        toolbar.show_insert={};
        toolbar.show_update={};
        toolbar.show_delete={};

        $scope.toolbar=this.data;
        $scope.toolbar.data="0001";
        $scope.toolbar.showFilter=false;
        $scope.submit=function(){
          //  alert("test-> "+$scope.toolbar.data)
        }
    }
});


