var express = require('express');
const puppeteer = require('puppeteer');
var app = express();
var md5 = require('md5');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = "mongodb://127.0.0.1:27017/jihantoro_shot";
app.set('views','./views');
app.set('view engine', 'ejs')
app.use(express.static('public'));


app.get('/', function(req, res){
    if(req.query.shot) {
     var site = req.query.shot;
     var site_file = site.split()
     var date = new Date();
     var h = date.getHours()
     ,   m = date.getMinutes()
     ,   d = date.getDate()
     ,   m = date.getMonth()
     ,   y = date.getFullYear();
     var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
     MongoClient.connect(url, function(err, db) {
       var col = db.collection('users');
       col.find({user_ip:ip}).limit(3).toArray(function(err, docs) {
         let l = docs.length;
	 db.close();
	 return l; // this is async rubi, you cant just return the value like that
       });
     });
     console.log(count_usage);
     
     var filename = md5(y+m+d+h+m+ip);
     (async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage(); 
        await page.goto(site);
        await page.screenshot({path: 'public/files/images/'+filename+'.jpg', fullPage: true});
	
	browser.close();
      })();
      MongoClient.connect(url, function(err, db) {
	db.collection('users').insertOne({user_ip:ip,user_filename:filename,site:site});
        db.close();
      });
      console.log(site)
      res.send("Done!");
    }
    else {
      res.render("index");
    }
});

app.listen(3000);
