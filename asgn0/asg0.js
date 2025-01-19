// DrawRectangle.js
function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    
    // Get the rendering context for 2DCG
    var ctx = canvas.getContext('2d');

    // Draw a blue rectangle
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
    
    // Initialize v1, set Z-coordinate as 0
    let v1 = new Vector3([2.25, 2.25, 0]);

    drawVector(v1, "red");

}

function drawVector(v, color) {

    // Retrieve <canvas> and get rendering context
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    
    ctx.beginPath();

    // Center is known as (canvas.width / 2, canvas.height / 2)
    ctx.moveTo(canvas.width / 2, canvas.height / 2);

    // Start at center then draw to destination, scalar by 20 for easy visualization
    ctx.lineTo((canvas.width / 2) + v.elements[0] * 20, (canvas.width / 2) - v.elements[1] * 20);

    // Set the color of the line
    ctx.strokeStyle = color;
    
    // Draw the line
    ctx.stroke();
}

function handleDrawEvent() {
    // Retrieve <canvas> and get rendering context
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Color the canvas in black again
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

    // Initialize a vector given x and y from user
    let v1 = new Vector3([document.getElementById("x1Value").value, document.getElementById("y1Value").value, 0]);
    let v2 = new Vector3([document.getElementById("x2Value").value, document.getElementById("y2Value").value, 0]);
    
    // Draw the two vectors, red and the other blue
    drawVector(v1, "red")
    drawVector(v2, "blue")
}

function handleDrawOperationEvent() {
    // Retrieve <canvas> and get rendering context
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Color the canvas in black again
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

    // Initialize a vector given x and y from user
    let v1 = new Vector3([document.getElementById("x1Value").value, document.getElementById("y1Value").value, 0]);
    let v2 = new Vector3([document.getElementById("x2Value").value, document.getElementById("y2Value").value, 0]);
    
    // Draw the two vectors, red and the other blue
    drawVector(v1, "red");
    drawVector(v2, "blue");
    
    let operation = document.getElementById("Operations").value;
    let scalar = document.getElementById("Scalar").value;
    v3 = new Vector3([0, 0, 0]);
    v4 = new Vector3([0, 0, 0]);

    if (operation == "Add") {
        v3 = v1.add(v2);
        drawVector(v3, "green");
    } else if (operation == "Subtract") {
        v3 = v1.sub(v2);
        drawVector(v3, "green");       
    } else if (operation == "Divide") {
        v3 = v1.div(scalar);
        v4 = v2.div(scalar);
        drawVector(v3, "green");
        drawVector(v4, "green");
    } else if (operation == "Multiply") {
        v3 = v1.mul(scalar);
        v4 = v2.mul(scalar);
        drawVector(v3, "green");
        drawVector(v4, "green");       
    } else if (operation == "Magnitude") {
        console.log("Magnitude v1:", v1.magnitude())
        console.log("Magnitude v2:", v2.magnitude())
    } else if (operation == "Normalize") {
        drawVector(v1.normalize(), "green");
        drawVector(v2.normalize(), "green");
    } else if (operation == "Angle Between") {
        // productdot(v1, v2) = ||v1|| * ||v2|| * cos(alpha)
        let x = Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude())
        let radians = Math.acos(x);
        console.log("Angle:", radians * 180 / Math.PI);
    } else if (operation == "Area") {
        console.log("Area of the triangle:", 1/2 * (Vector3.cross(v1, v2)).magnitude());
    }
}