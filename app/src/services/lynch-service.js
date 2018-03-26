
lynchService.$inject = ['$http', 'apiUrl'];

export default function lynchService($http, apiUrl) {
    return {
        get() {
            return $http.get(`${apiUrl}/incidents`)
                .then(res => res.data);
        },

        getCompleteIncidents() {
            return $http.get(`${apiUrl}/completeIncidents`)
                .then(res => res.data);
        },

        getById(incidentId) {
            // console.log('in get by Id ,', apiUrl);
            return $http.get(`${apiUrl}/incidents/${incidentId}`)
                .then(res => res.data);
        },

        getByQuery(query) {
            return $http.get(`${apiUrl}/incidents/${query}`)
            .then(res => res.data);
        },

        addIncident(incident){
            // console.log('In lynch service, adding this incident ', incident);
            return $http.post(`${apiUrl}/incidents`, incident)
                .then(res => res.data);
        },

        addOther(collection, entry){
            // console.log('In lynch service, adding this entry to this collection ', entry, collection);
            return $http.post(`${apiUrl}/${collection}`, entry)
            .then(res => res.data);
        },

        getCollection(collection){
            // console.log('in lynch service with this collection, ', collection);
            return $http.get(`${apiUrl}/${collection}`)
            .then(res => res.data);
        },

        getAllData(incident, collection){
            // console.log('in lynch service getting all the data for this incident and collection, ', incident, collection);
            return $http.get(`${apiUrl}/${collection}/?caseNum=${incident.caseNum}`)
                .then(res => res.data);
        },

        getIncidentByAccused(collection, query){
            // console.log('in lynch service getting all the data for this collection, ', collection);
            // console.log('in lynch service getting all the data for this query, ', query);
            if (collection === 'accused'){
                return $http.get(`${apiUrl}/accused/${query}`)
                .then(res => res.data); 
            }
            else if (collection === 'punishments'){
                return $http.get(`${apiUrl}/punishments/${query}`)
                .then(res => res.data); 
            }
            else if (collection === 'accusations'){
                return $http.get(`${apiUrl}/accusations/${query}`)
                .then(res => res.data); 
            }
        },

        getAccusedData(incident, accused, collection){
            // console.log('in lynch service getting all the data for this incident and collection, ', incident, collection, accused);
            return $http.get(`${apiUrl}/${collection}/?caseNum=${incident.caseNum}&accusedID=${accused.accusedID}`)
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

        deleteCollection(collection, item){
            console.log('In lynch service, deleting this item', item);
            return $http.delete(`${apiUrl}/${collection}/${item._id}`)
                .then(res => res.data);
        },

    };
};
