import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import dat from "https://cdn.skypack.dev/dat.gui";


//datgui setup
const gui = new dat.GUI()
const world = {
    plane: {
        width: 10,
        height: 10,
        widthSegments: 10,
        heightSegments: 10
    }
}
gui.add(world.plane, 'width', 1, 20).onChange(generatePlane)
gui.add(world.plane, 'height', 1, 20).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 20).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 20).onChange(generatePlane)

function generatePlane() {
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width, 
        world.plane.height, 
        world.plane.widthSegments, 
        world.plane.heightSegments
        )

    const {array} = planeMesh.geometry.attributes.position
    for (let i = 0; i < array.length; i += 3) {
        const x = array[i]
        const y = array[i + 1]
        const z = array[i + 2]
        array[i + 2] = z + Math.random()
    }
}

//scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio) //set dpi to device specs
document.body.appendChild(renderer.domElement) //set the canvas to the html body
const raycaster = new THREE.Raycaster() //tells 3js where the mouse is

new OrbitControls(camera, renderer.domElement)
camera.position.z = 5

//material setup
const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10)
const planeMaterial = new THREE.
    MeshPhongMaterial({
    side: THREE.DoubleSide,
    vertexColors: true
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
planeMesh.material.flatShading = true
scene.add(planeMesh)

//geometry gradient
const {array} = planeMesh.geometry.attributes.position
for (let i = 0; i < array.length; i += 3) {
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]
    array[i + 2] = z + Math.random()
}

const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(1,0,0)
}

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

//light setup
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 1)
scene.add(light)

const backlight = new THREE.DirectionalLight(0xffffff, 1)
backlight.position.set(0, 0, -1)
scene.add(backlight)

//define mouse for coordinates
const mouse = {
    x: undefined,
    y: undefined
}

//animate
function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(planeMesh)
    if (intersects.length > 0) {

        const {color} = intersects[0].object.geometry.attributes

        //vertice 1
        color.setX(intersects[0].face.a, 0)
        color.setY(intersects[0].face.a, 0)
        color.setZ(intersects[0].face.a, 1)

        //vertice 2
        color.setX(intersects[0].face.b, 0)
        color.setY(intersects[0].face.b, 0)
        color.setZ(intersects[0].face.b, 1)

        //vertice 3
        color.setX(intersects[0].face.c, 0)
        color.setY(intersects[0].face.c, 0)
        color.setZ(intersects[0].face.c, 1)
        intersects[0].object.geometry.attributes.color.needsUpdate = true

    }
}

animate()


addEventListener('mousemove', () => {
     mouse.x = (event.clientX / innerWidth) * 2 - 1
     mouse.y = -(event.clientY / innerHeight) * 2 + 1
})