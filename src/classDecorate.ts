type constructor = { new(...args: any[]): any };
function toJsonDecorator<T extends constructor>(base: T) {
    return class extends base {
        toJson(): string {
            return JSON.stringify(this);
        }
    }
}

function addServiceUrlDecorator<T extends constructor>(base: T) {
    return class extends base {
        serviceUrl: string = 'https://api.domain.com';
    }
}

@toJsonDecorator
class Person {
    firstName: string;
    lastName: string;

    // toJSON() {
    //     return JSON.stringify(this);
    // }
}

@addServiceUrlDecorator
class Config1 {
    c1: string;
    c2: string;
}
