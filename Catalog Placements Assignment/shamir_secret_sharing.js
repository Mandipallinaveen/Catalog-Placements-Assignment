const fs = require('fs');

// Function to convert a string in a given base to an integer
function convertToDecimal(value, base) {
    return parseInt(value, base);
}

// Function to read and parse JSON input
function readInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// Function to decode Y values from JSON
function decodeYValues(points) {
    const keys = points.keys;
    const n = keys.n;
    const xValues = [];
    const yValues = [];

    for (const key in points) {
        if (key !== 'keys') {
            const base = parseInt(points[key].base, 10);
            const value = points[key].value;
            xValues.push(parseInt(key, 10));
            yValues.push(convertToDecimal(value, base));
        }
    }

    return { xValues, yValues, n };
}

// Function to perform Lagrange interpolation and find the constant term
function lagrangeInterpolation(xValues, yValues, n) {
    let constantTerm = 0;

    for (let i = 0; i < n; i++) {
        let term = yValues[i];
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term *= -xValues[j];
                term /= (xValues[i] - xValues[j]);
            }
        }
        constantTerm += term;
    }

    return constantTerm;
}

// Function to identify imposter points
function findImposterPoints(xValues, yValues, k) {
    const n = xValues.length;
    let imposterPoints = [];

    for (let i = 0; i < n; i++) {
        let valid = true;
        let y = yValues[i];
        for (let j = 0; j < k; j++) {
            if (i !== j && (y % xValues[j]) !== 0) {
                valid = false;
                break;
            }
        }
        if (!valid) {
            imposterPoints.push({ x: xValues[i], y: yValues[i] });
        }
    }

    return imposterPoints;
}

// Main function
function main() {
    const filePath1 = "C:\Users\91939\OneDrive\Desktop\Catalog Placements Assignment\input1.json";
    const filePath2 = "C:\Users\91939\OneDrive\Desktop\Catalog Placements Assignment\input2.json";

    const input1 = readInput(filePath1);
    const input2 = readInput(filePath2);

    // Process first input
    const { xValues: xValues1, yValues: yValues1, n: n1 } = decodeYValues(input1);
    const constantTerm1 = lagrangeInterpolation(xValues1, yValues1, n1);
    console.log(`The constant term for input1 is: ${constantTerm1}`);

    // Process second input
    const { xValues: xValues2, yValues: yValues2, n: n2 } = decodeYValues(input2);
    const constantTerm2 = lagrangeInterpolation(xValues2, yValues2, n2);
    console.log(`The constant term for input2 is: ${constantTerm2}`);

    // Identify imposter points in second input
    const imposterPoints = findImposterPoints(xValues2, yValues2, input2.keys.k);
    console.log(`Imposter points in input2 are: ${JSON.stringify(imposterPoints)}`);
}

main();
