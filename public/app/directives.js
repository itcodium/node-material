window.angular.module('bp4.directives', [])
    .directive('limitDigits', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                angular.element(elem).on('keypress', function (e) {
                    var digits = attrs.limitDigits;
                    if (this.value.length == digits) {
                        e.preventDefault();
                    }
                })
            }
        }
    })
    //this one... Im not sure if it is in use or will be in the future, lets see later. Caob. --todo caob--
    .directive('fileModel', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function(){
            scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
            });
          });
        }
      };
    }])

    .directive('focusSearch', function ($timeout, $parse) {
        return {
            link: function(scope, element, attrs) {
                var model = $parse(attrs.focusSearch);
                scope.$watch(model, function(value) {
                    if(value === true) {
                        $timeout(function() {
                            element[0].focus();
                        }, 200);
                    }
                });
                // element.bind('blur', function() {
                //     console.log('blur');
                //     scope.$apply(model.assign(scope, false));
                // });
            }
        };
    })

    .directive('menuLink', function() {
        return {
            scope: {
                section: '='
            },
            templateUrl: '../app.partials/menu-link.tmpl.html',
            link: function($scope, $element) {
                var controller = $element.parent().controller();

                $scope.isSelected = function() {
                    return controller.isSelected($scope.section);
                };

                $scope.focusSection = function() {
                    // set flag to be used later when
                    // $locationChangeSuccess calls openPage()
                    controller.autoFocusContent = true;
                };
            }
        };
    })

    .directive('menuToggle', [ '$timeout', '$mdUtil', function($timeout, $mdUtil) {
        return {
            scope: {
                section: '='
            },
            templateUrl: '../app.partials/menu-toggle.tmpl.html',
            link: function($scope, $element) {
                var controller = $element.parent().controller();

                $scope.isOpen = function() {
                    return controller.isOpen($scope.section);
                };
                $scope.toggle = function() {
                    controller.toggleOpen($scope.section);
                };

                $mdUtil.nextTick(function() {
                    $scope.$watch(
                        function () {
                            return controller.isOpen($scope.section);
                        },
                        function (open) {
                            var $ul = $element.find('ul');

                            var targetHeight = open ? getTargetHeight() : 0;
                            $timeout(function () {
                                $ul.css({height: targetHeight + 'px'});
                            }, 0, false);

                            function getTargetHeight() {
                                var targetHeight;
                                $ul.addClass('no-transition');
                                $ul.css('height', '');
                                targetHeight = $ul.prop('clientHeight');
                                $ul.css('height', 0);
                                $ul.removeClass('no-transition');
                                return targetHeight;
                            }
                        }
                    );
                });

                var parentNode = $element[0].parentNode.parentNode.parentNode;
                if(parentNode.classList.contains('parent-list-item')) {
                    var heading = parentNode.querySelector('h2');
                    $element[0].firstChild.setAttribute('aria-describedby', heading.id);
                }
            }
        };
    }])

