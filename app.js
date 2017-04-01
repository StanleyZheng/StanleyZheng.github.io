//
// app.js
//

const X_AXIS = [1,0,0];
const Y_AXIS = [0,1,0];
const Z_AXIS = [0,0,1];
const CUBE_WIDTH = 0.205; //actually cube width plus spacing 0.2 width with 0.005 spacing btwn
const SCRAMBLE_SPEED = 10;

const whiMatrix = [25, 26, 27, 22, 23, 24, 19, 20, 21];
const yelMatrix = [3, 12, 21, 6, 15, 24, 9, 18, 27];
const oraMatrix = [19, 20, 21, 10, 11, 12, 1, 2, 3];
const redMatrix = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const greMatrix = [19, 10, 1, 22, 13, 4, 25, 16, 7];
const bluMatrix = [7, 8, 9, 16, 17, 18, 25, 26, 27];


var COLORS_MATRIX = [   [25, 26, 27, 22, 23, 24, 19, 20, 21],
                        [3, 12, 21, 6, 15, 24, 9, 18, 27],
                        [19, 20, 21, 10, 11, 12, 1, 2, 3],
                        [1, 2, 3, 4, 5, 6, 7, 8, 9],
                        [19, 10, 1, 22, 13, 4, 25, 16, 7],
                        [7, 8, 9, 16, 17, 18, 25, 26, 27] ];

//set up canvas and webGL
var canvas = document.getElementById("gl-canvas");

var gl = WebGLUtils.setupWebGL(canvas, {});
if (!gl) {
    alert("WebGL isn't available");
}

var indices = [
    [1, 0, 3, 1, 3, 2],
    [2, 3, 7, 2, 7, 6],
    [3, 0, 4, 3, 4, 7],
    [6, 5, 1, 6, 1, 2],
    [4, 5, 6, 4, 6, 7],
    [5, 4, 0, 5, 0, 1]
];

var vertices = [
    vec4( -0.1, -0.1,  0.1, 1.0 ),
    vec4( -0.1,  0.1,  0.1, 1.0 ),
    vec4(  0.1,  0.1,  0.1, 1.0 ),
    vec4(  0.1, -0.1,  0.1, 1.0 ),
    vec4( -0.1, -0.1, -0.1, 1.0 ),
    vec4( -0.1,  0.1, -0.1, 1.0 ),
    vec4(  0.1,  0.1, -0.1, 1.0 ),
    vec4(  0.1, -0.1, -0.1, 1.0 )
];

//Rubik's Cube colors: white, yellow, orange, red, green and blue
var colors = [
    [ 0.0, 0.0, 0.0, 1.0 ],  // black
    [ 1.0, 1.0, 1.0, 1.0 ],  // white    
    [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
    [ 1.0, 0.5, 0.0, 1.0 ],  // orange
    [ 1.0, 0.0, 0.0, 1.0 ],  // red
    [ 0.0, 1.0, 0.0, 1.0 ],  // green
    [ 0.0, 0.0, 1.0, 1.0 ],  // blue
    [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
];

/** objnum
 *
 *  FRONT                         BACK 
 *  7 8 9       16 17 18       25 26 27
 *  4 5 6  -->  13 14 15  -->  22 23 24
 *  1 2 3       10 11 12       19 20 21
 *
 *       B           BLU = Top Face
 *   G   R   Y       RED = Front Face
 *       O           ORA = Bottom Face
 *       W           WHI = Back Face
 *
 *  rotate_on = ( White, Yellow, Orange, Red, Green, Blue )
 *
 */

var objectsToDraw = [
    //FRONT FACES ( 1 - 9 )
    {   objnum:     1,
        init_offset:[-CUBE_WIDTH, -CUBE_WIDTH, -CUBE_WIDTH],
        rotate_on:  [0,0,1,1,1,0]
    },
    {   objnum:     2,
        init_offset:[0, -CUBE_WIDTH, -CUBE_WIDTH],
        rotate_on:  [0,0,1,1,0,0]
    },
    {   objnum:     3,
        init_offset:[CUBE_WIDTH, -CUBE_WIDTH, -CUBE_WIDTH],
        rotate_on:  [0,1,1,1,0,0]
    },
    {   objnum:     4,
        init_offset:[-CUBE_WIDTH, 0, -CUBE_WIDTH],
        rotate_on:  [0,0,0,1,1,0]
    },
    {   objnum:     5,
        init_offset:[0, 0, -CUBE_WIDTH],
        rotate_on:  [0,0,0,1,0,0]
    },
    {   objnum:     6,
        init_offset:[CUBE_WIDTH, 0, -CUBE_WIDTH],
        rotate_on:  [0,1,0,1,0,0]
    },
    {   objnum:     7,
        init_offset:[-CUBE_WIDTH, CUBE_WIDTH, -CUBE_WIDTH],
        rotate_on:  [0,0,0,1,1,1]
    },
    {   objnum:     8,
        init_offset:[0, CUBE_WIDTH, -CUBE_WIDTH],
        rotate_on:  [0,0,0,1,0,1]
    },
    {   objnum:     9,
        init_offset:[CUBE_WIDTH, CUBE_WIDTH, -CUBE_WIDTH],
        rotate_on:  [0,1,0,1,0,1]
    },

    //MIDDLE FACES ( 10 - 18 )
    {   objnum:     10,
        init_offset:[-CUBE_WIDTH, -CUBE_WIDTH, 0],
        rotate_on:  [0,0,1,0,1,0]
    },
    {   objnum:     11,
        init_offset:[0, -CUBE_WIDTH, 0],
        rotate_on:  [0,0,1,0,0,0]
    },
    {   objnum:     12,
        init_offset:[CUBE_WIDTH, -CUBE_WIDTH, 0],
        rotate_on:  [0,1,1,0,0,0]
    },
    {   objnum:     13,
        init_offset:[-CUBE_WIDTH, 0, 0],
        rotate_on:  [0,0,0,0,1,0]
    },
    {   objnum:     14,
        init_offset:[0, 0, 0],
        rotate_on:  [0,0,0,0,0,0]
    },
    {   objnum:     15,
        init_offset:[CUBE_WIDTH, 0, 0],
        rotate_on:  [0,1,0,0,0,0]
    },
    {   objnum:     16,
        init_offset:[-CUBE_WIDTH, CUBE_WIDTH, 0],
        rotate_on:  [0,0,0,0,1,1]
    },
    {   objnum:     17,
        init_offset:[0, CUBE_WIDTH, 0],
        rotate_on:  [0,0,0,0,0,1]
    },
    {   objnum:     18,
        init_offset:[CUBE_WIDTH, CUBE_WIDTH, 0],
        rotate_on:  [0,1,0,0,0,1]
    },

    //BACK FACES ( 19 - 27 )
    {   objnum:     19,
        init_offset:[-CUBE_WIDTH, -CUBE_WIDTH, CUBE_WIDTH],
        rotate_on:  [1,0,1,0,1,0]
    },
    {   objnum:     20,
        init_offset:[0, -CUBE_WIDTH, CUBE_WIDTH],
        rotate_on:  [1,0,1,0,0,0]
    },
    {   objnum:     21,
        init_offset:[CUBE_WIDTH, -CUBE_WIDTH, CUBE_WIDTH],
        rotate_on:  [1,1,1,0,0,0]
    },
    {   objnum:     22,
        init_offset:[-CUBE_WIDTH, 0, CUBE_WIDTH],
        rotate_on:  [1,0,0,0,1,0]
    },
    {   objnum:     23,
        init_offset:[0, 0, CUBE_WIDTH],
        rotate_on:  [1,0,0,0,0,0]
    },
    {   objnum:     24,
        init_offset:[CUBE_WIDTH, 0, CUBE_WIDTH],
        rotate_on:  [1,1,0,0,0,0]
    },
    {   objnum:     25,
        init_offset:[-CUBE_WIDTH, CUBE_WIDTH, CUBE_WIDTH],
        rotate_on:  [1,0,0,0,1,1]
    },
    {   objnum:     26,
        init_offset:[0, CUBE_WIDTH, CUBE_WIDTH],
        rotate_on:  [1,0,0,0,0,1]
    },
    {   objnum:     27,
        init_offset:[CUBE_WIDTH, CUBE_WIDTH, CUBE_WIDTH],
        rotate_on:  [1,1,0,0,0,1]
    },
]; //end objectsToDraw


//variables for scrambling
var scramble_amount = 0;
var rotation_speed = 3;
var slider_rotation_speed = 3;

//variables for rotating
var isClockwise = 0;
var isRotating = 0;
var currentRotatingIndex = -1;
var rotation_amount = 0;
var rotation_direction = 1;
var r_axis = [0, 0, 0];

var basisMatrix = mult(mat4(), rotate(45, [1,1,0]));

//set up vertices and colors
var points = [];
var sideColors = [];
for (let j = 0; j < 6; ++j) {
    for (let i = 0; i < 6; ++i) {
        points.push(vertices[indices[j][i]]);
        sideColors.push(colors[indices[j][0]]);
    }
}

objectsToDraw.forEach(function(object){
    object.rotationMatrix = mat4();
});


gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 0); //make background of canvas transparent
gl.enable(gl.DEPTH_TEST);

var program = initShaders(gl, "vertexShaderId", "fragmentShaderId");
gl.useProgram(program);


//pass color information to shader
var cBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(sideColors), gl.STATIC_DRAW);

var vColor = gl.getAttribLocation(program, "vColor");
gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vColor);

//pass points to vPosition of shader
var vBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

var vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

var basisMatrixLoc = gl.getUniformLocation(program, "basisMatrix");
gl.uniformMatrix4fv(basisMatrixLoc, false, flatten(basisMatrix));

requestAnimationFrame(draw);




/********************************/
/*  ALL FUNCTIONS               */
/********************************/
function draw(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //draw objects
    objectsToDraw.forEach(function(object){
        //send the translation vector to shader
        var trans_valuesLoc = gl.getUniformLocation(program, "trans_values");
        gl.uniform3fv(trans_valuesLoc, object.init_offset);

        //send the rotationMatrix to rotateMatrix of shader
        var rotationMatrixLoc = gl.getUniformLocation(program, "rotateMatrix");
        gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(object.rotationMatrix));

        //draw cube
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    });


    //rotation only if rotation_amount is set by button click
    if (rotation_amount > 0){
        //rotate less to avoid OVER Rotating
        if (rotation_amount < rotation_speed){
            objectsToDraw.forEach(function(object){
                if (object.rotate_on[currentRotatingIndex] == 1)
                    object.rotationMatrix = mult(object.rotationMatrix, rotate(rotation_amount * rotation_direction, r_axis));
            });
            rotation_amount -= rotation_amount;
        }
        else {
            objectsToDraw.forEach(function(object){
                if (object.rotate_on[currentRotatingIndex] == 1)
                    object.rotationMatrix = mult(object.rotationMatrix, rotate(rotation_speed * rotation_direction, r_axis));
            });
            rotation_amount -= rotation_speed;
        }
        requestAnimationFrame(draw);
    }
    else if (rotation_amount <= 0 && currentRotatingIndex != -1)
        updateObjects( currentRotatingIndex, isClockwise);
}



/********************************/
/*  Update Objects values       */
/********************************/
function updateObjects(param, orientation){
    var temp = COLORS_MATRIX[param];
    switchObjectParams(temp[0], temp[6], temp[8], temp[2], orientation);
    switchObjectParams(temp[3], temp[7], temp[5], temp[1], orientation);
    updateColorMatrices(param, orientation);
};



/********************************/
/*  Interchange Object Params when rotating  */
// 
/* switches the rotate_on values of objectsToDraw[i1]...
//  i1 takes i2
//  i2 takes i3      -->     2 3     -->     1 2
//  i3 takes i4              1 4             4 3
//  i4 takes i1
/********************************/
function switchObjectParams(i1, i2, i3, i4, orientation){
    var temp = [];
    var i = 1;
    if (orientation == -1)
        i = 3;

    for(;i > 0; i--){
        temp = objectsToDraw[i1 - 1].rotate_on;
        objectsToDraw[i1 - 1].rotate_on = objectsToDraw[i2 - 1].rotate_on;
        objectsToDraw[i2 - 1].rotate_on = objectsToDraw[i3 - 1].rotate_on;
        objectsToDraw[i3 - 1].rotate_on = objectsToDraw[i4 - 1].rotate_on;
        objectsToDraw[i4 - 1].rotate_on = temp;
    }
};



/********************************/
/*  Update ColorMatrix for Clockwise Rotation */
//
/* for loop 3 times for counter clockwise rotation */
/********************************/
function updateColorMatrices(param, orientation){
    var i = 1;
    if (orientation == -1)
        i = 3;

    for(;i > 0; i--){
        //update matrices to hold their new cubes
        temp = COLORS_MATRIX[param][0];
        COLORS_MATRIX[param][0] = COLORS_MATRIX[param][2];
        COLORS_MATRIX[param][2] = COLORS_MATRIX[param][8];
        COLORS_MATRIX[param][8] = COLORS_MATRIX[param][6];
        COLORS_MATRIX[param][6] = temp;
        temp = COLORS_MATRIX[param][1];
        COLORS_MATRIX[param][1] = COLORS_MATRIX[param][5];
        COLORS_MATRIX[param][5] = COLORS_MATRIX[param][7];
        COLORS_MATRIX[param][7] = COLORS_MATRIX[param][3];
        COLORS_MATRIX[param][3] = temp;


        if (param == 0){
            //matrix above
            COLORS_MATRIX[2][0] = COLORS_MATRIX[0][6];
            COLORS_MATRIX[2][1] = COLORS_MATRIX[0][7];
            COLORS_MATRIX[2][2] = COLORS_MATRIX[0][8];
            //matrix below
            COLORS_MATRIX[5][6] = COLORS_MATRIX[0][0];
            COLORS_MATRIX[5][7] = COLORS_MATRIX[0][1];
            COLORS_MATRIX[5][8] = COLORS_MATRIX[0][2];
            //matrix right
            COLORS_MATRIX[1][8] = COLORS_MATRIX[0][2];
            COLORS_MATRIX[1][5] = COLORS_MATRIX[0][5];
            COLORS_MATRIX[1][2] = COLORS_MATRIX[0][8];
            //matrix left
            COLORS_MATRIX[4][6] = COLORS_MATRIX[0][0];
            COLORS_MATRIX[4][3] = COLORS_MATRIX[0][3];
            COLORS_MATRIX[4][0] = COLORS_MATRIX[0][6];
        }
        else if (param == 1){
            //matrix above
            COLORS_MATRIX[5][2] = COLORS_MATRIX[1][6];
            COLORS_MATRIX[5][5] = COLORS_MATRIX[1][7];
            COLORS_MATRIX[5][8] = COLORS_MATRIX[1][8];
            //matrix below
            COLORS_MATRIX[2][8] = COLORS_MATRIX[1][0];
            COLORS_MATRIX[2][5] = COLORS_MATRIX[1][1];
            COLORS_MATRIX[2][2] = COLORS_MATRIX[1][2];
            //matrix right
            COLORS_MATRIX[0][8] = COLORS_MATRIX[1][2];
            COLORS_MATRIX[0][5] = COLORS_MATRIX[1][5];
            COLORS_MATRIX[0][2] = COLORS_MATRIX[1][8];
            //matrix left
            COLORS_MATRIX[3][2] = COLORS_MATRIX[1][0];
            COLORS_MATRIX[3][5] = COLORS_MATRIX[1][3];
            COLORS_MATRIX[3][8] = COLORS_MATRIX[1][6];
        }
        else if (param == 2){
            //matrix above
            COLORS_MATRIX[3][0] = COLORS_MATRIX[2][6];
            COLORS_MATRIX[3][1] = COLORS_MATRIX[2][7];
            COLORS_MATRIX[3][2] = COLORS_MATRIX[2][8];
            //matrix below
            COLORS_MATRIX[0][6] = COLORS_MATRIX[2][0];
            COLORS_MATRIX[0][7] = COLORS_MATRIX[2][1];
            COLORS_MATRIX[0][8] = COLORS_MATRIX[2][2];
            //matrix right
            COLORS_MATRIX[1][2] = COLORS_MATRIX[2][2];
            COLORS_MATRIX[1][1] = COLORS_MATRIX[2][5];
            COLORS_MATRIX[1][0] = COLORS_MATRIX[2][8];
            //matrix left
            COLORS_MATRIX[4][0] = COLORS_MATRIX[2][0];
            COLORS_MATRIX[4][1] = COLORS_MATRIX[2][3];
            COLORS_MATRIX[4][2] = COLORS_MATRIX[2][6];
        }
        else if (param == 3){
            //matrix above
            COLORS_MATRIX[5][0] = COLORS_MATRIX[3][6];
            COLORS_MATRIX[5][1] = COLORS_MATRIX[3][7];
            COLORS_MATRIX[5][2] = COLORS_MATRIX[3][8];
            //matrix below
            COLORS_MATRIX[2][6] = COLORS_MATRIX[3][0];
            COLORS_MATRIX[2][7] = COLORS_MATRIX[3][1];
            COLORS_MATRIX[2][8] = COLORS_MATRIX[3][2];
            //matrix right
            COLORS_MATRIX[1][0] = COLORS_MATRIX[3][2];
            COLORS_MATRIX[1][3] = COLORS_MATRIX[3][5];
            COLORS_MATRIX[1][6] = COLORS_MATRIX[3][8];
            //matrix left
            COLORS_MATRIX[4][2] = COLORS_MATRIX[3][0];
            COLORS_MATRIX[4][5] = COLORS_MATRIX[3][3];
            COLORS_MATRIX[4][8] = COLORS_MATRIX[3][6];
        }
        else if (param == 4){
            //matrix above
            COLORS_MATRIX[5][6] = COLORS_MATRIX[4][6];
            COLORS_MATRIX[5][3] = COLORS_MATRIX[4][7];
            COLORS_MATRIX[5][0] = COLORS_MATRIX[4][8];
            //matrix below
            COLORS_MATRIX[2][0] = COLORS_MATRIX[4][0];
            COLORS_MATRIX[2][3] = COLORS_MATRIX[4][1];
            COLORS_MATRIX[2][6] = COLORS_MATRIX[4][2];
            //matrix right
            COLORS_MATRIX[3][0] = COLORS_MATRIX[4][2];
            COLORS_MATRIX[3][3] = COLORS_MATRIX[4][5];
            COLORS_MATRIX[3][6] = COLORS_MATRIX[4][8];
            //matrix left
            COLORS_MATRIX[0][6] = COLORS_MATRIX[4][0];
            COLORS_MATRIX[0][3] = COLORS_MATRIX[4][3];
            COLORS_MATRIX[0][0] = COLORS_MATRIX[4][6];
        }
        else if (param == 5){
            //matrix above
            COLORS_MATRIX[0][0] = COLORS_MATRIX[5][6];
            COLORS_MATRIX[0][1] = COLORS_MATRIX[5][7];
            COLORS_MATRIX[0][2] = COLORS_MATRIX[5][8];
            //matrix below
            COLORS_MATRIX[3][6] = COLORS_MATRIX[5][0];
            COLORS_MATRIX[3][7] = COLORS_MATRIX[5][1];
            COLORS_MATRIX[3][8] = COLORS_MATRIX[5][2];
            //matrix right
            COLORS_MATRIX[1][6] = COLORS_MATRIX[5][2];
            COLORS_MATRIX[1][7] = COLORS_MATRIX[5][5];
            COLORS_MATRIX[1][8] = COLORS_MATRIX[5][8];
            //matrix left
            COLORS_MATRIX[4][8] = COLORS_MATRIX[5][0];
            COLORS_MATRIX[4][7] = COLORS_MATRIX[5][3];
            COLORS_MATRIX[4][6] = COLORS_MATRIX[5][6];
        }
        else{
            console.log("ERROR: none of the colors rotated!");
        }
    }

    isRotating = 0;
    rotation_speed = slider_rotation_speed;

    //rerun Scramble if scramble_amount is not zero
    if (scramble_amount > 0)
        Scramble();

    checkWin();
};



/********************************/
/*  Button Functions            */
/********************************/
function rotateWhite(arg){
    if (isRotating == 0 && rotation_amount <= 0){
        isRotating = 1;
        currentRotatingIndex = 0;
        r_axis = Z_AXIS;
        rotation_direction = -1 * arg;
        isClockwise = arg;
        rotation_amount = 90;
        requestAnimationFrame(draw);
    }
}
function rotateYellow(arg){
    if (isRotating == 0 && rotation_amount <= 0){
        isRotating = 1;
        currentRotatingIndex = 1;
        r_axis = X_AXIS;
        rotation_direction = -1 * arg;
        isClockwise = arg;
        rotation_amount = 90;
        requestAnimationFrame(draw);
    }
}
function rotateOrange(arg){
    if (isRotating == 0 && rotation_amount <= 0){
        isRotating = 1;
        currentRotatingIndex = 2;
        r_axis = Y_AXIS;
        rotation_direction = 1 * arg;
        isClockwise = arg;
        rotation_amount = 90;
        requestAnimationFrame(draw);
    }
}
function rotateRed(arg){
    if (isRotating == 0 && rotation_amount <= 0){
        isRotating = 1;
        currentRotatingIndex = 3;
        r_axis = Z_AXIS;
        rotation_direction = 1 * arg;
        isClockwise = arg;
        rotation_amount = 90;
        requestAnimationFrame(draw);
    }
}
function rotateGreen(arg){
    if (isRotating == 0 && rotation_amount <= 0){
        isRotating = 1;
        currentRotatingIndex = 4;
        r_axis = X_AXIS;
        rotation_direction = 1 * arg;
        isClockwise = arg;
        rotation_amount = 90;
        requestAnimationFrame(draw);
    }
}
function rotateBlue(arg){
    if (isRotating == 0 && rotation_amount <= 0){
        isRotating = 1;
        currentRotatingIndex = 5;
        r_axis = Y_AXIS;
        rotation_direction = -1 * arg;
        isClockwise = arg;
        rotation_amount = 90;
        requestAnimationFrame(draw);
    }
};



/********************************/
/*  Scramble Function           */
/********************************/
function Scramble(){
    if (scramble_amount == 0){
        scramble_amount = document.getElementById("scrambleID").value;
        if (scramble_amount > 40 || scramble_amount <= 0){
            alert("Value must be positive and less than or equal to 40");
            return;
        }
    }
    rotation_speed = SCRAMBLE_SPEED;
    scramble_amount--;
    var x = Math.floor(Math.random() * 6)
    switch(x){
        case 0:
            rotateWhite(1);
            break;
        case 1:
            rotateYellow(1);
            break;
        case 2:
            rotateOrange(1);
            break;
        case 3:
            rotateRed(1);
            break;
        case 4:
            rotateGreen(1);
            break;
        case 5:
            rotateBlue(1);
            break;
        default:
            console.log("ERROR: something went wrong in Scramble's switch cases");;
    }
}



/********************************/
/*  Slider Functionality        */
/********************************/
document.getElementById("sliderID").onchange = function(event) {
    slider_rotation_speed = event.target.value;
    rotation_speed = slider_rotation_speed;
};



/********************************/
/*  Check Win Condition         */
/********************************/
function checkWin(){
    var temp = [ whiMatrix, yelMatrix, oraMatrix, redMatrix, greMatrix, bluMatrix ];
    if (COLORS_MATRIX.toString() === temp.toString()){
        document.getElementById("winnerID").style.display = "block";
        document.getElementById("disclaimer").style.display = "none";
        alert("Rubik's Cube Solved! :D");
    }
    else {
        document.getElementById("winnerID").style.display = "none";
        document.getElementById("disclaimer").style.display = "block";
    }
}



/********************************/
/*   Rotate Cube with Mouse     */
/********************************/
var prevx,prevy;
var dragging = false;

function doMouseDown(evt) {
    if (dragging || isRotating == 1 || rotation_amount > 0)
        return;
    dragging = true;
    document.addEventListener("mousemove", doMouseDrag, false);
    document.addEventListener("mouseup", doMouseUp, false);
    prevx = evt.clientX;
    prevy = evt.clientY;
    evt.preventDefault();
}

function doMouseDrag(evt) {
    if (!dragging || isRotating == 1 || rotation_amount > 0)
        return;
    dX = (evt.clientX-prevx) / 100;
    dY = (evt.clientY-prevy) / 100;
    prevx = evt.clientX 
    prevy = evt.clientY;
    evt.preventDefault();
    var temp = mult(rotate(dY * 50, [1,0,0]), rotate(dX * 50,[0,1,0]));

    // DRAW without using draw() b/c drawing with draw() caused update problems
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    basisMatrix = mult(basisMatrix, temp);
    gl.uniformMatrix4fv(basisMatrixLoc, false, flatten(basisMatrix));
    
    objectsToDraw.forEach(function(object){
        var trans_valuesLoc = gl.getUniformLocation(program, "trans_values");
        gl.uniform3fv(trans_valuesLoc, object.init_offset);
        var rotationMatrixLoc = gl.getUniformLocation(program, "rotateMatrix");
        gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(object.rotationMatrix));

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    });
}

function doMouseUp(evt) {
    if (dragging) {
        document.removeEventListener("mousemove", doMouseDrag, false);
        document.removeEventListener("mouseup", doMouseUp, false);
        dragging = false;
    }
}

canvas.addEventListener("mousedown", doMouseDown, false);



/********************************/
/*  KeyPresses                  */
/********************************/
document.onkeydown = function(e){
    e = e || window.event;
    var key = e.which || e.keyCode;
    // w key for White Rotate
    if (key === 87){
        if (e.shiftKey)
            rotateWhite(-1);
        rotateWhite(1);
    }
    // y key for Yellow Rotate
    if (key === 89){
        if (e.shiftKey)
            rotateYellow(-1);
        rotateYellow(1);
    }
    // o key for Orange Rotate
    if (key === 79){
        if (e.shiftKey)
            rotateOrange(-1);
        rotateOrange(1);
    }
    // r key for Red Rotate
    if (key === 82){
        if(e.shiftKey)
            rotateRed(-1);
        rotateRed(1);
    }
    // g key for Green Rotate
    if (key === 71){
        if (e.shiftKey)
            rotateGreen(-1);
        rotateGreen(1);
    }
    // b key for Blue Rotate
    if (key === 66){
        if (e.shiftKey)
            rotateBlue(-1);
        rotateBlue(1);
    }
}



/********************************/
/*  SaveToFile                  */
/********************************/
function saveToFile() {
    var temp = [];
    temp[0] = objectsToDraw;
    temp[1] = basisMatrix;
    temp[2] = COLORS_MATRIX;
    var textToSave = JSON.stringify(temp);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'myFile.json';
    hiddenElement.click();
}



/********************************/
/*  Load File State             */
/********************************/
function loadFile(evt){
    if (!window.FileReader){
        alert('Load State functionality is not supported by your browser');
        return false;
    }
    if (isRotating == 0){
        var temp = document.getElementById('uploadFileID')
        var f = temp.files[0];
        if (f){
            var r = new FileReader();
            r.onload = function(e){
                var contents = e.target.result;
                var temp = JSON.parse(contents);

                //update objectsToDraw, basisMatrix, and COLORS_MATRIX
                objectsToDraw = temp[0];
                objectsToDraw.forEach(function(obj){
                    obj.rotationMatrix.matrix = true;
                });
                
                basisMatrix = temp[1];
                basisMatrix.matrix = true;
                gl.uniformMatrix4fv(basisMatrixLoc, false, flatten(basisMatrix));

                COLORS_MATRIX = temp[2];

                //reset currentRotatingIndex before drawing
                currentRotatingIndex = -1;
                requestAnimationFrame(draw);
            }
            r.readAsText(f);
        }
        else {
            console.log("Failed to load file");
        }
    }
}


