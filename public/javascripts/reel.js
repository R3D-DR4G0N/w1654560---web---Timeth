var firebase;
console.log("load called")
var config = {
    apiKey: "AIzaSyCmbiDZfSHL7c8EGwvxfF5mkMxl1xQfxko",
    authDomain: "slotmachine-2f6ff.firebaseapp.com",
    databaseURL: "https://slotmachine-2f6ff.firebaseio.com",
    projectId: "slotmachine-2f6ff",
    storageBucket: "slotmachine-2f6ff.appspot.com",
    messagingSenderId: "413654664016"
};
this.firebase.initializeApp(config);
/*function onLoad(){

    this.uid = firebase.auth().currentUser.uid
}*/
var TotWin = 0;
var TotLose = 0;
var user;

//var database = firebase.database();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


var database = firebase.database();

function retrieveData() {

    database.ref(uid + "/stats").once('value').then(function(snapshot) {
        TotWin = snapshot.val().TotWin;
        TotLose = snapshot.val().TotLose;

    });
    console.log(TotWin);
    console.log(TotLose);

}

var car1Val = 1;
var car2Val = 1;
var car3Val = 1;

var carousel;
var carousel1;
var carousel2;
var transformProp = Modernizr.prefixed('transform');

function Carousel3D(el) {
    this.element = el;

    this.rotation = 0;
    this.panelCount = 0;
    this.totalPanelCount = this.element.children.length;
    this.theta = 0;

    this.isHorizontal = false;

}

Carousel3D.prototype.modify = function() {

    var panel, angle, i;

    this.panelSize = this.element[this.isHorizontal ? 'offsetWidth' : 'offsetHeight'];
    this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
    this.theta = 360 / this.panelCount;

    // do some trig to figure out how big the carousel
    // is in 3D space
    this.radius = Math.round((this.panelSize / 2) / Math.tan(Math.PI / this.panelCount));

    for (i = 0; i < this.panelCount; i++) {
        panel = this.element.children[i];
        angle = this.theta * i;
        panel.style.opacity = 1;
        panel.style.backgroundColor = 'rgba(ffffff99)';
        // rotate panel, then push it out in 3D space
        panel.style[transformProp] = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
    }

    // hide other panels
    for (; i < this.totalPanelCount; i++) {
        panel = this.element.children[i];
        panel.style.opacity = 0;
        panel.style[transformProp] = 'none';
    }

    // adjust rotation so panels are always flat
    this.rotation = Math.round(this.rotation / this.theta) * this.theta;
    this.transform();

};

Carousel3D.prototype.transform = function() {
    // push the carousel back in 3D space,
    // and rotate it
    this.element.style[transformProp] = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)';

    //------------------------------------------------------------------------


};
//change to get the values from the database
var coinNum = 10;
var betNum = 0;

var init = function() {

    var carousel1 = new Carousel3D(document.getElementById('carousel1')),
        axisButton = document.getElementById('toggle-axis'),
        navButtons = document.querySelectorAll('#navigation button'),

        onNavButtonClick1 = function(int) {
            var increment = int;
            carousel1.rotation += carousel1.theta * increment * -1;
            carousel1.transform();
            car2Val += increment;
        };

    // populate on startup
    carousel1.panelCount = 6;
    carousel1.modify();

    carousel1.element.toggleClassName('panels-backface-invisible');

    var carousel = new Carousel3D(document.getElementById('carousel')),
        axisButton = document.getElementById('toggle-axis'),
        navButtons = document.querySelectorAll('#navigation button'),

        onNavButtonClick2 = function(int) {
            var increment = int;
            carousel.rotation += carousel.theta * increment * -1;
            carousel.transform();
            car1Val += increment;
        };

    // populate on startup
    carousel.panelCount = 6
    carousel.modify();
    carousel.element.toggleClassName('panels-backface-invisible');

    var carousel2 = new Carousel3D(document.getElementById('carousel2')),
        axisButton = document.getElementById('toggle-axis'),
        navButtons = document.querySelectorAll('#navigation button'),

        onNavButtonClick = function(int) {
            var increment = int;
            carousel2.rotation += carousel2.theta * increment * -1;
            carousel2.transform();
            car3Val += increment;
        };

    // populate on startup
    carousel2.panelCount = 6
    carousel2.modify();
    carousel2.element.toggleClassName('panels-backface-invisible');

    setTimeout(function() {
        document.body.addClassName('ready');
    }, 0);

    var spining = false;
    var btnSpin = document.getElementById('spinbtn');

    btnSpin.addEventListener('click', function() {

        if (spining) {
            spining = false;
            console.log('spin false');

            var r1 = car1Val % 6;
            var r2 = car2Val % 6;
            var r3 = car3Val % 6;

            var multiplier = 0;
            var won = false;
            if (r1 == r2) {
                multiplier = r1 + 2;
                won = true
            } else if (r3 == r2) {
                multiplier = r2 + 2;
                won = true;
            } else if (r1 == r3) {
                multiplier = r1 + 2;
                won = true;
            }
            setTimeout(function() {
                var win = 0
                if (won) {
                    retrieveData();
                    console.log(TotWin);
                    win = betNum * multiplier
                    TotWin += 1;
                    coinNum += win;
                    console.log('win ' + TotWin);
                    console.log(' Loss ' + TotLose);


                }else{

                    TotLose +=1;
                }

                console.log("win : " + win);

                //setting db ref to the currentUser id node under the statistics branch

                uid = firebase.auth().currentUser.uid
                database.ref(uid + "/stats").set({
                    TotWin: TotWin,
                    TotLose: TotLose,

                });
                console.log("sent")
                //console.log('won : ' + won + ' ' + multiplier);


                betNum = 0;
                update();
                //console.log('won : ' +won +' '+ multiplier);
                //console.log('reel 1 ' + car1Val % 6 + ' reel 2 ' + car2Val % 6 + 'reel 3 ' + car3Val % 6);
            })
        } else if (betNum > 0) {
            var num1 = getRandomInt(1, 3);
            var num2 = getRandomInt(3, 6);

            onNavButtonClick(num1);
            onNavButtonClick1(num2);

            spining = true;
            console.log('spin true');

        } else {
            alert("Please Bet !!")
        }
        console.log('spin');

    }, false);

    var x = setInterval(function() {
        if (spining) {
            onNavButtonClick(1);
            onNavButtonClick1(1);
            onNavButtonClick2(1);
        }
    }, 50);

};

var addCoin = document.getElementById('addCoins');
addCoin.addEventListener('click', function() {
    coinNum += 1;
    console.log(coinNum);
    update();
}, false)

var betOne = document.getElementById('betone');

betone.addEventListener('click', function() {

    if (coinNum > 0) {
        coinNum -= 1;
        betNum += 1;
    } else {
        alert("U don't have enough credits");
    }
    update();
    console.log(coinNum + ' ' + betNum);
}, false);

var betMax = document.getElementById('betmax');

betMax.addEventListener('click', function() {
    if (coinNum > 2) {
        coinNum -= 3;
        betNum += 3;
    } else {
        alert("You don't have enough credits");
    }
    update();
    console.log(coinNum + ' ' + betNum);
}, false);

var reset = document.getElementById('reset');

reset.addEventListener('click', function() {
    coinNum += betNum;
    betNum = 0;
    console.log(coinNum + ' ' + betNum);
    update()
}, false);

function update() {
    document.getElementById('cred').innerHTML = coinNum;
    document.getElementById('bet').innerHTML = betNum;
}

firebase.auth().onAuthStateChanged(user =>{
    if (user) {
        // User is signed in.
        uid = firebase.auth().currentUser.uid;
        retrieveData();
    } else {
        // No user is signed in.
        window.location.href = "/";
    }});

var signOut = document.getElementById('signOut')
signOut.addEventListener('click', function() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location.href = "/";
    }).catch(function(error) {
        // An error happened.
    });
}, false);

var stats = document.getElementById('stats')
stats.addEventListener('click', function() {
    window.location.href = "/stats"
}, false);



window.addEventListener('DOMContentLoaded', init, false);