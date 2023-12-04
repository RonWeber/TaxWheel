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
// All numbers in millions
wheelSegments = [
    {text: 'Legislative Branch', value: 6465, snark: "Gotta spend money to spend money."},
    {text: 'Judicial Branch', value: 9022, snark: "Those robes don't pay for themselves!"},
    {text: 'Department of Agriculture', value: 259176, snark: "They should name a cow after you."},
    {text: 'Department of Commerce', value: 13945, snark: ""},
    {text: 'Department of Defense\nMilitary Programs', noThe:true, value: 719470, snark: '"The only problem with a trillion dollar defense budget is that we didn\'t spend two trillion dollars!"\n- The Pentagon, probably.'},
    {text: 'Department of Education', value: 231346, snark: "But you still have to pay your student loans."},
    {text: 'Department of Energy', value: 23019, snark: "Solar panels and nukes.  What more could you ask for?"},
    // HHS
    {text: 'Medicare', noThe:true, value: 767325, snark: "Keep paying your health insurance premiums so that old people can have universal health care."},
    {text: 'Medicaid', noThe:true, value: 570687, snark: "Paid for by the federal government, but the states get to take credit for it.  Someone's gotta make sure that every governor gets reelected!"},
    {text: 'Administration for Children and Families', value: 85701, snark: "For children in impoverished families.  And also Brett Favre."},
    {text: 'Department of Health\nand Human Services', value: 256893, snark: "So next time someone you know doesn't get sick, they should thank you."},

    {text: 'Department of Homeland Security', value: 91031, snark: "You would think we could ease up on the 9/11 paranoia by this point."},
    {text: 'Department of Housing and Urban Development', value: 29286, snark: "Never before has the gap between what a department claims to be in charge of and what power it actually has been so wide."},
    {text: 'Department of the Interior', value: 15509, snark: "Hey, National Parks!"},
    {text: 'Department of Justice', value: 41460, snark: ""},
    {text: 'Department of Labor', value: 103387, snark: "Now go back to work at the Amazon warehouse!"},
    {text: 'Department of State', value: 36646, snark: "And there are still wars?  You should ask for a refund!"},
    {text: 'Department of Transportation', value: 122892, snark: "When a little kid asks what taxes pay for, the simple answer is \"Roads.\"  For you, this is actually true."},
    {text: 'Interest on the National Debt', noThe:true, value: 680976, snark: "We didn't solve this problem before and we're not gonna solve it now."},
    {text: 'Other', noThe:true, value: 456357, snark: "You know.  Stuff."},
    {text: 'Department of Veterans Affairs', value: 281470, snark: "The worst healthcare money can buy!"},
    {text: 'Corps of Engineers', value: 8315, snark: "That dam looks pretty stable."},
    {text: 'Other Defense Civil Programs', noThe:true, value: 54199, snark: ""},
    {text: 'Environmental Protection Agency', value: 8295, snark: "So go ahead and eat some delicious lead paint.  They owe you one."},
    {text: 'Executive Office of the President', value: 540, snark: "Maybe you paid for the toilet on Air Force One."},
    {text: 'International Assistance Programs', noThe:true, value: 37103, snark: "Your taxes didn't even go to your own crazy government?  Tough break."},
    {text: 'National Aeronautics and Space Administration', noThe:true, value: 23795, snark: "Email them to ask you for your ticket on their next flight to the Moon."},
    {text: 'National Science Foundation', value: 8183, snark: "The glowiest of lights"},
    {text: 'Office of Personnel Management', value: 114504, snark: "They move the retirement funds for everyone that used to work somewhere else in government over to here.  Sneaky!"},
    {text: 'Small Business Administration', value: 23845, snark: "So on Small Business Saturday, they should be supporting you!"},
    {text: 'Social Security', noThe: true, value: 1279128, snark: "Don't worry, I'm sure it will still be there by the time you retire!  Definitely!  Maybe!"},
    {text: 'Independent Agencies', noThe:true, value: 40169, snark: "What an exciting mystery!"},
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
        if (size < 35) textSize = 15
        if (size < 9) textSize = 9
        if (size < 4) textSize = 0
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
        resetWheel();
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
    // theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.

    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
}

function resultString(text) {
    for (const s of wheelSegments) {
        if (s.text === text) {
            let cleanText = text.replace(/(\r\n|\n|\r)/gm, " ")
            if (!s.noThe) {
                cleanText = "The " + cleanText
            }
            let result = `Your tax dollars went to:

${cleanText}`
            if (s.snark) {
                result += "\n\n" + s.snark
            }
            return result
        }
    }
    return "Your tax dollars went to: " + text
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters
// note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
// -------------------------------------------------------
function alertPrize(indicatedSegment)
{
    theWheel.stopAnimation(false);
    // wheelSpinning = false
    // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
    alert(resultString(indicatedSegment.text));
}
