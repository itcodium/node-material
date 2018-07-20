
app.controller('tramitesList.ctrl', ['$scope',"$resource","$routeParams",'datacontext','SugarCargaPortal','Tramite', 'Global',
	function ($scope, $resource,$routeParams,datacontext,SugarCargaPortal,Tramite, Global) {
 		$scope.tramites={};
		//console.log("$scope.ciudadano",$scope.ciudadano);
		// 1001977030

		Global.setModule('');


		//region Mensajes
		$scope.alerts = [];
		$scope.closeAlert = function (index) {
			if (index) {
				$scope.alerts.splice(index, 1);
			} else {
				$scope.alerts = [];
			}
		};

		function alertar(mensaje, type, timoff, strong, linkText, linkFunc) {
			datacontext.alertar($scope.alerts, mensaje, type, timoff, strong, linkText, linkFunc);
			refreshView();
		}

		function refreshView(obj) {
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
				$scope.$apply();
			}
		}
		//endregion Mensajes

		try {

			if(typeof  $routeParams.ciudadano != 'undefined') {

				var vCiudadano= $resource('/tramites');
				var vCiudadanoSugar= $resource('/ciudadanoSugar');

				$("#Container_Tramites").addClass("loadingContent");
				console.log("$routeParams.ciudadano", $routeParams.ciudadano);
				$scope.tramites=vCiudadano.query({cedulaCiudadanoRUC:  $routeParams.ciudadano},function(res) {

					vCiudadanoSugar.get({cedulaCiudadanoRUC: $routeParams.ciudadano},function(res) {
						$scope.ciudadano=res.data;
						if(res.result=="error"){
							alert(res.message)
						}
						console.log("+++ ciudadano ++++",res);
					});
					for (var i = 0; i < res.length; i++) {
						(function getPoll(tramite) {
							$("#"+tramite._id).css("padding","10").addClass("loadingContent");
							 var query={institucion : "",taxonomia :   ""};
							 query.institucion=tramite.institucion.instSigla;
							if (typeof tramite.taxonomia.taxCodTaxonomia != 'undefined' ){
								var vTaxonomia=tramite.institucion.instSigla;
								var vPolllist= $resource('/survey/encuestaPorTramite');
								var query={institucion : tramite.institucion._id ,taxonomia :   tramite.taxonomia._id,ciudadano: $routeParams.ciudadano};
								vPolllist.get(query,function(polllists){
									// console.log("< ******************** >",polllists, polllists.voted, polllists.survey);
									$scope.removeSpin(tramite._id);
									if(polllists.voted==false && polllists.survey!=-1){
										 $("#"+tramite._id).append('<a class="label label-info"  href=/#!/survey/'+polllists.survey+"/"+$routeParams.ciudadano+'>Encuesta</a>');
									}
									if(polllists.voted==true && polllists.survey!=-1){
										$("#"+tramite._id).append('<a class="label label-info"  href=/#!/surveyView/'+polllists.survey+"/"+$routeParams.ciudadano+'>ver evaluación</a>');
									}

									if(polllists.voted==false && polllists.survey==-1){
										  $scope.getDefaultDefaultPoll(tramite._id);
									}

								});
							}

						})(res[i]);
					//	$scope.addSpin(res[i]._id);
					}
					$("#Container_Tramites").removeClass("loadingContent");
					$("#container_search").show();
				});
			}else{
				alertar("No se ha encontrado ciudadano.");
			}
		}
		catch(err) {
			alertar(err.message, "danger");
		}


		$scope.removeSpin=function(pTramiteId){
			$("#"+pTramiteId).css("padding","0");
			$("#"+pTramiteId).css("border","0");
			$("#"+pTramiteId).removeClass("loadingContent");
		}

		$scope.addSpin=function(pTramiteId){
			$("#"+pTramiteId).addClass("loadingContent");
		}

		$scope.tramite_id=undefined;
		$scope.getDefaultDefaultPoll=function(tramite_id){
			//console.log("** getDefaultDefaultPoll ("+tramite_id+")**");

			if (typeof $scope.tramite_id!='undefined'){
				return;
			}
			$scope.tramite_id=tramite_id;
			if( typeof  $scope.defaultPoll=='undefined'){
				var vDefaultPoll= $resource('/survey/encuestaPorDefecto');
				$scope.tramite= vDefaultPoll.get({ciudadano: $routeParams.ciudadano}, function(poll) {
					console.log("+++ vDefaultPoll",poll)
						$("#"+tramite_id).css("background-color","transparent");
						$scope.removeSpin(tramite_id);

						$scope.defaultPoll=poll;
						if(poll.voted==false && poll.survey!=-1){
							$("#"+tramite_id).append('<a class="label label-info"  href=/#!/survey/'+poll.survey+"/"+$routeParams.ciudadano+'>Encuesta</a>');
						}
						if(poll.voted==true && poll.survey!=-1){
							$("#"+tramite_id).append('<a class="label label-info"  href=/#!/surveyView/'+poll.survey+"/"+$routeParams.ciudadano+'>ver evaluación</a>');
						}
						//console.log("$scope.defaultPoll",$scope.defaultPoll);
						//$("#"+tramite_id).append('<a class="label label-info"  href=/#!/survey/'+poll[0]._id+"/"+$routeParams.ciudadano+'>EVALUAR SERVICIO</a>');


				});
			}else{
				$("#"+tramite_id).attr("href", "/#!/survey/"+$scope.defaultPoll[0]._id+"/"+$routeParams.ciudadano).html("Encuesta ++");
				$scope.removeSpin(tramite_id);
			}
		}


	}]);

app.controller('tramiteItem.ctrl', ['$scope','$routeParams','$resource','socket','datacontext','TramitePortal',
	function ($scope, $routeParams, $resource,socket,datacontext,TramitePortal) {
		$scope.tramite={}

		$("#content_tramite").addClass("loadingContent");
		var vTramitePortal= $resource('/tramitePortal/:tramiteId');
		$scope.tramite= vTramitePortal.get({tramiteId:$routeParams.tramiteId}, function(res) {
			$("#content_tramite").removeClass("loadingContent");
			$("#content_tramite tramite").show();
		});



	}]);

