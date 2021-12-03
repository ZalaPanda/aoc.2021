const fs = require('fs');

const day1 = () => {
    const raw = fs.readFileSync('input1.txt', { encoding: 'utf-8' }).split('\n').map(Number);
    console.log(raw.reduce(({ prev = NaN, inc = 0 }, curr) => ({ prev: curr, inc: inc + (curr && prev && prev < curr ? 1 : 0) }), {}));
    console.log(raw.map((curr, index, arr) => curr + arr[index + 1] + arr[index + 2]).reduce(({ prev = NaN, inc = 0 }, curr) => ({ prev: curr, inc: inc + (curr && prev && prev < curr ? 1 : 0) }), {}));
}
// day1();

const day2 = () => {
    const raw = fs.readFileSync('input2.txt', { encoding: 'utf-8' }).split('\n').map(text => text.split(' ').map((value, index) => index ? Number(value) : value));
    console.log(raw.reduce(([x, y], [command, value]) => {
        switch (command) {
            case 'forward': return [x + value, y];
            case 'up': return [x, y - value];
            case 'down': return [x, y + value];
            default: return [x, y]
        }
    }, [0, 0]).reduce((x, y) => x * y));
    console.log(raw.reduce(([x, y, aim], [command, value]) => {
        switch (command) {
            case 'forward': return [x + value, y + aim * value, aim];
            case 'up': return [x, y, aim - value];
            case 'down': return [x, y, aim + value];
            default: return [x, y, aim]
        }
    }, [0, 0, 0]).reduce((x, y, index) => index === 1 ? x * y : x));
}
// day2();

const day3 = () => {
    const raw = fs.readFileSync('input3.txt', { encoding: 'utf-8' }).split('\n').map(text => [...text].map(Number)).filter(bits => bits.length);
    console.log(raw
        .reduce((sums, bits) => sums.map((value, index) => value + (bits[index] ?? 0))) // [527, 483, 519, 516, 511, 510, 490, 479, 505, 511, 517, 484]
        .map(sum => raw.length / 2 > sum) // [false, true, false, false, false, false, true, true, false, false, false, true]
        .reduce(([binary1, binary2], high) => [binary1.concat(high ? 1 : 0), binary2.concat(high ? 0 : 1)], ['', '']) // ['010000110001', '101111001110']
        .map(binary => parseInt(binary, 2)) // [1073, 3022]
        .reduce((number1, number2) => number1 * number2)
    );
    console.log([...Array(raw[0].length)]
        .map((_, index) => index) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        .reduce(([raw1, raw2], index) => {
            const sum1 = raw1.reduce((sum, bits) => sum + bits[index], 0);
            const sum2 = raw2.reduce((sum, bits) => sum + bits[index], 0);
            const bit1 = sum1 < raw1.length / 2 ? 0 : 1; // "If 0 and 1 are equally common, keep values with a 1 in the position being considered."
            const bit2 = sum2 < raw2.length / 2 ? 1 : 0; // "If 0 and 1 are equally common, keep values with a 0 in the position being considered."
            return [
                raw1.length > 1 ? raw1.filter(bits => bits[index] === bit1) : raw1,
                raw2.length > 1 ? raw2.filter(bits => bits[index] === bit2) : raw2
            ];
        }, [raw, raw]) // [[[1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0]], [[0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0]]]
        .map(bits => bits[0].join('')) // ['101110111100', '011101110010']
        .map(binary => parseInt(binary, 2)) // [3004, 1906]
        .reduce((number1, number2) => number1 * number2)
    );
}
day3();