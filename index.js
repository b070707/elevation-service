var addElevation = require('geojson-elevation').addElevation,
    TileSet = require('node-hgt').TileSet,
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    tiles = new TileSet('./data');

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.post('/geojson', function(req, res) {
    var geojson = req.body;

    if (!geojson || Object.keys(geojson).length === 0) {
        res.status(400).send('Error: invalid geojson.');
        return;
    }

    addElevation(geojson, tiles, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(JSON.stringify(geojson));
        }
    });
});

var server = app.listen(5001, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('elevation-server listening at http://%s:%s', host, port);
});