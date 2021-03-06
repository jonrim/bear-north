app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, CartFactory, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'Users', state: 'users' },
                { label: 'Orders', state: 'orders' },
            ];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            scope.search = function() {
                $state.go('products', {searchText: scope.searchText});
            }

            setUser();

            scope.numItemsInCart = 0;

            var updateCart = function() {
                scope.numItemsInCart = CartFactory.getNumItems();
            }
            updateCart();
            
            $rootScope.$on('cart-updated', updateCart)
            

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.loginSuccess, CartFactory.fetchCart);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, CartFactory.clearcart);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});

app.directive('searchBar', function () {
    return function (scope, element, attrs) {
        element.on("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.searchBar);
                });
                event.preventDefault();
            }
        });
    };
});
