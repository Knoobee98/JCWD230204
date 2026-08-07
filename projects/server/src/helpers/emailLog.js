const log = []

function logEmail(entry) {
    log.push({ ts: new Date().toISOString(), ...entry })
    if (log.length > 20) log.shift()
}

function getEmailLog() {
    return [...log]
}

module.exports = { logEmail, getEmailLog }
