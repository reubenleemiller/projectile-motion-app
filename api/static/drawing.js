
function draw_point(pos) {
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], 2, 0, Math.PI * 2);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}



function draw_particle(particle) {
    ctx.beginPath();
    const pos = particle.position.valueOf(); // Convert matrix to array
    ctx.arc(pos[0], pos[1], particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();
    ctx.closePath();
}

function draw_angle(center, radius, angle)  //in degrees 
    {
    ctx.beginPath(); // Start a new path

    // Convert angle from degrees to radians
    const startAngle = 0; // Start at the right (0 degrees)
    const endAngle = angle * Math.PI / 180; // Convert angle to radians

    // Draw the arc
    ctx.arc(center[0], center[1], radius, startAngle, endAngle, false); // Draw arc
    ctx.strokeStyle = 'red'; // Set stroke color
    ctx.lineWidth = 2; // Set line width
    ctx.stroke(); // Render the arc

    // Draw the angle text
    ctx.fillStyle = 'black'; // Set text color
    ctx.font = '16px Arial'; // Set font size and family

    // Calculate text position
    const textX = center[0] + (radius + 10) * Math.cos(endAngle); // Position text to the right of the arc
    const textY = center[1] + (radius + 10) * Math.sin(endAngle); // Position text vertically aligned with the arc

    ctx.fillText(`${angle.toFixed(2)}°`, textX, textY); // Draw the angle text
}

function draw_dotted_line(ctx, start_point, end_point, color, text) {
    const dx = end_point[0] - start_point[0];
    const dy = end_point[1] - start_point[1];
    const length = Math.sqrt(dx * dx + dy * dy); // Length of the line
    const dash_length = 5; // Length of each dash
    const gap_length = 3; // Length of the gap between dashes
    const dash_count = Math.floor(length / (dash_length + gap_length)); // Total number of dashes

    // Loop through and draw each dash
    for (let i = 0; i <= dash_count; i++) {
        const x = start_point[0] + (dx * (i * (dash_length + gap_length) / length));
        const y = start_point[1] + (dy * (i * (dash_length + gap_length) / length));

        ctx.moveTo(x, y);
        ctx.lineTo(x + (dx / length) * dash_length, y + (dy / length) * dash_length);
    }

    ctx.strokeStyle = color; // Set the stroke color
    ctx.lineWidth = 2; // Set the line width
    ctx.stroke(); // Render the line

    const text_x = start_point[0] + 10; // Offset the text to the right of the line
    const text_y = (start_point[1] + end_point[1]) / 2; // Center the text vertically

    ctx.fillStyle = 'white'; // Set text color
    ctx.font = '16px Arial'; // Set text font
    ctx.fillText(text, text_x, text_y); // Draw the text
}

function draw_vector(start_point, end_point) {
    ctx.beginPath(); // Start a new path

    // Draw the line from the start_point to the end_point
    ctx.moveTo(start_point[0], start_point[1]);
    ctx.lineTo(end_point[0], end_point[1]);

    // Calculate the angle for the arrowhead
    const angle = Math.atan2(end_point[1] - start_point[1], end_point[0] - start_point[0]);
    
    // Draw the arrowhead
    const arrow_length = 10; // Length of the arrowhead
    const arrow_angle = Math.PI / 6; // Angle of the arrowhead

    ctx.lineTo(end_point[0] - arrow_length * Math.cos(angle - arrow_angle), end_point[1] - arrow_length * Math.sin(angle - arrow_angle));
    ctx.moveTo(end_point[0], end_point[1]); // Move back to the end_point
    ctx.lineTo(end_point[0] - arrow_length * Math.cos(angle + arrow_angle), end_point[1] - arrow_length * Math.sin(angle + arrow_angle));

    ctx.strokeStyle = 'red'; // Set the stroke color for the vector
    ctx.lineWidth = 2; // Set the line width
    ctx.stroke(); // Render the vector
}

function draw_axes() {

    // Set styles for the axes
    heightCtx.strokeStyle = 'white'; // Color of the axes
    heightCtx.lineWidth = 1;          // Width of the axes lines

    // Draw the X axis (Time)
    heightCtx.beginPath();
    heightCtx.moveTo(0, h - 10); // Start point (0, height - 10)
    heightCtx.lineTo(w, h - 10); // End point (width, height - 10)
    heightCtx.stroke();

    // Draw the Y axis (Height in Feet)
    heightCtx.beginPath();
    heightCtx.moveTo(30, 0); // Start point (30, 0)
    heightCtx.lineTo(30, h); // End point (30, height)
    heightCtx.stroke();

    // Add labels for the axes
    heightCtx.fillStyle = 'white'; // Color for the text
    heightCtx.font = '14px Arial'; // Font style

    // Label for the X axis (Time)
    heightCtx.fillText('Time (s)', w / 2 - 25, h - 20);

    // Label for the Y axis (Height)
    heightCtx.save(); // Save current context
    heightCtx.translate(10, h / 2); // Move to the position for Y label
    heightCtx.rotate(-Math.PI / 2); // Rotate context to draw vertical text
    heightCtx.fillText('Height (feet)', 0, 0); // Draw Y axis label
    heightCtx.restore(); // Restore context to original state
}
