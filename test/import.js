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

  it('should raise error on a file that contains invalid KML', function(done) {
    var stream = fs.createReadStream(__dirname + '/fixtures/invalid-kml-inside.kmz');
    parse(stream, function(err, trip) {
      should.exist(err);
      err.should.have.property('err', 'invalid');
      err.should.have.property('message', 'Unexpected close tag');
      should.not.exist(trip);
      done();
    });
  });

  it('should raise error on a file that does not contain KML', function(done) {
    var stream = fs.createReadStream(__dirname + '/fixtures/no-kml-inside.kmz');
    parse(stream, function(err, trip) {
      should.exist(err);
      err.should.be.eql('invalid');
      should.not.exist(trip);
      done();
    });
  });

  it('should raise error on a file that cannot be unzipped', function(done) {
    var stream = fs.createReadStream(__dirname + '/fixtures/not-a-zip.kmz');
    parse(stream, function(err, trip) {
      should.exist(err);
      err.should.have.property('err', 'invalid');
      err.should.have.property('message');
      should.not.exist(trip);
      done();
    });
  });
});
