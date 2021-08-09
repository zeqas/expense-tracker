const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')

const routes = require('./routes')
require('./config/mongoose')

const usePassport = require('./config/passport')

const app = express()
const PORT = process.env.PORT || 3000

const methodOverride = require('method-override')

const hbsHelpers = require('handlebars-helpers')
const multiHelpers = hbsHelpers()

app.engine('hbs', exphbs({ 
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: multiHelpers
}))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})