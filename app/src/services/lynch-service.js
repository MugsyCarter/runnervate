
lynchService.$inject = ['$http', 'apiUrl'];

export default function lynchService($http, apiUrl) {
    return {
        get() {
            return $http.get(`${apiUrl}/incidents`)
                .then(res => res.data);
        },

        getById(incidentId) {
            console.log('in get by Id ,', apiUrl);
            return $http.get(`${apiUrl}/incidents/${incidentId}`)
                .then(res => res.data);
        },

        getByQuery(query) {
            return $http.get(`${apiUrl}/incidents/${query}`)
            .then(res => res.data);
        },

        addIncident(incident){
            console.log('In lynch service, adding this incident ', incident);
            return $http.post(`${apiUrl}/incidents`, incident)
                .then(res => res.data);
        },

        addOther(collection, entry){
            console.log('In lynch service, adding this entry to this collection ', entry, collection);
            return $http.post(`${apiUrl}/${collection}`, entry)
            .then(res => res.data);
        },

        // addSource(source, type){
        //     console.log('In lynch service, adding this source ', source);
        //     return $http.post(`${apiUrl}/` + type + incident)
        //         .then(res => res.data);
        // },

        deleteIncident(incident){
            console.log('In lynch service, deleting this incident id ', incident._id);
            return $http.delete(apiUrl + '/incidents/' + incident._id)
                .then(res => res.data);
        },

    };
};
