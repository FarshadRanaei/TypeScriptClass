import "reflect-metadata";

//! AOP
//? Advice, Pointcut, Aspect

import { cache } from "webpack"

//* Decorator Types (Class, Property, Method, Parameter, Accessor)

function decoratorFactory(value: string): Function {
    console.log('Evaluate:', value)
    return function () {
        console.log('Decorate:', value)
    }
}

// @decoratorFactory('Class')
// class Service {

//     constructor(@decoratorFactory('Param1') private d1: string){}

//     @decoratorFactory('Static')
//     static execute() { console.log('Execute') }

//     @decoratorFactory('Method')
//     process() { console.log('Process'); }

//     @decoratorFactory('Property')
//     data: string;
// }

// type myNumber = Number;
// let i: myNumber = true;

// let json = JSON.stringify(new Person());

// let person = new Person();
// person.firstName = 'reza';
// person.lastName = 'bardal';

// let personProxy : any = person;

// console.log(personProxy.toJson());
// let c1 : any = new Config1();
// console.log(c1.serviceUrl);

const minLenght = (limit: number) => {
    //? 
    return (target: Object, key: string) => {

        //? Closure
        let value: string;

        const getValue = () => value;

        const setValue = (newVal: string) => {
            if (newVal.length < limit) {
                Object.defineProperty(target, "errors", {
                    value: `${key} minimum lenght is ${limit}`
                });

                throw new Error(`${key} minimum lenght is ${limit}`);
            }
            else {
                value = newVal;
            }
        }

        Object.defineProperty(target, key, {
            get: getValue,
            set: setValue
        });
    }
}

const titleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

type Observer = (prev: any, next: any) => void;

const observable = (target: Object, key: string) => {
    //? Naming Convention
    const eventName = `on${titleCase(key)}Change`;

    target[eventName] = function (observer: Observer) {
        let current = this[key];

        //? Base + Interceptor

        Reflect.defineProperty(this, key, {
            get: () => current,
            set: (value) => {
                observer(current, value);
                current = value;
            }
        });
    }
}

class Product {
    @observable
    @minLenght(5)
    // @email
    name: string;

    @observable
    price: number;

    //? onPriceChange
    //? onNameChange
}

let p1 = new Product();

let p1Proxy: any = p1;
//! p1.name.onPriceChange

p1Proxy.onPriceChange((prev: any, next: any) =>
    console.log(`prev: ${prev}, next: ${next}`));

p1Proxy.onNameChange((prev: any, next: any) =>
    console.log(`prev: ${prev}, next: ${next}`));

// try {
//     p1.name = "eehhhhh";
//     p1.price = 100;
//     p1.price = 200;
// } catch (error) {
//     console.log(p1Proxy.errors);
// }

//? Method Decorator
//? Logging, Error, Caching

const log = (target: Object, key: string, descriptor: PropertyDescriptor) => {
    // console.log(target);

    const original = descriptor.value;

    //? Proxy Method
    descriptor.value = (...args: any[]) => {
        //? Before Logic 
        console.log(`function ${key} starting ...`, args);
        //? Main Method

        //? console.log(this);  ---> Practice

        let result = original.apply(this, args);
        //! let result = original(args);
        //! let result = original.apply(target, args);

        //? After Logic
        console.log(`function ${key} completed ...`, result);

        return result;
    }

    return descriptor;
}

//? Practice
// const error = (target: Object, key: string, descriptor: PropertyDescriptor) => {
//     console.log(target);

//     const original = descriptor.value;

//     descriptor.value = (...args: any[]) => {

//         let result = original.apply(this, args);

//         return result;
//     }

//     return descriptor;
// }

//? Proxy -- Reflection -- Polyfil Version

//? const cache1 = (storage: Map<string, string>, partitionName: string) => {
const cache1 = (storage: Map<string, string>) => {
    return (target: Object, key: string, descriptor: PropertyDescriptor) => {

        const original = descriptor.value;

        descriptor.value = (...args: any[]) => {
            //? let itemKey = target["name"] + key + JSON.stringify(args);
            let itemKey = key + JSON.stringify(args);

            if (storage.has(itemKey)) {
                console.log("Load from cache!");

                return storage.get(itemKey);
            }

            console.log("Load from network");

            const newItem = original.apply(this, args);

            if (newItem) {
                storage.set(itemKey, newItem);
            }

            return newItem;
        }

        return descriptor;
    }

}

type CacheStorage = Map<string, string>;

const cache2 = (target: Object, key: string, descriptor: PropertyDescriptor) => {
    //? defineProperty

    const original = descriptor.value;

    let storage = Reflect.getOwnMetadata("cacheStorage", target, key) as CacheStorage ??
                                            new Map<string, string>();

    descriptor.value = (...args: any[]) => {
        let itemKey = key + JSON.stringify(args);

        if (storage.has(itemKey)) {
            console.log("Load from cache!");

            return storage.get(itemKey);
        }

        console.log("Load from network");

        const newItem = original.apply(this, args);

        if (newItem) {
            storage.set(itemKey, newItem);
        }

        return newItem;
    }

    //? AddOrUpdate
    Reflect.defineMetadata("cacheStorage", storage, target, key);

    return descriptor;
}


//? Cache Provider
const cacheStorage = new Map<string, string>();

class User {
    constructor(public userName: string, public email: string) { }
}

class UserService {
    data: string = "Sample Data";

    // @log
    // @error
    // @cache1(cacheStorage)
    // @cache2
    // findByEmail(@isMail @required email: string): User {
    //     //? Validation (Required, Email, ..., Custom)
    //     return new User("User1", email);
    //     // return new User(this.data, email);
    // }

    @cache2
    findByEmail(email: string): User {
        //? Validation (Required, Email, ..., Custom)
        return new User("User1", email);
        // return new User(this.data, email);
    }

    @log
    findByUserName(userName: string): User {
        return new User(userName, "test@domain.com");
    }
}

let service = new UserService();

let r1 = service.findByEmail("test@domain.com");
console.log(r1);
let r2 = service.findByEmail("test@domain.com");
console.log(r2);

// service.findByUserName("User1");