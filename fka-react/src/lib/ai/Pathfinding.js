import PriorityQueue from "./../util/PriorityQueue";

export function heuristic(a, b) {
    const [ x1, y1 ] = a;
    const [ x2, y2 ] = b;

    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const _key = ([ x, y ]) => `${ x }.${ y }`;

//TODO  This has actually not been converted from Python yet, and as such, will break
export default function a_star_search(graph, start = [], goal = []) {
    const frontier = PriorityQueue((a, b) => a[ 1 ] > b [ 1 ]);
    frontier.push([ start, 0 ]);

    let came_from = {};
    let cost_so_far = {};

    came_from[ _key(start) ] = [];
    cost_so_far[ _key(start) ] = 0;

    while (!frontier.isEmpty) {
        current = frontier.pop();

        if (current == goal) {
            break;
        }

        for (let next in graph.neighbors(current)) {
            new_cost = cost_so_far[ _key(current) ] + graph.cost(current, next)

            if (!(next in cost_so_far) || (new_cost < cost_so_far[ _key(next) ])) {
                cost_so_far[ _key(next) ] = new_cost;
                priority = new_cost + heuristic(goal, next);

                frontier.push([ next, priority ]);

                came_from[ _key(next) ] = current;
            }
        }
    }

    return [ came_from, cost_so_far ];
};