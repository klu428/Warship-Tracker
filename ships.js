/*
References https://github.com/wolfordj/CS340-Sample-Web-App/blob/master/people.js as a template
*/

module.exports = function() {
	var express = require('express');
	var router = express.Router();

	//Get all country information
	function getCountries(res, mysql, context, complete) {
		mysql.pool.query("SELECT * FROM country", function(error, results, fields){
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.countries = results;
			complete();
		});
	}

	//Get one country's information for updating
	function getCountry(res, mysql, context, id, complete) {
		var stringQuery = "SELECT * FROM country WHERE id = ?";
		var inserts = [id];
		mysql.pool.query(stringQuery, inserts, function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.country = results[0];
			complete();
		});
	}

	//Get all classification information
	function getClasses(res, mysql, context, complete) {
		mysql.pool.query("SELECT * FROM classification", function(error, results, fields){
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.class = results;
			complete();
		});
	}

	//Get all battle information
	function getBattles(res, mysql, context, complete) {
		mysql.pool.query("SELECT * FROM battle", function(error, results, fields){
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.battle = results;
			complete();
		});
	}

	//Get all ship information
	function getShips(res, mysql, context, complete) {
		var stringQuery = "SELECT ship.id, ship.name, length, tonnage, ship.date, classification.type AS class, country.name AS nation " +
		"FROM ship LEFT JOIN classification ON ship.clid = classification.id " +
		"LEFT JOIN country ON ship.coid = country.id"
		mysql.pool.query(stringQuery, function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.ships = results;
			complete();
		});
	}

	//Get one ship's information
	function getShip(res, mysql, context, id, complete) {
		var sql = "SELECT * FROM ship WHERE ship.id = ?"
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.ship = results[0];
			complete();
		});
	}

	//Get all of one country's ships
	function getShipCountry(res, mysql, context, coid, complete) {
		var sql = "SELECT ship.id, ship.name, length, tonnage, ship.date, classification.type AS class, country.name AS nation " +
		"FROM ship INNER JOIN classification ON ship.clid = classification.id " +
		"INNER JOIN country ON ship.coid = country.id WHERE ship.coid = ?"
		var inserts = [coid];
		mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.coid = coid;
			context.ships = results;
			complete();
		})
	}

	//Get all ships fighting in battles information
	function getFought(res, mysql, context, complete) {
		var stringQuery = "SELECT sid, bid, ship.name AS sname, battle.name AS bname " +
		"FROM ship INNER JOIN fought_in ON ship.id = fought_in.sid " +
		"INNER JOIN battle ON fought_in.bid = battle.id " +
		"ORDER BY battle.name"
		mysql.pool.query(stringQuery, function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.fought = results;
			complete();
		});
	}

	//Display all tables on page
	router.get('/', function(req,res) {
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		getCountries(res, mysql, context, complete);
		getClasses(res, mysql, context, complete);
		//For filtering by country
		if(req.query.coid) {
			context.jsscripts = ["selectFilter.js"];
			getShipCountry(res, mysql, context, req.query.coid, complete);
		} else {
			getShips(res, mysql, context, complete);
		}
		getBattles(res, mysql, context, complete);
		getFought(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if(callbackCount >= 5) {
				res.render('ships', context);
			}
		}
	});

	//Displays one ship's information for updating
	router.get('/updateship/:id', function(req,res) {
		callbackCount = 0;
		var context = {};
		context.jsscripts = ["select.js"];
		var mysql = req.app.get('mysql');
		getShip(res, mysql, context, req.params.id, complete);
		getClasses(res, mysql, context, complete);
		getCountries(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if(callbackCount >= 3) {
				//Change date to accepted format
				context.ship.date = JSON.stringify(context.ship.date).substring(1,11);
				res.render('updateship', context);
			}
		}
	});

	//Adds a ship
	router.post('/addship', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO ship (name, length, tonnage, `date`, clid, coid) VALUES (?,?,?,?,?,?)";
		var inserts = [req.body.name, req.body.length, req.body.tonnage, req.body.date, req.body.clid, req.body.coid];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
			if(error){
				console.log(JSON.stringify(error));
				var context = {message: 'Add'};
				res.render('error', context);
			} else {
				res.redirect('/');
			}
		});
	});

	//Adds a class
	router.post('/addclass', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO classification (type, symbol) VALUES (?,?)";
		var inserts = [req.body.type, req.body.symbol];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
			if(error){
				console.log(JSON.stringify(error));
				var context = {message: 'Add'};
				res.render('error', context);
			} else {
				res.redirect('/');
			}
		});
	});

	//Adds a country
	router.post('/addcountry', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO country (name, navypop) VALUES (?,?)";
		var inserts = [req.body.name, req.body.navypop];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
			if(error){
				console.log(JSON.stringify(error));
				var context = {message: 'Add'};
				res.render('error', context);
			} else {
				res.redirect('/');
			}
		});
	});

	//Display one country's information for updating
	router.get('/updatecountry/:id', function(req,res){
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		var context = {};
		getCountry(res, mysql, context, req.params.id, complete);
		function complete() {
			callbackCount++
			if (callbackCount >= 1) {
				res.render('updatecountry', context);
			}
		}
	});

	//Updates a country
	router.post('/updatecountry/:id', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "UPDATE country SET name=?, navypop=? WHERE id=?";
		var inserts = [req.body.name, req.body.navypop, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error,results, fields) {
			if(error) {
				console.log(JSON.stringify(error));
				var context = {message: 'Update'};
				res.render('error', context);
			} else {
				res.redirect('/');
			}
		});
	});

	//Delete a country
	router.get('/deletecountry/:id', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM country WHERE id = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
			if(error){
				console.log(JSON.stringify(error));
				var context = {message: 'Delete'};
				res.render('error', context);
			} else {
				res.redirect('/');
			}
		});
	});

	//Adds a battle
	router.post('/addbattle', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO battle (name, date) VALUES (?,?)";
		var inserts = [req.body.name, req.body.date];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
			if(error){
				console.log(JSON.stringify(error));
				var context = {message: 'Add'};
				res.render('error', context);
			} else {
				res.redirect('/');
			}
		});
	});

	//Adds a ship battle participant
	router.post('/addfought', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO fought_in (sid, bid) VALUES (?,?)";
		var inserts = [req.body.sid, req.body.bid];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
			if(error){
				console.log(JSON.stringify(error));
				var context = {message: 'Add'};
				res.render('error', context);
			} else {
				res.redirect('/');
			}
		});
	});

	//Delete a ship
	router.get('/deleteship/:id', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM ship WHERE id = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
			if(error){
				console.log(JSON.stringify(error));
				var context = {message: 'Delete'};
				res.render('error', context);
			} else {
				res.redirect('/');
			}
		});
	});

	//Updates a ship
	router.post('/updateship/:id', function(req,res){
		//Check for null selection
		if (req.body.clid == ''){
			req.body.clid = null;
		}
		if (req.body.coid == '') {
			req.body.coid = null;
		}
		var mysql = req.app.get('mysql');
		var sql = "UPDATE ship SET name=?, length=?, tonnage=?, `date`=?, clid=?, coid=? WHERE id=?";
		var inserts = [req.body.name, req.body.length, req.body.tonnage, req.body.date, req.body.clid, req.body.coid, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error){
				console.log(JSON.stringify(error));
				var context = {message: 'Edit'};
				res.render('error', context);
			} else {
				res.redirect('/');
			}
		});
	});

	//Displays one ship's information for updating
	router.get('/updatefought', function(req,res) {
		callbackCount = 0;
		var context = {};
		context.sid = req.query.sid;
		context.bid = req.query.bid;
		context.jsscripts = ["selectFought.js"];
		var mysql = req.app.get('mysql');
		getShips(res, mysql, context, complete);
		getBattles(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if(callbackCount >= 2) {
				res.render('updatefought', context);
			}
		}
	});

	//Deletes a ship-battle participant
	router.get('/deletefought', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM fought_in WHERE sid=? AND bid=?";
		var inserts = [req.query.sid, req.query.bid];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
			if(error){
				console.log(JSON.stringify(error));
				var context = {message: 'Delete'};
				res.render('error', context);
			} else {
				res.redirect('/');
			}
		});
	});

	//Updates a ship-battle participant
	router.post('/updatefought', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "UPDATE fought_in SET sid=?, bid=? WHERE sid=? AND bid=?";
		var inserts = [req.body.sid, req.body.bid, req.body.oldsid, req.body.oldbid];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
			if(error){
				console.log(JSON.stringify(error));
				var context = {message: 'Update'};
				res.render('error', context);
			} else {
				res.redirect('/');
			}
		});
	});


	return router;
}();