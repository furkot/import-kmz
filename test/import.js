var should = require('should');
var fs = require('fs');
var parse = require('..');

describe('furkot import kmz', function() {
  it('should parse kmz', function(done) {
    var stream = fs.createReadStream(__dirname + '/fixtures/usa.kmz');
    parse(stream, function(err, trip) {
      var expected = require('./fixtures/usa.json');

      should.not.exist(err);
      should.exist(trip);
      trip.should.eql(expected);
      done();
    });
  });

  it('should raise error on a file that does not contain KML', function(done) {
    var stream = fs.createReadStream(__dirname + '/fixtures/no-kml-inside.kmz');
    parse(stream, function(err, trip) {
      should.exist(err);
      should.not.exist(trip);
      done();
    });
  });

  it('should raise error on a file that cannot be unzipped', function(done) {
    var stream = fs.createReadStream(__dirname + '/fixtures/not-a-zip.kmz');
    parse(stream, function(err, trip) {
      should.exist(err);
      should.not.exist(trip);
      done();
    });
  });
});
