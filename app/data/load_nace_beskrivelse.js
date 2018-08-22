var http = require('http');
var fs = require('fs');

fs.readFile( __dirname + '/nace_beskrivelse.tab', function (err, data) {
  if (err) {
    throw err;
  }

// Split data into array by lines:
  var l = data.toString().split('\r\n');
  for (var i = 0; i < l.length; i++) {
    // Split the line into array by tab
    var a = l[i].split('\t');

    // Create a Json object:
    var o;
    if (!a[2]) {
      o = JSON.stringify({
        industrialcode: a[0], description: a[1]
      });
    } else {
      o = JSON.stringify({
        industrialcode: a[0], description: a[1] + ' ' + a[2]
      });
    }

    console.log('Json: ', o);

    // Post the object to our endpoint
    var request = new http.ClientRequest({
      hostname: "localhost",
      port: 8080,
      path: "/industrialcodes",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Lenght": Buffer.byteLength(o)
      }
    });
    request.end(o);
  };
});
