window.angular.module('bp4.controllers.header', [])

    //warning: there´r 3 controllers included... see above, caob.

    .controller('MenuCtrl',
        //['$scope', 'Global', '$timeout', '$mdSidenav', '$log',
        // testing: Apparently this (way of enunciation) is no longer necessary, todo caob.

        function ($scope, Global, $timeout, $mdSidenav, $log, $mdDialog, menu, $location, $rootScope) {

            var self = this;

            debugger
            $scope.global = Global;

            Global.setModule('TC');  //todo caob

            $scope.toggleLeft = buildDelayedToggler('left');
            $scope.toggleRight = buildToggler('right');
            $scope.isOpenRight = function () {
                return $mdSidenav('right').isOpen();
            };

            /**
             * Supplies a function that will continue to operate until the
             * time is up.
             */
            function debounce (func, wait, context) {
                var timer;

                return function debounced () {
                    var context = $scope,
                        args = Array.prototype.slice.call(arguments);
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        timer = undefined;
                        func.apply(context, args);
                    }, wait || 10);
                };
            }

            /**
             * Build handler to open/close a SideNav; when animation finishes
             * report completion in console
             */
            function buildDelayedToggler (navID) {
                return debounce(function () {
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            $log.debug("toggle " + navID + " is done");
                        });
                }, 200);
            }

            function buildToggler (navID) {
                return function () {
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            $log.debug("toggle " + navID + " is done");
                        });
                }
            }


            $scope.menu = menu;

            $scope.path = path;
            $scope.goHome = goHome;
            $scope.openMenu = openMenu;
            $scope.closeMenu = closeMenu;
            $scope.isSectionSelected = isSectionSelected;

            // Grab the current year so we don't have to update the license every year
            $scope.thisYear = (new Date()).getFullYear();

            $rootScope.$on('$locationChangeSuccess', openPage);
            $scope.focusMainContent = focusMainContent;

            //-- Define a fake model for the related page selector
            Object.defineProperty($rootScope, "relatedPage", {
                get: function () { return null; },
                set: angular.noop,
                enumerable: true,
                configurable: true
            });

            $rootScope.redirectToUrl = function (url) {
                $location.path(url);
                $timeout(function () { $rootScope.relatedPage = null; }, 100);
            };

            // Methods used by menuLink and menuToggle directives
            this.isOpen = isOpen;
            this.isSelected = isSelected;
            this.toggleOpen = toggleOpen;
            this.autoFocusContent = false;


            var mainContentArea = document.querySelector("[role='main']");

            // *********************
            // Internal methods
            // *********************

            function closeMenu () {
                $timeout(function () { $mdSidenav('left').close(); });
            }

            function openMenu () {
                $timeout(function () { $mdSidenav('left').open(); });
            }

            function path () {
                return $location.path();
            }

            function goHome ($event) {
                menu.selectPage(null, null);
                $location.path('/');
            }

            function openPage () {
                $scope.closeMenu();

                if (self.autoFocusContent) {
                    focusMainContent();
                    self.autoFocusContent = false;
                }
            }

            function focusMainContent ($event) {
                // prevent skip link from redirecting
                if ($event) { $event.preventDefault(); }

                $timeout(function () {
                    mainContentArea.focus();
                }, 90);

            }

            function isSelected (page) {
                return menu.isPageSelected(page);
            }

            function isSectionSelected (section) {
                var selected = false;
                var openedSection = menu.openedSection;
                if (openedSection === section) {
                    selected = true;
                }
                else if (section.children) {
                    section.children.forEach(function (childSection) {
                        if (childSection === openedSection) {
                            selected = true;
                        }
                    });
                }
                return selected;
            }

            function isOpen (section) {
                return menu.isSectionSelected(section);
            }

            function toggleOpen (section) {
                menu.toggleSelectSection(section);
            }


        })


    .controller('ToolbarCtrl', function ($scope, $timeout, $mdSidenav, $window, $log, $location, $route, menu) {

        $scope.menu = menu;


        $scope.fbisOpen = false;
        $scope.fbhidden = false;
        $scope.fbhover = false;


        $scope.$watch('fb.isOpen', function (isOpen) {
            if (isOpen) {
                $timeout(function () {
                    $scope.tooltipVisible = self.isOpen;
                }, 600);
            } else {
                $scope.tooltipVisible = self.isOpen;
            }
        });


        $scope.closeLeft = function () {
            $mdSidenav('left').closeMenu()
                .then(function () {
                    $log.debug("close LEFT is done");
                });

        }

        $scope.openMenu = function () {
            $timeout(function () { $mdSidenav('left').open(); });
        }

        $scope.goTo = function (action) {
            var path = $location.path();

            if (action == 'next') { $window.history.forward(); }

            if (path == '/') {
                $location.path('/');
                return;
            }


            if (action == 'home') {
                $scope.menu.selectPage(null, null);
                $location.path('/');
            }

            if (action == 'last') { $window.history.back(); }

            if (action == 'me') {
                $route.reload();
            }

        };




    })

    .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            $mdSidenav('left').closeMenu()
                .then(function () {
                    $log.debug("close LEFT is done");
                });

        };
    })




    .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };
    });
