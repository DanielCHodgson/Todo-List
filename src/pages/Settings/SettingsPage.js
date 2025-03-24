import DomUtility from "../../utilities/DomUtility";
import "./SettingsPage.css";

export default class SettingsPage {

    #parent;
    #element;
    #resetBtn;
    #isDarkMode;

    constructor() {
        this.#parent = document.querySelector(".content");
        this.#isDarkMode = localStorage.getItem("isDarkMode") === "true";
        this.#element = this.#createElement();
        this.render();

        if (this.#isDarkMode) {
            document.body.classList.add("dark-mode");
        }
    }


    #createHeader() {
        const header = DomUtility.createElement("div", "header");
        const heading = DomUtility.createElement("h2", "title", "Settings");
        header.append(heading);
        return header;
    }

    #createBody() {
        const body = DomUtility.createElement("div", "body");

        const labelGroup1 = DomUtility.createElement("div", "label-group");
        labelGroup1.appendChild(DomUtility.createElement("label", "label", "Display Mode"));

        const toggle = DomUtility.createToggle("display-toggle", this.#isDarkMode, this.#toggleDarkMode.bind(this));

        labelGroup1.appendChild(toggle);
        body.appendChild(labelGroup1);
        const labelGroup2 = DomUtility.createElement("div", "label-group");
        const resetBtn = DomUtility.createElement("button", "btn", "Reset data");
        resetBtn.addEventListener("click", () => this.#handleResetClick());
        this.#resetBtn = resetBtn;

        labelGroup2.appendChild(resetBtn);

        body.appendChild(labelGroup1);
        body.appendChild(labelGroup2);
        return body;
    }


    #createElement() {
        const page = DomUtility.createElement("div", "settings-page");

        page.appendChild(this.#createHeader());
        page.appendChild(this.#createBody());

        return page;
    }

    #toggleDarkMode(isChecked) {
        this.#isDarkMode = isChecked;
        localStorage.setItem("isDarkMode", isChecked.toString());
        
        document.body.classList.toggle("dark-mode", isChecked);
        document.querySelector("#display-toggle").checked = isChecked;
    }

    #handleResetClick() {
        localStorage.clear();
        location.reload();
    }


    render() {
        if (!this.#parent.contains(this.#element)) {
            this.#parent.appendChild(this.#element);
        }
    }

    destroy() {
        this.#element.remove();
        this.#resetBtn.removeEventListener("click", () => this.#handleResetClick());
        this.#element.querySelector("#display-toggle").removeEventListener("change", () => {
            if (onChange) {
                onChange(checkbox.checked);
            }
        });

        this.#resetBtn = null;
    }

}