//re turn number like: 123-1234-1234
export function numberFormat(number, slice, sepatate) {
    var arr = [],
        temp = number.split('').reverse();
    temp.forEach(function (el, i) {
        (i + 1) % slice == 0 && i != 0 ? arr.push(el) && arr.push(sepatate) : arr.push(el)
    })
    return arr.reverse().join('');
}
