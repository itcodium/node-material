(function(){
    'use strict';

    angular
        .module('app')
        .controller('entesExternos.caratulas.ctrl', EntesExternosCaratulasCtrl);

    function EntesExternosCaratulasCtrl(registros, $scope) {
        /* jshint validthis:true */
        var vm = this;
        $scope.registros = registros;

        activate();

        function activate() {
            setTimeout(function() {
                previewPDF();
            }, 1000);
            
        }

        function previewPDF() {
            var doc = new jsPDF();
            
            $scope.registros.forEach((element, index, array) => {

                doc.setFontSize(14);
                doc.setTextColor(63, 132, 202);
                doc.text(5, 10, 'Totales Entes Externos');

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                doc.setFontType('bold');
                doc.text(100, 25, 'Ente:', null, null, 'right');
                doc.text(105, 25, element.ente);

                doc.text(100, 31, 'Fec.Generación:', null, null, 'right');
                doc.text(130, 31, moment(element.fecGeneracion).local().format('DD/MM/YYYY'), null, null, 'right');

                doc.setFontSize(10);
                doc.setFontType('normal');
                doc.text(100, 41, 'Cant', null, null, 'right');
                doc.text(130, 41, element.Cant.toString(), null, null, 'right');

                doc.text(100, 47, 'Total Cobrado', null, null, 'right');
                doc.text(130, 47, formatNumber(element.totalCobrado,',','.'), null, null, 'right');

                doc.text(100, 53, 'Total Comision', null, null, 'right');
                doc.text(130, 53, formatNumber(element.totalComision,',','.'), null, null, 'right');

                doc.text(100, 59, 'Iva', null, null, 'right');
                doc.text(130, 59, formatNumber(element.IVA,',','.'), null, null, 'right');
                
                doc.text(170, 280, moment().format('DD/MM/YYYY'));

                if (index !== array.length -1 )
                    doc.addPage();
            });

            let iframe = document.createElement('iframe');
            iframe.setAttribute('style','height:80vh; width:95%');
            iframe.src = doc.output('datauristring');
            document.querySelector('.contentPDF').appendChild(iframe);

        }

        function formatNumber(nro,mil,decimal){
            var res= nro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, mil);
            var aNro=res.split(decimal)
            var decimalPadding;
            if(typeof aNro[1] == 'undefined'){
                aNro[1] = 0;
            }
            decimalPadding=paddingRight(aNro[1], '0', 2);
        
            return aNro[0] + decimal + decimalPadding;
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
        
    }
})();