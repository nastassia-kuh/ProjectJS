import {Form} from "./components/form.js";
import {Main} from "./components/main.js";
import {Auth} from "./service/auth.js";
import {CategoriesPage} from "./components/categoriesPage.js";
import {CreateCategory} from "./components/createCategory.js";
import {ChangeCategory} from "./components/changeCategory.js";
import {Operations} from "./components/operations.js";
import {CreateOperation} from "./components/createOperation.js";
import {ChangeOperation} from "./components/changeOperation.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElementOne = document.getElementById('stylesOne');
        this.stylesElementTwo = document.getElementById('stylesTwo');
        this.titleElement = document.getElementById('titleUp');


        this.routes = [
            {
                route: '#/',
                title: 'Вход',
                template: 'templates/login.html',
                styleOne: 'styles/login.css',
                styleTwo: '',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styleOne: 'styles/login.css',
                styleTwo: '',
                load: () => {
                    new Form('signup');
                }
            },

            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/main.css',
                load: () => {
                    new Main();
                }
            },

            {
                route: '#/operations',
                title: 'Доходы & Расходы',
                template: 'templates/operations.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/main.css',
                load: () => {
                    new Operations();
                }
            },

            {
                route: '#/incomes',
                title: 'Доходы',
                template: 'templates/categories.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/income.css',
                load: () => {
                    new CategoriesPage();
                }
            },

            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/categories.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/income.css',
                load: () => {
                    new CategoriesPage();
                }
            },
            {
                route: '#/createIncCat',
                title: 'Создать категорию доходов',
                template: 'templates/createCat.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/income.css',
                load: () => {
                    new CreateCategory();
                }
            },
            {
                route: '#/createExpCat',
                title: 'Создать категорию расходов',
                template: 'templates/createCat.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/income.css',
                load: () => {
                    new CreateCategory();
                }
            },
            {
                route: '#/changeIncCat',
                title: 'Создать категорию расходов',
                template: 'templates/changeCategory.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/income.css',
                load: () => {
                    new ChangeCategory();
                }
            },
            {
                route: '#/changeExpCat',
                title: 'Создать категорию расходов',
                template: 'templates/changeCategory.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/income.css',
                load: () => {
                    new ChangeCategory();
                }
            },
            {
                route: '#/createOperation',
                title: 'Создание дохода/расхода',
                template: 'templates/createOperation.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/income.css',
                load: () => {
                    new CreateOperation();
                }
            },
            {
                route: '#/changeOperation',
                title: 'Редактирование дохода/расхода',
                template: 'templates/createOperation.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/income.css',
                load: () => {
                    new ChangeOperation();
                }
            },
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];

        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
            return;
        }


        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        })

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.stylesElementOne.setAttribute('href', newRoute.styleOne);
        this.stylesElementTwo.setAttribute('href', newRoute.styleTwo);
        this.titleElement.innerText = newRoute.title;

        newRoute.load();
    }
}