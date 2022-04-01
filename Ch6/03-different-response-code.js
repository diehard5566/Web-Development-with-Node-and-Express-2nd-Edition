const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

app.engine('handlebars', expressHandlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/error', (req, res) => {
    res.status(500).render('error')
})

app.get('*', (req, res) => {
    res.send('Check out our <a href="/error">error</a> page!')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/error\n`))
