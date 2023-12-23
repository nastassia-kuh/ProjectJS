import {GetCategories} from "./getCategories.js";
import {CustomHttp} from "./custom-http.js";
import config from "../../config/config.js";
import {CategoriesPage} from "../components/categoriesPage.js";
import {GetOperations} from "./getOperations.js";
import {Sidebars} from "./sidebars.js";

export class Popup {
    constructor(category) {
        const that = this;

        this.openPopup(that, category).then();
    }

    async openPopup(item, categories) {
        const urlRoute = window.location.hash.split('?')[0];
        const popup = document.getElementById('popup');
        const agree = document.getElementById('agree');
        const disagree = document.getElementById('disagree');
        const openBtns = document.getElementsByClassName('delete-category');
        const changeBtns = document.getElementsByClassName('edit-category');
        let categoryId = '';
        let categoryTitle = '';
        let a = await new GetCategories(categories);


        function closePopup() {
            popup.style.display = 'none';
            categoryId = '';
            categoryTitle = '';
        }

        for (let i = 0; i < openBtns.length; i++) {
            openBtns[i].onclick = function () {
                popup.style.display = 'flex';
                categoryId = a[i].id;
                categoryTitle = a[i].title;

                if (urlRoute === '#/incomes') {
                    agree.onclick = () => {
                        item.deleteOperations(categoryTitle).then(() => deleteInc());
                    }
                }
                if (urlRoute === '#/expenses') {
                    agree.onclick = () => {
                        item.deleteOperations(categoryTitle).then(() => deleteExp());
                    };
                }
            };
        }

        for (let i = 0; i < changeBtns.length; i++) {
            changeBtns[i].onclick = function () {
                categoryId = a[i].id;
                categoryTitle = a[i].title;

                if (urlRoute === '#/incomes') {
                    location.href = '#/changeIncCat?' + categoryId;
                }
                if (urlRoute === '#/expenses') {
                    location.href = '#/changeExpCat?' + categoryId;
                }
            };
        }


        disagree.addEventListener("click", closePopup);

        function deleteExp() {
            item.deleteCategory('/categories/expense/' + categoryId)
                .then(() => closePopup())
                .then(() => new CategoriesPage())
        }

        function deleteInc() {
            item.deleteCategory('/categories/income/' + categoryId)
                .then(() => closePopup())
                .then(() => new CategoriesPage())
        }

    }

    async deleteCategory(urlRoute) {

        try {
            const result = await CustomHttp.request(config.host + urlRoute, 'DELETE');

            if (result) {
                if (!result) {
                    throw new Error(result.message);
                }
            }
        } catch (error) {
            return console.log(error);
        }
    }

    async deleteOperations(categoryTitle) {
        let operations = await new GetOperations('all');
        const deleteCategory = operations.filter(operation => operation.category === categoryTitle);

        console.log(deleteCategory);

        deleteCategory.forEach(item => a(item.id));

        async function a(id) {
            try {
                const result = await CustomHttp.request(config.host + '/operations/' + id, 'DELETE');
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
    }
}



