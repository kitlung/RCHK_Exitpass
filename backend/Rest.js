function Exit_Pass_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

Exit_Pass_ROUTER.prototype.handleRoutes = function(router,connection,md5){
    router.get("/exitpass/",function(req,res){
        res.json({"Message" : "Server Access"});
    });

    router.post("/exitpass/import-student",importStudent);
    router.get("/exitpass/get-permission/:user", getPermission);
    router.post("/exitpass/add-to-exit-log", appendLog);
    router.get("/exitpass/get-card-details/:card_id", getDetails);
    router.get("/exitpass/if-exists/:weblogin", checkIfExists);
    router.post("/exitpass/student-return",studentReturn);
    router.get("/exitpass/get-students", getStudents);
    router.post("/exitpass/change-permission", changePermission);
    router.post("/exitpass/get-records-btw-dates", getRecordBtwDates);
    router.get("/exitpass/get-exit-log", getLogs);
    router.get("/exitpass/get-permission-log/:weblogin",getStudentPermissionLog);
    router.post("/exitpass/temp-access",addTempAccess)
    router.get("/exitpass/get-current-card-id/:old_card", getCurrentCardIDWithOldCardID)

    function importStudent(req,res){
        var query = `   
                        INSERT INTO rdapps.rcapps_exit_pass (weblogin, permission)
                        SELECT WEB_LOGIN, 1
                        FROM maze_rc.ST ST 
                        LEFT JOIN rdapps.rcapps_exit_pass
                        ON maze_rc.ST.WEB_LOGIN = rdapps.rcapps_exit_pass.weblogin
                        WHERE rdapps.rcapps_exit_pass.weblogin IS NULL
                        AND maze_rc.ST.STATUS = 'FULL'
                        AND (maze_rc.ST.SCHOOL_YEAR = 'Y12' OR maze_rc.ST.SCHOOL_YEAR = 'Y13');
                    `
        connection.query(query,function(err){
            if (err) {
                res.json({"Error" : true, "Message" : "Fail to run query"});
            } else {
                res.json({"Error" : false, "Message" : "Missing students are imported"});
            }
        })
    }

    function studentReturn(req,res){
        var weblogin = req.body.weblogin
        var query = "UPDATE rcapps_exit_pass_logs SET " + 
                    "status = 'returned', return_time = NOW(), lateness = 'no' " +
                    "WHERE weblogin = '" + weblogin + "' AND status != 'returned';"
        connection.query(query,function(err){
            if (err) {
                res.json({"Error" : true, "Message" : "Error in updating student log"});
            } else {
                res.json({"Error" : false, "Message" : "Student returned"});
            }
        })
    }

    function getStudents(req,res){
        var query = "SELECT " +
                    "ru.weblogin, CONCAT(ru.name, ' ', ru.family_name) AS name, ru.house, ru.school_year, ru.card_id, rep.permission, ru.roll_group as advisory " + 
                    "FROM rcapps_exit_pass rep INNER JOIN rcapps_users ru ON rep.weblogin = ru.weblogin ORDER BY name, ru.weblogin;"
        connection.query(query, function(err, row){
            if (err) {
                res.json({"Error" : true, "Message" : "Cannot get log"});
            } else {
                res.json({"Error" : false, "Message" : "Get log success", "Request": row});
            }
        })
    }

    function getDetails(req,res){
        var query = "SELECT "+
                    "ru.weblogin AS weblogin, ru.first_name, ru.family_name, "+
                    "ru.name AS name, rup.photo AS photo_name, ru.house, "+
                    "ru.roll_group AS roll_group, rep.permission "+
                    "FROM rcapps_users_photo rup "+
                    "INNER JOIN rcapps_users ru ON rup.user_id = ru.weblogin "+
                    "INNER JOIN rcapps_exit_pass rep ON rup.user_id = rep.weblogin "+
                    "WHERE ru.card_id = '" + req.params.card_id + "' "+
                    "ORDER BY year_taken DESC LIMIT 1;"
        connection.query(query, function(err, row){
            if (err) {
                res.json({"Error" : true, "Message" : "Cannot get table"});
            } else {
                res.json({"Error" : false, "Message" : "Get data success", "Request": row});
            }
        })
    }

    function getLogs(req,res){
        var status = req.params.status
        var query = "SELECT "+
        "ru.weblogin, CONCAT(ru.name, ' ' , ru.family_name) AS name, ru.house, ru.school_year,ru.card_id,rep.permission,ru.tutor_group,repl.id,repl.status,repl.leave_time,repl.return_time,repl.lateness "+
        "FROM rcapps_exit_pass rep "+
        "INNER JOIN rcapps_exit_pass_logs repl ON rep.weblogin = repl.weblogin "+
        "INNER JOIN rcapps_users ru ON rep.weblogin = ru.weblogin "+
        "ORDER BY repl.id DESC;"
        connection.query(query, function(err, row){
            if (err) {
                console.log('get error')
                res.json({"Error" : true, "Message" : "Cannot get log"});
            } else {
                res.json({"Error" : false, "Message" : "Get log success", "Request": row});
            }
        })
    }


    function checkIfExists(req,res){
        var query = "SELECT * FROM rcapps_exit_pass_logs WHERE (status = 'exit' OR status = 'leave') AND (DATE(leave_time) = CURDATE()) AND (weblogin = '" + req.params.weblogin + "');"; 
        connection.query(query, function(err, row){
            if (err) {
                res.json({"Error" : true, "Message" : "Cannot check existence"});
            } else {
                res.json({"Error" : false, "Message" : "check existence success", "Request": row});
            }
        })
    }

    function getPermission(req,res){
        var query = "SELECT permission FROM rcapps_exit_pass WHERE weblogin = '" +req.params.user+ "';";
        connection.query(query, function(err, row){
            if (err) {
                res.json({"Error" : true, "Message" : "Cannot check permission"});
            } else {
                if (row[0].permission == 0) {
                    var checkTempPermissionQuery = `SELECT COUNT(*) AS permission FROM rcapps_exit_pass_temp_access WHERE weblogin = '` + req.params.user + `' AND CURDATE() >= valid_date AND CURDATE() < expiry_date`
                    connection.query(checkTempPermissionQuery,function(err,temp){
                        if(err){
                            res.json({"Error" : true, "Message" : "Cannot check permission"});
                        }else{
                            if (temp[0].permission > 0) {
                                res.json({"Error" : false, "Message" : "get permission success", "Request": temp});
                            } else {
                                res.json({"Error" : true, "Message" : "Cannot check permission"});
                            }
                        }
                    })
                }else{
                    res.json({"Error" : false, "Message" : "get permission success", "Request": row});
                }
            }
        })
    }

    function appendLog(req,res){
        var query = "INSERT INTO rcapps_exit_pass_logs (weblogin, status, leave_time) VALUES ('"+req.body.weblogin+"', '"+req.body.status+"', NOW());";
        console.log(query)
        connection.query(query,function(err, result){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success"});
            }
        })
    }

 


    function changePermission(req,res){
        var query = `
                UPDATE rcapps_exit_pass SET permission = '` +req.body.permission+ `' WHERE weblogin= '` +req.body.weblogin+ `';
                INSERT INTO rcapps_exit_pass_permission_logs (admin, student, reason, permission, created_date) VALUES ('` +req.body.admin+ `', '` +req.body.weblogin+ `', '` +req.body.reason+ `', '` +req.body.permission+ `', NOW());
            `
            console.log(query)
        connection.query(query, function(err, row){
            if (err) {
                console.log("FAILED change permission");
                res.json({"Error" : true, "Message" : "Cannot check existence"});
            } else {
                console.log("change permission success");
                res.json({"Error" : false, "Message" : "change permission success"});
            }
        })
    }

    function getRecordBtwDates(req,res){
        var start = req.body.start
        var end = req.body.end
        var query = "SELECT repl.id, ru.family_name, ru.name, repl.weblogin , repl.status, repl.leave_time, repl.return_time "+
                    "FROM rcapps_exit_pass_logs repl "+
                    "INNER JOIN rcapps_users ru ON ru.weblogin = repl.weblogin " +
                    "WHERE leave_time BETWEEN '" + start + "' AND '" + end + "';"
        console.log(query)
        connection.query(query,function(err, rows){
            if(err){
                res.json({"Error" : true, "Message" : "Cannot get records."});
            } else {
                res.json({"Error" : false, "Message" : "Get records success", "Request": rows})
            }
        })
    }

    function getStudentPermissionLog(req,res){
        var weblogin = req.params.weblogin
        if(weblogin == 'all'){
            var query = `
            SELECT CONCAT(ru1.name, ' ', ru1.family_name) AS admin_name, CONCAT(ru2.name, ' ', ru2.family_name) AS student_name, reppl.reason, reppl.created_date, reppl.permission
            FROM rcapps_exit_pass_permission_logs reppl
            JOIN rcapps_users ru1 ON reppl.admin = ru1.weblogin
            JOIN rcapps_users ru2 ON reppl.student = ru2.weblogin
            ORDER BY created_date DESC;
        `
        }else{
            var query = `
            SELECT CONCAT(ru.name, ' ', ru.family_name) AS admin_name, reppl.reason, reppl.created_date, reppl.permission
            FROM rcapps_exit_pass_permission_logs reppl
            JOIN rcapps_users ru ON reppl.admin = ru.weblogin
            WHERE reppl.student = '` + weblogin + `'
            ORDER BY created_date DESC;
        `
        }
        connection.query(query,function(err, rows){
            if(err){
                res.json({"Error" : true, "Message" : "Cannot get records."});
            } else {
                res.json({"Error" : false, "Message" : "Get records success", "Request": rows})
            }
        })
    }

    function addTempAccess(req,res){
        var weblogin = req.body.weblogin
        var card_id = req.body.card_id
        var query = `INSERT INTO rcapps_exit_pass_temp_access (weblogin, card_id, valid_date, expiry_date) VALUES ('` + weblogin + `', '` + card_id + `', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY));`
        console.log(query)
        connection.query(query, function(err,rows){
            if(err){
                res.json({"Error" : true, "Message" : "Cannot insert record."});
            } else {
                res.json({"Error" : false, "Message" : "Success."})
            }
        })
    }

    function getCurrentCardIDWithOldCardID(req,res){
        var query = `
            SELECT card_id FROM rcapps_users_cardlogs
            WHERE current_card = 1 AND 
            user_id = (SELECT DISTINCT user_id FROM rcapps_users_cardlogs WHERE card_id = '` + req.params.old_card + `')
        `
        connection.query(query, function(err,rows){
            if(err){
                res.json({"Error" : true, "Message" : "Cannot get card id."});
            }else{
                res.json({"Error" : false, "Message" : "Success.", "Request" : rows});
            }
        })
    }
}

module.exports = Exit_Pass_ROUTER;