class SolveState {
    constructor(boardNumbers, boardsToTest, options, optionsToTest) {
        this.boardNumbers = boardNumbers;
        this.boardsToTest = boardsToTest;
        this.options = options;
        this.optionsToTest = optionsToTest;
    }
    getBoardNumbers() {
        return this.boardNumbers;
    }
    getBoardsToTest() {
        return this.boardsToTest;
    }
    getOptions() {
        return this.options;
    }
    getOptionsToTest() {
        return this.optionsToTest;
    }
}