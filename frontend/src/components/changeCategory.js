import {CustomHttp} from "../service/custom-http.js";
import config from "../../config/config.js";
import {GetCategories} from "../service/getCategories";

export class ChangeCategory {
    constructor() {
        this.title = document.getElementById('main-header');
        const urlRoute = window.location.hash.split('?')[0];
        const categoryId = Number(window.location.hash.split('?')[1]);
        const agreeBtn = document.getElementById('agree');
        const disagreeBtn = document.getElementById('disagree');
        const that = this;

        if (urlRoute === '#/changeIncCat') {
            this.loadCategory('income', categoryId).then();
            this.title.innerText = 'Редактирование категории доходов';
            agreeBtn.onclick = changeInc;
            disagreeBtn.onclick = () => {location.href = '#/incomes'}
        }
        if (urlRoute === '#/changeExpCat') {
            this.loadCategory('expense', categoryId).then();
            this.title.innerText = 'Редактирование категории расходов';
            agreeBtn.onclick = changeExp;
            disagreeBtn.onclick = () => {location.href = '#/expenses'}
        }

        function changeExp() {
            that.changeCategory('/categories/expense/' + categoryId).then(() => {
                location.href = '#/expenses'
            })
        }

        function changeInc() {
            that.changeCategory('/categories/income/' + categoryId).then(() => {
                location.href = '#/incomes'
            })
        }
    }

    async loadCategory(typeCategory, categoryId) {
        const categoryName = document.getElementById('name');
        const categories = await new GetCategories(typeCategory);
       let category = categories.find(item => item.id === categoryId);
       categoryName.value = category.title;
    }

    async changeCategory(urlRoute) {
        const categoryName = document.getElementById('name').value;

        try {
            const result = await CustomHttp.request(config.host + urlRoute, 'PUT', {
                title: categoryName
            })

            if (result) {
                if (!result) {
                    throw new Error(result.message);
                }
            }
        } catch (error) {
            return console.log(error);
        }
    }
}