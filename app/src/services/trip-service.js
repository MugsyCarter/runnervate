
tripService.$inject = ['$http', 'apiUrl'];

export default function tripService($http, apiUrl) {
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

        addTrip(trip){
            console.log('In trip service, adding this trip ', trip);
            return $http.post(`${apiUrl}/trips`, trip)
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
