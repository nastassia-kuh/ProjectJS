import {CustomHttp} from "./custom-http.js";
import config from "../../config/config.js";

export class GetCategories {
    constructor(typeCategory) {
        return this.categories(typeCategory);
    }

    async categories(typeCategory) {
        return await CustomHttp.request(config.host + '/categories/' + typeCategory);
    }
}