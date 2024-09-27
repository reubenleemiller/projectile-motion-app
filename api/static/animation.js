

function pixels_to_feet(pixels) {
    return pixels / 40
}

function feet_to_pixels(feet) {
    return feet * 40
}

const REST_POSITION = math.matrix([feet_to_pixels(1), H-feet_to_pixels(1)])

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
        iheight: feet_to_pixels(iheight),
        speed: speed
    };
}


function reset(particle, event) {
    dt = 0
    particle.velocity = math.matrix([60, -80])
    time = 0
    height_samples = [0]
    positions = []
    document.getElementById('dtSlider').value = 0
}

function adjust() {
    const { angle, iheight, speed } = getInputValues();
    const { mass, gravity, new_dt } = getSliderValues();
    if (time == 0) {
        console.log(angle, iheight, speed)
        const angleInRadians = math.unit(angle, 'deg').toNumber('rad');

        // Set initial velocity using speed and angle
        const vx = speed * Math.cos(angleInRadians);  // Horizontal velocity
        const vy = -speed * Math.sin(angleInRadians); // Vertical velocity (negative because canvas Y increases downward)

        myparticle.velocity = math.matrix([vx, vy]);

        myparticle.position = REST_POSITION;
        myparticle.position = math.add(myparticle.position, [0, -iheight])
    }
    dt = new_dt / 1000
    myparticle.mass = mass
    gravitation = gravity
    return angle
}

function init_loop_vars() {
    dt = 0.016
    time = 0
    height = pixels_to_feet(H - myparticle.position.valueOf()[1])
    height_samples = [height]
    positions = [myparticle.position.valueOf()]
    frames = 0
}

function draw_sequence(ppos, angle) {
    drawGridDynamic(W / 40, H / 40)
    draw_particle(myparticle);
    draw_dotted_line(ctx, [ppos[0], H], [ppos[0], ppos[1]], 'green', `${(height).toFixed(2)} feet`)
    if (time == 0) {
        draw_angle([ppos[0], ppos[1]], myparticle.radius * 0.8, angle)
    }
    draw_vector(ppos, math.add(myparticle.position, myparticle.velocity).valueOf())
    for (let index = 0; index < positions.length; index++) {
        const p = positions[index];
        draw_point(p)
    }
}


let myparticle = new CircularParticle([feet_to_pixels(1), H - feet_to_pixels(1)], [60, 0], 20, 'blue');
init_loop_vars()

function animate() {
    ctx.clearRect(0, 0, W, H); // Clear the canvas
    angle = adjust()
    border_collisions(myparticle, 0.9)

    // Update the particle's position and velocity
    myparticle.integrate(dt); // Assuming a 60 FPS frame time of ~16ms
    const pos = myparticle.position.valueOf()
    draw_sequence(pos, angle)

    height = pixels_to_feet(H - pos[1])
    if (time != 0) {
        positions.push(pos)
        height_samples.push(height)
    }

    time += dt
    frames += 1
    requestAnimationFrame(animate); // Recursively call animate to create animation
}

document.getElementById("resetButton").addEventListener("click", (event) => { reset(myparticle, event) });
animate(); // Start the animation loop
