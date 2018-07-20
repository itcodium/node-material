var MOTIVORECHAZOS_COLUMNS=[
    { id: 11, show: false, name: 'idMotivoRechazos', field: 'idMotivoRechazos', tip: ''},
    { id: 12, show: true,name: 'Tipo',         field: 'tipo',          tip: ''},
    { id: 13, show: true, name: 'Código',       field: 'codigo',        tip: ''},
    { id: 14, show: true, name: 'Descripción',  field: 'descripcion',   tip: ''},
    { id: 15, show: true, name: 'Validación',   field: 'validacion',    tip: ''},
    { id: 15, show: false, name: 'Fecha de baja',field: 'fecBaja',       tip: ''},
]



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

var MotivoRechazosControl=function($scope,$resource,$filter,$mdEditDialog,Global,$q,MotivoRechazos,$mdToast,$mdDialog){
    var _this=this;
    var url='/api/MotivosDeRechazo';
    this.operac="";
    this.getData=function() {
        function getFecha(data){
            if (data!=null){
                var fecha=data.replace("Z"," ").replace("T"," ");
                return new Date(fecha);
            }
            return null
        }

        $scope.motivoRechazos.selected=[];
        var _this=this;
        var deferred = $q.defer();
        $scope.promiseMotivoRechazos = deferred.promise;
        $resource(url).query(
            function success(data) {
                angular.forEach(data, function (item) {
                    item["fecBaja"]=getFecha(item["fecBaja"]);
                });
                $scope.motivoRechazos.data = data;
                deferred.resolve();
            },
            function error(err) {
                _this.showToast('error', err.data.message);
                $scope.motivoRechazos.data={};
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
        $scope.motivosRechazo={};
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
            templateUrl: 'app.views/motivosDeRechazo/add.html'
        }).then(function () {});
    }

    this.modalController=function ($scope, $mdDialog,ParentScope) {
        $scope.ParentScope = ParentScope;
        $scope.motivosRechazo=$scope.ParentScope.motivosRechazo;
        console.log("$scope.motivosRechazo",$scope.motivosRechazo);

        if($scope.motivosRechazo.fecBaja==null){
            var minDate=new Date();
            var day   = minDate.getDate();
            var month   = minDate.getMonth();
            var year    = minDate.getFullYear();
            $scope.motivosRechazo.fecBaja=new Date(year, month, day);
        }
        console.log("$scope.motivosRechazo.fecBaja",$scope.motivosRechazo.fecBaja)

        $scope.hide = function() {
            if(!$scope.motivosRechazo){
                $scope.motivosRechazo.fecBaja=null;
            }
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            if(!$scope.motivosRechazo){
                $scope.motivosRechazo.fecBaja=null;
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
                data.tipo_codigo=res.length;
            },_this.error);
    }

    this.selectCheckbox=function(index, row){
        $scope.motivoRechazos.selected=[];
        for(var i=0;i<$scope.motivoRechazos.data.length;i++){
             if($scope.motivoRechazos.data[i].idMotivoRechazos!=row.idMotivoRechazos){
                 $scope.motivoRechazos.data[i].selected=false;
             }
        }
        if(row.selected==true){
            $scope.motivoRechazos.selected.push(row);
            $scope.motivosRechazo=row;
        }
    }


    this.insert=function(form,data){
        if (form.$valid && data.tipo_codigo==0) {
            data.usuario= Global.currentUser.name
            MotivoRechazos.save(data, _this.ok,_this.error);
        }
    }
    this.update=function (form,data){
        if (form.$valid) {
            data.usuario= Global.currentUser.name
            MotivoRechazos.update({ idMotivoRechazos: data.idMotivoRechazos },data,_this.ok,_this.error);
        }
    }
    this.delete=function (form,data){
        if (form.$valid) {
            data.usuario= Global.currentUser.name
            data.baja=1;
            MotivoRechazos.update({ idMotivoRechazos: data.idMotivoRechazos },data, _this.ok,_this.error);
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
        $scope.motivoRechazos.data =$filter('orderBy')($scope.motivoRechazos.data , order,reverse);
    }
    this.removeFilter=function () {
        $scope.motivoRechazos.filter.show = true;
        $scope.motivoRechazos.query.filter = '';
        if(typeof $scope.motivoRechazos.formFilter!='undefined'){
            if ($scope.motivoRechazos.formFilter.$dirty) {
                $scope.motivoRechazos.formFilter.$setPristine();
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



app.controller('motivosDeRechazo.ctrl',
    function ($scope,$resource,$filter,$mdEditDialog,Global, $q,MotivosDeRechazo,$mdToast,$mdDialog ) {
        $scope.motivoRechazos= {
            "selected": [],
            "columns":MOTIVORECHAZOS_COLUMNS,
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
                limit: '5',
                order: 'proceso',
                page: 1,
            }
        };
        $scope.tiposMotivosRechazo=[{text:"TC",value:"TC"},{text:"TD",value:"TD"}];
        $scope.config=new MotivoRechazosControl($scope,$resource,$filter,$mdEditDialog,Global, $q,MotivosDeRechazo,$mdToast,$mdDialog );


        var minDate=new Date();
        var day   = minDate.getDate();
        var month   = minDate.getMonth();
        var year    = minDate.getFullYear();
        $scope.minFecBaja=new Date(year, month, day);

        $scope.config.getData();

    });





