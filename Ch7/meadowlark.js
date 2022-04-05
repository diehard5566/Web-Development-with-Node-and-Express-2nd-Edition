const express = require('express')
const expressHandlebars = require('express-handlebars')

const handlers = require('./lib/handlers')
const weatherMiddleware = require('./lib/middleware/weather')

const app = express()

//configure Handlebars view engine
app.engine(
    'handlebars',
    expressHandlebars.engine({
        defaultLayout: 'main',
        helpers: {
            section: function (name, options) {
                if (!this_sections) this_sections = {}
                this_sections[name] = options.fn(this)
                return null
            },
        },
    })
)
app.set('view engine', 'handlebars')

app.use(weatherMiddleware)

app.get('/', handlers.home)
app.get('/section-test', handlers.sectionTest)

app.get('/about', (req, res) => {
    res.render('about')
})

// custom 404 page
app.use(handlers.notFound)

//custom 500 page
app.use(handlers.serverError)

const port = process.env.PORT || 3000
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Express started on http://localhost:${port}; ` + `press Ctrl-C to terminate.`)
    })
} else {
    module.exports = app
}
