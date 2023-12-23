import {CustomHttp} from "../service/custom-http.js";
import {Auth} from "../service/auth.js";
import config from "../../config/config.js";

export class Form {

    constructor(page) {

        this.agreeElement = null;
        this.processElement = null;
        this.page = page;

        const accessToken = localStorage.getItem(Auth.accessTokenKey);

        if (accessToken) {
            location.href = '/#/main';
            return;
        }

        this.fields = [
            {
                name: "email",
                id: "email",
                element: null,
                regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+.[A-Za-z]{2,4}$/,
                valid: false,
            },
            {
                name: "password",
                id: "password",
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];

        if (this.page === 'signup') {
            this.fields.unshift(
                {
                    name: "name",
                    id: "name",
                    element: null,
                    regex: /^[A-ЯЁ][а-яё]+\s[A-ЯЁ][а-яё]+$/,
                    valid: false,
                })
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.oninput = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }
    }


    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = "red";
            field.valid = false;
        } else {
            element.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }

    validateForm() {
        const valudForm = this.fields.every(item => item.valid);
        const isValid = this.agreeElement ? this.agreeElement.checked && valudForm : valudForm;
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }

    async processForm() {
        if (this.validateForm()) {

            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                const name = this.fields.find(item => item.name === 'name').element.value.split(' ')[0];
                const lastName = this.fields.find(item => item.name === 'name').element.value.split(' ')[1];
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: password
                    })

                    if (result) {
                        if (!result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error);
                }

            }
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password
                })

                if (result) {
                    if (!result.tokens || !result.user) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.name,
                        userId: result.user.id,
                        email: email,
                    })
                    location.href = '/#/main';
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
