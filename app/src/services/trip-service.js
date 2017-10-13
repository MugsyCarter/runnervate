
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

        addAnswers(trip, quiz, answers){
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
            trip[quiz[0].course][quiz[0].unit]=(quizObject);
            console.log('in addAnswer ', trip);
            return [trip, quizObject];
        },

        updatetrip(trip, course) {
            return $http.put(`${apiUrl}/trips/${trip._id}`, course)
                .then(res => res.data);
        },

        checkCourseProgress(trip, course){
            console.log('checking progress ', trip, course);
        },

        updateCourseProgress(trip, course){
            console.log('updating this trip and course ', trip, course);
            var points = 0;
            var total = 0;
            trip[course.name].forEach((unit)=>{
                if (unit){
                    points += unit.correct;
                    total += unit.total;
                }
                console.log('unit is ', unit);
            });
            var percentComplete = (points/total)* 100;
            console.log('trip has this many points', percentComplete);
        }


    };
};
