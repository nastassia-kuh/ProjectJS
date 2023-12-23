import {Sidebars} from "../service/sidebars.js";
import {CustomHttp} from "../service/custom-http.js";
import config from "../../config/config.js";
import moment from "moment/moment";
import {GetCategories} from "../service/getCategories.js";

export class ChangeOperation {
    constructor() {
        new Sidebars();
        const id = window.location.hash.split('?')[1];
        const titleHTML = document.getElementById('main-header');
        const disagree = document.getElementById('disagree');


        titleHTML.innerText = 'Редактирование дохода/расхода';

        this.loadOperation(this, id).then();
        disagree.onclick = () => {
            location.href = '#/operations'
        }
    }

    async loadOperation(that, id) {
        const operation = await CustomHttp.request(config.host + '/operations/' + id);

        const type = document.getElementById('typeName');
        const income = document.getElementById('income');
        const expense = document.getElementById('expense');
        const price = document.getElementById('price');
        const date = document.getElementById('date');
        const comment = document.getElementById('comment');
        let categories;


        if (operation.type === 'income') {
            type.removeAttribute('selected');
            income.setAttribute('selected', 'selected');
        }
        if (operation.type === 'expense') {
            type.removeAttribute('selected');
            expense.setAttribute('selected', 'selected');
        }

        function f1(data) {
            return data;
        }

        type.value = operation.type;
        categories = await that.getCat(type.value,operation).then(f1);
        price.value = operation.amount + ' $';
        date.value = operation.date
        comment.value = operation.comment;

        that.changeOperation(that, operation, categories);
    }

    async changeOperation(that, operation, categories) {
        const type = document.getElementById('type');
        const category = document.getElementById('category');
        const amount = document.getElementById('price');
        const date = document.getElementById('date');
        const comment = document.getElementById('comment');
        const agree = document.getElementById('agree');

        type.onchange = async () => {
            if (type.value !== "Тип..") {
                operation.type = type.value;
                categories = await that.getCat(type.value, operation).then(f1);
            }
        };

        function f1(data) {
            return data;
        }

        category.onchange = () => {
            operation.categoryId = categories.find(item => item.title === category.value).id;
            operation.category = category.value;
        }
        amount.onchange = () => {
            operation.amount = Number(amount.value.split(' ')[0]);
        };
        date.onchange = () => {
            operation.date = date.value
        };
        comment.onchange = () => {
            operation.comment = comment.value;
        };


        async function updateOperation(that, operation) {
            try {
                const categories = await that.getCat(operation.type, operation);
                operation.categoryId = categories.find(item => item.title === operation.category).id;
                const result = await CustomHttp.request(config.host + '/operations/' + operation.id, "PUT", {
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
        agree.onclick = async () => {
            updateOperation(that, operation);
            location.href = '#/operations';
        }
    }

    async getCat(type, operation) {
        const category = document.getElementById('category');
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
        const optionFirst = document.getElementById('option');
        optionFirst.removeAttribute('selected');
        categories.forEach(item => {
            const option = document.createElement('option');
            if (item.title === operation.category) {
                option.setAttribute('selected', 'selected');
            }
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
}