
// Author: JBrown

//=====================================
// I Ran into many errors when moving
// around function and the window.onload
// feature. I took a new approach by
// setting global variables to get
// the code back up and running
//=====================================

window.onload = function() {

    // Defines unit conversion factor dictionary
    // the KEY will be the unit's abbreviation and the VALUE will be the number of meters that 1 of the unit is.
    // Example:
    //      1 in = 0.0254 m
    //      etc.
    window.con = {"in":0.0254, "ft":0.3048, "m":1, "km":1000, "cm":0.01};

    // populates units once the window is finished loading
    populateUnits();

    //Defines angle that gets used in 3d rotation
    window.angle = 0;

};

// ------------- Function Definitions --------------
//Function that fills the drop down lists with the unit options
    function populateUnits() {
        var elements = document.getElementsByClassName("units");

        // Loop through dictionary of units and populate control(s)
        for (i = 0; i < elements.length; i++){
            for (x = 0; x < Object.keys(con).length; x++) {
              var option = document.createElement("option");
              var node = document.createTextNode(Object.keys(con)[x]);
              option.appendChild(node);
              elements[i].appendChild(option);
              }
        }
    }

    // Changes the global 'angle' by a rotation factor.
    // Parameters:
    //      direction.   'R' or 'L' determines which way to rotate (Right or Left)
    //      If you pass in an invalid value, it will go LEFT
    function updateAngle(direction) {
        var newAngle = 0;

        if (direction == 'R'){
            newAngle = angle + (Math.PI) / 12;

        }
        else{
            newAngle = angle - (Math.PI) / 12;
        }
        return(newAngle);
    }

    // Function that determines errors and will display error messages if needed
    function errors(value, error) {
        if (value < 0 || isNaN(value) == true) {
            // show error msg
            error.style.visibility = "visible";
        }

        else {
            error.style.visibility = "hidden";
        }
    }

    // Function that determines the exponent value of the answer
    function exponent(ansValue) {
        if (ansValue == "vol") {
            return "3";
        }

        else {
            return "2";
        }
    }

    // Function that calculates the final values and formats answers with correct units
    function finalCalc(ans, dest, places) {

        //Gets the final answer with the right amount of decimal places
        var final = Math.round(ans*places)/places;

        //adds trailing zeros if required
        if (final.toString().includes(".") == false) {

            var zeros = "";

            for (i = 0; i < decimal.value; i++) {
                var zeros = zeros + "0";
            }

            if (zeros != "") {

                var final = final.toString() + "." + zeros;
                document.getElementById(dest).innerHTML = final  + " " + answeru.value + exponent(dest).sup();
                ctx.clearRect(0,0,canvas.width,canvas.height);
            }

            else {
                var final = final.toString();
                document.getElementById(dest).innerHTML = final  + " " + answeru.value + exponent(dest).sup();
                ctx.clearRect(0,0,canvas.width,canvas.height);
            }
        }

        //Gets answers to correct number of decimals
        //Adds trailing zeros if needed
        else if (final.toString().includes(".") == true) {

            var decplaces = final.toString().split(".")[1].length;

            if (decplaces != decimal.value) {

                var final = final.toString();

                for (i=0; i < decimal.value - decplaces; i++) {
                    var final = final + "0";
                document.getElementById(dest).innerHTML = final  + " " + answeru.value + exponent(dest).sup();
                ctx.clearRect(0,0,canvas.width,canvas.height);
                }

            }

            else {
                document.getElementById(dest).innerHTML = final  + " " + answeru.value + exponent(dest).sup();
                ctx.clearRect(0,0,canvas.width,canvas.height);
            }
        }

        //Display answer and clear canvas
        else {
            document.getElementById(dest).innerHTML = final  + " " + answeru.value + exponent(dest).sup();
            ctx.clearRect(0,0,canvas.width,canvas.height);
        }

    }

    // Function that will return the scale factor for the drawing
    function scale(length,width,height,a) {
        var lScale = 250/(length+width*Math.cos(a));
        var hScale = 150/(height+width*Math.sin(a));
        var scale = Math.min(lScale,hScale);
        return scale;
    }

    // Function that draws the corners of the rectangular prism
    function corners(x,y,angle) {
        ctx.beginPath();
        ctx.moveTo(x,y);
        var x1 = x + W*Math.cos(angle);
        var y1 = y - W*Math.sin(angle);
        ctx.lineTo(x1,y1);
        ctx.stroke();
    }

    // TEST FUNCTION
    // Function rotates a 3 dimensional shape Still a work in progress
    function test(direction) {
        //Function that draws a line between two points
        function draw(x0,y0,x1,y1) {
            tctx.beginPath();
            tctx.moveTo(x0,y0);
            tctx.lineTo(x1,y1);
            tctx.stroke();
        }

        //Function that draws a side of the prism
        //Function takes in an initial point
        function side(x0,y0) {

            //VARIABLE NOTES
            // x0 => initial x coordinate
            // y0 => initial y coordinate
            // xn => new x coordinate of the side
            // yn => new y coordinate of the side
            // yb => y coordinate of the bottom of the side
            // ynb => new y coordinate of the bottom of the side

            //defines the next coordinate of the side
            var xn = x0 + L/2 * Math.cos(angle);
            var yn = y0 + H/2 * Math.sin(angle);

            //defines the y coordinates of the bottom of the sides
            var yb = y0 - H;
            var ynb = (y0 - H) + H/2 * Math.sin(angle);

            //Draws lines between the specified points
            draw(x0,y0,xn,yn);
            draw(x0,yb,xn,ynb);
            draw(xn,ynb,xn,yn);

            //defines coordinates as specified above
            xn = x0 - L/2 * Math.cos(angle);
            yn = y0 - H/2 * Math.sin(angle);
            ynb = (y0 - H) - H/2 * Math.sin(angle);

            //Draws lines between the specified points
            draw(x0,y0,xn,yn);
            draw(x0,yb,xn,ynb);
            draw(xn,ynb,xn,yn);
        }

        // Test function to draw the corners of the cube
        function cornerTest(x0,y0) {

            //defines the new x and y coordinates of the corner
            //angle + 30 degrees because when it rotates it needs to rotate as much as the sides.
            var x1 = x0 + W * Math.cos(angle + (Math.PI)/6);
            var y1 = y0 + W * Math.sin(angle + (Math.PI)/6);

            //Draws a line between the two points
            draw(x0,y0,x1,y1);
        }

        //Gets angle based on direction of rotation
        angle = updateAngle(direction);

        //Defines test canvas
        var testCanvas = document.getElementById("test");
        var tctx = testCanvas.getContext("2d");

        //Sets stroke styles and clears canvas
        tctx.lineWidth = 4;
        tctx.strokeStyle = "black";
        tctx.clearRect(0,0,testCanvas.width,testCanvas.height);

        //Defines Test values for the Height, width, length
        var H = 50;
        var L = 50;
        var W = 50;

        //Sets the starting coordinates
        var x0 = testCanvas.width/2;
        var y0 = testCanvas.height/2 + H/2;

        //Draws a side of the cube
        side(x0,y0);

        //Defines variables for the corners as specified above
        xn = x0 - (L/2 * Math.cos(angle));
        yn = y0 - (L/2 * Math.sin(angle));

        //Draws a corner of the cube
        cornerTest(xn,yn);

        //Defines variables for the corners as specified above
        yn = y0 - H - (L/2 * Math.sin(angle));

        //Draws a corner of the cube
        cornerTest(xn,yn);

        //Defines variables for the corners as specified above
        xn = x0 + (L/2 * Math.cos(angle));
        yn = y0 + (L/2 * Math.sin(angle));

        //Draws a corner of the cube
        cornerTest(xn,yn);

        //Defines variables for the corners as specified above
        yn = y0 - H + (L/2 * Math.sin(angle));

        //Draws a corner of the cube
        cornerTest(xn,yn);

        //Defines variables for the corners as specified above
        x0 = x0 + W * Math.cos(angle + (Math.PI)/6);
        y0 = y0 + W * Math.sin(angle + (Math.PI)/6);

        //Draws a side of the cube
        side(x0,y0);

    }

    //Creates the function that executes when the calculate button is pressed
    function calculatorMain() {
        // Get a reference to all the important elements
        window.lengthElement = document.getElementById("length");
        window.widthElement = document.getElementById("width");
        window.heightElement = document.getElementById("height");
        window.widthError = document.getElementById("Errorw");
        window.lengthError = document.getElementById("Errorl");
        window.heightError = document.getElementById("Errorh");
        window.decimalError = document.getElementById("Errord");
        window.decimal = document.getElementById("dec");

        // Reads and stores the values the user entered as INT
        var length = parseInt(lengthElement.value);
        var width = parseInt(widthElement.value);
        var height = parseInt(heightElement.value);

        // Loop through dictionary of units and populate control(s)
        for (i = 0; i < con.length; i++) {
            var option = document.createElement("option");
            var node = document.createTextNode(con[i]);
            option.appendChild(node);
            var element = document.getElementByClass("units");
            element.appendChild(option);

        }

        //Defines the canvas for the 3D drawing
        window.canvas = document.getElementById("drawing");
        window.ctx = canvas.getContext("2d");

        //Checks for errors with the three inputted dimensions
        errors(length,lengthError);
        errors(width,widthError);
        errors(height,heightError);

        //Determines errors with the decimals and will display error messages if needed
        if (decimal.value < 0 || isNaN(decimal.value) == true || decimal.value.includes(".") == true) {
            // show error msg
            decimalError.style.visibility = "visible";
        }

        else {
            decimalError.style.visibility = "hidden";
        }

        //Calculates the final value of the dimensions after converting units
        var finalL = length * con[unit_A.value]/con[answeru.value];
        var finalW = width * con[unit_B.value]/con[answeru.value];
        var finalH = height * con[unit_C.value]/con[answeru.value];

        //Finalizes and displays all answers if there are no errors
        if (lengthError.style.visibility == "hidden" && widthError.style.visibility == "hidden" && decimalError.style.visibility == "hidden" && heightError.style.visibility == "hidden") {

            //Gets all of the final answers
            var ansArea = finalL * finalW;
            var ansVol = finalL * finalW * finalH;
            var ansSA = 2*((finalL * finalW) + (finalL * finalH) + (finalW * finalW));
            var places = Math.pow(10,decimal.value);

            //Gets final answers with units for all values
            finalCalc(ansArea, "area", places);
            finalCalc(ansVol, "vol", places);
            finalCalc(ansSA, "sa", places);

            //Defines canvas stroke styles
            ctx.lineWidth = 4;
            ctx.strokeStyle = "black";

            //Defines variable for the scale Factor
            var scaleFactor = scale(finalL,finalW,finalH,(Math.PI/6));

            //Defines new scaled variables
            window.H = finalH*scaleFactor;
            window.W = finalW*scaleFactor;
            window.L = finalL*scaleFactor;

            // Get top left corner coords
            // half width of canvas - half length*scaleFactor
            // 2*L+(W*Math.cos((Math.PI)/6))
            var x0 = (canvas.width - (L+(W*Math.cos((Math.PI)/6))))/2;
            var y0 = 175-H;

            //Draws the first side of the prism
            ctx.strokeRect(x0, y0, L, H);

            //Draws all the corners of the prism
            corners(x0,y0,Math.PI/6);
            corners(x0+L,y0,Math.PI/6);
            corners(x0,y0+H,Math.PI/6);
            corners(x0+L,y0+H,Math.PI/6);

            //Draws the final side of the prism
            ctx.strokeRect(x0+W*Math.cos(Math.PI/6), y0-W*Math.sin(Math.PI/6), L, H);

      }

    }