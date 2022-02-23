import Rules from "./rules";
const inquirer = require("inquirer");

export const selectRules = async (): Promise<string[]> => {
    const choices = Object.keys(Rules);
    const answer = await inquirer.prompt([
        {
            type: "checkbox",
            message: "Select the rules you want to use:",
            name: "modules",
            choices
        }
    ]);
    return answer.modules;
}