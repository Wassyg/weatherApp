var express = require('express');
var router = express.Router();
//var cityList = [];
var request = require('request');

/* GET Sign-In page. */
router.get('/', function(req, res, next) {
  if (req.session.cityList == undefined) {
    req.session.cityList = [];
  }
  res.render('signin', {title: "Bonjour"});
});

/* POST Index page. */
router.post('/index', function(req, res, next) {
  var userName = req.body.nomUtilisateur;
  req.session.nomUtilisateur = userName;
  res.render('index', {cityList: req.session.cityList,userName });
});

/* POST Add function */
router.post('/add-city', function(req, res, next) {
  var userName = req.session.nomUtilisateur;

      request("http://api.openweathermap.org/data/2.5/weather?q=" + req.body.city + "&appid=82531526b10b3e167b18d94ba6da4905&units=metric&lang=fr", function(error, response, body) {
        body = JSON.parse(body);
        var check =false;
        for (var i=0; i<req.session.cityList.length; i++){
        if (req.session.cityList[i].name == req.body.city) {
          console.log("ANCIENNE VILLE ==>OK");
          check = true;
        }
      }
      if(check == false) {
        console.log("NOUVELLE VILLE ==>OK");
        console.log(' "http://openweathermap.org/img/w/" + body.weather[0].icon + ".png"')
        req.session.cityList.push({
          name: body.name,
          picto: "http://openweathermap.org/img/w/" + body.weather[0].icon + ".png",
          min: body.main.temp_min,
          max: body.main.temp_max,
          temps: body.weather[0].description
        });
      }
        res.render('index', {cityList: req.session.cityList,userName});
    });
  });

/* GET delete function */
router.get('/delete', function(req, res, next) {
  var userName = req.session.nomUtilisateur;
  req.session.cityList.splice(req.query.indice, 1);
  res.render('index', {cityList: req.session.cityList,userName});
});


module.exports = router;
