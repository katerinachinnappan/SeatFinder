'use strict';

module.exports = function(Room) {
    Room.getRooms = function(filter,cb){
        Room.getApp(function(err,app) {
            var Reservation = app.models.Reservation;
            // Get all rooms that fit the filter
            Room.find(filter, function(err,rooms){
                // Find all reservations that haven't expired
                Reservation.find({where: {expirationTime : {gt: Date.now()}},include: { relation: "rooms",scope :{include:{relation:"itemTypes"}}}},function(err,reservations) {
                    // Check if we are filtering on any item types
                    var itemFilterPresent = true;
                    if (!filter.include.scope){
                         itemFilterPresent = false;
                    }

                    // Locate all Rooms that belong to a valid reservation
                    var unavailableRooms = [];
                    reservations.forEach(res => {
                        var r = res.toJSON();
                        unavailableRooms = unavailableRooms.concat(r.rooms);
                    });
                    // Find all available Rooms
                    if (unavailableRooms.length > 0) {
                        var availableRooms = rooms.filter(function(room) {
                            if (itemFilterPresent){
                                return unavailableRooms.findIndex(r => r.id === room.id) < 0 && room.toJSON().itemTypes.length > 0;
                            }
                            else {
                                return unavailableRooms.findIndex(r => r.id === room.id) < 0;
                            }
                        });
                    }
                    else {
                        if (itemFilterPresent){
                            var availableRooms = rooms.filter(function(room){
                                return room.toJSON().itemTypes.length > 0;
                            });
                        }
                        else {
                            var availableRooms = rooms;
                        }
                    }

                    // Find the rooms that have a "wrong" availability
                    var availableRoomsToUpdate = availableRooms.filter(room => {
                        return room.availability == false;
                    });
                    var unavailableRoomsToUpdate = unavailableRooms.filter(room => {
                        return room.availability == true;
                    });

                    // Set the availability of the available Rooms to true so we don't have to wait for the callback from the update
                    availableRooms.forEach(room => {
                        room.availability = true;
                    });
                    // Return the available Rooms
                    cb(null, availableRooms);

                    // Mark available Rooms as available
                    availableRoomsToUpdate.forEach(room => {
                        room.availability = true;
                        Room.upsert(room, function(err,obj){});
                    });
                    unavailableRoomsToUpdate.forEach(room => {
                        room.availability = false;
                        Room.upsert(room, function(err,obj){});
                    });
                }); 
            });
        });
    };
    
    Room.remoteMethod('getRooms',{
        accepts: {arg: 'filter', type: 'object', http: { source: 'body' }},
        returns: {type: 'object', root: true}
    });
};
