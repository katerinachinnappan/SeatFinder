var expect = require('chai').expect;
var stubbyCLI = require(__dirname + '/../index');
var StubbyCLI = stubbyCLI.CLI;
var Events = stubbyCLI.Events;
var http = require('http');

describe('Stubby CLI', function() {
    it('should capture Events.LISTENING, Events.REQUEST & Events.DISCONNECTED', function(done) {
        var cli = new StubbyCLI();
        return cli.admin(8001)
            .stubs(8003)
            .tls(8002)
            .data(__dirname + '/fixtures/routes.json')
            .on(Events.LISTENING, function() {
                http.get('http://localhost:8003/my-api/', function(res) {})
                    .on('error', function() {});
            }).on(Events.REQUEST, function(payload) {
                expect(payload.path).to.equal('/my-api/');
                cli.kill();
            }).on(Events.DISCONNECTED, function() {
                setTimeout(done, 1000);
            }).on(Events.LOADED_ROUTE, function(data) {}).start();
    });

    it('should capture', function(done) {
        var cli = new StubbyCLI();
        return cli.admin(9001)
            .stubs(9003)
            .tls(9002)
            .data(__dirname + '/fixtures/routes.json')
            .on(Events.LISTENING, function() {
                http.get('http://localhost:8003/my-api/', function(res) {})
                    .on('error', function() {});
            }).on(Events.REQUEST, function(payload) {
                expect(payload.path).to.equal('/my-api/');
                cli.kill();
            }).on(Events.DISCONNECTED, function() {
                done();
            }).on(Events.LOADED_ROUTE, function(data) {}).start();
    });
});