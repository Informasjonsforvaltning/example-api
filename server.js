const logger = require('koa-logger');
const _ = require ('koa-route');
const Koa = require('koa');
const app = new Koa();

app.use(logger());

const db = {
  1: { name: 'tobi', species: 'ferret'},
  2: { name: 'loki', species: 'ferret'},
  3: { name: 'jane', species: 'ferret'}
};

const pets = {
  list: (ctx) => {
    ctx.body = db;
  },

  show: (ctx, name) => {
    const pet = db[name];
    if (!pet) return ctx.throw('cannot find that pet', 404);
    ctx.body = pet;
  }
};

app.use(_.get('/pets', pets.list));
app.use(_.get('/pets/:name', pets.show))

app.listen(8080);
console.log('listening on port 8080');
