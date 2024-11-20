const express = require("express")
const path = require('path')
const app = express()
const port = process.env.PORT || '3000'
const router = require('./router/router')
const userRouter = require('./router/user.js')
const passport = require('passport')
const flash = require('express-flash')
const session = require('./config/session.js')
const { error } = require("console")

// process.on('warning', (warning) => {
//   console.log(warning.stack);
// });
function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('index', {user: res.locals.currentUser, error: err })
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session)
app.use(passport.session())
require('./config/passport.js')(passport)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/css', express.static(path.join(__dirname, 'styles')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use('/', router)
app.use('/user',userRouter)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})