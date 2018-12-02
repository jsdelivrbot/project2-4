const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000;
var pg = require('pg');
const url = require('url');

require('dotenv').load();
var connectionString = process.env.DATABASE_URL;

pg = require("pg");
pg.defaults.ssl = true;
const { Pool } = require("pg");
const pool = new Pool({ connectionString: connectionString });

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')

    .get('/', function (request, response) {
        response.sendFile(__dirname + '/public/' + 'login.html');
    })

    .get('/', function (request, response) {
        response.sendfile(__dirname + '/public/' + 'login.html');
    })

    .get('/getUser', function (request, response) {
        getUser(request, response);
    })

    .get('/getProfile', function (request, response) {
        getProfile(request, response);
    })

    .get('/getLogin', function (request, response) {
        getLogin(request, response);
    })

    .get('/getAllUsers', function (request, response) {
        getAllUsers(request, response);
    })

    .get('/getAllInterests', function (request, response) {
        getAllnterests(request, response);
    })

    .get('/getUserInterests', function (request, response) {
        getUserInterests(request, response);
    })

    .get('/getYears', function (request, response) {
        getYears(request, response);
    })

    .get('/getUserYear', function (request, response) {
        getUserYearInfo(request, response);
    })

    .get('/getBoardList', function (request, response) {
        getBoardList(request, response);
    })
 
    //start server running
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

function getUser(request, response) {
    var requestUrl = url.parse(request.url, true);
    var id = requestUrl.query.id;

    getUserFromDb(id, function (error, result) {

        if (error || result == null || result.length != 1) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            var user = result[0];
            response.status(200).json(user);
        }
    });
}

function getProfile(request, response) {
    var requestUrl = url.parse(request.url, true);
    var id = requestUrl.query.id;

    getUserFromDb(id, function (error, result) {

        if (error || result == null || result.length != 1) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            var user = result[0];
            var params = { user: user };
            response.render('pages/userprofile', params)
            //response.status(200).json(user);
        }
    });
}

function getLogin(request, response) {
    var requestUrl = url.parse(request.url, true);
    var email = requestUrl.query.email;

    getLoginFromDb(email, function (error, result) {

        if (error || result == null || result.length != 1) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            var user = result[0];
            response.status(200).json(user);
        }
    });
}

function getAllUsers(request, response) {

    getAllUsersFromDb(function (error, result) {

        if (error || result == null) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            var list = result;

            var params = { users: list };
            response.render('pages/userlist', params)
            //response.status(200).json(list);
        }
    });
}

function getAllnterests(request, response) {

    getAllInterestsFromDb(function (error, result) {

        if (error || result == null) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            var list = result;
            response.status(200).json(list);
        }
    });
}

function getUserInterests(request, response) {
    var requestUrl = url.parse(request.url, true);
    var id = requestUrl.query.id;

    getAllUserInterestsFromDb(id, function (error, result) {

        if (error || result == null) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            var list = result;
            response.status(200).json(list);
        }
    });
}

function getYears(request, response) {

    getYearsFromDb(function (error, result) {

        if (error || result == null) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            var list = result;
            response.status(200).json(list);
        }
    });
}

function getUserYearInfo(request, response) {
    var requestUrl = url.parse(request.url, true);
    var id = requestUrl.query.id;

    getUserYearInfoFromDb(id, function (error, result) {

        if (error || result == null) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            var info = result;
            response.status(200).json(info);
        }
    });
}

function getBoardList(request, response) {
    var requestUrl = url.parse(request.url, true);
    var id = requestUrl.query.id;

    getBoardListFromDb(id, function (error, result) {

        if (error || result == null) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            var list = result;
            response.status(200).json(list);
        }
    });
}

function getUserFromDb(id, callback) {
    console.log("Getting user from DB with id: " + id);

    //var sql = "SELECT user_account_id, email, password, first_name, last_name, address1, address2, city, state,zip, notes, colors FROM user_account WHERE user_account_id = $1::int";
    var sql = "SELECT u.user_account_id, email, password, first_name, last_name, address1, address2, city, state,zip, notes, colors, string_agg(i.interest, ',') AS interests ";
    sql += "FROM user_account u LEFT JOIN user_interest ui ON(u.user_account_id = ui.user_account_id) LEFT JOIN interest i ON(ui.interest_id = i.interest_id) ";
    sql += "WHERE u.user_account_id = $1::int ";
    sql += "GROUP BY u.user_account_id, email, password, first_name, last_name, address1, address2, city, state, zip, notes, colors";
    var params = [id];

    pool.query(sql, params, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));

        // (The first parameter is the error variable, so we will pass null.)
        callback(null, result.rows);
    });
}


function getLoginFromDb(email, callback) {
    console.log("Getting user from DB with email: " + email);

    var sql = "SELECT user_account_id, email, password, first_name, last_name FROM user_account WHERE email = $1::varchar";
    var params = [email];

    pool.query(sql, params, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));

        // (The first parameter is the error variable, so we will pass null.)
        callback(null, result.rows);
    });
}

function getAllUsersFromDb(callback) {
    console.log("Getting users from db");

    var sql = "SELECT user_account_id, email, password, first_name, last_name, address1, address2, city, state, zip FROM user_account ";

    pool.query(sql, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));

        // (The first parameter is the error variable, so we will pass null.)
        callback(null, result.rows);
    });
}

function getAllInterestsFromDb(callback) {
    console.log("Getting interests from db");

    var sql = "SELECT interest_id, interest FROM interest ";

    pool.query(sql, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));

        // (The first parameter is the error variable, so we will pass null.)
        callback(null, result.rows);
    });
}

function getAllUserInterestsFromDb(id, callback) {
    console.log("Getting interests from db for userid: " + id);

    var sql = "SELECT ui.user_account_id, ui.interest_id, i.interest  from user_interest ui JOIN interest i ON(ui.interest_id = i.interest_id) WHERE ui.user_account_id = $1::int";
    var params = [id];

    pool.query(sql, params, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));

        // (The first parameter is the error variable, so we will pass null.)
        callback(null, result.rows);
    });
}

function getYearsFromDb(callback) {
    console.log("Getting years from db");

    var sql = "SELECT gift_year_id, gift_year FROM gift_year ";

    pool.query(sql, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));

        // (The first parameter is the error variable, so we will pass null.)
        callback(null, result.rows);
    });
}

function getUserYearInfoFromDb(id, callback) {
    console.log("Getting user year info from db for userid: " + id);

    var sql = "SELECT uy.gift_year_id, uy.user_account_id, uy.is_participating, uy.assigned_user_id, u.first_name || ' ' || u.last_name as AssignedUser FROM user_year uy JOIN gift_year gy ON (uy.gift_year_id = gy.gift_year_id) LEFT JOIN user_account u ON(uy.assigned_user_id = u.user_account_id) WHERE uy.user_account_id =  $1::int";
    var params = [id];

    pool.query(sql, params, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));

        // (The first parameter is the error variable, so we will pass null.)
        callback(null, result.rows);
    });
}

function getBoardListFromDb(id, callback) {
    console.log("Getting pinterest boards from db for userid: " + id);

    var sql = "SELECT board_id, user_account_id, name, pin_board_id from board WHERE user_account_id =  $1::int";
    var params = [id];

    pool.query(sql, params, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));

        // (The first parameter is the error variable, so we will pass null.)
        callback(null, result.rows);
    });
}