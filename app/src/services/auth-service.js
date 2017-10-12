authService.$inject = ['tokenService', '$http', 'apiUrl'];

export default function authService(token, $http, apiUrl){
    console.log('in auths service');
    const current = token.get();
    if(current){
        $http 
            .get(`${apiUrl}/auths/verify`)
            .catch(() => token.remove());
    }

    function credential(endpoint){
        console.log('credential called.  This is the endpoint:', endpoint);
        return (credentials) => {
            console.log('these are the credentials, ', credentials);
            return $http.post(`${apiUrl}/auths/${endpoint}`, credentials)
            .then(result => {
                token.set(result.data.token);
                return result.data;
            })
            .catch(err => {
                throw err.data;
            });
        };
    }

    return {
        isAuthenticated(){
            return !!token.get();
        },
        logout() {
            token.remove();
        },
        login: credential('login'),
        signup: credential('signup')
    };
}