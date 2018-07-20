window.app = angular.module('app', [ 'ngMaterial', 'ngMessages', 'ngQuill',
    'ngResource',  'ngRoute', 'moment-picker',
    'bp4.data.table',
    'bp4.controllers', 'bp4.directives', 'bp4.services', 'bp4.filters', 'bp4-tree']);

//'ngGrid', 'ui.grid.selection','ui.grid.exporter',  todo quitado 20160417

// cookies ver si esta relacionado al login (ver si hace falta)      todo caob 20160222
//'ngCookies', 'ui.bootstrap', 'ui.keypress',


window.angular.module('bp4.controllers', ['bp4.controllers.header','bp4.controllers.index']);
window.angular.module('bp4.services', ['bp4.services.global']);
window.angular.module('bp4.filters', ['bp4.filters']);
window.angular.module('bp4.directives', ['bp4.directives']);
