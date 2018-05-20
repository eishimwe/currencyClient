/**
 * Created by Elie.Ishimwe on 2018/05/18.
 */

var app =  angular.module('app',['ngRoute'])


app.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'HomeController'
        })

});

app.controller('HomeController',['$scope','currencyService',function($scope,currencyService){

    $scope.paymentCurrencies     = [];
    $scope.purchasableCurrencies = [];
    $scope.responseQuote         = false;
    $scope.responsePayment       = false;
    $scope.payment               = false;
    $scope.purchasable           = false;

    $scope.purchaseCurrency      = function(){

        var payload = {

            data:{
                quote_id:$scope.quote.id
            }

        };

        currencyService.purchaseCurrency(payload,function(response){

            if(response.success){

                $scope.responsePayment  = true;
                $scope.responseQuote   = true;

            }

        });


    }



    $scope.$watch("amount_to_pay",function(newValue,oldValue){

        if(newValue != oldValue){

           $scope.amount_to_purchase = "";
            $scope.responseQuote     = false;
            $scope.responsePayment     = false;
            $scope.data = {};
        }

    });

    $scope.$watch("amount_to_purchase",function(newValue,oldValue){

        if(newValue != oldValue){

            $scope.amount_to_pay = "";
            $scope.responseQuote = false;
            $scope.responsePayment     = false;

        }

    });

    $scope.$watch("selectedPaymentCurrency",function(newValue,oldValue){

        if(newValue != oldValue){

            $scope.responseQuote = false;
            $scope.responsePayment = false;

        }

    });

    $scope.$watch("selectedPurchasableCurrency",function(newValue,oldValue){

        if(newValue != oldValue){

            $scope.responseQuote = false;
            $scope.responsePayment = false;
        }

    });



     $scope.currencies = currencyService.getCurrencies(function(response){


        $.each(response.data.paymentCurrencies, function( index, value ){

            var currency = {};

            currency.name   = value.currency.name;
            currency.id     = value.currency.code;

            $scope.paymentCurrencies.push(currency);


        });

        $.each(response.data.purchasableCurrencies, function( index, value ){

            var currency = {};

            currency.name    = value.currency.name;
            currency.id      = value.currency.code;

            $scope.purchasableCurrencies.push(currency);


        });

    });

     $scope.calculateQuote = function(){

     $scope.params = {};

         if($scope.selectedPaymentCurrency && $scope.selectedPurchasableCurrency){

             if(parseInt($scope.amount_to_pay) > 0){

                 $scope.params = {

                     data: {

                         from:$scope.selectedPaymentCurrency.id,
                         to: $scope.selectedPurchasableCurrency.id,
                         amount: $scope.amount_to_pay
                     },
                     quoteUrl:'/api/v1/quoteUsdForeign'

                 };

                 $scope.payment               = true;
                 $scope.purchasable           = false;

             }

             if(parseInt($scope.amount_to_purchase) > 0){

                 $scope.params = {

                     data: {

                         from:$scope.selectedPurchasableCurrency.id,
                         to: $scope.selectedPaymentCurrency.id,
                         amount: $scope.amount_to_purchase
                     },
                     quoteUrl:'/api/v1/quoteForeignUsd'

                 };

                 $scope.purchasable        = true;
                 $scope.payment            = false;

             }


             $scope.quote = currencyService.calculateQuote($scope.params,function(response){

                 if(response.success){

                     $scope.responseQuote  = true;
                     $scope.quote          = response.data;
                 }

             });


         }


     }

}])


app.provider('currencyService',function(){

    var baseUrl  = "";
    var quoteUrl = "/api/v1/quoteUsdForeign";

    this.config = function(url){
        baseUrl = url;
    }

    this.$get =['$log','$http', function($log,$http){

        var oCurrencyService = {};

        oCurrencyService.getCurrencies = function(cb){

            $http({

                url: baseUrl + '/api/v1/currencies',
                method: 'GET'

            }).then(function(response){

                cb(response.data);

            },function(response){

                $log.error("ERROR occurred");

            });
        };
        oCurrencyService.calculateQuote = function(params,cb){

            quoteUrl = params.quoteUrl;

                $http({

                    url: baseUrl + quoteUrl,
                    method: 'POST',
                    data:params

                }).then(function(response){

                    cb(response.data);

                },function(response){

                    $log.error("ERROR occurred");

                });
        }
        oCurrencyService.purchaseCurrency = function(params,cb){

            $http({

                url: baseUrl + '/api/v1/order',
                method: 'POST',
                data:params

            }).then(function(response){

                cb(response.data);

            },function(response){

                $log.error("ERROR occurred");

            });
        }




        return oCurrencyService;

    }];


})


app.config(['currencyServiceProvider',function(currencyServiceProvider){

    currencyServiceProvider.config("http://127.0.0.1:8000");

}]);
