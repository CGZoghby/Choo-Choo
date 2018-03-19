$(document).ready(function () {
    //need a function to populate the entire <tr>, with <td> for each train value
    var config = {
        apiKey: "AIzaSyCCCb50ebt582ShtPAmAqOpa8Ri94VyLqg",
        authDomain: "zog-bootcamp-activities.firebaseapp.com",
        databaseURL: "https://zog-bootcamp-activities.firebaseio.com",
        projectId: "zog-bootcamp-activities",
        storageBucket: "zog-bootcamp-activities.appspot.com",
        messagingSenderId: "717986679747"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    var train = {
        StartTime: "",
        Name: "",
        Destination: "",
        Frequency: 0,
    };

    //Need train name, destination, start time, and frequency in minutes
    //next arrival and minutes away can be calculated locally, and do not have to be stored to firebase
    function writeRow(train) {
        //First Time (pushed back 1 year to make sure it comes before current time)
        var startTimeConverted = moment(train.StartTime, "HH:mm").subtract(1, "years"),
            //Difference between the start time and now
            minutesToNextArrival = moment().diff(moment(startTimeConverted), "minutes"),
            //Modulus remainder over total number of loops, used to calculate how far away the next train will be
            remainderMins = minutesToNextArrival % train.Frequency,
            //take the difference between the frequency and remainder to establish minuts to next train arrival
            minsAway = train.Frequency - remainderMins,
            //then take those minutes away, and add them to the current moment, and arrive at the next train arrival time
            nextArrival = moment().add(minsAway, "minutes").format("hh:mm A"),
            //add it all to a nice big row using template literals, and dance as we send trains on their merry way
            row = ` <tr>
                    <td>${train.Name}</td>
                    <td>${train.Destination}</td>
                    <td>${train.Frequency}</td>
                    <td>${nextArrival}</td>
                    <td>${minsAway}</td>
                </tr>`;
        $("#trains").prepend(row);
    };

    database.ref().on("child_added", function (childSnapshot) {
        writeRow(childSnapshot.val().train);
        //need to index through children and update them to database
    });

    $("#submit").on("click", function (event) {
        event.preventDefault();
        $.each(train, function (index, value) {
            train[index] = $(`#${index}`).val().trim();
        });
        database.ref().push({
            train
        });
    });
});