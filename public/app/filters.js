window.angular.module('bp4.filters', [])

  .filter('startFrom', function() {
    return function(input, start) {
      return input.slice(start);
    }
  })

  .filter('nospace', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
    }
    })

  .filter('humanizeDoc', function() {
        return function(doc) {
            if (!doc) return;
            if (doc.type === 'directive') {
                return doc.name.replace(/([A-Z])/g, function($1) {
                    return '-'+$1.toLowerCase();
                });
            }
            return doc.label || doc.name;
        }
    })

  .filter('directiveBrackets', function() {
        return function(str) {
            if (str.indexOf('-') > -1) {
                return '<' + str + '>';
            }
            return str;
        }
    })
  .filter('html', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    })

    .filter('cut', function () {
        return function (value, length) {
            if (!value) {
                return '';
            }

            value = value.replace(/<(?:.|\n)*?>/gm, ' ');

            if (value.indexOf('&nbsp;') > -1) {
                value = value.split('&nbsp;&nbsp;&nbsp;&nbsp;').join(' ');
            }
            if (!length || value.length <= length) {
                return value;
            }
            return value.substr(0, length) + "...";
        }
    });



