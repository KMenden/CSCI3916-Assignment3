var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authJwtController = require('./auth_jwt');
var User = require('./Users');
var Movie = require('./Movies')
var jwt = require('jsonwebtoken');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

router.route('/postjwt')
    .post(authJwtController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            res.send(req.body);
        }
    );

router.route('/users/:userId')
    .get(authJwtController.isAuthenticated, function (req, res) {
        var id = req.params.userId;
        User.findById(id, function(err, user) {
            if (err) res.send(err);

            var userJson = JSON.stringify(user);
            // return that user
            res.json(user);
        });
    });

router.route('/users')
    .get(authJwtController.isAuthenticated, function (req, res) {
        User.find(function (err, users) {
            if (err) res.send(err);
            // return the users
            res.json(users);
        });
    });

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
    }
    else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        // save the user
        user.save(function(err) {
            if (err) {
                // duplicate entry
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists. '});
                else
                    return res.send(err);
            }

            res.json({ message: 'User created!' });
        });
    }
});

router.post('/signin', function(req, res) {
    var userNew = new User();
    userNew.name = req.body.name;
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) res.send(err);

        user.comparePassword(userNew.password, function(isMatch){
            if (isMatch) {
                var userToken = {id: user._id, username: user.username};
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
            }
        });


    });
});

router.route('/movies')
    .get(authJwtController.isAuthenticated, function (req, res) {
        Movie.find(function (err, movies) {
            if (err) res.send(err);
            // return the users
            res.json(movies);
        });
    })
    .post(authJwtController.isAuthenticated, function (req, res) {
        if (!req.body.title || !req.body.genre || !req.body.year || !req.body.actors && req.body.actors.length > 2) {
            res.json({success: false, msg: 'Please pass movie information (title,genre,year,and three actors(actorname, charactername))'});
        }
        else
        {

            if(req.body.actors.length < 3)
            {
                res.json({ success: false, message: 'Please include at least three actors from the film'});
            }
            else
                {
                    var movie = new Movie();
                    movie.title = req.body.title;
                    movie.year = req.body.year;
                    movie.genre = req.body.genre;
                    movie.actors = req.body.actors;

                    movie.save(function(err) {
                        if (err) {
                            // duplicate entry
                            if (err.code == 11000)
                                return res.json({ success: false, message: 'A movie with that title already exists'});
                            else
                                return res.send(err);
                        }

                        res.json({ message: 'Movie created!' });
                    });
                }
        }
    })
    .put(authJwtController.isAuthenticated, function (req, res) {
        Movie.findById(req.body.Id,function (err, movie) {
            if (err)
            {
                res.send(err);
            }
            if(req.body.actors.length < 3)
            {
                res.json({ success: false, message: 'Please include at least three actors from the film'});
            }
            else
                {
                    movie.title = req.body.title;
                    movie.year = req.body.year;
                    movie.genre = req.body.genre;
                    movie.actors = req.body.actors;

                    movie.save(function(err) {
                        if (err) {
                            // duplicate entry
                            if (err.code == 11000)
                                return res.json({ success: false, message: 'A movie with that title already exists'});
                            else
                                return res.send(err);
                        }

                        res.json({ message: 'Movie Updated!' });
                    });
                }


        });
    })
    .delete(authJwtController.isAuthenticated, function (req, res) {
        Movie.findByIdAndRemove(req.body.Id,function (err, movie) {
            if (err) res.send(err);

            res.json({ message: 'Movie Deleted!' });
        });
    });
app.use('/', router);
app.listen(process.env.PORT || 8080);