// DemoPI (c) Baltasar 2018 MIT License <baltasarq@gmail.com>

/** Counts the pixels needed for a circle.
 *  Simulates the drawing of a circle using the bresenham's algorithm.
 *  Algorithm adapted from wikipedia's drawCircle().
 *  https://en.wikipedia.org/wiki/Midpoint_circle_algorithm#JavaScript
 *  @param radius The radius of the circle.
 *  @return The number of pixels used.
 */
function calculateCirclePerimeter(radius)
{
    const x0 = radius;
    const y0 = radius;
    var toret = 0;
    var x = radius - 1;
    var y = 0;
    var dx = 1;
    var dy = 1;
    var decisionOver2 = dx - ( radius << 1 );
    const drawPixel = function(x, y) { ++toret };

    while ( x >= y ) {
        drawPixel( x + x0, y + y0 );
        drawPixel( y + x0, x + y0 );
        drawPixel( -x + x0, y + y0 );
        drawPixel( -y + x0, x + y0 );
        drawPixel( -x + x0, -y + y0 );
        drawPixel( -y + x0, -x + y0 );
        drawPixel( x + x0, -y + y0 );
        drawPixel( y + x0, -x + y0 );

        if ( decisionOver2 <= 0 ) {
            // Change in decision criterion for y -> y+1
            y++;
            decisionOver2 += dy;
            dy += 2;
        }

        if ( decisionOver2 > 0 ) {
            // Change for y -> y+1, x -> x-1
            x--;
            dx += 2;
            decisionOver2 += ( -radius << 1 ) + dx;
        }
    }

    return toret;
}

/** Draws a quarter of a circle on given canvas,
 *  the radius equals the size of the canvas.
 *  @param canvas The drawing board, a canvas element.
 *  @param radius The radius of the circle.
 *  @return The number of pixels drawn.
 */
function drawQuarterCircle(canvas)
{
    const x = canvas.width;
    const y = canvas.height;
    const radius = canvas.width;
    const ctx = canvas.getContext( "2d" );

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.imageSmoothingEnabled = false;
    ctx.beginPath();
    ctx.moveTo( x, y );
    ctx.arc( x, y, radius, Math.PI, -( Math.PI / 2 ) );
    ctx.fill();
    ctx.stroke();
}

/** Creates the board, given the size for each side
 *  @param side The size for each side
 */
function resizeBoard(side)
{
    const cvBoard = document.getElementById( "cvBoard" );

    cvBoard.width = side;
    cvBoard.height = side;
    cvBoard.getContext( "2d" ).clearRect( 0, 0, side, side );
    return cvBoard;
}

/** Calculates the area of the whole circle, parting from the 1/4 circle.
  @param canvas The canvas in which the shape is.
  @return The number of pixels inside the arc.
*/
function calculateCircleArea(canvas)
{
    var toret = 0;
    const imgWidth = canvas.width;

    if ( imgWidth > 0 ) {
        const imgData = canvas.getContext( "2d" )
                        .getImageData( 0, 0, canvas.width, canvas.height ).data;

        // loop through each pixel and count black pixels
        for (var i = 0; i < imgData.length; i += 4) {
            if ( imgData[ i + 3 ] === 255 ) {
                toret += 1;
            }
        }
    }

    return toret * 4;
}

/** Updates the drawing on screen */
function update()
{
    const edRadius = document.getElementById( "edRadius" );
    const lblPerimeter = document.getElementById( "lblPerimeter" );
    const lblCalcPerimeter = document.getElementById( "lblCalcPerimeter" );
    const lblTheoreticalPi = document.getElementById( "lblTheoreticalPi" );
    const lblPracticalPi = document.getElementById( "lblPracticalPi" );
    const lblPracticalPi2 = document.getElementById( "lblPracticalPi2" );
    const lblPracticalArea = document.getElementById( "lblPracticalArea" );
    const lblArea = document.getElementById( "lblArea" );
    const radius = parseFloat( edRadius.value );
    const pxs = calculateCirclePerimeter( radius );
    const cvBoard = resizeBoard( radius );

    // Calc theoretical values
    const pr = 2 * radius * Math.PI;
    const area = Math.PI * radius * radius;
    lblCalcPerimeter.value = pr;
    lblTheoreticalPi.value = radius > 0? pr / ( 2 * radius ): 0;
    lblArea.value = area;

    // Calculate practical values
    drawQuarterCircle( cvBoard );

    const calcArea = calculateCircleArea( cvBoard );
    lblPracticalArea.value = calcArea;
    lblPerimeter.value = pxs;
    lblPracticalPi.value = radius > 0 ? ( pxs / ( radius * 2 ) ): 0;
    lblPracticalPi2.value = calcArea / ( radius * radius );
}

/** Shows or hides a div, given its name.
 * @param divName The name of the div.
 * @param lnkName The name of the link that triggered switching.
 */
function switchDisplay(divName, lnkName)
{
    const link = document.getElementById( lnkName );
    const div = document.getElementById( divName );

    if ( div.style.display == "block" ) {
        link.innerHTML = "[+]";
        div.style.display = "none";
    } else {
        link.innerHTML = "[-]";
        div.style.display = "block";
    }

    return false;
}
