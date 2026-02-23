import {fakerRU} from "@faker-js/faker";

export class TextBuilderBuilder {

    getTextForName() {
        this.nameDistrict = fakerRU.location.county();
        return this;
    }

    getTextForDeleteTest() {
        this.nameDistrict = 'Это запись удалится в этом тесте';
        return this;
    }

    generate() {
        return {
            name: this.nameDistrict,
        };
    }
}