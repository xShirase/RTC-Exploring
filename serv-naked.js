var fs = require('fs'),
    http = require('http');


// This commented bit is enough to get a working app, if used in conjunction with a webserver to serve the static files. Used the workaround below to get a working demo on node.js only. 
// var serv = http.createServer(function(req, res) {
//                 res.writeHead(200, { 'Content-type': 'text/html'});
//                 res.end(fs.readFileSync(__dirname + '/public/ttt.html'));}).listen(8080, function() { console.log('running 8080');});


//use of a fs and node-static to serve the static files to client

function handler(req, res) {
    "use strict";
        // res.setHeader('Strict-Transport-Security', 'max-age=8640000; includeSubDomains');

        // if (req.headers['x-forwarded-proto'] !== 'https') {
        //     var url = 'https://' + req.headers.host + '/';
        //     res.writeHead(301, {
        //         'location': url
        //     });
        //     return res.end('Redirecting to <a href="' + url + '">' + url + '</a>.');
        // }
    fileServer.serve(req, res); // this will return the correct file
}

var app = http.createServer(handler),
    iosocks = require('socket.io').listen(app),
    staticserv = require('node-static'), // for serving files

    // This will make all the files in the current folder
    // accessible from the web
    fileServer = new staticserv.Server('./');
app.listen(8080);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Handling global users
var users = [];

var addUser = function(name, id) {
    var user = {
        name: name,
        id: id
    };
    users.push(user);
    return user;
};
var spliceUser = function(user) {
    for (var i = 0; i < users.length; i += 1) {
        if (user.name === users[i].name) {
            users.splice(i, 1);
            return;
        }
    }
};


/////////////SOCKET EVENTS//////////////
iosocks.on('connection', function(soc) {
    "use strict";
    var user = {};

    soc.on('disconnect', function() {
        spliceUser(user);
        game.splicePlayer(user);
    });

    soc.on('addUser', function(name) {
        user = addUser(name, soc);
        soc.broadcast.emit('newUser', '<b>' + user.name + '</b> has connected </br>');
        game.sortPlayers(user);
    });
    soc.on('chatmsg', function(msg) {
        console.log(msg);
        soc.broadcast.emit('chatmsg', msg);
    });

});