
let time = 0
let wave = []
let sliderlist
const ctx = new (window.AudioContext || window.webkitAudioContext)()
const gainNode = ctx.createGain()
gainNode.connect(ctx.destination)

let osc

function addSliderComponent () {
  sliderlist.appendChild(
    document.importNode(
      document.getElementById('slider-template').content, true))
}

function setSliderCount (val) {
  if (val <= 0) return
  while (sliderlist.childElementCount < val) {
    addSliderComponent()
  }
  while (sliderlist.childElementCount > val) {
    sliderlist.removeChild(sliderlist.lastChild)
  }
}

function setSlidersToPreset (preset, phases) {
  setSliderCount(preset.length)
  document.getElementById('slider-count').value = preset.length
  for (let i = 0; i < sliderlist.childElementCount; i++) {
    const el = sliderlist.children[i].getElementsByClassName('radius')[0]
    el.value = preset[i] * el.getAttribute('max')
    sliderlist.children[i].getElementsByClassName('phase')[0].checked = phases && phases[i]
  }
}

function setup () {
  createCanvas(600, 400)
  sliderlist = document.getElementById('sliders')
  for (let i = 0; i < document.getElementById('slider-count').value; i++) {
    addSliderComponent()
  }
  document.getElementById('slider-count').onchange = e => {
    setSliderCount(e.target.value | 0)
  }
  document.getElementById('square-wave').onclick = e => {
    let preset = []
    for (let n = 1; n <= 13; n++) {
      preset.push(n % 2 ? (4 / (Math.PI * n)) / (4 / Math.PI) : 0)
    }
    setSlidersToPreset(preset)
  }
  document.getElementById('sawtooth-wave').onclick = e => {
    let preset = []
    for (let n = 1; n <= 13; n++) {
      preset.push(1/n)
    }
    setSlidersToPreset(preset)
  }
  document.getElementById('smooth-saw').onclick = e => {
    let preset = []
    for (let n = 0; n <= 12; n++) {
      preset.push(1/(2 ** n))
    }
    setSlidersToPreset(preset)
  }
  document.getElementById('triangle-wave').onclick = e => {
    let preset = []
    let phases = []
    for (let n = 1; n <= 13; n++) {
      preset.push(n % 2 ? 9.8 / ((n * Math.PI) ** 2) : 0)
      phases.push(n % 4 === 3)
    }
    setSlidersToPreset(preset, phases)
  }
  setupPiano()
}

function midiNumToFrequency (num) {
  return 13.75 * Math.pow(2, (num - 9) / 12)
}

function playNote (freq = 440) {
  if (osc) osc.stop()
  len = sliderlist.childElementCount
  let real = new Float32Array(len + 1)
  let imag = new Float32Array(len + 1)
  const getValue = li => {
    let el = li.getElementsByClassName('radius')[0]
    let val = el.value / el.getAttribute('max')
    if (li.getElementsByClassName('phase')[0].checked) {
      val *= -1
    }
    return val
  }

  real[0] = 0
  imag[0] = 0

  for (let i = 0; i < len; i++) {
    real[i + 1] = getValue(sliderlist.children[i])
    imag[i + 1] = 0
  }

  osc = ctx.createOscillator()
  osc.setPeriodicWave(ctx.createPeriodicWave(real, imag))
  osc.frequency.value = freq
  osc.connect(gainNode)
  osc.start()
}

function draw () {
  background(0)
  translate(150, 200)

  let x = 0
  let y = 0

  for (let i = 0; i < sliderlist.childElementCount; i++) {
    let prevx = x
    let prevy = y
    let radius = sliderlist.children[i].getElementsByClassName('radius')[0].value
    if (sliderlist.children[i].getElementsByClassName('phase')[0].checked) {
      radius *= -1
    }

    x += radius * cos(time * (i + 1))
    y += radius * sin(time * (i + 1))

    stroke(255, 100)
    noFill()
    ellipse(prevx, prevy, 2 * radius)

    stroke(255)
    line(prevx, prevy, x, y)
    ellipse(x, y, 2)
  }
  wave.unshift(y)

  translate(200, 0)
  line(x - 200, y, 0, wave[0])
  beginShape()
  noFill()
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i])
  }
  endShape()

  time += 0.05

  if (wave.length > 250) {
    wave.pop()
  }
}

function removeChildren (el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
}

function setupPiano (maxKeys = 25) {
  document.getElementById('volume-slider').onchange = e => {
    gainNode.gain.value = Math.pow(e.target.value, 2)
  }
  gainNode.gain.value = Math.pow(document.getElementById('volume-slider').value, 2)

  const iv = document.getElementById('ivory')
  const eb = document.getElementById('ebony')
  const kb = document.getElementById('piano')
  removeChildren(eb)
  removeChildren(iv)
  const addKeyFunctions = (key, keyNum) => {
    const keyOff = e => {
      e.target.classList.remove('pressed')
      if (osc) osc.stop()
    }
    const keyOn = e => {
      e.target.classList.add('pressed')
      playNote(midiNumToFrequency(keyNum))
    }
    key.onmousedown = keyOn
    key.onmouseleave = keyOff
    key.onmouseup = keyOff
  }

  let keyNum = 45

  for (let i = 0; i < maxKeys * 2 / 3 + 1; i++) {
    let elem = document.createElement('div')
    elem.classList.add('key')
    addKeyFunctions(elem, keyNum++)
    iv.appendChild(elem)
    elem = document.createElement('div')
    elem.classList.add('key')
    if (i % 7 === 1 || i % 7 === 4) {
      elem.classList.add('invisible')
    } else {
      addKeyFunctions(elem, keyNum++)
    }
    eb.appendChild(elem)
  }
}
