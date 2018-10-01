"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_po_1 = require("./app.po");
describe('kafka-plarium App', () => {
    let page;
    beforeEach(() => {
        page = new app_po_1.AppPage();
    });
    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('Welcome to app!');
    });
});
//# sourceMappingURL=app.e2e-spec.js.map