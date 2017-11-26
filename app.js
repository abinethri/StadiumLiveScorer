var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;
var engine = require('ejs-locals');



// app configuation
app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('public', __dirname + '/public');
app.use(express.static('public'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'coloft'}));

app.get('/', function (req, res) {
    console.log("Coming here");
        if (req.session.user){
                Status.find({}).sort({time: -1}).exec(function (err, statuses){
                	console.log("rendering index as homepage");	
                res.render('index.ejs', {user: req.session.user, statuses: statuses});
                });

        } else {
	        console.log("Rendering index.ejs");
                res.render('index.ejs');
        }

});

io.on('connection', function(socket){
	console.log("A User connected");
});

function get_cur_score() {
	var score = ["5 runs 1st over", "10 runs 4th over", "50 runs 8th over", "100 runs 17th over", "150 runs 30th over", "200 runs 40th over", "300 runs 50th over"];
	var random_index = Math.floor(Math.random() * (score.length));
	//console.log("random index = ", random_index);
	return score[random_index];
	
}

function get_cur_commentary() {
	var commentary_arr = ["Good Shot", "Missed to field", "Classic Text Book Shot", "Hat trick", " Classical Shot", "Unbelievable miss", "Very good catch by mid-on player"];
	var random_index = Math.floor(Math.random() * (commentary_arr.length));
	//console.log("random index = ", random_index);
	return commentary_arr[random_index];
	
}
function myFunc(arg) {
	 //console.log("In myFunc function");
	 //var cur_score = "20 runs 3rd over";
	 var cur_score = get_cur_score();
	 //var commentary = 'Commentary:' + ' very good catch by mid-on player';
	 var commentary = 'Commentary:' + get_cur_commentary();
	 io.emit("Current Score:", cur_score + commentary);
	 //io.emit("Commentary:", commentary);
	 setTimeout(myFunc, 1500, 'funky');
}

setTimeout(myFunc, 1500, 'funky');


server.listen(port, function(){
    console.log('listening on *:' + port);
});
