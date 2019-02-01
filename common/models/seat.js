'use strict';

module.exports = function(Seat) {

    // Define remote method
    Seat.getSeats = function(filter,cb){
        // Get the app (so we can access other models)
        Seat.getApp(function(err, app) {
            // Get all reservations that haven't expired yet
            var Reservation = app.models.Reservation;
            Reservation.find({where: {expirationTime : {gt: Date.now()}},include: 'seats'},function(err,reservations){
                // Locate all seats that belong to a valid reservation
                var unavailableSeats = [];
                reservations.forEach(res => {
                    var r = res.toJSON();
                    unavailableSeats = unavailableSeats.concat(r.seats);
                });

                // Find all seats
                Seat.find(filter, function(err, seats){
                    // Find all available seats
                    if (unavailableSeats.length > 0) {
                        var availableSeats = seats.filter(function(seat) {
                            return unavailableSeats.findIndex(s => s.id === seat.id) < 0;
                        });
                    }
                    else {
                        availableSeats = seats;
                    }

                    // Find the seats that have a "wrong" availability
                    var availableSeatsToUpdate = availableSeats.filter(seat => {
                        return seat.availability == false;
                    });
                    var unavailableSeatsToUpdate = unavailableSeats.filter(seat => {
                        return seat.availability == true;
                    });

                    // Set the availability of the available seats to true so we don't have to wait for the callback from the update
                    availableSeats.forEach(seat => {
                        seat.availability = true;
                    });

                    // Return the available seats
                    cb(null, availableSeats);

                    // Mark available seats as available
                    availableSeatsToUpdate.forEach(seat => {
                        seat.availability = true;
                        Seat.upsert(seat, function(err,obj){});
                    });
                    // Mark unavailable seats as unavailable
                    unavailableSeatsToUpdate.forEach(seat => {
                        seat.availability = false;
                        Seat.upsert(seat, function(err,obj){});
                    });
                });
            });
        });
    };
    
    Seat.remoteMethod('getSeats',{
        accepts: {arg: 'filter', type: 'object',  http: { source: 'body' }},
        returns: {type: 'object', root: true}
       // http:    {path: '/getSeats', verb: 'post'}
    });
};
