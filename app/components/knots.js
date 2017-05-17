// This component controls sphere rendering and animations of Knots.jsx. 
// Adapted from: (1) https://github.com/mrdoob/three.js/blob/master/examples/webgl_effects_anaglyph.html (2) https://github.com/aframevr/aframe/blob/master/examples/showcase/dynamic-lights/index.html 

let knots = []
let lightX
let lightY
// let colorA = '#CC0033'
//let colorB = 'green'  
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let width = window.innerWidth || 2;
let height = window.innerHeight || 2;
let mouseX = 0;
let mouseY = 0;
// let movementPath = 'spin' // need to write movement path
let tickSpeed = 0.005

const initScene = () => {
  let camera = document.getElementById('camera')
  camera.setAttribute('fov', 60) //field of view
  camera.setAttribute('aspect', window.innerWidth / window.innerHeight) //aspect
  camera.setAttribute('near', 0.01) //near
  camera.setAttribute('far', 1000) //far
  camera.setAttribute('position', { z: 3 })
  camera.setAttribute('focalLength', 3)

  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false)
}

// helper function to generate random coords
const getRandCoord = () => {
  let coord = Math.random() * 60;
  return Math.random() < 0.5 ? coord + 5 : coord * -1 - 5;
}

// create one random knot
const createKnot = () => {

  let knot = document.createElement('a-torus-knot')

  knot.setAttribute('radius', `${Math.random() * 10}`)
  knot.setAttribute('radiusTubular', `${Math.random() * 8}`)
  knot.setAttribute('p', `${Math.round(Math.random() * 10)}`)
  knot.setAttribute('q', `${Math.round(Math.random() * 10)}`)

  // knot.setAttribute('color', `${colorA}`)

  knot.setAttribute('metalness', `${(Math.random() * 0.5) + 0.5}`)
  knot.setAttribute('roughness', `${Math.random()}`)
  knot.setAttribute('segments-radial', '10')

  knot.setAttribute('position', {
    x: `${getRandCoord()}`,
    y: `${getRandCoord()}`,
    z: `${getRandCoord()}`,
  })

  // give each knot a unique id
  knots.push(knot)
  knot.setAttribute('id', `knot-${knots.length}`)
  console.log('knot id is', knot, '-', knots.length)

  // set random knot into scene
  document.querySelector('a-scene').appendChild(knot)

}

// create multiple random knots
const makeKnots = (numKnots) => {
  while (numKnots >= 0) {
    createKnot()
    numKnots--
  }
  console.log('knots is', knots)
}


// set target lights A + B for each knot, colors based on emotion
const setTargetLightA = (colorA) => {
  console.log('light A being created')

  for (let i = 0; i < knots.length; i++) {
    let lightA = document.createElement('a-light')

    lightA.setAttribute('position', '0 0 0')
    lightA.setAttribute('angle', '90')
    lightA.setAttribute('radius', '60')
    lightA.setAttribute('position', '-3 -4 1')
    lightA.setAttribute('type', 'point')
    lightA.setAttribute('intensity', '2')
    lightA.setAttribute('distance', '200')
    lightA.setAttribute('target', `knot-${i}`)
    lightA.setAttribute('opacity', '0.5')
    lightA.setAttribute('color', `${colorA}`)
    lightA.setAttribute('id', 'lightA')
    console.log('target is ', knots[i].id)

    document.querySelector('a-scene').appendChild(lightA)
  }
}


const setTargetLightB = (colorB) => {
  console.log('light B being created')

  for (let i = 0; i < knots.length; i++) {
    let lightB = document.createElement('a-light')

    //lightB.setAttribute('position', '0 0 0')
    lightB.setAttribute('angle', '-90')
    lightB.setAttribute('radius', '60')
    lightB.setAttribute('position', '3 4 -1')
    lightB.setAttribute('type', 'point')
    lightB.setAttribute('intensity', '2')
    lightB.setAttribute('distance', '300')
    lightB.setAttribute('target', `knot-${i}`)
    lightB.setAttribute('opacity', '0.5')
    lightB.setAttribute('color', `${colorB}`)
    lightB.setAttribute('id', 'lightB')

    document.querySelector('a-scene').appendChild(lightB)
  }
}

const updateColor = (colorA, colorB) => {
  document.getElementById('lightA').setAttribute('color', `${colorA}`)
  document.getElementById('lightB').setAttribute('color', `${colorB}`)
}

const makeRotatingLightX = () => {
  console.log('lightX is being created')
  lightX = document.createElement('a-light')
  lightX.setAttribute('geometry', 'primitive: sphere; radius: 1.5')
  lightX.setAttribute('material', 'color: white; shader: flat; opacity: 0')
  lightX.setAttribute('light', 'color: blue; distance: 120; intensity: 3; type: point')
  document.querySelector('a-scene').appendChild(lightX)
}

const makeRotatingLightY = () => {
  console.log('lightY is being created')
  lightY = document.createElement('a-light')
  lightY.setAttribute('geometry', 'primitive: sphere; radius: 2')
  lightY.setAttribute('material', 'color: white; shader: flat; opacity: 0')
  lightY.setAttribute('light', 'color: orange; distance: 120; intensity: 2; type: point')
  document.querySelector('a-scene').appendChild(lightY)
}

const updateLightRotationRate = (n) => {
  tickSpeed = n
}

const render = () => {
  //let camera = document.getElementById('camera')
  let timer = tickSpeed * Date.now() // change tickSpeed for rotating light speed
  //let curr = camera.getAttribute('position') || { x: 1, y: 1 }
  //let addx = curr.x + ((mouseX - curr.x) * .05)
  //let addy = curr.y + ((- mouseY - curr.y) * .05)
  //camera.setAttribute('position', { x: addx, y: addy, z: 5 })

  // circleZ animation path for lightX
  lightX.setAttribute('position', { x: 18 * Math.sin(timer + (2 * Math.PI)) })
  lightX.setAttribute('position', { z: 24 * Math.cos(timer + 3 + (2 * Math.PI)) })

  // circleY animation path for lightY
  lightY.setAttribute('position', { x: 25 * Math.sin(timer + (2 * Math.PI)) })
  lightY.setAttribute('position', { y: 17 * Math.cos(timer + 2 * (2 * Math.PI)) })
}

const animate = () => {
  requestAnimationFrame(animate)
  render()
}

const onWindowResize = () => {
  var camera = document.getElementById('camera')
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  camera.setAttribute('aspect', window.innerWidth / window.innerHeight)
}

const onDocumentMouseMove = (event) => {
  mouseX = (event.clientX - windowHalfX) / 100
  mouseY = (event.clientY - windowHalfY) / 100
}

module.exports = { initScene, animate, makeKnots, setTargetLightA, setTargetLightB, makeRotatingLightX, makeRotatingLightY, updateColor, updateLightRotationRate }