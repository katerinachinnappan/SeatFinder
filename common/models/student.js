'use strict';

module.exports = function(Student) {

    Student.register = function(student,cb){
        Student.create(student, function(err, user){
            Student.getApp(function(err,app){
                var Role = app.models.Role;
                var RoleMapping = app.models.RoleMapping;
    
                Role.find({where: {name:"student"}},function(err,role){
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

    Student.remoteMethod('register',{
        accepts: {arg: 'student', type: 'object',  http: { source: 'body' }},
        returns: {type: 'object', root: true}
       // http:    {path: '/getSeats', verb: 'post'}
    });

};
