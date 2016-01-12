var mainApp = angular.module('jsClient', [
    'ngRoute',
    'ui.bootstrap',
    'ui-notification',
    'LocalStorageModule',
    'ui-leaflet', 
    'pascalprecht.translate',
    'ngTable',
    'ngResource',
    'nemLogging',
    
    'n52.core.alert',
    'n52.core.barChart',
    'n52.core.color',
    'n52.core.dataLoading',
    'n52.core.diagram',
    'n52.core.exportTs',
    'n52.core.favorite',
    'n52.core.favoriteUi',
    'n52.core.flot',
    'n52.core.helper',
    'n52.core.interface', 
    'n52.core.legend',
    'n52.core.listSelection',
    'n52.core.locate',
    'n52.core.map',
    'n52.core.menu',
    'n52.core.userSettings',
    'n52.core.legend',
    'n52.core.table',
    'n52.core.exportTs',
    'n52.core.timeUi',
    'n52.core.modal',
    'n52.core.overviewDiagram',
    'n52.core.permalinkEval',
    'n52.core.permalinkGen', 
    'n52.core.phenomena',
    'n52.core.provider',
    'n52.core.userSettings',
    'n52.core.settings',
    'n52.core.startup',
    'n52.core.status',
    'n52.core.style',
    'n52.core.styleTs',
    'n52.core.table',
    'n52.core.time',
    'n52.core.timeUi',
    'n52.core.timeseries',
    'n52.core.translateSelector',
    'n52.core.utils',
    'n52.core.yAxisHide',
    
    'n52.client.menu',
    'n52.client.mobileMap'
]);

mainApp.config(['$routeProvider', 'MenuProvider', function ($routeProvider, MenuProvider) {
        $routeProvider
                .when('/', {templateUrl: 'templates/views/diagramView.html', reloadOnSearch: false})
                .when('/diagram', {templateUrl: 'templates/views/diagramView.html', reloadOnSearch: false})
                .when('/map', {templateUrl: 'templates/views/mapView.html', reloadOnSearch: false})
                .when('/favorite', {templateUrl: 'templates/views/favoriteView.html', reloadOnSearch: false})
                .when('/mobile', {templateUrl: 'templates/views/mobilemapView.html', reloadOnSearch: false})
                .otherwise({redirectTo: '/'});
        MenuProvider.add({
            url: '/map',
            title: 'main.mapView',
            target: '#map',
            icon: 'glyphicon-globe'
        });
        MenuProvider.add({
            url: '/diagram',
            title: 'main.chartView',
            target: '#diagram',
            icon: 'glyphicon-stats'
        });
        MenuProvider.add({
            title: 'main.settings',
            icon: 'glyphicon-cog',
            controller: 'SwcUserSettingsCtrl',
            click: 'open()'
        });
        MenuProvider.add({
            url: '/favorite',
            title: 'main.favoriteView',
            target: '#favorite',
            icon: 'glyphicon-star'
        });
        MenuProvider.add({
            url: '/mobile',
            title: 'main.mobileView',
            target: '#mobile',
            icon: 'glyphicon-road'
        });
    }]);

mainApp.config(['$translateProvider', 'settingsServiceProvider', function ($translateProvider, settingsServiceProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });
        var suppLang = [];
        angular.forEach(settingsServiceProvider.$get().supportedLanguages, function (lang) {
            suppLang.push(lang.code);
        });
        $translateProvider.registerAvailableLanguageKeys(suppLang);
        $translateProvider.determinePreferredLanguage();
    }]);

mainApp.filter('objectCount', function () {
    return function (item) {
        if (item) {
            return Object.keys(item).length;
        } else {
            return 0;
        }
    };
});

// start the app after loading the settings.json
fetchData().then(bootstrapApp);

function fetchData() {
    var initInjector = angular.injector(["ng"]);
    var $http = initInjector.get("$http");
    return $http.get("settings.json").then(function (response) {
        mainApp.constant("config", response.data);
    });
}

function bootstrapApp() {
    angular.element(document).ready(function () {
        var injector = angular.bootstrap(document, ["jsClient"], {strictDi: true});
        // initilize parameter reader
        var startupService = injector.get('startupService');
        startupService.registerServices([
            'SetTimeseriesOfStatusService',
            'SetTimeParameterService',
            'SetInternalTimeseriesService',
            'SetConstellationService',
            'SetConstellationServiceHack',
            'SetLanguageService'
        ]);
        startupService.checkServices();
        // init mapService to have load stations directly
        injector.get('mapService');
    });
}
