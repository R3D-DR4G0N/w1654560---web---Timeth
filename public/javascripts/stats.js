var config = {
    apiKey: "AIzaSyCmbiDZfSHL7c8EGwvxfF5mkMxl1xQfxko",
    authDomain: "slotmachine-2f6ff.firebaseapp.com",
    databaseURL: "https://slotmachine-2f6ff.firebaseio.com",
    projectId: "slotmachine-2f6ff",
    storageBucket: "slotmachine-2f6ff.appspot.com",
    messagingSenderId: "413654664016"
};
var TotWin = 0 ;
var TotLose =0;
var user;
var currentUser;
firebase.initializeApp(config);


var database = firebase.database();


function retrieveData() {

    database.ref(currentUser + "/stats").once('value').then(function(snapshot) {
        console.log(snapshot.val().TotWin);
        console.log(snapshot.val().TotLose);
        TotWin = snapshot.val().TotWin;
        TotLose = snapshot.val().TotLose;
        drawChart();

    });

    console.log(currentUser)
    console.log(TotWin);
    console.log(TotLose);

}

retrieveData();
google.charts.load('current', {'packages':['corechart']});

function drawChart() {

    var data = google.visualization.arrayToDataTable([
        ['', ''],
        ['Win',     TotWin],
        ['Loss',      TotLose]
    ]);

    var options = {
        title: 'Wins Vs Loses'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}

firebase.auth().onAuthStateChanged(user =>{
    if (user) {
        // User is signed in.
        currentUser = user.uid;
        retrieveData();
    } else {
        // No user is signed in.
        window.location.href = "/";
    }});

var btnBack = document.getElementById('backbtn');
btnBack.addEventListener('click',function(){
    window.location.href = "/reel";
},false)