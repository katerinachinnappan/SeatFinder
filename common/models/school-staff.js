'use strict';

module.exports = function(Schoolstaff) {
    Schoolstaff.register = function(schoolstaff,cb){
        Schoolstaff.create(schoolstaff, function(err, user){
            Schoolstaff.getApp(function(err,app){
                var Role = app.models.Role;
                var RoleMapping = app.models.RoleMapping;
    
                Role.find({where: {name:"schoolstaff"}},function(err,role){
                    RoleMapping.create({ 
                        principalType: RoleMapping.USER,
                        principalId: user.id,
                        roleId: role[0].id
                    }, function(err,rm){
                        if(err) throw err;
                    });
                });
            });
            cb(null, user);
        });
    }

    Schoolstaff.remoteMethod('register',{
        accepts: {arg: 'Schoolstaff', type: 'object',  http: { source: 'body' }},
        returns: {type: 'object', root: true}
       // http:    {path: '/getSeats', verb: 'post'}
    });
};
