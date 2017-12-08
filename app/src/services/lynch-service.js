
lynchService.$inject = ['$http', 'apiUrl'];

export default function lynchService($http, apiUrl) {
    return {
        get() {
            return $http.get(`${apiUrl}/trips`)
                .then(res => res.data);
        },
        getById(tripId) {
            console.log('in get by Id ,', apiUrl);
            return $http.get(`${apiUrl}/trips/${tripId}`)
                .then(res => res.data);
        },

        getByName(tripname) {
            return $http.get(`${apiUrl}/trips/${tripname}`)
            .then(res => res.data);
        },

        addIncident(incident){
            console.log('In lynch service, adding this incident ', incident);
            return $http.post(`${apiUrl}/incidents`, incident)
                .then(res => res.data);
        },

        // updatetrip(trip, course) {
        //     return $http.put(`${apiUrl}/trips/${trip._id}`, course)
        //         .then(res => res.data);
        // },

        // checkCourseProgress(trip, course){
        //     console.log('checking progress ', trip, course);
        // },

        // updateCourseProgress(trip, course){
        //     console.log('updating this trip and course ', trip, course);
        //     var points = 0;
        //     var total = 0;
        //     trip[course.name].forEach((unit)=>{
        //         if (unit){
        //             points += unit.correct;
        //             total += unit.total;
        //         }
        //         console.log('unit is ', unit);
        //     });
        //     var percentComplete = (points/total)* 100;
        //     console.log('trip has this many points', percentComplete);
        // }


    };
};
