const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// the following layout doesn't have a layout file, so
// views/no-layout.handlebars must include all necessary HTML
app.get('/custom-layout', (req, res) => {
    res.render('custom-layout', { layout: 'custom' })
})

app.get('*', (req, res) => res.send('Check out the "<a href="/custom-layout">custom layout</a>" page!'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/custom-layout\n`))
