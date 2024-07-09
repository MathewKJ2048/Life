HEIGHT = window.innerHeight * 0.9
WIDTH = window.innerWidth
SCALE = 32

var canvas = document.querySelector("canvas")
canvas.width = WIDTH
canvas.height = HEIGHT
var c = canvas.getContext("2d");


class Vector
{
	constructor(x,y)
	{
		this.x = x
		this.y = y
	}
}
const camera = new Vector(0,0)
const mouse = new Vector(undefined,undefined)

window.addEventListener("mousemove",function(event){
	mouse.x = event.x
	mouse.y = event.y
})
console.log(camera)


function animate(){
	requestAnimationFrame(animate);
	c.fillStyle = "black"
	c.fillRect(0,0,WIDTH,HEIGHT)

	for(i=0;i<WIDTH;i+=SCALE)
	{
		c.beginPath()
		c.moveTo(i,0)
		c.lineTo(i,HEIGHT)
		c.strokeStyle = "grey"
		c.stroke()
	}
	for(i=0;i<HEIGHT;i+=SCALE)
	{
		c.beginPath()
		c.moveTo(0,i)
		c.lineTo(WIDTH,i)
		c.strokeStyle = "grey"
		c.stroke()
	}
	
}
animate()

