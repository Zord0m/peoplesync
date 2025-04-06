export class Employee 
{
    constructor
        (
            name,
            email,
            role,
            contractType,
            register,
            type
        )
    {
        this._name = name;
        this._email = email;
        this._role = role;
        this._contractType = contractType;
        this._register = register;
        this._type = type;
    }

    // Getters e Setters para name
    get name() { return this._name; }
    set name(newName) { this._name = newName; }

    // Getters e Setters para email
    get email() { return this._email; }
    set email(newEmail) { this._email = newEmail; }

    // Getters e Setters para role
    get role() { return this._role; }
    set role(newRole) { this._role = newRole; }

    // Getters e Setters para contractType
    get contractType() { return this._contractType; }
    set contractType(newContractType) { this._contractType = newContractType; }

    // Getters e Setters para register
    get register() { return this._register; }
    set register(newRegister) { this._register = newRegister; }

    // Getters e Setters para type
    get type() { return this._type; }
    set type(newType) { this._type = newType; }
}