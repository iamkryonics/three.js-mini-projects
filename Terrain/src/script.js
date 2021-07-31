import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Texture loader
const loader = new THREE.TextureLoader()
const height = loader.load('textures/height.png')
const texture = loader.load('textures/texture.jpg')
const alpha = loader.load('textures/alpha.png')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.PlaneBufferGeometry(3, 3, 64, 64)

// Materials
const material = new THREE.MeshStandardMaterial({
    color: 'gray',
    map: texture,
    displacementMap: height,
    displacementScale: .8,
    //below remove edge
    alphaMap: alpha, //need transparent to show
    transparent: true,
    depthTest: false
})

// Mesh
const plane = new THREE.Mesh(geometry, material)
plane.rotation.x = 181
scene.add(plane)

// Lights

const pointLight = new THREE.PointLight(0x00b3ff, 3)
pointLight.position.x = .2
pointLight.position.y = 10
pointLight.position.z = 4.5
scene.add(pointLight)

// Debug
const gui = new dat.GUI()

gui.add(plane.rotation, 'x').min(0).max(200)
gui.add(pointLight.position, 'x')
gui.add(pointLight.position, 'y')
gui.add(pointLight.position, 'z')

const col = {
    color: '#0000ff'
}
gui.addColor(col, 'color').onChange(() => {
    pointLight.color.set(col.color)
})


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth * .7, //move
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth * .7 //move 
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3 // 2->3 chỉnh nhỏ tầm nhìn trước mặt lại
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true //change background color to white?
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
// Mouse move event
document.addEventListener('mousemove', animateTerrain)
let mouseY = 0

function animateTerrain(e) {
    mouseY = e.clientY
}


const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    plane.rotation.z = .5 * elapsedTime //0.5 speed
    // Mouse move
    plane.material.displacementScale = .7 + mouseY * 0.001 //descrease

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()