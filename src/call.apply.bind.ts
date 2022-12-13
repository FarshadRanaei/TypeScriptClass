//? call, apply, bind

let profile = { firstName: 'reza', lastName: 'bardal' };

function showProfile1() {
    return this.firstName + ' ' + this.lastName;
}

function showProfile2(start: string) {
    return start + ' ' + this.firstName + ' ' + this.lastName;
}

function showProfile3(start: string, end: string) {
    return start + ' ' + this.firstName + ' ' + this.lastName + ' ' + end;
}

//? Call
// console.log(showProfile1.call(profile));
// console.log(showProfile2.call(profile, 'Hi'));
// console.log(showProfile3.call(profile, 'Hi', 'Are you Ok?'));

//? apply
// console.log(showProfile1.apply(profile));
// console.log(showProfile2.apply(profile, ['Hi']));
// console.log(showProfile3.apply(profile, ['Hi', 'Are you Ok?']));

//? bind
console.log(showProfile1.bind(profile)());
// console.log(showProfile2.bind(profile, ['Hi'])());
let func = showProfile2.bind(profile);
console.log(func('Hi'));
// console.log(showProfile3.bind(profile, ['Hi', 'Are you Ok?'])());
console.log(showProfile3.bind(profile)('Hi', 'Are you Ok?'));