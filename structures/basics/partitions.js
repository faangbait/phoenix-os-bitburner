export const partition_array = (arr, cmp) => {
    let truthy = [];
    let falsy = [];
    for (const a of arr) {
        if (cmp(a)) {
            truthy.push(a);
        }
        else {
            falsy.push(a);
        }
    }
    return { truthy, falsy };
};
