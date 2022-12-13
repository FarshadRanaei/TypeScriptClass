const mult2 = (n: number) => n * 2;
const add2 = (n: number) => n + 2;

let rma = mult2(add2(10));

// console.log(rma);

//? Right to Left
const myCompose = (fa: Function, fb: Function) =>
    (value: number) => fa(fb(value));

const mycMult2Add2 = myCompose(mult2, add2);

// console.log(mycMult2Add2(10));
//? Filter
//? Map
//? Reduce

let arr = [1, 2, 3, 4];

// let rx1 = arr.reduce((prev, cur)=> prev+cur, 1);
// console.log(rx1);

const compose = (...fns: Function[]) => (value: any) =>
    fns.reduceRight((prevFunc, curFunc) => curFunc(prevFunc), value);


let cMult2Add2 = compose(mult2, add2);

console.log(cMult2Add2(10));


interface Func {
    (value: number): number;
}
//? Left to Right
const pipe = (...fns: Function[]) => (value: any) =>
    fns.reduce((prevFunc, curFunc) => curFunc(prevFunc), value);


const pipeNumber = (...fns: Func[]) => (value: number) =>
    fns.reduce((prevFunc, curFunc) => curFunc(prevFunc), value);


let pMult2Add2 = pipe(mult2, add2);
let pnMult2Add2 = pipeNumber(mult2, add2);

// console.log(pMult2Add2(10));
// console.log(pnMult2Add2(10));


//? data = '1,2,3,4...'

const strToArr = (str: string) => str.split(',');
const strArrToNums = (arr: string[]) => arr.map(x => +x);
const sumArr = (arr: number[]) => arr.reduce((i, c) => i + c);

const strUtil1 = compose(sumArr, strArrToNums, strToArr);
const strUtil2 = pipe(strToArr, strArrToNums, sumArr);

console.log(strUtil1('1,2,3,4'));
console.log(strUtil2('1,2,3,4'));