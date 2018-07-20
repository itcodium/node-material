var codigoDeAjustes_COLUMNS=[
    { id: 10, show: false, name: 'idcodigoDeAjustes', field: 'idcodigoDeAjustes', tip: ''},
    { id: 11, show: true,name: 'Entidad',         field: 'entidad',          tip: ''},
    { id: 12, show: true, name: 'Descripción',  field: 'descripcion',   tip: ''},
    { id: 13, show: true, name: 'Emisor',       field: 'emisor',        tip: ''},
    { id: 14, show: true, name: 'Marca',   field: 'entidadMarca',    tip: ''},
    { id: 15, show: true, name: 'Código de ajuste',field: 'codAjuste',       tip: ''},
    { id: 16, show: true, name: 'Importe',field: 'importe',       tip: ''},
]


/*
app.filter('filterFieldsStartBy', function(){
    return function(dataArray, searchTerm,columns) {
        if (!dataArray) {
            return;
        }
        if (!searchTerm) {
            return dataArray;
        }
        else {
            if (typeof searchTerm == 'undefined') {
                return dataArray;
            }

            var term = searchTerm.toLowerCase();
            return dataArray.filter(function(item){
                var res=0;
                for (var i = 0; i < columns.length; i++) {
                    if(typeof item[columns[i]]!='undefined' && item[columns[i]]!=null){
                        res =res +item[columns[i]].toLowerCase().indexOf(term.toLowerCase()) ===0;
                        if(res){
                            break;
                        }
                    }
                }
                return res;
            });
        }
    }
});
*/
var codigoDeAjustesControl=function($scope,$resource,$filter,$mdEditDialog,Global,$q,$mdToast,$mdDialog){
    var _this=this;
    var url='/api/codigoDeAjustes';
    this.operac="";
    this.getData=function() {
        function getFecha(data){
            if (data!=null){
                var fecha=data.replace("Z"," ").replace("T"," ");
                return new Date(fecha);
            }
            return null
        }

        $scope.codigoDeAjustes.selected=[];
        var _this=this;
        var deferred = $q.defer();
        $scope.promisecodigoDeAjustes = deferred.promise;
        $resource(url).query(
            function success(data) {
                angular.forEach(data, function (item) {
                    item["fecBaja"]=getFecha(item["fecBaja"]);
                });
                $scope.codigoDeAjustes.data = data;
                deferred.resolve();
            },
            function error(err) {
                _this.showToast('error', err.data.message);
                $scope.codigoDeAjustes.data={};
                deferred.resolve();
            }
        );
    }

    this.openUpdateForm=function(){
        $scope.operac="Modificar";
        this.submit=this.update;
        _this.dialogShow()
    }
    this.openDeleteForm=function(){
        $scope.operac="Baja";
        this.submit=this.delete;
        _this.dialogShow()
    }
    this.openAddForm=function(){
        $scope.operac="Alta";
        this.submit=this.insert;
        $scope.CodigoAjustes={};
        _this.dialogShow()
    }
    this.dialogShow=function(){
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: _this.modalController,
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            locals: {
                ParentScope: $scope
            },
            templateUrl: 'app.views/codigoDeAjustes/add.html'
        }).then(function () {});
    }

    this.modalController=function ($scope, $mdDialog,ParentScope) {
        $scope.ParentScope = ParentScope;
        $scope.CodigoAjustes=$scope.ParentScope.CodigoAjustes;
        console.log("$scope.CodigoAjustes",$scope.CodigoAjustes);

        if($scope.CodigoAjustes.fecBaja==null){
            var minDate=new Date();
            var day   = minDate.getDate();
            var month   = minDate.getMonth();
            var year    = minDate.getFullYear();
            $scope.CodigoAjustes.fecBaja=new Date(year, month, day);
        }
        console.log("$scope.CodigoAjustes.fecBaja",$scope.CodigoAjustes.fecBaja)

        $scope.hide = function() {
            if(!$scope.CodigoAjustes){
                $scope.CodigoAjustes.fecBaja=null;
            }
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            if(!$scope.CodigoAjustes){
                $scope.CodigoAjustes.fecBaja=null;
            }
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

    this.validTipoCodigo=function(data){
        if(typeof data.tipo=='undefined' || typeof data.codigo=='undefined' ){
            return;
        }
        $resource(url+".ControlDuplicado").query(data,
            function success(res) {
                data.entidad_codigo=res.length;
            },_this.error);
    }

    this.selectCheckbox=function(index, row){
        $scope.codigoDeAjustes.selected=[];
        for(var i=0;i<$scope.codigoDeAjustes.data.length;i++){
             if($scope.codigoDeAjustes.data[i].idcodigoDeAjustes!=row.idcodigoDeAjustes){
                 $scope.codigoDeAjustes.data[i].selected=false;
             }
        }
        if(row.selected==true){
            $scope.codigoDeAjustes.selected.push(row);
            $scope.CodigoAjustes=row;
        }
    }


    this.insert=function(form,data){
        console.log("form.$valid && data.entidad_codigo",form.$valid && data.entidad_codigo)
        if (form.$valid && data.entidad_codigo==0) {
            data.usuario= Global.currentUser.name
            codigoDeAjustes.save(data, _this.ok,_this.error);
        }
    }
    this.update=function (form,data){
        if (form.$valid) {
            data.usuario= Global.currentUser.name
            codigoDeAjustes.update({ idcodigoDeAjustes: data.idcodigoDeAjustes },data,_this.ok,_this.error);
        }
    }
    this.delete=function (form,data){
        if (form.$valid) {
            data.usuario= Global.currentUser.name
            data.baja=1;
            codigoDeAjustes.update({ idcodigoDeAjustes: data.idcodigoDeAjustes },data, _this.ok,_this.error);
        }
    }

    this.ok=function(res){
        _this.showToastSuccess();
        _this.getData();
        $mdDialog.hide();
    }
    this.error=function(err){
        if(typeof err.data.message=='undefined'){
            _this.showToast("Error",err.statusText);
        }else{
            _this.showToast("Error",err.data.message);
        }
    }
    this.submit=function(){
        console.log("Submit")
    }





    this.onReorder=function(order) {
        var reverse=order[0]=='-'?true:false;
        if(order[0]=='-'){
            order=order.replace("-","")
        }
        $scope.codigoDeAjustes.data =$filter('orderBy')($scope.codigoDeAjustes.data , order,reverse);
    }
    this.removeFilter=function () {
        $scope.codigoDeAjustes.filter.show = true;
        $scope.codigoDeAjustes.query.filter = '';
        if(typeof $scope.codigoDeAjustes.formFilter!='undefined'){
            if ($scope.codigoDeAjustes.formFilter.$dirty) {
                $scope.codigoDeAjustes.formFilter.$setPristine();
            }
        }
    }

     this.showVal = function(value, filter) {
        if (filter == 'date') {
            return moment(value).utc().format('DD/MM/YYYY')
        }
        if (filter == 'number') {
            return $filter('number')(value, 2);
        }
        if (filter == 'coef') {
            return $filter('number')(value, 4);
        }
        return value;
    };

    this.showToastSuccess = function() {
        _this.showToast('toastSuccess','La operación se realizó correctamente.')
    };

    this.showToast = function(type, msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast ' + type +'">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '#toastSelect',
            position: 'top left'
        });
    };
}


app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});



app.controller('codigoDeAjustes.ctrl',
    function ($scope,$resource,$filter,$mdEditDialog,Global, $q,$mdToast,$mdDialog ) {
        $scope.codigoDeAjustes= {
            "selected": [],
            "columns":codigoDeAjustes_COLUMNS,
            "data": [],
            "count": 0,
            "filter": {
                show: true,
                options: {
                    debounce: 500
                }
            },
            "query": {
                filter: '',
                limit: '10',
                order: 'proceso',
                page: 1,
            }
        };
        $scope.tiposCodigoAjustes=[{text:"67",value:"67"},{text:"667",value:"667"},{text:"90",value:"90"},{text:"91",value:"91"}];
        $scope.config=new codigoDeAjustesControl($scope,$resource,$filter,$mdEditDialog,Global, $q,$mdToast,$mdDialog );


        var minDate=new Date();
        var day   = minDate.getDate();
        var month   = minDate.getMonth();
        var year    = minDate.getFullYear();
        $scope.minFecBaja=new Date(year, month, day);

        $scope.config.getData();

    });





