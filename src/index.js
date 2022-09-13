import 'babel-polyfill';
import './index.html';
import './index.scss';

import "./img/icons/angle_right_icon.svg";
import "./img/icons/angle_double_right_icon.svg";
import "./img/icons/angle_left_icon.svg";
import "./img/icons/angle_double_left_icon.svg";
import "./img/icons/no-photo.png";
import "./img/TV.png";
import "./img/fridge.jpg";
import "./img/appartment.jpeg";
import "./img/car.jpg";
import "./img/dishwasher.jpg";
import "./img/bg.jpg";

class ArrangeBox {
    #nodes = {
        parentNode: null,
        productList1Node: null,
        productList2Node: null,

        buttonRightNode: null,
        buttonDoubleRightNode: null,
        buttonLeftNode: null,
        buttonDoubleLeftNode: null,

        search1Node: null,
        search2Node: null,

        buttonPrice1Node: null,
        buttonTitle1Node: null,
        buttonPrice2Node: null,
        buttonTitle2Node: null,

        buttonGenerateNode: null,
    };

    #allProducts = [];
    #generateResult = [];

    constructor(selectorContainer, products) {
        this.#nodes.parentNode = document.querySelector(selectorContainer);
        this.#allProducts = products;
        this.#generateResult = result;

        this.#createDefaultHtmlInNode(this.#nodes.parentNode);
        this.#createHtmlProductList1InNode(this.#nodes.productList1Node, this.#allProducts, this.#generateResult, this.#nodes.search1Node);
        this.#addEventListenerToButtons(this.#nodes);
        this.#searchProductItems(this.#nodes);
        this.#sortListButtons(this.#nodes);
    }

    #createDefaultHtmlInNode(parentNode) {
        parentNode.innerHTML = `
            <div class="arrangeBox__wrapper">
                <div class="arrangeBox__block">
                    <div class="arrangeBox__block-title">
                        <span>Список желаемых покупок</span>
                    </div>
                    <div class="arrangeBox__block-filter">
                        <form class="search">
                            <input type="text" class="search__input search_1" id="search-1">
                            <label for="search-1" class="search__label">Поиск</label>
                        </form>
                        <div class="arrangeBox__block-buttons">
                            <button class="button button-price_1">По цене</button>
                            <button class="button button-title_1">По имени</button>
                        </div>
                    </div>
                    <ul class="product-list product-list_1" id="product-list-1"></ul>
                </div>
                <div class="arrangeBox__buttons">
                    <button class="button button_right" disabled title="вправо">
                        <img src="img/icons/angle_right_icon.svg" alt="">
                    </button>
                    <button class="button button_double-right" disabled title="всё вправо">
                        <img src="img/icons/angle_double_right_icon.svg" alt="">
                    </button>
                    <button class="button button_left" disabled title="влево">
                        <img src="img/icons/angle_left_icon.svg" alt="">
                    </button>
                    <button class="button button_double-left" disabled title="всё влево">
                        <img src="img/icons/angle_double_left_icon.svg" alt="">
                    </button>
                </div>
                <div class="arrangeBox__block">
                    <div class="arrangeBox__block-title">
                        <span>Куплено</span>
                    </div>
                    <div class="arrangeBox__block-filter">
                        <form class="search">
                            <input type="text" class="search__input search_2" id="search-2">
                            <label for="search-2" class="search__label">Поиск</label>
                        </form>
                        <div class="arrangeBox__block-buttons">
                            <button class="button button-price_2">По цене</button>
                            <button class="button button-title_2">По имени</button>
                        </div>
                    </div>
                    <ul class="product-list product-list_2" id="product-list-2"></ul>
                </div>
            </div>
            <button class="button button_m0" id="button-generate">Сгенерировать другой список покупок</button>
        `;

        this.#nodes.productList1Node = parentNode.querySelector('.product-list_1');
        this.#nodes.productList2Node = parentNode.querySelector('.product-list_2');

        this.#nodes.buttonRightNode = parentNode.querySelector('.button_right');
        this.#nodes.buttonDoubleRightNode = parentNode.querySelector('.button_double-right');
        this.#nodes.buttonLeftNode = parentNode.querySelector('.button_left');
        this.#nodes.buttonDoubleLeftNode = parentNode.querySelector('.button_double-left');

        this.#nodes.search1Node = parentNode.querySelector('.search_1');
        this.#nodes.search2Node = parentNode.querySelector('.search_2');

        this.#nodes.buttonPrice1Node = parentNode.querySelector('.button-price_1');
        this.#nodes.buttonTitle1Node = parentNode.querySelector('.button-title_1');
        this.#nodes.buttonPrice2Node = parentNode.querySelector('.button-price_2');
        this.#nodes.buttonTitle2Node = parentNode.querySelector('.button-title_2');

        this.#nodes.buttonGenerateNode = document.querySelector('#button-generate');
        
    }

    #createHtmlProductList1InNode(productList1Node, products, result) {

         // Активный элемент

        const clickEventHandlerItem = (event) => {

            // логика добавления/удаления активного класса item'у в списке
            const onOffLogicClassActiveElement = () => {
                const clickNode = event.target.closest('.product-list__item');
                const currentProductObj = this.#getProductObjFromNode(clickNode);
                const lastActiveProductObj = this.#getProductActiveItemObj();
                
                if (currentProductObj.node instanceof Node) {
                    this.#offOnActiveItemNode(currentProductObj, false);
                }
    
                if (lastActiveProductObj === undefined) { // если прошлого активного элемента нет (самый первый клик)
                    this.#offOnActiveItemNode(currentProductObj, true);
                } else if (lastActiveProductObj.node !== currentProductObj.node) {
                    this.#offOnActiveItemNode(lastActiveProductObj, false);
                    this.#offOnActiveItemNode(currentProductObj, true);
                }

                buttonOnOffLogic(currentProductObj);
            };

            const buttonOnOffLogic = (productObj) => {
    
                if (productObj.list === 'left') { 
                    // если продукт находится в левом списке
                    const activeBtnBool = productObj.active;

                    this.#toggleButton(this.#nodes.buttonRightNode, activeBtnBool);

                    this.#toggleButton(this.#nodes.buttonLeftNode, false);
                    // нужно включить все кнопки
                }

                if (productObj.list === 'right') {
                    // если продукт находится в правом списке
                    const activeBtnBool = productObj.active;

                    this.#toggleButton(this.#nodes.buttonLeftNode, activeBtnBool);
                    this.#toggleButton(this.#nodes.buttonRightNode, false);

                }
            };

            onOffLogicClassActiveElement();
        };

        for (let i = 0; i < 5; i++) {
            products[i].list = 'left';
            
            const productItem = document.createElement('li');

            productItem.classList.add('product-list__item', 'search_left');
            productItem.setAttribute('data-id', i);
            productItem.innerHTML = `
                <div class="product-list__img">
                    <img src=${products[i].image} alt=${products[i].title}>
                </div>
                <div class="product-list__detail">
                    <h5 class="product-list__title">${products[i].title}</h5>
                    <span class="product-list__category">${products[i].category}</span>
                </div>
                <div class="product-list__price"><span>${products[i].cost}</span> ₽</div>
            `;
            productList1Node.append(productItem); // добавляет product узлы в html, слева 
            products[i].node = productItem;
            products[i].id = i;
            products[i].active = false;
            productItem.addEventListener('click', clickEventHandlerItem);
        }

        // Генератор списка
        
        function generateNewProducts(arr) {
            products = [];
            let getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

            while (products.length != 5) {
                let index = getRandomInt(arr.length);    
                products.push(arr[index]);    
                products = products.filter((v, i, arr) =>  arr.indexOf(v) == i);
                productList1Node.innerHTML = ``;
                for (let i = 0; products.length > i; i++) {
                    products[i].list = 'left';
                    const productItem = document.createElement('li');
                    productItem.classList.add('product-list__item', 'search_left');
                    productItem.setAttribute('data-id', i);
                    productItem.innerHTML = `
                        <div class="product-list__img">
                            <img src=${products[i].image} alt=${products[i].title}>
                        </div>
                        <div class="product-list__detail">
                            <h5 class="product-list__title">${products[i].title}</h5>
                            <span class="product-list__category">${products[i].category}</span>
                        </div>
                        <div class="product-list__price"><span>${products[i].cost}</span> ₽</div>
                    `;
                    productList1Node.append(productItem); // добавляет product узлы в html, слева 
                    products[i].node = productItem;
                    products[i].id = i;
                    products[i].active = false;
                    productItem.addEventListener('click', clickEventHandlerItem);
                }
            }
        }
        
        this.#nodes.buttonGenerateNode.addEventListener('click', () => {
            generateNewProducts(result);
            this.#nodes.productList2Node.innerHTML= ``;
            this.#allProducts = products;
            this.#toggleButton(this.#nodes.buttonDoubleRightNode, true);
            this.#toggleButton(this.#nodes.buttonRightNode, false);
            this.#toggleButton(this.#nodes.buttonDoubleLeftNode, false);
            this.#toggleButton(this.#nodes.buttonLeftNode, false);
        })
    }

    #addEventListenerToButtons(nodes = this.#nodes) {

        this.#toggleButton(nodes.buttonDoubleRightNode, true);

        const clickHandlerBtnDoubleRight = () => {            
            
            // найти products, которые слева
            
            const leftList = this.#allProducts.filter(item => item.list === 'left');

            for (let i = 0; leftList.length > i; i++) {
                this.#offOnActiveItemNode(leftList[i], false);
                leftList[i].list = 'right';
                this.#nodes.productList2Node.append(leftList[i].node);
                leftList[i].node.classList.add('search_right');
                leftList[i].node.classList.remove('search_left');
            }

            this.#toggleButton(nodes.buttonDoubleRightNode, false);
            this.#toggleButton(nodes.buttonDoubleLeftNode, true);
            this.#toggleButton(this.#nodes.buttonRightNode, false);
        };

        const clickHandlerBtnDoubleLeft = () => {

            const rightList = this.#allProducts.filter(item => item.list === 'right');

            for (let i = 0; rightList.length > i; i++) {
                rightList[i].list = 'left';
                this.#offOnActiveItemNode(rightList[i], false);
                this.#nodes.productList1Node.append(rightList[i].node);
                rightList[i].node.classList.add('search_left');
                rightList[i].node.classList.remove('search_right');
            }

            this.#toggleButton(nodes.buttonDoubleRightNode, true);
            this.#toggleButton(nodes.buttonDoubleLeftNode, false);
            this.#toggleButton(nodes.buttonLeftNode, false);
        };

        const clickHandlerBtnRight  = () => {
            const activeItemObj = this.#getProductActiveItemObj();

            if (activeItemObj !== undefined) { // если активный элемент найден
                activeItemObj.list = 'right';
                this.#offOnActiveItemNode(activeItemObj, false);
                this.#nodes.productList2Node.append(activeItemObj.node);
                activeItemObj.node.classList.add('search_right');
                activeItemObj.node.classList.remove('search_left');

            }

            this.#toggleButton(this.#nodes.buttonRightNode, false);
            this.#toggleButton(this.#nodes.buttonDoubleLeftNode, true);

            const leftList = this.#allProducts.filter(item => item.list === 'left');

            if (leftList.length === 0) { // если после перемещения одного продукта вправо в левом списке ничего нет
                this.#toggleButton(this.#nodes.buttonDoubleRightNode, false);
            }

        };

        const clickHandlerBtnLeft = () => {
            const activeItemObj = this.#getProductActiveItemObj();

            if (activeItemObj !== undefined) { // если активный элемент найден
                this.#offOnActiveItemNode(activeItemObj, false);
                this.#nodes.productList1Node.append(activeItemObj.node);
                activeItemObj.list = 'left';
                activeItemObj.node.classList.add('search_left');
                activeItemObj.node.classList.remove('search_right');
            }

            this.#toggleButton(this.#nodes.buttonLeftNode, false);
            this.#toggleButton(this.#nodes.buttonDoubleRightNode, true);

            const rightList = this.#allProducts.filter(item => item.list === 'right');

            if (rightList.length === 0) { // если после перемещения одного продукта влево в правом списке ничего нет
                this.#toggleButton(this.#nodes.buttonDoubleLeftNode, false);
            }
        };
        

        nodes.buttonDoubleRightNode.addEventListener('click', clickHandlerBtnDoubleRight);
        nodes.buttonDoubleLeftNode.addEventListener('click', clickHandlerBtnDoubleLeft);
        nodes.buttonRightNode.addEventListener('click', clickHandlerBtnRight);
        nodes.buttonLeftNode.addEventListener('click', clickHandlerBtnLeft);
    }

    // Поиск

    #searchProductItems(nodes) {

        const parentSearchItems = nodes.productList1Node.getElementsByClassName('search_left');
        const parentSearchItems2 = nodes.productList2Node.getElementsByClassName('search_right');
        
        function searchItems(input, parent, cl) {
            input.addEventListener('input', function() {
                let val = this.value.toLowerCase();
                if (val != '') {
                    Array.from(parent).forEach(function(elem) {
                        if (elem.innerText.toLowerCase().search(val) == -1 && elem.classList.contains(cl)) {
                            elem.classList.add('hide');
                        } else {
                            elem.classList.remove('hide');
                        }
                    });
                } else {
                    Array.from(parent).forEach(function(elem) {
                        elem.classList.remove('hide');
                    });
                }
            })
        }
    
        searchItems(nodes.search1Node, parentSearchItems, 'search_left');
        searchItems(nodes.search2Node, parentSearchItems2, 'search_right');

    }
    
    #sortListButtons(nodes) {

        nodes.buttonPrice1Node.addEventListener('click', () => {
            const leftList = this.#allProducts.filter(item => item.list === 'left');

            function byField(field) {
                return (a, b) => a[field] > b[field] ? 1 : -1;
            }

            leftList.sort(byField('cost'));

            for (let i = 0; leftList.length > i; i++) {
                nodes.productList1Node.append(leftList[i].node);
            }
        });

        nodes.buttonTitle1Node.addEventListener('click', () => {
            const leftList = this.#allProducts.filter(item => item.list === 'left');
            function byField(field) {
                return (a, b) => a[field] > b[field] ? 1 : -1;
            }

            leftList.sort(byField('title'));

            for (let i = 0; leftList.length > i; i++) {
                nodes.productList1Node.append(leftList[i].node);
            }
        });

        nodes.buttonPrice2Node.addEventListener('click', () => {

            const rightList = this.#allProducts.filter(item => item.list === 'right');
            function byField(field) {
                return (a, b) => a[field] > b[field] ? 1 : -1;
            }

            rightList.sort(byField('cost'));

            for (let i = 0; rightList.length > i; i++) {
                nodes.productList2Node.append(rightList[i].node);
            }
        });

        nodes.buttonTitle2Node.addEventListener('click', () => {

            const rightList = this.#allProducts.filter(item => item.list === 'right');
            function byField(field) {
                return (a, b) => a[field] > b[field] ? 1 : -1;
            }

            rightList.sort(byField('title'));

            for (let i = 0; rightList.length > i; i++) {
                nodes.productList2Node.append(rightList[i].node);
            }
        });
    }

    #toggleButton(button, bool) { // true - включить, false - выключить
        button.disabled = !bool;

        if (bool === false) {
            button.classList.remove('button_active');
        } else if (bool === true) {
            button.classList.add('button_active');
        }
        
    }

    #getProductObjFromNode(productItemNode) {
        const id = Number(productItemNode.getAttribute('data-id'));
        const productObj = this.#allProducts.find(item => item.id === id);
        return productObj;
    }

    #getProductActiveItemObj() {
        return this.#allProducts.find(item => item.active === true)
    }

    getProductActiveItemObj() {
        return this.#getProductActiveItemObj();
    }

    getProducts() {
        return this.#allProducts;
    }

    #offOnActiveItemNode(itemObj, active) {
        itemObj.active = active;

        if (active === true) {
            itemObj.node.classList.add('product-list__item_active');
        } else {
            itemObj.node.classList.remove('product-list__item_active');
        }
    }
}

const products = [
    {
        image: 'img/fridge.jpg',
        title: 'Холодильник',
        category: 'Техника',
        cost: 40000
    },
    {
        image: 'img/TV.png',
        title: 'Телевизор',
        category: 'Техника',
        cost: 30000
    },
    {
        image: 'img/appartment.jpeg',
        title: 'Квартира',
        category: 'Недвижимость',
        cost: 3000000
    },
    {
        image: 'img/car.jpg',
        title: 'Машина',
        category: 'Техника',
        cost: 1000000
    },
    {
        image: 'img/dishwasher.jpg',
        title: 'Посудомойка',
        category: 'Техника',
        cost: 50000
    },
]

const result = [
    {
        image: 'img/fridge.jpg',
        title: 'Холодильник',
        category: 'Техника',
        cost: 40000
    },
    {
        image: 'img/TV.png',
        title: 'Телевизор',
        category: 'Техника',
        cost: 30000
    },
    {
        image: 'img/appartment.jpeg',
        title: 'Квартира',
        category: 'Недвижимость',
        cost: 3000000
    },
    {
        image: 'img/car.jpg',
        title: 'Машина',
        category: 'Техника',
        cost: 1000000
    },
    {
        image: 'img/dishwasher.jpg',
        title: 'Посудомойка',
        category: 'Техника',
        cost: 50000
    },
    {
        image: 'img/icons/no-photo.png',
        title: 'Кондиционер',
        category: 'Техника',
        cost: 30000
    },
    {
        image: 'img/icons/no-photo.png',
        title: 'Тарелки',
        category: 'Посуда',
        cost: 3000
    },
    {
        image: 'img/icons/no-photo.png',
        title: 'Креветки',
        category: 'Продукты',
        cost: 300
    },
    {
        image: 'img/icons/no-photo.png',
        title: 'Пицца',
        category: 'Продукты',
        cost: 700
    },
    {
        image: 'img/icons/no-photo.png',
        title: 'Кофемашина',
        category: 'Техника',
        cost: 30999
    },
    {
        image: 'img/icons/no-photo.png',
        title: 'Джинсы',
        category: 'Одежда',
        cost: 3090
    },
    {
        image: 'img/icons/no-photo.png',
        title: 'Шорты',
        category: 'Одежда',
        cost: 1000
    },
    {
        image: 'img/icons/no-photo.png',
        title: 'Кофта',
        category: 'Одежда',
        cost: 3090
    },
    {
        image: 'img/icons/no-photo.png',
        title: 'Путевка на море',
        category: 'Путешествия',
        cost: 100000
    },
    {
        image: 'img/icons/no-photo.png',
        title: 'Абонемент',
        category: 'Спорт',
        cost: 20000
    },
];


new ArrangeBox('.arrangeBox',  products);