const bodyParser  = require("body-parser");
const express = require('express');
var engines = require('consolidate');
var md5 = require('MD5');
var rest = require("./Rest.js")
var db = require('./config/db.js');
var mysql = require('mysql')

const app = express()

function REST(){
    var self = this
    self.connectMysql();
}

REST.prototype.connectMysql = function(){
    var hostInfo = db.development
    console.log('Using localhost db...', hostInfo)

    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : hostInfo.host,
        user     : hostInfo.user,
        password : hostInfo.password,
        database : hostInfo.database,
        debug    :  false,
        multipleStatements: true,
        timezone: 'utc'
    });

    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(bodyParser.urlencoded({ extended: true }));
    //   app.use(bodyParser.json());
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
    app.set('views', __dirname + '/views');
    app.engine('html', engines.mustache);
    app.set('view engine', 'html');
    var router = express.Router();
    app.use('/api', router);
    var rest_router = new rest(router,connection,md5);
    self.startServer();
}

REST.prototype.startServer = function() {
    app.listen(7082,function(){
        console.log("All right ! I am alive at Port 7082.");
    });
}

REST.prototype.stop = function(err) {
  console.log("ISSUE WITH MYSQL \n" + err);
  process.exit(1);
}

new REST();
