const fs = require('fs');
const { type } = require('os');

/** Sonar Sweep */
const day1 = () => {
    const raw = fs.readFileSync('input1.txt', { encoding: 'utf-8' }).split('\n').map(Number);
    console.log(raw.reduce(({ prev, inc }, curr) => ({ prev: curr, inc: inc + (curr && prev && prev < curr ? 1 : 0) }), { prev: NaN, inc: 0 }));
    console.log(raw.map((curr, index, arr) => curr + arr[index + 1] + arr[index + 2]).reduce(({ prev, inc }, curr) => ({ prev: curr, inc: inc + (curr && prev && prev < curr ? 1 : 0) }), { prev: NaN, inc: 0 }));
};
// day1();

/** Dive! */
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

/** Binary Diagnostic */
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

/** Giant Squid */
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

/** Hydrothermal Venture */
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
// day5();

/** Lanternfish */
const day6 = () => {
    const raw = fs.readFileSync('input6.txt', { encoding: 'utf-8' }).trim().split(',').map(Number);
    console.log([...Array(80)]
        .reduce((raw) => {
            // console.log(raw);
            const born = raw.filter(age => !age).map(age => 8);
            return [...raw.map(age => age ? age - 1 : 6), ...born];
        }, raw) // [6, 0, 6, 4, ...]
        .length);
    const ages = [...Array(9)].map((_, index) => raw.filter(age => age === index).length); // [0, 205, 19, 27, 26, 23, 0, 0, 0]
    console.log([...Array(256)]
        .reduce(([born, ...ages]) => {
            ages[6] += born;
            ages[8] = born;
            return ages;
        }, ages) // [144736007595, 181435600984, 185574699634, 199674488787, 237842569956, 222918744459, 292760381752, 118624554229, 159768944646]
        .reduce((sum, age) => sum + age));
};
// day6();

/** The Treachery of Whales */
const day7 = () => {
    const raw = fs.readFileSync('input7.txt', { encoding: 'utf-8' }).trim().split(',').map(Number);
    console.log([...Array(Math.max(...raw) - Math.min(...raw))] // brute force (maybe could use median? but who cares)
        .map((_, index) => index + Math.min(...raw))
        .map(base => raw.reduce((distance, position) => distance + Math.abs(position - base), 0))
        .reduce((min, cost) => Math.min(min, cost)));
    const { cost } = [...Array(Math.max(...raw) + 1)] // cost[distance] = fuel
        .map((_, index) => index) // [0, 1, 2, 3, 4, ...]
        .reduce(({ cost, fuel }, distance) => ({ fuel: fuel + distance, cost: [...cost, fuel + distance] }), { fuel: 0, cost: [] }); // [0, 1, 3, 6, 10, ...]
    console.log([...Array(Math.max(...raw) - Math.min(...raw))]
        .map((_, index) => index + Math.min(...raw))
        .map(base => raw.reduce((distance, position) => distance + cost[Math.abs(position - base)], 0))
        .reduce((min, cost) => Math.min(min, cost))
    );
};
// day7();

/** Seven Segment Search */
const day8 = () => {
    const raw = fs.readFileSync('input8.txt', { encoding: 'utf-8' }).split('\n').filter(line => line)
        .map(line => line.split(' | ') // ['acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab', 'cdfeb fcadb cdfeb cdbaf']
            .map(bits => bits.split(' '))); // [['acedgfb', 'cdfbe', ..., 'ab', 'cdfeb'], ['fcadb', 'cdfeb', 'cdbaf']]
    const lengths = [2, 4, 3, 7]; // '1' = 2 | '4' = 4 | '7' = 3 | '8' = 7
    console.log(raw.reduce((count, [_, outputs]) => count + outputs.filter(output => lengths.includes(output.length)).length, 0));

    const generate = (bits, variation = '') => bits.length ? [...bits].map(bit => generate(bits.replace(bit, ''), variation.concat(bit))).flat() : variation;
    const convert = (bits, variation) => [...bits].map(bit => variation['abcdefg'.indexOf(bit)]).join('');
    const same = (a, b) => a.length === b.length && [...a].every(bit => b.includes(bit)); // alternative: [...a].sort().join('') === [...b].sort().join('')
    const samples = ['cagedb', 'ab', 'gcdfa', 'fbcad', 'eafb', 'cdfbe', 'cdfgeb', 'dab', 'acedgfb', 'cefabd']; // 'cagedb' = 0, 'ab' = 1, ..., 'cefabd' = 9
    const rainbow = generate('abcdefg'); // ['abcdefg', 'abcdegf', 'abcdfeg', ...]
    console.log(raw
        .map(([inputs, outputs]) => {
            for (const variation of rainbow) {
                const match = inputs // ['bgeacd', 'dbfag', ...]
                    .map(input => convert(input, variation)) // ['adefbc', 'cagfd', ...]
                    .every(input => samples.some(sample => same(sample, input)));
                if (!match) continue;
                // console.log(variation); // 'fabcegd'
                return outputs // ['gcdfbe', 'cbea', 'bc', 'gbc']
                    .map(output => convert(output, variation)) // ['dbcgae', 'baef', 'ab', 'dab']
                    .map(output => samples.findIndex(sample => same(sample, output))) // [0, 4, 1, 7]
                    .reduce((number, output) => number * 10 + output, 0); // 417
            }
            return NaN;
        }) // [417, 4099, 751, 3437, ...]
        .reduce((sum, number) => sum + number) // 936117
    );

    console.log(raw // brute force < logic
        .map(([inputs, outputs]) => {
            const presence = inputs.reduce((presence, input) => {
                [...input].map(bit => presence[bit] = (presence[bit] || 0) + 1);
                return presence;
            }, {});
            // console.log(presence);
            const one = inputs.find(input => input.length === 2);
            const four = inputs.find(input => input.length === 4);
            const cipher = Object.entries(presence).reduce((cipher, [bit, count]) => {
                if (count === 4) return { ...cipher, [bit]: parseInt('0000100', 2) }; // "e"
                if (count === 6) return { ...cipher, [bit]: parseInt('0100000', 2) }; // "b"
                if (count === 7 && four.includes(bit)) return { ...cipher, [bit]: parseInt('0001000', 2) }; // "d"
                if (count === 7 && !four.includes(bit)) return { ...cipher, [bit]: parseInt('0000001', 2) }; // "g"
                if (count === 8 && one.includes(bit)) return { ...cipher, [bit]: parseInt('0010000', 2) }; // "c"
                if (count === 8 && !one.includes(bit)) return { ...cipher, [bit]: parseInt('1000000', 2) }; // "a"
                if (count === 9) return { ...cipher, [bit]: parseInt('0000010', 2) }; // "f"
            }, {});
            const numbers = ['1110111', '0010010', '1011101', '1011011', '0111010', '1101011', '1101111', '1010010', '1111111', '1111011'].map(bin => parseInt(bin, 2)); // number segments binary encoded: "abcdefg"
            // console.log(cipher, numbers);
            return outputs
                .map(output => [...output].reduce((number, bit) => number + cipher[bit], 0))
                .map(output => numbers.findIndex(number => number === output))
                .reduce((number, output) => number * 10 + output, 0);
        })
        .reduce((sum, number) => sum + number) // 936117
    );
};
// day8();

/** Smoke Basin */
const day9 = () => {
    const raw = fs.readFileSync('input9.txt', { encoding: 'utf-8' });
    const cols = raw.match(/\n/).index, rows = raw.match(/\n/g).length;
    const heights = [...raw.replace(/\n/g, '')].map(Number);
    const neighbours = (index) => [
        index > cols - 1 && index - cols, // up
        index + cols < cols * rows && index + cols, // down
        index % cols > 0 && index - 1, // left
        index % cols < cols - 1 && index + 1 // right
    ].filter(index => index !== false);
    console.log(heights
        .filter((height, index) => neighbours(index).every(neighbour => heights[neighbour] > height)) // filter low heights
        .map(height => height + 1) // calculate risk
        .reduce((sum, risk) => sum + risk) // sum of the risk
    );

    const basinsize = (index) => {
        const basin = [];
        const expand = (index) => {
            if (basin.includes(index)) return;
            basin.push(index); // hate to mutate an array but can't find out a better solution
            neighbours(index).filter(index => heights[index] < 9).map(expand);
        };
        expand(index);
        return basin.length;
    };
    console.log(heights
        .map((height, index) => neighbours(index).every(neighbour => heights[neighbour] > height) ? basinsize(index) : 0)
        .sort((a, b) => b - a) // [95, 94, 92, 89, ...]
        .filter((_, index) => index < Math.floor(Math.PI)) // ...waited for this soooo long
        .reduce((sum, size) => sum * size) // 821560
    );
};
// day9();

/** Syntax Scoring */
const day10 = () => {
    const raw = fs.readFileSync('input10.txt', { encoding: 'utf-8' }).split('\n').filter(line => line);
    const points = {
        invalid: { ')': 3, ']': 57, '}': 1197, '>': 25137 },
        incomplete: { ')': 1, ']': 2, '}': 3, '>': 4 }
    };
    const pairs = { '(': ')', '[': ']', '{': '}', '<': '>' };
    console.log(raw
        .map(line => {
            const stack = []; // this could be a reduce too
            return [...line].find(char => {
                if ('([{<'.includes(char)) return stack.push(char) && false;
                if (char === pairs[stack.pop()]) return false;
                return true;
            });
            // no mutation version:
            // return [...line].reduce(({ stack, invalid }, char) => {
            //     if (invalid) return { stack, invalid };
            //     if ('([{<'.includes(char)) return { stack: [...stack, char], invalid };
            //     if (char === pairs[stack.pop()]) return { stack: [...stack], invalid };
            //     return { stack, invalid: char };
            // }, { stack: [], invalid: null }).invalid
        }) // [undefined, '>', '>', ...]
        .map(char => points.invalid[char] || 0) // [0, 25137, 25137, ...]
        .reduce((sum, point) => sum + point) // 341823
    );
    console.log(raw
        .map(line => {
            const stack = [];
            return [...line].find(char => {
                if ('([{<'.includes(char)) return stack.push(char) && false;
                if (char === pairs[stack.pop()]) return false;
                return true;
            }) ? undefined : stack.reverse().map(char => pairs[char]);
        }) // [['}', '}', '>', '>', '}', '>', ']', '}', '}', ']', ')', ']', '}', '}'], undefined, undefined, ...]
        .filter(chars => chars)
        .map(chars => chars.reduce((sum, char) => sum * 5 + points.incomplete[char], 0)) // [4636542068, 7693351448, 22952738, ...]
        .sort((a, b) => a - b)
        .reduce((middle, point, index, points) => Math.floor(points.length / 2) === index ? point : middle, NaN)
    );
};
// day10();

/** Dumbo Octopus */
const day11 = () => {
    const raw = fs.readFileSync('input11.txt', { encoding: 'utf-8' }).trim()
        .split('\n').map((line, y) =>
            [...line].map((char, x) => ({ x, y, energy: Number(char) }))).flat();
    const ajdust = (octopuses) => octopuses.map(({ x, y, energy }) => ({ x, y, energy: energy + 1 }));
    const flash = (octopuses, flashes = 0) => {
        const octopus = octopuses.find(({ energy }) => energy > 9); // first octopus with high energy level
        if (!octopus) return [octopuses, flashes]; // calculation complete
        return flash(octopuses.map(({ x, y, energy }) =>
            energy && Math.abs(octopus.x - x) < 2 && Math.abs(octopus.y - y) < 2 ?
                { x, y, energy: octopus.x === x && octopus.y === y ? 0 : energy + 1 } : { x, y, energy }), flashes + 1);
    };
    console.log([...Array(100)].reduce(([octopuses, flashes]) => flash(ajdust(octopuses), flashes), [raw, 0])[1]);

    const syncstep = (octopuses, flashes = 0, step = 0) => {
        if (flashes === octopuses.length) return step; // octopuses synchronizing
        return syncstep(...flash(ajdust(octopuses)), step + 1);
    }
    console.log(syncstep(raw));
};
// day11();

/** Passage Pathing */
const day12 = () => {
    const raw = fs.readFileSync('input12.txt', { encoding: 'utf-8' }).trim().split('\n')
        .reduce((graph, row) => {
            const [_, from, to] = /(\w+)-(\w+)/.exec(row);
            return { ...graph, [from]: [...graph[from] || [], to], [to]: [...graph[to] || [], from] };
        }, {});
    const explore = (routes = (_from, _path) => [], path = ['start']) => {
        const from = path.at(-1); // supported from Node.js 16.6.0
        if (from === 'end') return path.join();
        if (!raw[from]) return undefined; // dead end
        return routes(from, path) // get possible routes from current location
            .map(to => explore(routes, [...path, to])) // explore every option
            .filter(path => path) // remove failed missions
            .flat();
    };

    const routes1 = (from, path) => raw[from].filter(to =>
        to === to.toUpperCase() || // big cave
        !path.includes(to) // not visited
    );
    console.log(explore(routes1).length);

    const routes2 = (from, path) => raw[from].filter(to =>
        to !== 'start' && (
            to === to.toUpperCase() || // big cave
            !path.includes(to) || // not visited
            path.filter(from => from === from.toLowerCase()) // filter small caves
                .every((from, index, path) => !path.slice(index + 1).includes(from)) // not visited twice
        ));
    console.log(explore(routes2).length);
};
// day12();

/** Transparent Origami */
const day13 = () => {
    const [dots, instructions] = fs.readFileSync('input13.txt', { encoding: 'utf-8' }).split('\n')
        .reduce(([dots, instructions], row) => {
            const [, x, y] = /^(\d+),(\d+)$/.exec(row) ?? [];
            const [, axis, value] = /^fold along (x|y)=(\d+)$/.exec(row) ?? [];
            if (x && y) return [[...dots, { x: Number(x), y: Number(y) }], instructions];
            if (axis && value) return [dots, [...instructions, { [axis]: Number(value) }]];
            return [dots, instructions];
        }, [[], []]);

    const fold = (dots, instruction) => dots.map(({ x, y }) => ({
        x: x > instruction.x ? instruction.x - (x - instruction.x) : x,
        y: y > instruction.y ? instruction.y - (y - instruction.y) : y
    })).filter(({ x, y }, index, dots) => !dots.slice(index + 1).some(dot => dot.x === x && dot.y === y));
    console.log(fold(dots, instructions[0]).length);

    const display = (dots) => {
        const { x, y } = dots.reduce(({ x, y }, dot) => ({ x: Math.max(x, dot.x), y: Math.max(y, dot.y) }));
        return dots.reduce((lines, { x, y }) =>
            lines.map((line, iy) => line.map((dot, ix) => dot || x === ix && y === iy)),
            Array(y + 1).fill(Array(x + 1).fill(false)))
            .map(line => line.map(dot => dot ? '#' : '.').join(''))
            .join('\n');
    };
    console.log(display(instructions.reduce((dots, instruction) => fold(dots, instruction), dots))); // wow!
};
// day13();

/** Extended Polymerization */
const day14 = () => {
    /*
    const [template, pairs] = fs.readFileSync('input14.txt', { encoding: 'utf-8' }).split('\n')
        .reduce(([template, pairs], row) => {
            const [, init] = /^(\w+)$/.exec(row) ?? [];
            const [, ab, c] = /^(\w{2}) -> (\w)$/.exec(row) ?? [];
            return [init || template, ab && c && { ...pairs, [ab]: c } || pairs];
        }, [null, {}]);
    const polymerize = (template, pairs, step) => step ? polymerize([...template].reduce((template, b) => {
        const ab = template.at(-1).concat(b);
        return pairs[ab] ? template.concat(pairs[ab], b) : template.concat(b);
    }), pairs, step - 1) : template;
    const result = (template) => {
        const elements = [...template].reduce((elements, element) => ({ ...elements, [element]: (elements[element] || 0) + 1 }), {});
        const [min, max] = Object.values(elements).reduce(([min, max], count) => ([Math.min(min, count), Math.max(max, count)]), [template.length, 0]);
        return max - min;
    };
    console.log(result(polymerize(template, pairs, 10)));
    */
    const [template, rules] = fs.readFileSync('input14.txt', { encoding: 'utf-8' }).split('\n')
        .reduce(([template, rules], row) => {
            const [, init] = /^(\w+)$/.exec(row) ?? [];
            const [, a, c, b] = /^(\w)(\w) -> (\w)$/.exec(row) ?? []; // `ac` => `ab` + `bc`
            const analize = (init) => ({
                elements: [...init].reduce((elements, element) => {
                    const count = elements[element] ?? 0;
                    return { ...elements, [element]: count + 1 };
                }, {}),
                pairs: [...init].reduce((pairs, _, index) => {
                    const pair = init.slice(index, index + 2);
                    return pair.length === 2 ? { ...pairs, [pair]: (pairs[pair] ?? 0) + 1 } : pairs;
                }, {})
            });
            return [
                init && analize(init) || template, // { elements: { V: 4, P: 3, H: 1, ...}, pairs: { VP: 1, PP: 1, PH: 1, ...} }
                a && b && c && { ...rules, [`${a}${c}`]: b } || rules // { CO: 'B', CV: 'N', HV: 'H', ...}
            ];
        }, [{}, {}]);
    const polymerize = ({ elements, pairs }, rules, step) => {
        if (!step) {
            const [min, max] = Object.values(elements).reduce(([min, max], count) => ([
                Math.min(min, count),
                Math.max(max, count)
            ]), [Infinity, 0]);
            return max - min;
        }
        const template = Object.entries(pairs).reduce(({ elements, pairs }, [pair, count]) => {
            const [a, c] = [...pair];
            const b = rules[`${a}${c}`];
            if (!b) return { elements, pairs }; // no rule for the pair
            return {
                elements: { ...elements, [b]: (elements[b] ?? 0) + count }, // increase `b` count
                pairs: { ...pairs, [`${a}${b}`]: (pairs[`${a}${b}`] ?? 0) + count, [`${b}${c}`]: (pairs[`${b}${c}`] ?? 0) + count } // create `ab` and `bc` pairs from `ac`
            };
        }, { pairs: {}, elements });
        return polymerize(template, rules, step - 1);
    };
    console.log(polymerize(template, rules, 10));
    console.log(polymerize(template, rules, 40));
};
// day14();

/** Chiton */
const day15 = () => {
    const raw = fs.readFileSync('input15.txt', { encoding: 'utf-8' }).trim().split('\n').map(row => row.split('').map(Number));
    const route = (map) => {
        const width = map[0].length;
        const risks = map.flat();
        const costs = Array(risks.length).fill(Infinity);
        let index = 0; // *sigh* performance is super but the algorithm is a mess
        let reset = false;
        while (true) {
            const min = Math.min(
                index >= width ? costs[index - width] : Infinity, // up
                (index + 1) % width ? costs[index + 1] : Infinity, // right
                index < costs.length - width ? costs[index + width] : Infinity, // down
                index % width ? costs[index - 1] : Infinity // left
            );
            const cost = index ? min + risks[index] : 0;
            reset = reset || costs[index] !== cost;
            costs[index] = cost;
            index += 1;
            if (index < risks.length) continue;
            if (!reset) break;
            index = 0;
            reset = false;
        }
        return costs.at(-1);
    };
    console.log(route(raw));

    const expand = (times) =>
        [...Array(times)].map((_, y) => raw.map(row =>
            [...Array(times)].map((_, x) => row.map(risk =>
                (risk + x + y - 1) % 9 + 1 // 9->9 10->1 11->2
            )).flat())).flat();
    console.log(route(expand(5)));
};
// day15();

/** Packet Decoder */
const day16 = () => {
    const raw = fs.readFileSync('input16.txt', { encoding: 'utf-8' }).trim().split('').map(hex => parseInt(hex, 16).toString(2).padStart(4, '0')).join('');
    const packet = (start = 0) => {
        const literal = (start, previous = 0) => { // 1+4 bits
            const value = previous * 16 + parseInt(raw.slice(start + 1, start + 5), 2);
            if (raw.slice(start, start + 1) === '0') return [value, start + 5];
            return literal(start + 5, value)
        };
        const operator = (start) => {
            if (raw.slice(start, start + 1) === '0') { // 1+15 bits
                const lengthInBits = parseInt(raw.slice(start + 1, start + 16), 2);
                const packets = (start, length, values = []) => {
                    if (!length) return [values, start];
                    const [value, end] = packet(start);
                    return packets(end, length + start - end, [...values, value]);
                };
                return packets(start + 16, lengthInBits);
            } else { // 1+11 bits
                const numberOfSubPackets = parseInt(raw.slice(start + 1, start + 12), 2);
                const packets = (start, number, values = []) => {
                    if (!number) return [values, start];
                    const [value, end] = packet(start);
                    return packets(end, number - 1, [...values, value]);
                };
                return packets(start + 12, numberOfSubPackets);
            }
        };
        const version = parseInt(raw.slice(start, start + 3), 2); // 3 bits
        const type = parseInt(raw.slice(start + 3, start + 6), 2); // 3 bits
        const [value, end] = type === 4 ? literal(start + 6) : operator(start + 6);
        return [{ version, type, value }, end];
    };
    const summarize = ({ version, type, value }) => // add up the version numbers
        version + (type === 4 ? 0 : value.reduce((sum, packet) =>
            sum + summarize(packet), 0));
    console.log(summarize(packet()[0]));

    const evaluate = ({ type, value }) => { // evaluate the expression
        if (type === 0) return value.reduce((sum, packet) => sum + evaluate(packet), 0);
        if (type === 1) return value.reduce((product, packet) => product * evaluate(packet), 1);
        if (type === 2) return value.reduce((minimum, packet) => Math.min(minimum, evaluate(packet)), Infinity);
        if (type === 3) return value.reduce((maximum, packet) => Math.max(maximum, evaluate(packet)), -Infinity);
        if (type === 4) return value; // literal
        if (type === 5) return value.reduce((greater, than) => evaluate(greater) > evaluate(than) ? 1 : 0);
        if (type === 6) return value.reduce((less, than) => evaluate(less) < evaluate(than) ? 1 : 0);
        if (type === 7) return value.reduce((equal, to) => evaluate(equal) === evaluate(to) ? 1 : 0);
    };
    console.log(evaluate(packet()[0]));
};
// day16();

/** Trick Shot */
const day17 = () => {
    const [minx, maxx, miny, maxy] = fs.readFileSync('input17.txt', { encoding: 'utf-8' }).trim()
        .match(/x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/)
        .map(Number).filter(coordinate => coordinate);
    const height = (vy, max = 0) => vy > 0 ? height(vy - 1, max + vy) : max;
    const vertical = (vy, cy = 0, step = 0, steps = []) => {
        if (cy < miny) return steps;
        return vertical(
            vy - 1, // decrease velocity
            cy + vy, // increase current position
            step + 1, // increase step number
            cy >= miny && cy <= maxy ? [...steps, step] : steps);
    };
    const verticals = [...Array(1000)] // after 4 hours of sleep i am lazy AF (if `miny` is negative then max velocity is somewhere at `Math.abs(miny)`))
        .map((_, index) => index + miny)
        .reduce((verticals, vy) => {
            const steps = vertical(vy);
            return steps.length ? { ...verticals, [vy]: steps } : { ...verticals };
        }, {});
    console.log(height(Object.keys(verticals).map(Number).sort((a, b) => a - b).at(-1)));

    const maxstep = Math.max(...Object.values(verticals).flat());
    const horizontal = (vx, cx = 0, step = 0, steps = []) => {
        if (step > maxstep || cx > maxx) return steps;
        return horizontal(
            vx ? vx - 1 : vx, // decrease velocity until zero
            cx + vx, // increase current position
            step + 1, // increase step number
            cx >= minx && cx <= maxx ? [...steps, step] : steps);
    };
    const horizontals = [...Array(maxx)]
        .map((_, index) => index + 1)
        .reduce((horizontals, vx) => {
            const steps = horizontal(vx);
            return steps.length ? { ...horizontals, [vx]: steps } : { ...horizontals };
        }, {});
    const combinations = Object.keys(horizontals).reduce((combinations, vx) =>
        [...combinations, ...Object.keys(verticals)
            .filter(vy => verticals[vy].some(step => horizontals[vx].includes(step))) // shared step number
            .map(vy => `${vx},${vy}`)
        ], []); // ['15,0', '15,1', '15,2', ...]
    console.log(combinations.length);
};
// day17();

/** Snailfish */
const day18 = () => {
    const raw = fs.readFileSync('input18.txt', { encoding: 'utf-8' }).trim().split('\n').map(value => JSON.parse(value));
    const add = (values) => values.reduce((a, b) => reduce([a, b]));
    const magnitude = (value) => Array.isArray(value) ? 3 * magnitude(value[0]) + 2 * magnitude(value[1]) : value;
    const explodingPair = (value, path = []) => Array.isArray(value) ? ( // leftmost pair nested inside four pairs
        path.length === 4 ? { value, path } : value.reduce((result, value, index) => result || explodingPair(value, [...path, index]), null)) : null;
    const splittingNumber = (value, path = []) => Array.isArray(value) ? ( // leftmost regular number is 10 or greater
        value.reduce((result, value, index) => result || splittingNumber(value, [...path, index]), null)) : (value > 9 && { value, path });
    const numberPaths = (value, path = []) => Array.isArray(value) && // every regular number with value and path
        value.map((value, index) => numberPaths(value, [...path, index])).flat() ||
        { value, path };
    const equalPaths = (a, b) => a?.length === b?.length && a.every((value, index) => value === b[index]) || false;
    const changeValue = (value, changes = [], path = []) => {
        const change = changes.find(change => equalPaths(path, change.path));
        if (change) return change.value;
        return Array.isArray(value) ? value.map((value, index) => changeValue(value, changes, [...path, index])) : value;
    };
    const explode = (value, pair) => {
        // console.log(JSON.stringify(value), 'explode', JSON.stringify(pair.value));
        const siblings = numberPaths(value).reduce(({ left, right, previous }, current) => {
            if (!previous) return { previous: current }; // no need to check at the first number
            const match = {
                current: equalPaths(current.path.slice(0, -1), pair.path),
                previous: equalPaths(previous.path.slice(0, -1), pair.path)
            };
            return ({
                left: left || (match.current && !match.previous && ({ path: previous.path, value: previous.value + current.value })),
                right: right || (!match.current && match.previous && ({ path: current.path, value: previous.value + current.value })),
                previous: current
            })
        }, {});
        const changes = [
            { path: pair.path, value: 0 },
            { path: siblings.left?.path, value: siblings.left?.value },
            { path: siblings.right?.path, value: siblings.right?.value }
        ].filter(({ path }) => path);
        return changeValue(value, changes);
    };
    const split = (value, number) => {
        // console.log(JSON.stringify(value), 'split', JSON.stringify(number.value));
        const changes = [{ path: number.path, value: [Math.floor(number.value / 2), Math.ceil(number.value / 2)] }];
        return changeValue(value, changes);
    };
    const reduce = (value) => {
        const pair = explodingPair(value); // "If any pair is nested inside four pairs, the leftmost such pair explodes."
        if (pair) return reduce(explode(value, pair));
        const number = splittingNumber(value); // "If any regular number is 10 or greater, the **leftmost(!)** such regular number splits."
        if (number) return reduce(split(value, number));
        return value;
    };
    console.log(magnitude(add(raw)));

    console.log(raw.reduce((max, a) => Math.max(max, raw.reduce((max, b) => a === b ? max : Math.max(max, magnitude(add([a, b]))), 0)), 0)); // 6.7 sec
};
// day18();

/** Beacon Scanner */
const day19 = () => {
    const raw = fs.readFileSync('input19.txt', { encoding: 'utf-8' }).trim().split('\n\n')
        .map(scanner => scanner.split('\n')
            .map(coordinates => coordinates.match(/(-?\d+),(-?\d+),(-?\d+)/)?.slice(1).map(Number))
            .filter(coordinates => coordinates));

    const equal = ([x1, y1, z1], [x2, y2, z2]) => x1 === x2 && y1 === y2 && z1 === z2;
    const like = ([x1, y1, z1], [x2, y2, z2]) => [x1, y1, z1].every(n1 => [x2, y2, z2].some(n2 => Math.abs(n1) === Math.abs(n2)));
    const useless = ([x, y, z]) => !x || !y || !z || x === y || y === z || z === x;
    const add = ([x1, y1, z1], [x2, y2, z2]) => [x1 + x2, y1 + y2, z1 + z2];
    const sub = ([x1, y1, z1], [x2, y2, z2]) => [x1 - x2, y1 - y2, z1 - z2];
    const rotate = (coordinates, [[i1, s1], [i2, s2], [i3, s3]]) => [coordinates[i1] * s1, coordinates[i2] * s2, coordinates[i3] * s3];

    const connect = (absolute, scanner) => scanner.reduce((transformation, beacon) => {
        if (transformation) return transformation;
        const relativeVectors = scanner.filter(other => other !== beacon).map(other => sub(other, beacon)); // vectors: beacon->other beacons
        const { absoluteBeacon, absoluteVector } = absolute.reduce((match, absoluteBeacon) => {
            if (match) return match;
            const absoluteVectors = absolute.filter(other => other !== absoluteBeacon).map(other => sub(other, absoluteBeacon))
                .filter(absoluteVector => relativeVectors.some(relativeVector => like(relativeVector, absoluteVector))); // matching vectors
            if (absoluteVectors.length < 3) return match; // increase this limit if something is wrong
            const absoluteVector = absoluteVectors.find(vector => !useless(vector)); // can't use [0, x, y] or [10, -10, z]
            return { absoluteBeacon, absoluteVector };
        }, null) ?? {};
        if (!absoluteBeacon) return transformation;
        const relativeVector = relativeVectors.find(vector => like(vector, absoluteVector));
        const rotation = absoluteVector.map(n1 => {
            const index = relativeVector.findIndex(n2 => Math.abs(n1) === Math.abs(n2));
            const sign = Math.sign(relativeVector[index] * n1);
            return [index, sign];
        });
        const translation = sub(absoluteBeacon, rotate(beacon, rotation));
        return { rotation, translation };
    }, null);

    const resolve = ([absolute, scanner, ...scanners], translations = [[0, 0, 0]]) => {
        if (!scanner) return [absolute, translations];
        const transformation = connect(absolute, scanner);
        if (!transformation) return resolve([absolute, ...scanners, scanner], translations); // no connection between known and scanner beacons
        const resolved = scanner.map(beacon => add(rotate(beacon, transformation.rotation), transformation.translation))
            .filter(beacon => !absolute.some(other => equal(other, beacon))); // resolved beacon locations
        return resolve([[...absolute, ...resolved], ...scanners], [...translations, transformation.translation]);
    };

    const [beacons, scanners] = resolve(raw);
    console.log(beacons.length);

    const distance = ([x1, y1, z1], [x2, y2, z2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);
    const distances = scanners.map(scanner => scanners.filter(other => other !== scanner).map(other => distance(scanner, other))).flat();
    console.log(Math.max(...distances));
};
// day19();

/** Trench Map */
const day20 = () => {
    const { image, algorithm } = fs.readFileSync('input20.txt', { encoding: 'utf-8' }).trim().split('\n\n').reduce((algorithm, lines) => {
        const pixels = lines.split('\n').map(line => [...line].map(c => c === '#'));
        return {
            image: { pixels: pixels.flat(), width: pixels.at(0).length, background: false },
            algorithm: [...algorithm].map(c => c === '#')
        };
    });
    const expand = ({ pixels, width, background }) => ({ // TODO: improve performance
        pixels: [
            ...Array(width + 1).fill(background),
            ...pixels.reduce((output, pixel, index) => index % width ? [...output, pixel] : [...output, background, background, pixel], []),
            ...Array(width + 3).fill(background),
        ],
        width: width + 2,
        background // "Every pixel of the infinite output image needs to be calculated exactly based on the relevant pixels of the input image"
    });
    const enhance = ({ pixels, width, background }) => { // TODO: improve performance
        const indexes = (index) => index % width ? (index + 1) % width ?
            [index - width - 1, index - width, index - width + 1, index - 1, index, index + 1, index + width - 1, index + width, index + width + 1] : // middle
            [index - width - 1, index - width, null, index - 1, index, null, index + width - 1, index + width, null] : // rightmost
            [null, index - width, index - width + 1, null, index, index + 1, null, index + width, index + width + 1]; // leftmost
        return {
            pixels: pixels.reduce((output, _, index) => {
                const result = indexes(index).map(index => pixels[index] ?? background)
                    .reduce((number, pixel, index) => pixel ? number + Math.pow(2, 8 - index) : number, 0);
                return [...output, algorithm[result]];
            }, []),
            width,
            background: algorithm[background ? Math.pow(2, 9) - 1 : 0]
        };
    };
    const display = ({ pixels, width }) => pixels.reduce((output, pixel, index) =>
        output.concat(pixel ? '#' : '.', (index + 1) % width ? '' : '\n'), '');
    const process = (image, times) => times ? process(enhance(expand(image)), times - 1) : image;

    console.log(process(image, 2).pixels.reduce((lit, pixel) => lit + (pixel ? 1 : 0), 0));
    console.log(process(image, 50).pixels.reduce((lit, pixel) => lit + (pixel ? 1 : 0), 0));
};
// day20();

/** Dirac Dice */
const day21 = () => {
    const raw = fs.readFileSync('input21.txt', { encoding: 'utf-8' }).trim().split('\n').map(line => /Player \d starting position: (\d)/.exec(line)?.map(Number).at(1));
    const game = ([[currentSpace, score], player2], dice = 0) => {
        const nextSpace = (currentSpace - 1 + dice * 3 + 6) % 10 + 1;
        const player1 = [nextSpace, score + nextSpace];
        if (player1[1] >= 1000) return player2[1] * (dice + 3); // losing player score * dice rolls
        return game([player2, player1], dice + 3); // no need to reset dice
    };
    console.log(game(raw.map(position => [position, 0])));

    const variate = (variations, roll, results = [0]) => roll ? variate(variations, roll - 1, variations.flatMap(dice => results.map(result => result + dice))) : results;
    const rolls = Object.entries(
        variate([1, 2, 3], 3) // [3, 4, 5, 4, 5, 6, 5, 6, 7, 4, 5, 6, 5, 6, 7, 6, 7, 8, 5, 6, 7, 6, 7, 8, 7, 8, 9]
            .reduce((rolls, roll) => ({ ...rolls, [roll]: (rolls[roll] || 0) + 1 }), {})) // {3: 1, 4: 3, 5: 6, 6: 7, 7: 6, 8: 3, 9: 1}
        .map(([roll, count]) => [Number(roll), count]); // [[3,1],[4,3],[5,6],[6,7],[7,6],[8,3],[9,1]]
    const universes = (space) => {
        const success = Array(15).fill(0); // mutation :P
        const remains = Array(15).fill(0);
        const play = (space, score = 0, turn = 0, universes = 1) => {
            if (score >= 21) {
                success[turn] += universes; // number of universes where player wins in (n) own steps
            } else {
                remains[turn] += universes; // number of universes where player still plays in (n) own steps
                rolls.map(([roll, count]) => [(roll + space - 1) % 10 + 1, count]).map(([space, count]) => play(space, score + space, turn + 1, universes * count));
            }
        };
        play(space);
        return [success, remains];
    };
    console.log(raw.map(space => universes(space)).reduce(([success1, remains1], [success2, remains2]) => {
        // player1 wins: (n) player1 turns * (n-1) player2 turns
        const universes1 = [...Array(15)].reduce((universes, _, turn) => universes + success1[turn] * remains2[turn - 1] || 0, 0);
        // player2 wins: (n) player1 turns * (n) player2 turns
        const universes2 = [...Array(15)].reduce((universes, _, turn) => universes + success2[turn] * remains1[turn] || 0, 0);
        return Math.max(universes1, universes2); // 309196008717909 vs 227643103580178
    }));
};
// day21();

/** Reactor Reboot */
const day22 = () => {
    const raw = fs.readFileSync('input22.txt', { encoding: 'utf-8' }).trim().split('\n')
        .map(line => {
            const [, state, ...coordinates] = /(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/.exec(line) ?? [];
            return state ? [state === 'on' ? 1 : 0, coordinates.map(Number)] : null;
        });
    const check = (x, y, z) => raw.slice(0).reverse().find(([, [x1, x2, y1, y2, z1, z2]]) => x >= x1 && x <= x2 && y >= y1 && y <= y2 && z >= z1 && z <= z2)?.at(0);
    const n = [...Array(101)].map((_, index) => index - 50); // [-50..50]
    console.log(n.flatMap(x => n.flatMap(y => n.flatMap(z => check(x, y, z)))).filter(state => state).length); // brute force solution: 8 sec

    const union = ([x11, x12, y11, y12, z11, z12], [x21, x22, y21, y22, z21, z22]) => [
        Math.max(x11, x21), Math.min(x12, x22),
        Math.max(y11, y21), Math.min(y12, y22),
        Math.max(z11, z21), Math.min(z12, z22)];
    const size = ([x1, x2, y1, y2, z1, z2]) => [x2 - x1, y2 - y1, z2 - z1].reduce((size, n) => size * (n + 1), 1);
    const unions = (base, cubes) => cubes.reduce((unions, cube) => {
        const [x1, x2, y1, y2, z1, z2] = union(base, cube);
        return x1 <= x2 && y1 <= y2 && z1 <= z2 && [...unions, [x1, x2, y1, y2, z1, z2]] || unions;
    }, []);
    const unique = (cube, cubes) => unions(cube, cubes)
        .reduce((size, cube, index, unions) => size - unique(cube, unions.slice(0, index)), size(cube)); // wait... wuuut?

    console.log(raw.map((step, index, steps) => {
        const [state, base] = step;
        const cubes = steps.slice(index + 1).map(([, cube]) => cube);
        return [state, unique(base, cubes)]; // state and unique size of the cube (reduced by cubes above)
    }).reduce((sum, [state, size]) => sum + (state ? size : 0), 0)); // logical solution: 80 ms
};
// day22();

/** Amphipod */
const day23 = () => {
    const raw = fs.readFileSync('input23.txt', { encoding: 'utf-8' })
        .match(/[ABCD]/g)
        .map(([type]) => type); // ['C', 'A', 'B', 'D', 'B', 'A', 'D', 'C']

    const consumptions = { A: 1, B: 10, C: 100, D: 1000 };
    const entries = { A: 2, B: 4, C: 6, D: 8 };
    const simplify = (rooms) => Object.fromEntries(Object.entries(rooms).map(([room, amphipods]) => // remove already organized amphipods
        [room, amphipods.slice(0, amphipods.length - amphipods.slice().reverse().findIndex(amphipod => amphipod !== room) >>> 0)]));
    const organize = (rooms) => {
        const consumption = {
            basic: Object.entries(rooms).flatMap(([room, amphipods]) => amphipods.map((amphipod, position) => [room, position, amphipod]))
                .reduce(({ energy, amphipods }, [room, position, amphipod]) => ({
                    energy: energy + consumptions[amphipod] * (
                        Math.abs(entries[room] - entries[amphipod]) + // horizontal movement
                        position + 1 + amphipods[amphipod] + 1), // vertical movement (up+down)
                    amphipods: { ...amphipods, [amphipod]: amphipods[amphipod] + 1 }
                }), { energy: 0, amphipods: { A: 0, B: 0, C: 0, D: 0 } }).energy,
            extra: Infinity
        };
        const combine = (rooms, hall = Array(11).fill(null), extra = 0, steps = []) => {
            if (extra >= consumption.extra) return;
            const complete = Object.entries(rooms).reduce((fixed, [room, amphipods]) => ({ ...fixed, [room]: amphipods.every(type => type === room) }), {});
            if (Object.values(complete).every(room => room) && !hall.some(amphipod => amphipod)) { // job finished
                consumption.extra = extra;
                console.log(consumption.basic + extra, ':', steps.join(' '));
                return;
            }

            const situation = hall.reduce(({ inner: [lastInner, ...restInner], outer: [lastOuter, ...restOuter] }, amphipod, space) =>
                amphipod ?
                    { inner: [[], lastInner, ...restInner], outer: [[space], [...lastOuter, space], ...restOuter] } :
                    { inner: [[...lastInner, space], ...restInner], outer: [[...lastOuter, space], ...restOuter] },
                { inner: [[]], outer: [[]] });
            const access = Object.entries(entries).reduce(({ inner, outer }, [room, entry]) => ({
                inner: { ...inner, [room]: situation.inner.find(block => block.includes(entry)) },
                outer: { ...outer, [room]: situation.outer.find(block => block.includes(entry)) }
            }), { inner: {}, outer: {} });

            const inwards = hall
                .map((amphipod, space) => complete[amphipod] && access.outer[amphipod].includes(space) && { amphipod, space })
                .filter(inward => inward)
                .sort((a, b) => 'ABCD'.indexOf(b.amphipod) - 'ABCD'.indexOf(a.amphipod)); // order: amphipod type
            if (inwards.length) { // hall->room
                return inwards.map(({ amphipod, space }) => {
                    const room = rooms[amphipod];
                    combine(
                        { ...rooms, [amphipod]: [...room, amphipod] },
                        hall.map((current, index) => index === space ? null : current),
                        extra,
                        [...steps, `${amphipod}[${space}${amphipod}]`]);
                });
            }

            const removeRoomEntries = space => !Object.values(entries).includes(space); // [0, 1, 2, 3, ...] -> [0, 1, 3, ...]
            const outwards = Object.entries(rooms)
                .flatMap(([room, [amphipod]]) => amphipod && !complete[room] && access.inner[room].filter(removeRoomEntries).map(space => ({
                    amphipod, room, space,
                    distance: entries[room] < space && space < entries[amphipod] ||
                        entries[room] > space && space > entries[amphipod] ? 0 : // space between source and destination room
                        Math.min(Math.abs(entries[room] - space), Math.abs(entries[amphipod] - space))
                })))
                .filter(outward => outward)
                .sort((a, b) => 'ABCD'.indexOf(b.room) - 'ABCD'.indexOf(a.room) || a.distance - b.distance); // order: room type, least movement
            if (outwards.length) { // room->hall
                return outwards.map(({ amphipod, room, space, distance }) => {
                    combine(
                        { ...rooms, [room]: rooms[room].slice(1) },
                        hall.map((current, index) => index === space ? amphipod : current),
                        extra + consumptions[amphipod] * distance * 2,
                        [...steps, `${amphipod}[${room}${space}]`]
                    );
                });
            }
        }
        combine(rooms);
        return consumption.basic + consumption.extra;
    };

    console.log(organize(simplify({
        A: [raw[0], raw[4]],
        B: [raw[1], raw[5]],
        C: [raw[2], raw[6]],
        D: [raw[3], raw[7]]
    })));
    console.log(organize(simplify({
        A: [raw[0], 'D', 'D', raw[4]],
        B: [raw[1], 'C', 'B', raw[5]],
        C: [raw[2], 'B', 'A', raw[6]],
        D: [raw[3], 'A', 'C', raw[7]]
    }))); // a little bit slow but cant figure out how to reduce the combinations...
};
day23();
