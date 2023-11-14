const OUTER_RADIUS = 212
const BASE_FONT_SIZE = 28


colors = [
    "#4B0000",
    "#030065",
    "#154022",
    "#6F3808",
    "#2B2B2B",
]

// https://www.fiscal.treasury.gov/files/reports-statements/mts/mts0922.pdf
wheelSegments = [
    {text: 'Legislative Branch', value: 6465}   ,
    {text: 'Judicial Branch', value: 9022},
    {text: 'Department of Agriculture', value: 259176},
    {text: 'Department of Commerce', value: 13945},
    {text: 'Department of Defense\nMilitary Programs', value: 719470},
    {text: 'Department of Education', value: 231346},
    {text: 'Department of Energy', value: 23019},
    {text: 'Department of Health\nand Human Services', value: 1660606},
    {text: 'Department of Homeland Security', value: 91031},
    {text: 'Department of Housing and Urban Development', value: 29286},
    {text: 'Department of the Interior', value: 15509},
    {text: 'Department of Justice', value: 41460},
    {text: 'Department of Labor', value: 103387},
    {text: 'Department of State', value: 36646},
    {text: 'Department of Transportation', value: 122892},
    {text: 'Interest on Treasury\nDebt Securities (Gross)', value: 680976},
    {text: 'Other', value: 456357},
    {text: 'Department of Veterans Affairs', value: 281470},
    {text: 'Corps of Engineers', value: 8315},
    {text: 'Other Defense Civil Programs', value: 54199},
    {text: 'Environmental Protection Agency', value: 8295},
    {text: 'Executive Office of the President', value: 540},
    {text: 'International Assistance Programs', value: 37103},
    {text: 'National Aeronautics and Space Administration', value: 23795},
    {text: 'National Science Foundation', value: 8183},
    {text: 'Office of Personnel Management', value: 114504},
    {text: 'Small Business Administration', value: 23845},
    {text: 'Social Security Administration', value: 1279128},
    {text: 'Independent Agencies', value: 40169},
]

function toSegments() {
    results = []
    totalValue = 0
    for (const ws of wheelSegments) {
        totalValue += ws.value
    }
    for (let i = 0; i < wheelSegments.length; i++) {
        let size = wheelSegments[i].value / totalValue * 360
        let textSize = 20
        if (size < 40) textSize = 15
        if (size < 5) textSize = 0
        results.push({
            textFillStyle: "lightgrey",
            fillStyle: colors[i % colors.length],
            text: wheelSegments[i].text,
            size: size,
            textFontSize: textSize,
        })
    }
    return results
}

// Create new wheel object specifying the parameters at creation time.
let theWheel = new Winwheel({
    'numSegments'  : wheelSegments.length,     // Specify number of segments.
    'outerRadius'  : 350,   // Set outer radius so wheel fits inside the background.
    'textFontSize' : 28,    // Set font size as desired.
    'segments'     : toSegments(),
    'animation' :           // Specify the animation to use.
    {
        'type'     : 'spinToStop',
        'duration' : 5,     // Duration in seconds.
        'spins'    : 8,     // Number of complete spins.
        'callbackFinished' : alertPrize
    }
});

// Vars used by the code in this page to do power controls.
let wheelPower    = 0;
let wheelSpinning = false;

// -------------------------------------------------------
// Function to handle the onClick on the power buttons.
// -------------------------------------------------------
function powerSelected(powerLevel)
{
    // Ensure that power can't be changed while wheel is spinning.
    if (wheelSpinning == false) {
        // Reset all to grey incase this is not the first time the user has selected the power.
        document.getElementById('pw1').className = "";
        document.getElementById('pw2').className = "";
        document.getElementById('pw3').className = "";

        // Now light up all cells below-and-including the one selected by changing the class.
        if (powerLevel >= 1) {
            document.getElementById('pw1').className = "pw1";
        }

        if (powerLevel >= 2) {
            document.getElementById('pw2').className = "pw2";
        }

        if (powerLevel >= 3) {
            document.getElementById('pw3').className = "pw3";
        }

        // Set wheelPower var used when spin button is clicked.
        wheelPower = powerLevel;

        // Light up the spin button by changing it's source image and adding a clickable class to it.
        document.getElementById('spin_button').src = "spin_on.png";
        document.getElementById('spin_button').className = "clickable";
    }
}

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin()
{
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
        // Based on the power level selected adjust the number of spins for the wheel, the more times is has
        // to rotate with the duration of the animation the quicker the wheel spins.
        if (wheelPower == 1) {
            theWheel.animation.spins = 3;
        } else if (wheelPower == 2) {
            theWheel.animation.spins = 8;
        } else if (wheelPower == 3) {
            theWheel.animation.spins = 15;
        }

        // Disable the spin button so can't click again while wheel is spinning.
        document.getElementById('spin_button').src       = "spin_off.png";
        document.getElementById('spin_button').className = "";

        // Begin the spin animation by calling startAnimation on the wheel object.
        theWheel.startAnimation();

        // Set to true so that power can't be changed and spin button re-enabled during
        // the current animation. The user will have to reset before spinning again.
        wheelSpinning = true;
    }
}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel()
{
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.

    document.getElementById('pw1').className = "";  // Remove all colours from the power level indicators.
    document.getElementById('pw2').className = "";
    document.getElementById('pw3').className = "";

    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters
// note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
// -------------------------------------------------------
function alertPrize(indicatedSegment)
{
    theWheel.stopAnimation(false);
    wheelSpinning = false
    // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
    alert("Your tax dollars went to " + indicatedSegment.text);
}
