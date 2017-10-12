
userService.$inject = ['$http', 'apiUrl'];

export default function userFoodsService($http, apiUrl) {
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

        addAnswers(user, quiz, answers){
            console.log(quiz);
            let quizObject = {unit: quiz[0].unit, lessons: [], correct: 0, total: quiz.length};
            for (var i=0; i<quiz.length; i++){
                //no entry for this lesson
                if (!quizObject.lessons[quiz[i].lesson]){
                    quizObject.lessons[quiz[i].lesson] = {lesson: quiz[i].lesson, correct: 0, total: 0};
                }
                if (answers[i]===1){
                    quizObject.correct ++;
                    quizObject.lessons[quiz[i].lesson].correct ++;
                }
                quizObject.lessons[quiz[i].lesson].total ++;
            }
            user[quiz[0].course][quiz[0].unit]=(quizObject);
            console.log('in addAnswer ', user);
            return [user, quizObject];
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
