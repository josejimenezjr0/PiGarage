const express = require('express')
const { Gpio } = require('onoff')

const app = express()
const LED = new Gpio(4, 'out')

let stopBlinking = false
let blinking = false

const on = () => LED.writeSync(1)
const off = () => LED.writeSync(0)

const blink = () => {
  if (stopBlinking) {
    return off();
  }

  LED.read()
    .then(value => LED.write(value ^ 1))
    .then(_ => setTimeout(blink, 50))
    .catch(err => console.log(err));
}

const port = 5000

app.get('/blink', (req, res) => {
  if(blinking) {
    console.log('already blinking!')
    return res.send('already blinking!')
  }
  else {
    blinking = true
    res.send('blinked')
    console.log('blinked?')
    blink()
    setTimeout(() => stopBlinking = true, 1000)
    setTimeout(() => {
      stopBlinking = false
      blinking = false
    }, 1500)
  }
  
})

app.get('/led_on', (req, res) => {
  res.send('led_on')
  // console.log('led_on?')
  on()
})

app.get('/led_off', (req, res) => {
  res.send('led_off')
  // console.log('led_off?')
  off()
})

app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})