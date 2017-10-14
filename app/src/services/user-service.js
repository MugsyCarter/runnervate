
userService.$inject = ['$http', 'apiUrl'];

export default function userService($http, apiUrl) {
    return {
        get() {
            return $http.get(`${apiUrl}/users`)
                .then(res => res.data);
        },

        getById(userId) {
            console.log('in get by Id ,', apiUrl);
            return $http.get(`${apiUrl}/users/${userId}`)
                .then(res => res.data);
        },

        getByName(username) {
            return $http.get(`${apiUrl}/users/${username}`)
            .then(res => res.data);
        },

        updateUser(user, course) {
            return $http.put(`${apiUrl}/users/${user._id}`, course)
                .then(res => res.data);
        },

        checkCourseProgress(user, course){
            console.log('checking progress ', user, course);
        },

        updateCourseProgress(user, course){
            console.log('updating this user and course ', user, course);
            var points = 0;
            var total = 0;
            user[course.name].forEach((unit)=>{
                if (unit){
                    points += unit.correct;
                    total += unit.total;
                }
                console.log('unit is ', unit);
            });
            var percentComplete = (points/total)* 100;
            console.log('user has this many points', percentComplete);
        }


    };
};
