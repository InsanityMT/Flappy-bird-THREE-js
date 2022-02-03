import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import birdImage from './Sbird.png'
import back from './back.png'
import bottom from './bottom.png'
import top from './top.png'


// function
function decimalAdjust(type, value, exp) {
    // Если степень не определена, либо равна нулю...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Если значение не является числом, либо степень не является целым числом...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Сдвиг разрядов
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Обратный сдвиг
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}
if (!Math.round10) {
    Math.round10 = function(value, exp) {
        return decimalAdjust('round', value, exp);
    };
}



// Canvas
const canvas = document.querySelector('canvas#canvas')
//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
//bird
const geometry = new THREE.PlaneGeometry(1.5,1.5);
const texture = new THREE.TextureLoader().load(birdImage)
const material = new THREE.MeshBasicMaterial({ map : texture })
const bird = new THREE.Mesh(geometry, material)
const scene = new THREE.Scene({})
scene.add(bird)
bird.position.z = 1
bird.position.x = 0
//back
const backGeo = new THREE.PlaneGeometry(sizes.width/20,30);
const backTexture = new THREE.TextureLoader().load(back);
const backMaterial = new THREE.MeshBasicMaterial({map: backTexture})
const background = new THREE.Mesh(backGeo, backMaterial)
background.position.z = -5;
background.position.y = 0
scene.add(background)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 18
scene.add(camera)



const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))







const items = []
function createAll(){
    //createBottom
    let bottomHeight = (Math.random()*15)+1
    let positionX = 30
    const itemGeo = new THREE.PlaneGeometry(2,bottomHeight);
    const textureItemB = new THREE.TextureLoader().load(bottom)
    const materialItemB = new THREE.MeshBasicMaterial({ map : textureItemB })
    const bottom1 = new THREE.Mesh(itemGeo, materialItemB)
    bottom1.position.z = 0
    bottom1.position.y = -11.6+(bottomHeight/2)
    bottom1.position.x = positionX
    items.push(bottom1)
    scene.add(bottom1)
    //create Top
    const topHeight = 29-bottomHeight-10
    const itemGeoT = new THREE.PlaneGeometry(2, topHeight);
    const textureItemT = new THREE.TextureLoader().load(top)
    const materialItemT = new THREE.MeshBasicMaterial({map: textureItemT})
    const top1 = new THREE.Mesh(itemGeoT, materialItemT)
    top1.position.z = 0
    top1.position.y = 11.72-(topHeight/2)
    top1.position.x = positionX
    items.push(top1)
    scene.add(top1)
}


let game = true;
document.addEventListener("keydown", event => {
        if( event.keyCode === 32) {
            jump()
        }
});
createAll()
let interval = setInterval(createAll, 2000)
const clock = new THREE.Clock()
console.log(items)
console.log(bird)
function scoreUpdate(){
    console.log(game)
    if(game) {
        let score = Number(document.getElementById('score').innerHTML)
        score += 1
        document.getElementById('score').innerHTML = score
    }
}
function scoreUpdate2(){
    let scoreUpd = setInterval(scoreUpdate, 2000)
}
let timerScoreUpd = setTimeout(scoreUpdate2, 3000)

let jumping = 0

function jump(){
    jumping = 1
    let jumpCount = 0
    let jumpInterval = setInterval(
        ()=> {
            if(jumpCount < 10) {
                bird.position.y += 0.25
                jumpCount++
            } else {jumping = 0}
        }, 10
    )
}
window.addEventListener('click', jump)
async function tick() {
    if(game === true) {
        if(bird.position.y < -10.1 || bird.position.y > 10.29) game = false
        items.map((v, i) => {
            v.position.x -= .1
        })

        items.map((v,i) => {

             if(bird.position.x === Math.round10(v.position.x, -1)-0.6 ) {
                 if(bird.position.y > 10.29 - v.geometry.parameters.height*0.98 && i % 2 == 1 ) {
                      game = false;
                 }
                 if(bird.position.y < -10.1 + v.geometry.parameters.height*0.95 && i % 2 == 0 ) {
                     game = false;
                 }
             }
        })
        if (jumping === 0) bird.position.y -= .13;
        renderer.render(scene, camera)
        const elapsedTime = clock.getElapsedTime()
        window.requestAnimationFrame(tick)
    }
}
tick()

