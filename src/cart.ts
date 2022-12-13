interface BasketItem {
    itemCode: string;
    itemGroupId: number;
    count: number;
    price: number;
}

interface Basket {
    sessionId: number;
    basketItems: BasketItem[];
}

const basket: Basket = {
    sessionId: 1,
    basketItems: [
        { itemCode: 'A1', itemGroupId: 1, count: 10, price: 1 },
        { itemCode: 'A2', itemGroupId: 2, count: 5, price: 2 },
        { itemCode: 'A3', itemGroupId: 1, count: 3, price: 3 },
        { itemCode: 'A4', itemGroupId: 2, count: 8, price: 4 },]
}

const pipe1 = <T>(...fns: Function[]) => (value: T) =>
    fns.reduce((prevFunc, curFunc) => curFunc(prevFunc), value);


const filter = (groupId: number) => (cart: Basket) => cart.basketItems.filter(i => i.itemGroupId == groupId);
const filter2 = (groupId: number) => (cart: Basket) => Object.assign({...cart}, {basketItems: cart.basketItems.filter(i => i.itemGroupId == groupId)});

const filterByGroup1 = filter2(1);
const filterByGroup2 = filter2(2);

const calc = (cart: Basket) => cart.basketItems.reduce((a, b)=> a+ (b.count*b.price), 0);

const filterAndCalc1 = pipe1<Basket>(filter(3), calc);
const filterAndCalc2 = pipe1<Basket>(filterByGroup1, calc);

filterAndCalc1(basket);