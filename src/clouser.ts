const makeCounter = function(){
    let counter = 0;

    function changeBy(val: number) {
        counter += val;
    }

    function inc(){//Code Name
        changeBy(1);
    }

    function dec(){
        changeBy(-1);
    }

    function val(){
        return counter;
    }

    function reset(){
        counter = 0;
    }

    //? Module Pattern
    return {
        //? Service Name
        increment: inc,
        val,
        reset
    }
}

let counter1 = makeCounter();
let counter2 = makeCounter();
counter1.increment();
counter1.increment();
counter1.increment();
console.log(counter1.val());
console.log(counter2.val());