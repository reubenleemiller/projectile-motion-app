
let dt = 2
let time = 0

const heightCanvas = document.getElementById('heightCanvas');
const heightCtx = heightCanvas.getContext('2d');
const w = heightCanvas.width;
const h = heightCanvas.height;


heightCtx.lineWidth = 3;


function getSliderValues() {
    // Accessing the slider values
    const mass = document.getElementById('massSlider').value;
    const gravity = document.getElementById('gravitySlider').value;
    const angle = document.getElementById('angleSlider').value;
    const _dt = document.getElementById('dtSlider').value;

    // Convert angle from degrees to radians if needed
    const angleInRadians = math.unit(angle, 'deg').toNumber('rad');

    return {
        mass: parseFloat(mass),              // Convert string to float
        gravity: parseFloat(gravity),        // Convert string to float
        angle: angleInRadians,                // Return angle in radians
        new_dt: parseFloat(_dt)        // Convert string to float
    };
}


function append_to_height_graph(ct, ch, nh) {
    heightCtx.beginPath();
    heightCtx.moveTo(30+ct*10, h-ch*30);
    heightCtx.lineTo(30+(ct + dt)*10, h-nh*30);
    heightCtx.strokeStyle = 'blue';
    heightCtx.stroke();
}

function reset(particle, event) {
    particle.velocity = math.matrix([200/Math.sqrt(2), -200/Math.sqrt(2)])
    time = 0
    height = [0]
    document.getElementById('dtSlider').value = 0.1
    particle.position = math.matrix([0, H])
    heightCtx.clearRect(0, 0, w, h); // Clear the canvas
}

const myparticle = new CircularParticle([30, H - 30], [60, 80], 30, 'blue');

var height = (H - myparticle.position.valueOf()[1]) / 40
let height_samples = [height]
let time_samples = [0]
let frames = 0


function animate() {
    let maxh = Math.max(height_samples)
    ctx.clearRect(0, 0, W, H); // Clear the canvas
    const { mass, gravity, angle, new_dt } = getSliderValues();
    dt = new_dt / 1000
    myparticle.mass = mass
    gravitation = gravity

    border_collisions(myparticle, 0.9)

    // Update the particle's position and velocity
    myparticle.integrate(dt); // Assuming a 60 FPS frame time of ~16ms

    draw_particle(myparticle);
    const pos = myparticle.position.valueOf()
    var height = (H - myparticle.position.valueOf()[1]) / 40
    height_samples.push(height)
    draw_dotted_line(ctx, [pos[0], H], [pos[0], pos[1]], 'green', `${(height).toFixed(2)} feet`)
    console.log(maxh)
    draw_dotted_line(heightCtx, [0, maxh], [time_samples[height_samples.indexOf(maxh)], maxh], 'green', `${(height).toFixed(2)} feet (max hight)`)
    draw_vector(pos, math.add(myparticle.position, myparticle.velocity).valueOf())
    draw_angle([pos[0], pos[1]], myparticle.radius*0.8, 30)
    draw_axes()
    append_to_height_graph(time, height_samples[frames], height)
    time += dt
    time_samples.push(time)
    frames += 1
    requestAnimationFrame(animate); // Recursively call animate to create animation
}

document.getElementById("resetButton").addEventListener("click", (event) => { reset(myparticle, event) });
animate(); // Start the animation loop
