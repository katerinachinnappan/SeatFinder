'use strict';

module.exports = function(Reservation) {

    Reservation.getReservations = function(filter,cb) {
        Reservation.find(filter, function(err, reservations){
            cb(null,reservations);
        });
    }
    
    Reservation.remoteMethod('getReservations',{
        accepts: {arg: 'filter', type: 'object',  http: { source: 'body' }},
        returns: {type: 'object', root: true}
       // http:    {path: '/getSeats', verb: 'post'}
    });
};
