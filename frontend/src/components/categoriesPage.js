import {GetCategories} from "../service/getCategories.js";
import {Sidebars} from "../service/sidebars.js";
import {Popup} from "../service/popup.js";

export class CategoriesPage {
    constructor() {
        this.title = document.getElementById('main-title');
        this.catTable = document.getElementById('categoryTable');
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/incomes'){
            this.title.innerText = 'Доходы';
            this.createCategoriesTable('income').then(() => new Popup('income'));
        } if (urlRoute === '#/expenses') {
            this.title.innerText = 'Расходы';
            this.createCategoriesTable('expense').then(() => new Popup('expense'));
        }

        new Sidebars();
    }

    async createCategoriesTable(categories) {
        let a = await new GetCategories(categories);
        let tableCat = '';
        const createCat = `<div class="category-item add-category-item" id="add-category-item">+</div>`
        a.forEach(a => {
            const categoryHTML = `<div class="category-item" id="categoryItem">
                                            <div class = "category-item-name" id="categoryItemName">${a.title}</div>
                                            <div class="category-item-action">
                                                 <button class="btn edit-category">Редактировать</button>
                                                 <button class="btn delete-category">Удалить</button>
                                            </div>
                                      </div>`;


            tableCat += categoryHTML;
        })
        this.catTable.innerHTML = tableCat + createCat;
        this.changePage(categories);
    }

    changePage(categories) {
        const createBtn = document.getElementById('add-category-item');

        if (categories === 'income') {
            createBtn.onclick = () => location.href = "#/createIncCat";
        }
        if (categories === 'expense') {
            createBtn.onclick = () => location.href = "#/createExpCat";
        }
    }
}
