HEIGHT = window.innerHeight * 0.9
WIDTH = window.innerWidth
SCALE = 16
LINE_COLOR = "grey"
BACKGROUND = "black"
SQUARE = "white"
MAX_SCALE = 32
MIN_SCALE = 8

PLAYING = false

var canvas = document.querySelector("canvas")
const step_button = document.getElementById("step_button")
const play_button = document.getElementById("play_button")
const clear_button = document.getElementById("clear_button")
const zoom_in = document.getElementById("zoom_in")
const zoom_out = document.getElementById("zoom_out")
const up_button = document.getElementById("up")
const down_button = document.getElementById("down")
const left_button = document.getElementById("left")
const right_button = document.getElementById("right")
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
var cells = new Set()

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
		p = new Vector(camera.x,camera.y+y+0.5)
		if(in_screen(p))
		{
			drawHorizontal(p,LINE_COLOR)
		}
	}
	num_w = Math.floor(WIDTH/SCALE)
	for(x=-num_w;x<=num_w;x++)
	{
		p = new Vector(camera.x+x+0.5,camera.y)
		if(in_screen(p))
		{
			drawVertical(p,LINE_COLOR)
		}
	}
}


function step()
{
	console.log(cells)
	cell_int = []
	for(const t_ of cells)
	{
		coords = t_.split("|")
		cell_int.push(new Vector(
			parseInt(coords[0]),parseInt(coords[1])
		))
	}
	console.log(cell_int)
	cells_to_compute = []
	for(const t of cell_int)
	{
		u = new Vector(t.x,t.y+1)
		d = new Vector(t.x,t.y-1)
		l = new Vector(t.x-1,t.y)
		r = new Vector(t.x+1,t.y)
		ul = new Vector(t.x+1,t.y+1)
		ur = new Vector(t.x+1,t.y-1)
		dl = new Vector(t.x-1,t.y+1)
		dr = new Vector(t.x-1,t.y-1)
		cells_to_compute.push(t)
		cells_to_compute.push(u)
		cells_to_compute.push(l)
		cells_to_compute.push(r)
		cells_to_compute.push(d)
		cells_to_compute.push(ul)
		cells_to_compute.push(ur)
		cells_to_compute.push(dl)
		cells_to_compute.push(dr)
	}
	console.log(cells_to_compute)
	next_cell_set = new Set()
	for(const t of cells_to_compute)
	{
		u = new Vector(t.x,t.y+1)
		d = new Vector(t.x,t.y-1)
		l = new Vector(t.x-1,t.y)
		r = new Vector(t.x+1,t.y)
		ul = new Vector(t.x+1,t.y+1)
		ur = new Vector(t.x+1,t.y-1)
		dl = new Vector(t.x-1,t.y+1)
		dr = new Vector(t.x-1,t.y-1)
		neighbours = [u,l,d,r,ul,ur,dl,dr]
		ct=0
		for(n of neighbours)
		{
			if(cells.has(stringify(n)))
			{
				ct+=1
			}
		}
		if(cells.has(stringify(t)))
		{
			if(ct==2 || ct==3)
			{next_cell_set.add(stringify(t));	
			console.log("continue"+ct)}
		}
		else
		{
			if(ct==3)
			{next_cell_set.add(stringify(t));
			console.log("born"+ct)}
		}
	}
	console.log(next_cell_set)
	cells = next_cell_set
}
step_button.addEventListener("click",function(event){
	step()
	console.log("button pressed")
})
clear_button.addEventListener("click",function(event){
	cells = new Set()
})
zoom_in.addEventListener("click",function(event){
	if(SCALE<MAX_SCALE)SCALE+=1
})
zoom_out.addEventListener("click",function(event){
	if(SCALE>MIN_SCALE)SCALE-=1
})
play_button.addEventListener("click",function(main){
	PLAYING = !PLAYING
	console.log(PLAYING)
	if(PLAYING)
	{
		document.getElementById("play_button").innerHTML = "||"
	}
	else
	{
		document.getElementById("play_button").innerHTML = "▶"
	}
})
up_button.addEventListener("click",function(main){
	camera.y+=SCALE
})
down_button.addEventListener("click",function(main){
	camera.y-=SCALE
})
left_button.addEventListener("click",function(main){
	camera.x-=SCALE
})
right_button.addEventListener("click",function(main){
	camera.x+=MAX_SCALE/SCALE
})


canvas.addEventListener("mousemove", function (event) {
	mouse.x = event.x
	mouse.y = event.y
})
canvas.addEventListener("mousedown",function(event)
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
	}})



function animate() {



	requestAnimationFrame(animate);
	c.fillStyle = BACKGROUND
	c.fillRect(0, 0, WIDTH, HEIGHT)



	for(const t_ of cells)
	{
		c.fillStyle = SQUARE
		coords = t_.split("|")
		t = new Vector(parseInt(coords[0]),parseInt(coords[1]))
		rt = transform_point(new Vector(t.x+0.5,t.y+0.5))
		lb = transform_point(new Vector(t.x-0.5,t.y-0.5))
		c.fillRect(lb.x,lb.y,rt.x-lb.x,rt.y-lb.y)

	}
	drawGrid()

	if(PLAYING)
	{
		step()
	}

}
animate()
