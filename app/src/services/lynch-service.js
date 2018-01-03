
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

        getByName(incidentname) {
            return $http.get(`${apiUrl}/incidents/${incidentname}`)
            .then(res => res.data);
        },

        addIncident(incident){
            console.log('In lynch service, adding this incident ', incident);
            return $http.post(`${apiUrl}/incidents`, incident)
                .then(res => res.data);
        },

        // updateincident(incident, course) {
        //     return $http.put(`${apiUrl}/incidents/${incident._id}`, course)
        //         .then(res => res.data);
        // },

        // checkCourseProgress(incident, course){
        //     console.log('checking progress ', incident, course);
        // },

        // updateCourseProgress(incident, course){
        //     console.log('updating this incident and course ', incident, course);
        //     var points = 0;
        //     var total = 0;
        //     incident[course.name].forEach((unit)=>{
        //         if (unit){
        //             points += unit.correct;
        //             total += unit.total;
        //         }
        //         console.log('unit is ', unit);
        //     });
        //     var percentComplete = (points/total)* 100;
        //     console.log('incident has this many points', percentComplete);
        // }


    };
};
