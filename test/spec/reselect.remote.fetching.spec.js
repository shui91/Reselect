'use strict';

describe('Remote Fetching Test', function(){
    var $scope, $rootScope, $compile;

    var template = '<reselect \
                        ng-model="ctrl.value"> \
                        <reselect-choices \
                            options="option in ctrl.choices" \
                            value="$choice"> \
                                <span ng-bind="$choice.text"></span> - Choice \
                        </reselect-options> \
                    </reselect>';

    beforeEach(module('Reselect'));

    beforeEach(inject(function(_$rootScope_, _$compile_){
        $rootScope  = _$rootScope_;
        $scope      = $rootScope.$new();
        $compile    = _$compile_;

        $scope.ctrl = {};
    }));


})
