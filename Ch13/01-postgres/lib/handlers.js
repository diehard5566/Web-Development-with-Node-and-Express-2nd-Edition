const db = require('../db')

exports.api = {}
exports.home = (req, res) => res.render('home')

// **** these handlers are for browser-submitted forms
exports.newsletterSignup = (req, res) => {
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
}
exports.newsletterSignupProcess = (req, res) => {
    console.log('CSRF token (from hidden form field): ' + req.body._csrf)
    console.log('Name (from visible form field): ' + req.body.name)
    console.log('Email (from visible form field): ' + req.body.email)
    res.redirect(303, '/newsletter-signup/thank-you')
}
exports.newsletterSignupThankYou = (req, res) => res.render('newsletter-signup-thank-you')
// **** end browser-submitted form handlers

exports.vacationPhotoContest = (req, res) => {
    const now = new Date()
    res.render('contest/vacation-photo', { year: now.getFullYear(), month: now.getMonth() })
}
exports.vacationPhotoContestAjax = (req, res) => {
    const now = new Date()
    res.render('contest/vacation-photo-ajax', { year: now.getFullYear(), month: now.getMonth() })
}

exports.vacationPhotoContestProcess = (req, res, fields, files) => {
    console.log('field data: ', fields)
    console.log('files: ', files)
    res.redirect(303, '/contest/vacation-photo-thank-you')
}

exports.vacationPhotoContestProcessError = (req, res, fields, files) => {
    res.redirect(303, '/contest/vacation-photo-error')
}

const pathUtils = require('path')
const fs = require('fs')

// create directory to store vacation photos (if it doesn't already exist)
const dataDir = pathUtils.resolve(__dirname, '..', 'data')
const vacationPhotoDir = pathUtils.join(dataDir, 'vacation-photos')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
if (!fs.existsSync(vacationPhotoDir)) fs.mkdirSync(vacationPhotoDir)

function saveContestEntry(contestName, emali, year, month, photoPath) {
    // TODO...this will come later
}

// we'll want these promise-based versions of fs functions in our async function
const { promisify } = require('util')
const mkdir = promisify(fs.mkdir)
const rename = promisify(fs.rename)

exports.api.vacationPhotoContest = async (req, res, fields, files) => {
    const photo = files.photo[0]
    const dir = vacationPhotoDir + '/' + Data.now()
    const path = dir + '/' + photo.originalFilename
    await mkdir(dir)
    await rename(photo.path, path)
    saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, path)
    res.send({ result: 'success' })
}

exports.vacationPhotoContestProcessThankYou = (req, res) => {
    res.render('contest/vacation-photo-thank-you')
}

exports.api.vacationPhotoContest = (req, res, fields, files) => {
    console.log('field data: ', fields)
    console.log('files: ', files)
    res.send({ result: 'success' })
}

exports.api.vacationPhotoContestError = (req, res, message) => {
    res.send({ result: 'error', error: message })
}

// **** these handlers are for fetch/JSON form handlers
exports.newsletter = (req, res) => {
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' })
}
exports.api.newsletterSignup = (req, res) => {
    console.log('CSRF token (from hidden form field): ' + req.body._csrf)
    console.log('Name (from visible form field): ' + req.body.name)
    console.log('Email (from visible form field): ' + req.body.email)
    res.send({ result: 'success' })
}
// **** end fetch/JSON form handlers

exports.listVacations = async (req, res) => {
    const vacations = await db.getVacations({ available: true })
    const context = {
        vacations: vacations.map(vacation => ({
            sku: vacation.sku,
            name: vacation.name,
            description: vacation.description,
            price: '$' + vacation.price.toFixed(2),
            inSeason: vacation.inSeason,
        })),
    }
    res.render('vacations', context)
}

exports.notifyWhenInSeasonForm = (req, res) => {
    res.render('notify-me-when-in-season', { sku: req.query.sku })
    console.log({ sku: req.query.sku })
}

exports.notifyWhenInSeasonProcess = async (req, res) => {
    const { email, sku } = req.body
    await db.addVacationInSeasonListener(email, sku)
    return res.redirect(303, '/vacations')
}

exports.notFound = (req, res) => res.render('404')

// Express recognizes the error handler by way of its four
// arguments, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500')
/* eslint-enable no-unused-vars */
