const express = require('express')
const app = express()

app.get('/text', (req, res) => {
    res.type('text/plain')
    res.send('this is a test')
})

app.get('*', (req, res) => res.send('Check out the "<a href="/custom-layout">custom layout</a>" page!'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/custom-layout\n`))
