(function () {
    'use strict';

    angular
        .module('app')
        .service('cruceVISACOService', cruceVISACOService);

    function cruceVISACOService($http) {
        const URL_ESTVISACO = '/api/cruceVISACO/EstVISACO';
        const URL_TOTRECLAMOSVISA = '/api/cruceVISACO/TotReclamosVISA';
        const URL_TOTVISAASOCIADOS = '/api/cruceVISACO/TotVISAAsociados';
        const URL_TOTCAMBIOESTADO = '/api/cruceVISACO/TotCambioEstado';
        const URL_VISACODETALLE = '/api/cruceVISACO/VisaDetalle';
        const URL_MONEDAS = '/api/cruceVISACO/Monedas';
        const URL_FECPROCESO = '/api/cruceVISACO/FecProceso';
        const URL_EXPORTARDETALLE = '/api/cruceVISACO/ExcelDetalle';
        const URL_OBTENERTOTALESDETALLE = '/api/cruceVISACO/TotalesDetalle'
        const URL_ENVIARMAIL = '/api/cruceVISACO/EnviarMail'

        this.obtenerTotVISACO = function (filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_ESTVISACO,
                    method: "GET",
                    params: {
                        moneda: filters.moneda,
                        fecProceso: filters.fecProceso
                    }
                }).then(function (res) {
                        resolve(res.data[0])
                    },
                    function (err) {
                        reject(err.message)
                    });
            });
        };

        this.obtenerTotReclamosVISA = function (filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_TOTRECLAMOSVISA,
                    method: "GET",
                    params: {
                        moneda: filters.moneda,
                        fecProceso: filters.fecProceso
                    }
                }).then(function (res) {
                        resolve(res.data[0])
                    },
                    function (err) {
                        reject(err.message)
                    });
            })
        };

        this.obtenerTotVisaAsociados = function (filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_TOTVISAASOCIADOS,
                    method: "GET",
                    params: {
                        moneda: filters.moneda,
                        fecProceso: filters.fecProceso
                    }
                }).then(function (res) {
                        resolve(res.data[0])
                    },
                    function (err) {
                        reject(err.message)
                    });
            });
        };

        this.obtenerTotCambioEstado = function (filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_TOTCAMBIOESTADO,
                    method: "GET",
                    params: {
                        moneda: filters.moneda,
                        fecProceso: filters.fecProceso
                    }
                }).then(function (res) {
                        resolve(res.data[0]);
                    },
                    function (err) {
                        reject(err.message);
                    });
            });
        };

        this.obtenerDetalle = function (filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_VISACODETALLE,
                    method: "GET",
                    params: {
                        moneda: filters.moneda,
                        fecProceso: filters.fecProceso
                    }
                }).then(function (res) {
                        resolve(res.data[0])
                    },
                    function (err) {
                        reject(err.message)
                    });
            });
        };

        this.obtenerMonedas = function () {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_MONEDAS,
                    method: "GET"
                }).then(function (res) {
                        resolve(res.data[0]);
                    },
                    function (err) {
                        reject(err.message);
                    });
            })
        };

        this.obtenerUltimaFechaProceso = function () {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_FECPROCESO,
                    method: 'GET'
                }).then(function (res) {
                        resolve(res.data[0].fecProceso? res.data[0].fecProceso : new Date());
                    },
                    function (err) {
                        reject(err.message);
                    });
            })
        };

        this.exportarExcel = function (filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_EXPORTARDETALLE,
                    method: "GET",
                    params: {
                        moneda: filters.moneda,
                        fecProceso: filters.fecProceso
                    },
                    responseType: "arraybuffer"
                }).then(function (res) {
                        resolve(res);
                    },
                    function (err) {
                        reject(err.message);
                    });
            })
        };

        this.obtenerTotalesDetalle = function(filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_OBTENERTOTALESDETALLE,
                    method: "GET",
                    params: {
                        moneda: filters.moneda,
                        fecProceso: filters.fecProceso
                    }
                }).then(function (res) {
                    resolve(res);
                },
                function (err) {
                    reject(err.message);
                });
            })
        }

        this.enviarMail = function(filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_ENVIARMAIL,
                    method: 'GET',
                    params: {
                        moneda: filters.moneda,
                        fecProceso: moment(filters.fecProceso).format('YYYY-MM-DD')
                    }
                }).then(function (res) {
                    resolve(res);
                },
                function (err) {
                    reject(err.message);
                });
            })
        }
    }
})();