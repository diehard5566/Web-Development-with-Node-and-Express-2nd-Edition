const mongoose = require('mongoose')

const VacationInSeasonListenerSchema = mongoose.Schema({
    email: String,
    skus: [String],
})

const VacationInSeasonListener = mongoose.model('VacationInSeasonListener', VacationInSeasonListenerSchema)

module.exports = VacationInSeasonListener
