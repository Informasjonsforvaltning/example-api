const logger = require('koa-logger');
const _ = require ('koa-route');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();
const responseTime = require('response-time');

// only set up statsd if in production:
if(process.env.NODE_ENV === 'production') {
  var StatsD = require('hot-shots');
  const options = {
    "host": "telegraf",
    "port": "8125"
  }
  var metrics = new StatsD(options);
  // Catch socket errors so they don't go unhandled, as explained
  // in the Errors section below
  metrics.socket.on('error', function(error) {
    console.error("Error in socket: ", error);
  });
}

// Metric middleware, cf https://github.com/koajs/koa/blob/master/docs/middleware.gif
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  // In production we send metrics to statsd, otherwise to console
  if(process.env.NODE_ENV === 'production') {
    metrics.timing(`naeringskoder.timer_${ctx.method}_${ctx.url}`, ms);
    metrics.increment(`naeringskoder.counter_${ctx.method}_${ctx.url}`);
    metrics.gauge('naeringskoder.gauge_numberofnaeringskoder', db.length);
  } else {
    console.log(`naeringskoder.timer_${ctx.method}_${ctx.url} - ${ms}`);
  }
});

app.use(logger());
app.use(bodyParser());

const db = [];
var maxId = 0;

// Content negotiation middleware.
// For now we only return application/json
app.use(async (ctx, next) => {
  await next();
  // no body? nothing to format, early return
  if (!ctx.body) return;
  // Check which type is best match by giving
  // a list of acceptable types to `req.accepts()`.
  const type = ctx.accepts('json');
  // accepts json, koa handles this for us,
  // so just return
  if (type === 'json') return;
  // not acceptable
  if (type === false) ctx.throw(406);
});

const naeringskoder = {
  list: (ctx) => {
    // We accept a query on 'nacekode':
    if (ctx.query.nacekode) {
      console.log("searching for nacekode", ctx.query.nacekode);
      var res = [];
      for (var i = 0; i < db.length; i++) {
        if (db[i].nacekode && db[i].nacekode === ctx.query.nacekode) {
          res.push(db[i]);
        }
      }
      ctx.body = res;
    }
    // We also accept a query on 'beskrivelse':
    else if (ctx.query.beskrivelse) {
      console.log("searching for beskrivelse", ctx.query.beskrivelse);
      var res = [];
      for (var i = 0; i < db.length; i++) {
        if (db[i].beskrivelse && db[i].beskrivelse.toLowerCase().includes(ctx.query.beskrivelse.toLowerCase())) {
          res.push(db[i]);
        }
      }
      ctx.body = res;
    } else {
      ctx.body = db; // otherwise return the whole lot
    }
  },

  create: (ctx) => {
    console.log('Creating: ', ctx.request.body);
    var index = db.push(ctx.request.body);
    db[index-1].id = ++maxId;
    ctx.set('Location', 'http://localhost:8080/naeringskoder/' + ctx.request.body.id);
    ctx.status = 201;
  },

  show: (ctx, id) => {
    var naeringskode = db.find( o => o.id === parseInt(id));
    if (!naeringskode) return ctx.throw(404, 'cannot find that naeringskode');
    ctx.body = naeringskode;
  },

  update: (ctx, id) => {
    console.log('Updating: ', id, ' ', ctx.request.body);
    var naeringskode = db.find( o => o.id === parseInt(id));
    if (!naeringskode) return ctx.throw(404, 'cannot find that naeringskode');
    var index = db.indexOf(naeringskode);
    if (index > -1) {
      db[index] = ctx.request.body;
      db[index].id = naeringskode.id;
    }
    ctx.status = 204;
},

  delete: (ctx, id) => {
    console.log('Deleting: ', id);
    var naeringskode = db.find( o => o.id === parseInt(id));
    if (!naeringskode) return ctx.throw(404, 'cannot find that naeringskode');
    var index = db.indexOf(naeringskode);
    if (index > -1) {
      db.splice(index, 1);
    }
    ctx.status = 204;
  }
};

app.use(_.get('/naeringskoder', naeringskoder.list));
app.use(_.post('/naeringskoder', naeringskoder.create));
app.use(_.get('/naeringskoder/:id', naeringskoder.show));
app.use(_.put('/naeringskoder/:id', naeringskoder.update));
app.use(_.delete('/naeringskoder/:id', naeringskoder.delete));

const server = app.listen(8080, function (){
  console.log('listening on port 8080');
});
module.exports = server;
