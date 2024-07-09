HEIGHT = window.innerHeight * 0.9
WIDTH = window.innerWidth
SCALE = 16

var canvas = document.querySelector("canvas")
canvas.width = WIDTH
canvas.height = HEIGHT
var c = canvas.getContext("2d");


class Vector {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
}
const camera = new Vector(0, 0)
const mouse = new Vector(undefined, undefined)

const cells = new Set()

function transform_point(p) {
	z = new Vector(0, 0)
	z.x = (p.x - camera.x) * SCALE + WIDTH / 2
	z.y = HEIGHT / 2 - (p.y - camera.y) * SCALE
	return z
}
function stringify(p)
{
	return p.x+"|"+p.y
}
function inverse_transform_point(z){
	p = new Vector(0, 0)
	p.x = (z.x-WIDTH/2)/SCALE + camera.x
	p.y = (HEIGHT/2 - z.y)/SCALE + camera.y
	return p
}

window.addEventListener("mousemove", function (event) {
	mouse.x = event.x
	mouse.y = event.y
})
window.addEventListener("click",function(event)
{
	z = new Vector(mouse.x, mouse.y)
	p = inverse_transform_point(z)
	p.x = Math.round(p.x)
	p.y = Math.round(p.y)
	t = stringify(p)
	if(!cells.has(t))
	{
		cells.add(t)
	}
	else
	{
		cells.delete(t)
	}
	console.log(cells)
})
console.log(camera)


function drawline(start, end, color) {
	// start and end are vectors with respect to the abstract space
	s = transform_point(start)
	e = transform_point(end)
	c.strokeStyle = color
	c.beginPath()
	c.moveTo(s.x, s.y)
	c.lineTo(e.x, e.y)
	c.stroke()
}
function drawHorizontal(p, color)
{
	z = transform_point(p)
	c.strokeStyle = color
	c.beginPath()
	c.moveTo(0, z.y)
	c.lineTo(WIDTH, z.y)
	c.stroke()
}
function drawVertical(p, color)
{
	z = transform_point(p)
	c.strokeStyle = color
	c.beginPath()
	c.moveTo(z.x, 0)
	c.lineTo(z.x, HEIGHT)
	c.stroke()
}
function in_screen(p)
{
	z = transform_point(p)
	return z.x >= 0 && z.x <= WIDTH && z.y >=0 && z.y <= HEIGHT
}
function drawGrid()
{
	num_h = Math.floor(HEIGHT/SCALE)
	for(y=-num_h;y<=num_h;y++)
	{
		p = new Vector(0,y+0.5)
		if(in_screen(p))
		{
			drawHorizontal(p,"grey")
		}
	}
	num_w = Math.floor(WIDTH/SCALE)
	for(x=-num_w;x<=num_w;x++)
	{
		p = new Vector(x+0.5,0)
		if(in_screen(p))
		{
			drawVertical(p,"grey")
		}
	}
}

function step()
{

}

function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = "black"
	c.fillRect(0, 0, WIDTH, HEIGHT)

	drawline(new Vector(0, 1), new Vector(1, 0), "red");
	drawHorizontal(new Vector(0,0))
	drawVertical(new Vector(0,0))


	for(const t_ of cells)
	{
		c.fillStyle = "white"
		coords = t_.split("|")
		t = new Vector(parseInt(coords[0]),parseInt(coords[1]))
		rt = transform_point(new Vector(t.x+0.5,t.y+0.5))
		lb = transform_point(new Vector(t.x-0.5,t.y-0.5))
		c.fillRect(lb.x,lb.y,rt.x-lb.x,rt.y-lb.y)

	}
	drawGrid()

}
animate()

