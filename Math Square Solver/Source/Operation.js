class Operation {
    static Add = new Operation("Add");
    static Sub = new Operation("Sub");
    static Mul = new Operation("Mul");
    static Div = new Operation("Div");
    static Symbols = {
        Add: "+",
        Sub: "–",
        Mul: "&times;",
        Div: "&divide;"
    }

    constructor(name) {
        this.name = name;
    }
    nextOperation() {
        switch(this.name) {
            case "Add":
                return Operation.Sub;
            case "Sub":
                return Operation.Mul;
            case "Mul":
                return Operation.Div;
            case "Div":
                return Operation.Add;
        }
    }
    symbol() {
        return Operation.Symbols[this.name];
    }
}