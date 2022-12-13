// (10> 9)

// (function(){console.log('test');})();
// (() => console.log('test'))();
// ((str) => console.log(str))('sample content');


// ;(function(){console.log('test');})();
// ;(function(){console.log('test');})();

for (var index = 0; index < 3; index++) {
    (index => {
        setTimeout(function () {
            console.log(`Index : ${index}`);
        }, 3000);
    })(index)
}

