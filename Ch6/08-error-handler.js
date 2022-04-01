const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// see the views/error.hbs file for the contents of this view
app.get('/bad-bad-not-good', (req, res) => {
    // we're going to simulate something bad happening in your code....
    throw new Error('that didnt go well')
})

app.get('*', (req, res) => {
    res.render('08-click-here')
})

app.use((err, req, res, next) => {
    console.log('** SERVER ERROR: ' + err.message)
    res.status(500).render('08-error', { message: "you shouldn't have clicked that!" })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/about\n`))
