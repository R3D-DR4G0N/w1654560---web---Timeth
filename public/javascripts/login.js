var config = {
    apiKey: "AIzaSyCmbiDZfSHL7c8EGwvxfF5mkMxl1xQfxko",
    authDomain: "slotmachine-2f6ff.firebaseapp.com",
    databaseURL: "https://slotmachine-2f6ff.firebaseio.com",
    projectId: "slotmachine-2f6ff",
    storageBucket: "slotmachine-2f6ff.appspot.com",
    messagingSenderId: "413654664016"
};
firebase.initializeApp(config);
var unin = document.getElementById('username');
var pwin = document.getElementById('password');
var loginbtn = document.getElementById('loginbtn');
loginbtn.addEventListener('click', function () {
    console.log("Login Clicked");
    var username = unin.value;
    var password = pwin.value;
    console.log(username);
    console.log(password);
    var user = firebase.auth().signInWithEmailAndPassword(username, password)["catch"](function (error) {
        // Handle Errors here.
        console.log("loggedIn");
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/invalid-custom-token') {
            alert('The token you provided is not valid.');
        }
        else {
            console.error(error);
        }
        // ...
    });
    console.log(user);
}, false);
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        window.location.href = "/reel";
    }
    else {
        // No user is signed in.
    }
});
