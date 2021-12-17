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
// day5();

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
day17();
