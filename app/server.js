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
    metrics.timing(`industrialcodes.timer_${ctx.method}_${ctx.url}`, ms);
    metrics.increment(`industrialcodes.counter_${ctx.method}_${ctx.url}`);
    metrics.gauge('industrialcodes.gauge_numberofindustrialcodes', db.length);
  } else {
    console.log(`industrialcodes.timer_${ctx.method}_${ctx.url} - ${ms}`);
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

const industrialcodes = {
  list: (ctx) => {
    // We accept a query on 'industrialcode':
    if (ctx.query.industrialcode) {
      console.log("searching for industrialcode", ctx.query.industrialcode);
      var res = [];
      for (var i = 0; i < db.length; i++) {
        if (db[i].industrialcode && db[i].industrialcode === ctx.query.industrialcode) {
          res.push(db[i]);
        }
      }
      ctx.body = res;
    }
    // We also accept a query on 'description':
    else if (ctx.query.description) {
      console.log("searching for description", ctx.query.description);
      var res = [];
      for (var i = 0; i < db.length; i++) {
        if (db[i].description && db[i].description.toLowerCase().includes(ctx.query.description.toLowerCase())) {
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
    ctx.set('Location', 'http://localhost:8080/industrialcodes/' + ctx.request.body.id);
    ctx.status = 201;
  },

  show: (ctx, id) => {
    var industrialcode = db.find( o => o.id === parseInt(id));
    if (!industrialcode) return ctx.throw(404, 'cannot find that industrialcode');
    ctx.body = industrialcode;
  },

  update: (ctx, id) => {
    console.log('Updating: ', id, ' ', ctx.request.body);
    var industrialcode = db.find( o => o.id === parseInt(id));
    if (!industrialcode) return ctx.throw(404, 'cannot find that industrialcode');
    var index = db.indexOf(industrialcode);
    if (index > -1) {
      db[index] = ctx.request.body;
      db[index].id = industrialcode.id;
    }
    ctx.status = 204;
},

  delete: (ctx, id) => {
    console.log('Deleting: ', id);
    var industrialcode = db.find( o => o.id === parseInt(id));
    if (!industrialcode) return ctx.throw(404, 'cannot find that industrialcode');
    var index = db.indexOf(industrialcode);
    if (index > -1) {
      db.splice(index, 1);
    }
    ctx.status = 204;
  }
};

app.use(_.get('/industrialcodes', industrialcodes.list));
app.use(_.post('/industrialcodes', industrialcodes.create));
app.use(_.get('/industrialcodes/:id', industrialcodes.show));
app.use(_.put('/industrialcodes/:id', industrialcodes.update));
app.use(_.delete('/industrialcodes/:id', industrialcodes.delete));

const server = app.listen(8080, function (){
  console.log('listening on port 8080');
});
module.exports = server;
