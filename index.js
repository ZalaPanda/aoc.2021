const fs = require('fs');

const day1 = () => {
    const raw = fs.readFileSync('input1.txt', { encoding: 'utf-8' }).split('\n').map(Number);
    console.log(raw.reduce(({ prev, inc }, curr) => ({ prev: curr, inc: inc + (curr && prev && prev < curr ? 1 : 0) }), { prev: NaN, inc: 0 }));
    console.log(raw.map((curr, index, arr) => curr + arr[index + 1] + arr[index + 2]).reduce(({ prev, inc }, curr) => ({ prev: curr, inc: inc + (curr && prev && prev < curr ? 1 : 0) }), { prev: NaN, inc: 0 }));
};
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
};
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
};
// day3();

const day4 = () => {
    const { numbers, boards } = fs.readFileSync('input4.txt', { encoding: 'utf-8' }).split('\n\n')
        .reduce(({ numbers, boards }, piece, index) => ({
            numbers: !index && piece.split(',').map(Number) || numbers,
            boards: index && [...boards, piece
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ')
                .trim().split(/\s/).map(Number)] || boards,
        }), { numbers: [], boards: [] });
    const size = [...Array(5)].map((_, index) => index); // [0, 1, 2, 3, 4]
    console.log(numbers.slice(0).reduce((boards, picked, _, numbers) => {
        const filtered = boards.map(board => board.map(number => number === picked ? NaN : number)); // zero number in bingo?!?
        const winner = filtered.find(board => // row or column complete
            size.find(row =>
                size.find(col => !isNaN(board[row * 5 + col])) === undefined) !== undefined || // row complete
            size.find(col =>
                size.find(row => !isNaN(board[row * 5 + col])) === undefined) !== undefined); // column complete
        if (winner) {
            numbers.splice(0); // break reduce (DONT DO THIS!) source: https://stackoverflow.com/a/47441371
            const sum = winner.reduce((sum, number) => sum + (number || 0), 0);
            console.log({ picked, sum, winner }); // {picked: 71, sum: 562, winner: [64, 65, 6, 86, 53, 10, 56, 2, 88, NaN, 11, NaN, NaN, 84, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 19, 14, 4]}
            return sum * picked;
        }
        return filtered;
    }, boards));
    console.log(numbers.slice(0).reduce((boards, picked, _, numbers) => {
        const filtered = boards.map(board => board.map(number => number === picked ? NaN : number));
        const survived = filtered.filter(board =>
            size.find(row =>
                size.find(col => !isNaN(board[row * 5 + col])) === undefined) === undefined && // rows NOT complete
            size.find(col =>
                size.find(row => !isNaN(board[row * 5 + col])) === undefined) === undefined); // columns NOT complete
        if (!survived.length) {
            const looser = filtered[0];
            numbers.splice(0);
            const sum = looser.reduce((sum, number) => sum + (number || 0), 0);
            console.log({ picked, sum, looser }); // {picked: 56, sum: 481, looser: [NaN, NaN, NaN, NaN, 32, NaN, NaN, 38, NaN, 45, 70, NaN, NaN, 86, NaN, NaN, NaN, NaN, 66, 60, NaN, NaN, 84, NaN, NaN]}
            return sum * picked;
        }
        return survived;
    }, boards));
};
// day4();

const day5 = () => {
    const raw = fs.readFileSync('input5.txt', { encoding: 'utf-8' }).split('\n')
        .filter(line => line).map(line => /(\d+),(\d+) -> (\d+),(\d+)/.exec(line))
        .map(([_, ...numbers]) => numbers.map(Number));
    console.log(Object.values(raw
        .reduce((map, [x1, y1, x2, y2]) => {
            if (x1 === x2 || y1 === y2)
                for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
                    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
                        map[`${x}x${y}`] = (map[`${x}x${y}`] || 0) + 1;
            return map;
        }, {}))
        .filter(heat => heat > 1)
        .length);
    console.log(Object.values(raw
        .reduce((map, [x1, y1, x2, y2]) => {
            const v1 = Math.sign(x2 - x1), v2 = Math.sign(y2 - y1); // vector
            const d1 = Math.abs(x2 - x1), d2 = Math.abs(y2 - y1); // distance
            [...Array(Math.max(d1, d2) + 1)].map((_, distance) => {
                const x = x1 + v1 * distance, y = y1 + v2 * distance;
                map[`${x}x${y}`] = (map[`${x}x${y}`] || 0) + 1;
            });
            return map;
        }, {}))
        .filter(heat => heat > 1)
        .length);
};
day5();