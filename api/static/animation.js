
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
    const gravity = document.getElementById('gravitySlider').value
    const _dt = document.getElementById('dtSlider').value;

    return {
        mass: parseFloat(mass),              // Convert string to float
        gravity: parseFloat(gravity),        // Convert string to float             
        new_dt: parseFloat(_dt)        // Convert string to float
    };
}

function getInputValues() {
    // Get the values from the input boxes
    const angle = parseFloat(document.getElementById('angleInput').value);
    const iheight = parseFloat(document.getElementById('heightInput').value);
    const speed = parseFloat(document.getElementById('speedInput').value);

    // Return an object with the values
    return {
        angle: angle,
        height: iheight,
        speed: speed
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
    particle.velocity = math.matrix([60, -80])
    time = 0
    height = [0]
    positions = []
    document.getElementById('dtSlider').value = 0.1
    particle.position = math.matrix([60, H - 60])
    heightCtx.clearRect(0, 0, w, h); // Clear the canvas
}

const myparticle = new CircularParticle([60, H - 60], [60, -80], 30, 'blue');

var height = (H - myparticle.position.valueOf()[1]) / 40
let height_samples = [height]
let positions = [myparticle.position.valueOf()]
let time_samples = [0]
let frames = 0


function animate() {
    ctx.clearRect(0, 0, W, H); // Clear the canvas
    const { mass, gravity, new_dt } = getSliderValues();
    const { angle, iheight, speed } = getInputValues();
    if (time === 0) { // Only apply these at the start of the simulation
        const angleInRadians = math.unit(angle, 'deg').toNumber('rad');
        
        // Set initial velocity using speed and angle
        const vx = speed * Math.cos(angleInRadians);  // Horizontal velocity
        const vy = -speed * Math.sin(angleInRadians); // Vertical velocity (negative because canvas Y increases downward)
    
        myparticle.velocity = math.matrix([vx, vy]);
    
        // Set initial position based on height
        myparticle.position = math.matrix([60, 60]);  // Assuming 1 unit height = 40 pixels
    }
    dt = new_dt / 1000
    myparticle.mass = mass
    gravitation = gravity

    border_collisions(myparticle, 0.9)

    // Update the particle's position and velocity
    myparticle.integrate(dt); // Assuming a 60 FPS frame time of ~16ms

    draw_particle(myparticle);
    const pos = myparticle.position.valueOf()
    positions.push(pos)
    for (let index = 0; index < positions.length; index++) {
        const p = positions[index];
        draw_point(p)
    }
    var height = (H - pos[1]) / 40
    height_samples.push(height)
    draw_dotted_line(ctx, [pos[0], H], [pos[0], pos[1]], 'green', `${(height).toFixed(2)} feet`)
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
