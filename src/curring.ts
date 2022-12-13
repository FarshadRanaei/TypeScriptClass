//? Partial Application

//? <div>content</div>

// const renderTagWithContent = function (tagName: string, content: string) {
//     return `<${tagName}>${content}</${tagName}>`;
// }

// let r1 = renderTagWithContent('div', 'sample content');

// console.log(r1);

const renderElement = function (tagName: string) {
    //? Pre Process

    return function (content: string) {
        //? 
        return `<${tagName}>${content}</${tagName}>`;
    }
}

let renderDiv = renderElement('div');

let divElm1 = renderDiv('sample content1 div');
let divElm2 = renderDiv('sample content2 div');

console.log(divElm1);
console.log(divElm2);