
runService.$inject = ['$http', 'apiUrl'];

export default function runService($http, apiUrl) {
    return {
        get() {
            return $http.get(`${apiUrl}/runs`)
                .then(res => res.data);
        },

        getById(runId) {
            // console.log('in get by Id ,', apiUrl);
            return $http.get(`${apiUrl}/runs/${runId}`)
                .then(res => res.data);
        },

        getByQuery(query) {
            return $http.get(`${apiUrl}/runs/${query}`)
            .then(res => res.data);
        },

        addRun(run){
            // console.log('In lynch service, adding this run ', run);
            return $http.post(`${apiUrl}/runs`, run)
                .then(res => res.data);
        },

        deleteRun(run){
            console.log('In lynch service, deleting this run id ', run._id);
            return $http.delete(apiUrl + '/runs/' + run._id)
                .then(res => res.data);
        },

        deleteCollection(collection, item){
            console.log('In lynch service, deleting this item', item);
            return $http.delete(`${apiUrl}/${collection}/${item._id}`)
                .then(res => res.data);
        },

    };
};
