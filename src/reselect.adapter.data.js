
Reselect.service('ReselectDataAdapter', ['$q', function($q){

    var DataAdapter = function(){
        this.data = [];
    };

    DataAdapter.prototype.observe = function(){
        console.error('Not implemented');
        return;
    };

    DataAdapter.prototype.prepareGetData = function(){
        return;
    };

    DataAdapter.prototype.getData = function(search_term){
        var self = this;

        // This function requires the return of a deferred promise
        var defer = $q.defer();

        var choices;
        var search_options = {};

        if(search_term){

            // Fuzzy Search
            var fuse = new Fuse(this.data, search_options);

            choices = fuse.search(search_term);

            if(angular.isDefined(search_options.keys)){
                choices = choices.map(function(index){
                    return self.data[index];
                });
            }
        }else{
            choices = this.data;
        }

        defer.resolve({
            data: choices
        });

        return defer.promise;
    };

    DataAdapter.prototype.updateData = function(newData){

        this.data = newData;

        return this.data;
    };

    DataAdapter.prototype.init = function(){
        this.observe(this.updateData.bind(this));
    };

    return DataAdapter;
}]);

Reselect.service('ReselectAjaxDataAdapter', ['$http', function($http){

    var DataAdapter = function(remoteOptions, parsedOptions){
        this.data = [];
        this.page = 1;
        this.pagination = {};

        this.parsedOptions = parsedOptions;
        //console.log('parsedOptions ' , this.parsedOptions);
        this.options = angular.extend({
            params: function(params){
                return params;
            }
        }, remoteOptions);
    };

    DataAdapter.prototype.observe = function(){
        return;
    };

    DataAdapter.prototype.prepareGetData = function(){
        return;
    };

    DataAdapter.prototype.getData = function(search_term){
        var self = this;

        var state = {
            page       : this.page,
            search_term: search_term
        };

        var params = this.options.params(state, self.pagination);

        var endpoint;

        if(typeof this.options.endpoint === 'function'){
            endpoint = this.options.endpoint(state, self.pagination);
        }else{
            endpoint = this.options.endpoint;
        }

        return $http.get(endpoint, {
            params: params
        })
            .then(function(res){
                return self.parsedOptions.source({
                    '$remote': res.data
                });
            })
            .then(this.options.onData)
            .then(function(choices){
                if(choices.pagination){
                    self.pagination = choices.pagination;

                    if(choices.pagination.more){
                        self.page += 1;
                    }
                }else{
                    self.pagination = null;
                }

                return choices;
            });
    };

    DataAdapter.prototype.updateData = function(newData, push){
        if(push === true){
            this.data = this.data.concat(newData);
        }else{
            this.data = newData;
        }
        return this.data;
    };

    DataAdapter.prototype.init = function(){
    };

    return DataAdapter;
}]);
