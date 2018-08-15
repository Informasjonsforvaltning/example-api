var http = require('http');
var fs = require('fs');

fs.readFile( __dirname + '/nace_beskrivelse.tab', function (err, data) {
  if (err) {
    throw err;
  }

  var r = [];
  var l = data.toString().split('\r\n');
  for (var i = 0; i < l.length; i++) {
    //console.log(l[i]);
    var a = l[i].split('\t');
    for (var j = 0; j < a.length; j++) {
      console.log(a[j]);
    };
    var o;
    if (!a[2]) {
      o = JSON.stringify({
        nacekode: a[0], beskrivelse: a[1]
      });
    } else {
      o = JSON.stringify({
        nacekode: a[0], beskrivelse: a[1] + ' ' + a[2]
      });
    }

    console.log('Json: ', o);
    var request = new http.ClientRequest({
      hostname: "localhost",
      port: 8080,
      path: "/naeringskoder",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Lenght": Buffer.byteLength(o)
      }
    });
    request.end(o);
  };
});
