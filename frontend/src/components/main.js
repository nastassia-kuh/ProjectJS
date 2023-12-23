import {Sidebars} from "../service/sidebars.js";
import {Chart} from "chart.js/auto";
import {Filters} from "../service/filters.js";
import moment from "moment";

export class Main {
    constructor() {
        const today = document.getElementById('today');
        const week = document.getElementById('week');
        const month = document.getElementById('month');
        const year = document.getElementById('year');
        const all = document.getElementById('all');
        const interval = document.getElementById('interval');
        const allBtns = document.getElementsByClassName('filter-btn');

        function delClass(btn) {
            for (let i = 0; i < allBtns.length; i++) {
                if (allBtns[i].classList.contains('active')) {
                    allBtns[i].classList.remove("active");
                }
            }
            btn.classList.add('active');
        }

        delClass(today);
        this.clickBtn(this).then();

        today.onclick = () => {
            delClass(today);
            this.clickBtn(this).then()
        };
        week.onclick = () => {
            delClass(week);
            this.clickBtn(this, 'week').then()
        };
        month.onclick = () => {
            delClass(month);
            this.clickBtn(this, 'month').then()
        };
        year.onclick = () => {
            delClass(year);
            this.clickBtn(this, 'year').then();
        };
        all.onclick = () => {
            delClass(all);
            this.clickBtn(this, 'all').then()
        };
        interval.onclick = () => {
            delClass(interval);
            let dateFrom = document.getElementById('dateFrom').value;
            // let dateFrom = moment(from, 'DD.MM.YYYY', true).format('YYYY-MM-DD');
            let dateTo = document.getElementById('dateTo').value;
            // let dateTo = moment(to, 'DD.MM.YYYY', true).format('YYYY-MM-DD');
            this.clickBtn(this, 'interval', dateFrom, dateTo).then()
        };

        new Sidebars();
    }


    async clickBtn(that, period, from, to) {
        let getData = await new Filters(period, from, to);

        function f1(data) {
            return data
        }

        let [incomesCategories, incomesData, expenseCategories, expensesData] = f1(getData);
        const incomes = document.getElementById('canvasIncomes');
        const expenses = document.getElementById('canvasExpense');

        let expenseChart = document.getElementById('catExpenses');
        let incomesChart = document.getElementById('catIncomes');

        if (incomesChart) {
            incomesChart.remove();
            incomesChart = document.createElement("canvas");
            incomesChart.id = 'catIncomes';
            incomesChart.style.width = '437px';
            incomesChart.style.height = '437px';
        } else {
            incomesChart = document.createElement("canvas");
            incomesChart.id = 'catIncomes';
            incomesChart.style.width = '437px';
            incomesChart.style.height = '437px';
        }

        if (expenseChart) {
            expenseChart.remove();
            expenseChart = document.createElement("canvas");
            expenseChart.id = 'catExpenses';
            expenseChart.style.width = '437px';
            expenseChart.style.height = '437px';
        } else {
            expenseChart = document.createElement("canvas");
            expenseChart.id = 'catExpenses';
            expenseChart.style.width = '437px';
            expenseChart.style.height = '437px';
        }
        incomes.appendChild(incomesChart);
        expenses.appendChild(expenseChart);

        let configIncomes = {
            type: 'pie',
            data: {
                labels: incomesCategories,
                datasets: [{
                    data: incomesData,
                    label: "$",
                    borderWidth: 1
                }]
            },
            options: {
                radius: 180
            }
        }

        let configExpenses = {
            type: 'pie',
            data: {
                labels: expenseCategories,
                datasets: [{
                    data: expensesData,
                    label: "$",
                    borderWidth: 1
                }]
            },
            options: {
                radius: 180
            }
        }

        await new Chart(incomesChart, configIncomes);
        await new Chart(expenseChart, configExpenses);
    }
}




