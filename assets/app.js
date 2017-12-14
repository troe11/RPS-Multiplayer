var config = {
    apiKey: "AIzaSyDMWhhXETn_L7JClHW6hTAadpqnZg_Prww",
    authDomain: "newproj-735bf.firebaseapp.com",
    databaseURL: "https://newproj-735bf.firebaseio.com",
    projectId: "newproj-735bf",
    storageBucket: "newproj-735bf.appspot.com",
    messagingSenderId: "93086397648"
};
firebase.initializeApp(config);
var database = firebase.database();

var clicked = true;

var player1 = false;
var player2 = false;

var p1choice = '';
var p2choice = '';

var p1Wins = 0;
var p2Wins = 0;
var ties = 0;

var p1 = 'Not Selected';
var p2 = 'Not Selected';
//You left off here, you are not trying to set a DB key for selected and push it to html div

database.ref().on('value', function(snapshot) {
    $('#ties').html(snapshot.val().ties);
    $('#p1wins').html(snapshot.val().p1Wins);
    $('#p2wins').html(snapshot.val().p2Wins);
})

var reset = function() {
    //resets key global/db variables so it resets the game without reloading the page
    clicked = true;
    player1 = false;
    player2 = false;
    p1choice = '';
    p2choice = '';
    $('#p1status').html('Not Selected');
    $('#p2status').html('Not Selected');
}

var updateDB = database.ref().on('value', function(snapshot) {
    //Updates score divs after every outcome
    $('#ties').html(snapshot.val().ties);
    $('#p1wins').html(snapshot.val().p1Wins);
    $('#p2wins').html(snapshot.val().p2Wins);

    var p1 = snapshot.val().player1;
    var p2 = snapshot.val().player2;
    var p1Throw = snapshot.val().p1choice;
    var p2Throw = snapshot.val().p2choice;

    if (p1 && p2 && p1Throw != '' && p2Throw != '') {
        if (p1Throw == p2Throw) {
            alert('Its a tie!');
            database.ref().update({
                ties: ++ties,
                p1choice: p1choice,
                p2choice: p2choice
            })
            reset();
        } else if ((p1Throw == 'rock' && p2Throw == 'scissors') || (p1Throw == 'paper' && p2Throw == 'rock') || (p1Throw == 'scissors' && p2Throw == 'paper')) {
            alert('Player 1 wins!')
            database.ref().update({
                p1Wins: ++p1Wins,
                p1choice: p1choice,
                p2choice: p2choice
            })
            reset();
        } else {
            alert('Player 2 wins!')
            database.ref().update({
                p2Wins: ++p2Wins,
                p1choice: p1choice,
                p2choice: p2choice
            })
            reset();
        }
    }
})


$('.player').on('click', function() {
    event.preventDefault();
    if ($(this).attr('id') === 'player1') {
        player1 = true;
        $('#p1status').html('Selected');
    } else { $('#p2status').html('Selected');player2 = true }
    updateDB;
})

$('.choice').on('click', function() {
    event.preventDefault();
    if (clicked && (player1 || player2)) {
        clicked = false;
        if (player1) {
            p1choice = $(this).attr('id');
            console.log(player1, player2, clicked, p1choice, p2choice)
            database.ref().update({
                player1: player1,
                p1choice: p1choice
            })
            updateDB;
        } else if (player2) {
            p2choice = $(this).attr('id');
            database.ref().update({
                player2: player2,
                p2choice: p2choice,
            })
            updateDB;
            console.log(player1, player2, clicked, p1choice, p2choice)
        }
    } else { alert('You chose already!') }

})