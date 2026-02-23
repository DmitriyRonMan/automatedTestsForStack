
export class UserBuilder {

    addLoginAuth() {
        this.userLogin = 'DEMOWEB';
        return this;
    }

    addPasswordAuth() {
        this.userPassword = 'awdrgy';
        return this;
    }

    generate() {
        return {
            login: this.userLogin,
            password: this.userPassword,
        };
    }
}