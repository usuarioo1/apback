const dns = require('dns');

dns.resolveSrv(
  '_mongodb._tcp.artesaniaspachybd.gvvss.mongodb.net',
  (err, records) => {
    console.log('ERROR:', err);
    console.log('RECORDS:', records);
  }
);