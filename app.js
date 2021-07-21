const express = require('express')
const exphbs = require('express-handlebars')

const routes = require('./routes')
require('./config/mongoose')

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

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})