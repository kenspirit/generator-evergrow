var rp = require('request-promise')
var redisClient = require('./redis-manager').getRedisClient()
var getRandomIntInclusive = require('./util').getRandomIntInclusive
var config = require('./config-manager').getConfig()

module.exports.sendSMS = sendSMS
module.exports.verifySMS = verifySMS

function sendSMS(phone, phoneCountryCode) {
  var key = getKey(phone, phoneCountryCode)

  return redisClient.get(key)
    .then(function(smsHistory) {
      if (!smsHistory) {
        smsHistory = {
          count: 0,
          hour_count: 0,
          today_count: 0,
          time: Date.now()
        }
      } else {
        smsHistory = JSON.parse(smsHistory)
      }

      // check user sending frequency
      var errorCode = hasValidationError(smsHistory)

      if (errorCode) {
        redisClient.set(key, JSON.stringify(smsHistory))
        throw new Error(errorCode)
      }

      var code = getRandomIntInclusive(1000, 9999)
      smsHistory.code = code

      redisClient.set(key, JSON.stringify(smsHistory))

      return send(code, phone, phoneCountryCode)
        .then(function(response) {
          if (response.code !== 0) {
            throw new Error('SEND_FAIL')
          }
          return true
        })
    })
}

function hasValidationError(smsHistory) {
  var timeDiff = Date.now() - smsHistory.time
  var oneHour = 60 * 60 * 1000
  var oneDay = 24 * oneHour

  smsHistory.count++

  var errorCode = null

  if (timeDiff > oneDay) {
    // Last sent time is one day ago
    smsHistory.today_count = 1
    smsHistory.hour_count = 1
  } else {
    // Within one day
    smsHistory.today_count++
    if (timeDiff <= oneHour) {
      smsHistory.hour_count++
    } else {
      smsHistory.hour_count = 1
    }

    if (smsHistory.today_count > config.sms.maxCountPerDay) {
      // Exceed max count in one day
      errorCode = 'EX_MAX_DAY'
    } else if (smsHistory.hour_count > config.sms.maxCountPerHour) {
      // Exceed max count in one hour
      errorCode = 'EX_MAX_HOUR'
    } else if (smsHistory.hour_count > 1 && timeDiff < config.sms.minInterval) {
      // Too frequent
      errorCode = 'TOO_FREQ'
    }
  }

  return errorCode
}

function send(code, phone, phoneCountryCode) {
  var formData = {
    apikey: config.sms.apiKey,
    text: config.sms.smsText.replace(/\$\{code\}/, code),
    mobile: phone + ''
  }

  var options = {
    method: 'POST',
    uri: config.sms.uri,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
      'Accept' : 'application/json; charset=utf-8'
    },
    form: formData,
    json: true
  }

  return rp(options)
}

function verifySMS(code, phone, phoneCountryCode) {
  var key = getKey(phone, phoneCountryCode)

  return redisClient.get(key)
    .then(function(smsHistory) {
      if (!smsHistory) {
        throw new Error('NO_CODE_FOUND')
      }

      smsHistory = JSON.parse(smsHistory)
      if (smsHistory.code != code) {
        throw new Error('INVALID_CODE')
      }

      return true
    })
}

function getKey(phone, phoneCountryCode) {
  return 'sms:' + (phoneCountryCode || '86') + ':' + phone
}
