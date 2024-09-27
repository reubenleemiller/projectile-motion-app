
let gravitation = G
TIME_STEP = 0.0025

function pixels_to_feet(pixels) {
    return pixels / PIXEL_PER_FOOT
}

function feet_to_pixels(feet) {
    return feet * PIXEL_PER_FOOT
}

const REST_POSITION = math.matrix([feet_to_pixels(1), H-feet_to_pixels(1)])

function max_by_key(arr, key) {
    return arr.reduce((maxElement, currentElement) => {
        return key(currentElement) > key(maxElement) ? currentElement : maxElement;
    });
}

function getSliderValues() {
    // Accessing the slider values
    const gravity = document.getElementById('gravitySlider').value
    const ispeed = document.getElementById('speedSlider').value
    const angle = document.getElementById('angleSlider').value;
    const iheight = document.getElementById('heightSlider').value;

    return {
        sgravity: parseFloat(gravity),
        sispeed: feet_to_pixels(parseFloat(ispeed)),
        sangle: parseFloat(angle),              
        siheight: feet_to_pixels(parseFloat(iheight)),                    
    };
}

function getInputValues() {
    // Get the values from the input boxes
    const gravity = document.getElementById('gravityInput').value
    const ispeed = document.getElementById('speedInput').value
    const angle = document.getElementById('angleInput').value;
    const iheight = document.getElementById('heightInput').value;

    // Return an object with the values
    return {
        tgravity: gravity,
        tispeed: feet_to_pixels(ispeed),
        tangle: angle,              
        tiheight: feet_to_pixels(iheight),       
    };
}


function reset(particle, event) {
    maxh = [0, 0]
    dt = 0
    time = 0
    positions = []
    document.getElementById('gravitySlider').value = G
}

function adjust() {
    const {tgravity, tispeed, tangle, tiheight } = getInputValues();
    console.log(tangle)
    const {sgravity, sispeed, sangle, sheight } = getSliderValues();
    if (time == 0) {
        const angleInRadians = math.unit(tangle, 'deg').toNumber('rad');

        // Set initial velocity using speed and angle
        const vx = tispeed * Math.cos(angleInRadians);  // Horizontal velocity
        const vy = -tispeed * Math.sin(angleInRadians); // Vertical velocity (negative because canvas Y increases downward)

        myparticle.velocity = math.matrix([vx, vy]);

        myparticle.position = REST_POSITION;
        myparticle.position = math.add(myparticle.position, [0, -tiheight])
    }
    gravitation = feet_to_pixels(tgravity)
    return tangle
}

function init_loop_vars() {
    dt = TIME_STEP
    time = 0
    height = pixels_to_feet(H - myparticle.position.valueOf()[1])
    positions = []
    frames = 0
    maxh = 0
}

function play() {
    dt = TIME_STEP
}

function draw_sequence(ppos, angle) {
    drawGridDynamic(W / PIXEL_PER_FOOT, H / PIXEL_PER_FOOT)
    draw_particle(myparticle);
    draw_dotted_line(ctx, [ppos[0], H], [ppos[0], ppos[1]], 'blue', `${(height).toFixed(2)} feet`)
    draw_dotted_line(ctx, [maxh[0], maxh[1]], [maxh[0], H], 'red', "max")
    if (time == 0) {
        draw_angle([ppos[0], ppos[1]], myparticle.radius * 0.6, angle)
    }
    draw_vector(ppos, math.add(myparticle.position, math.divide(myparticle.velocity, PIXEL_PER_FOOT/3)).valueOf())
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
    let collided = border_collisions(myparticle, 0.9)

    // Update the particle's position and velocity
    myparticle.integrate(dt); // Assuming a 60 FPS frame time of ~16ms
    const pos = myparticle.position.valueOf()

    height = pixels_to_feet(H - pos[1])
    if (time != 0) {
        positions.push(pos)
        maxh = max_by_key(positions, t => H-t[1])
    }

    draw_sequence(pos, angle)

    if (!collided) {
        time += dt
    }
    document.getElementById("timeLabel").innerHTML = `${time.toFixed(2)}s`
    frames += 1
    requestAnimationFrame(animate); // Recursively call animate to create animation
}

document.getElementById("resetButton").addEventListener("click", (event) => { reset(myparticle, event) });
document.getElementById("playButton").addEventListener("click", play);
animate(); // Start the animation loop
