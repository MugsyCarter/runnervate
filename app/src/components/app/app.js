import template from './app.html';

export default {
    template,
    controller
};


function controller() {

//this code prevents scrolldown on an iphone
    var xStart, yStart = 0;
 
    document.addEventListener('touchstart',function(e) {
        xStart = e.touches[0].screenX;
        yStart = e.touches[0].screenY;
    });
    
    document.addEventListener('touchmove',function(e) {
        var xMovement = Math.abs(e.touches[0].screenX - xStart);
        var yMovement = Math.abs(e.touches[0].screenY - yStart);
        if((yMovement * 3) > xMovement) {
            e.preventDefault();
        }
    });

    this.link = {
        home: true,
        test: false,
        about: false,

    };

    this.clicked = (page)=>{
        if (this.link[page] === false){
            console.log('updating link');
            this.link = {
                home: false,
                test: false,
                about: false,
            };
            this.link[page] = true;
        }
    };
};