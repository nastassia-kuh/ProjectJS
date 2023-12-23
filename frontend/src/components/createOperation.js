import {Sidebars} from "../service/sidebars.js";
import {GetCategories} from "../service/getCategories.js";
import moment from "moment/moment";
import {CustomHttp} from "../service/custom-http.js";
import config from "../../config/config.js";

export class CreateOperation {
    constructor() {
        new Sidebars();

        const titleHTML = document.getElementById('main-header');
        const disagree = document.getElementById('disagree');


        titleHTML.innerText = 'Создание дохода/расхода';
        disagree.onclick = () => {
            location.href = '#/operations'
        }

        this.createOperation().then();
    }

    async createOperation() {
        let operation = {};
        const type = document.getElementById('type');
        const category = document.getElementById('category');
        const amount = document.getElementById('price');
        const date = document.getElementById('date');
        const comment = document.getElementById('comment');
        const agree = document.getElementById('agree');
        let categories;

        agree.setAttribute('disabled', 'disabled');

        type.onchange = async () => {
            if (type.value !== "Тип..") {
                operation.type = type.value;
                categories = await getCat(type.value).then(f1);
            }
            validation();
        };

        function f1(data) {
            return data;
        }

        async function getCat(type) {
            let options = [];
            const categories = await new GetCategories(type);
            if (category) {
                const items = document.getElementsByTagName('option');
                const newItems = [];
                for (let arr of items) {
                    newItems.push(arr);
                }
                const a = newItems.filter(item => item.id.includes('option_'));
                a.forEach(item => item.remove());
            }
            categories.forEach(item => {
                const option = document.createElement('option');
                option.setAttribute('id', 'option_' + item.id);
                option.setAttribute('value', item.title);
                option.innerText = item.title;
                options.push(option);
            })
            options.forEach(item => {
                category.appendChild(item);
            })
            return categories;
        }

        category.onchange = () => {
            operation.categoryId = categories.find(item => item.title === category.value).id;
            operation.category = category.value;
            validation();
        }
        amount.onchange = () => {
            operation.amount = Number(amount.value.split(' ')[0]);
            validation();
        };
        date.onchange = () => {
            operation.date = date.value;
            validation();
        };
        comment.oninput = () => {
            operation.comment = comment.value;
            validation();
        };

        function validation() {
            if (operation.type && operation.categoryId && operation.amount && operation.date && operation.comment) {agree.removeAttribute('disabled')}
        }


        async function createOperation(operation) {
            try {
                const result = await CustomHttp.request(config.host + '/operations', "POST", {
                    type: operation.type,
                    category_id: operation.categoryId,
                    amount: operation.amount,
                    date: operation.date,
                    comment: operation.comment
                })
                if (result) {
                    if (!result.user) {
                        new Sidebars();
                        throw new Error(result.message);
                    }
                }
            } catch (error) {
                return console.log(error);
            }
        }

        agree.onclick = () => {
            createOperation(operation);
            location.href = '#/operations';
        }
    }
}