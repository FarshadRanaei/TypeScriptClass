import "reflect-metadata";

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
  };

  return descriptor;
};

const error = (target: Object, key: string, descriptor: PropertyDescriptor) => {
  const original = descriptor.value;
  descriptor.value = (...args: any[]) => {
    console.log(`function ${key} starting ...`, args);
    try {
      return original.apply(this, args);
    } catch (error) {
      throw new Error(`Special error message: ${error.message}`);
    }
  };
  return descriptor;
};

const requiredMetadataKey = Symbol("required");
function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  let existingRequiredParameters: number[] =
    Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    requiredMetadataKey,
    existingRequiredParameters,
    target,
    propertyKey
  );
}

type Validator = (x: any) => boolean;

// save the marks
const validateMap: Record<string, Validator[]> = {};

// 1. mark the parameters need to be validated
function typedDecoratorFactory(validator: Validator): ParameterDecorator {
  return (_, key, index) => {
    const target = validateMap[key as string] ?? [];
    target[index] = validator;
    validateMap[key as string] = target;
  };
}

function validate(_: Object, key: string, descriptor: PropertyDescriptor) {
  const originalFn = descriptor.value;
  descriptor.value = function (...args: any[]) {
    // 2. run the validators
    const validatorList = validateMap[key];
    if (validatorList) {
      args.forEach((arg, index) => {
        const validator = validatorList[index];

        if (!validator) return;

        const result = validator(arg);

        if (!result) {
          throw new Error(
            `Failed for parameter: ${arg} of the index: ${index}`
          );
        }
      });
    }

    // 3. run the original method
    return originalFn.call(this, ...args);
  };
}

const isInt = typedDecoratorFactory((x) => Number.isInteger(x));
const isString = typedDecoratorFactory((x) => typeof x === "string");

class User {
  constructor(public userName: string, public email: string) {}
}

class UserService {
  data: string = "Sample Data";

  // @log
  // @error
  // @cache1(cacheStorage)
  // @cache2
  @validate
  findByEmail(@isString email): User {
    //? Validation (Required, Email, ..., Custom)
    return new User("User1", email);
    // return new User(this.data, email);
  }
  //   @log
  //   @error
  //   findByEmail(email: string): User {
  //     if (email === "test@domain.com") {
  //       throw new Error("email not valid");
  //     }
  //     ? Validation (Required, Email, ..., Custom)
  //     return new User("User1", email);
  //     return new User(this.data, email);
  //   }

  @log
  findByUserName(userName: string): User {
    return new User(userName, "test@domain.com");
  }
}

let service = new UserService();

let r1 = service.findByEmail(10 as any);
console.log(r1);
// let r2 = service.findByEmail("test@domain.com");
// console.log(r2);
