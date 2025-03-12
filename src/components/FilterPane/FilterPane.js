import "./FilterPane.css";
import DomUtility from "../../utilities/DomUtility.js";
import EventBus from "../../utilities/EventBus.js";
import getIcons from "../../res/icons/icons.js";

export default class FilterPane {

    #element

    constructor() {
        this.#element = null;
        this.#element = this.#createElement();
    }

    #createElement() {
        const filterPane = DomUtility.createElement("div", "filter-pane");
        filterPane.appendChild(this.#createSearch());

        const addSwimlane = DomUtility.createElement("button", "addSwimlane");
        addSwimlane.addEventListener("click", () => this.#handleNewSwimlanekClick());
        addSwimlane.appendChild(DomUtility.renderSvg(getIcons().add));

        filterPane.appendChild(addSwimlane);
        return filterPane;
    }

    #createSearch() {
        const searchContainer = DomUtility.createElement("div", "search-container");

        const searchInput = DomUtility.createElement("input", "", "", { id: "search-input", type: "text" });
        searchContainer.appendChild(searchInput);

        const searchIcon = DomUtility.createElement("div", "search-icon");
        searchIcon.append(DomUtility.renderSvg(getIcons().search));
        searchContainer.appendChild(searchIcon);

        return searchContainer;
    }

    #handleNewSwimlanekClick() {
        if (!document.querySelector(".create-swimlane-modal")) {
            EventBus.emit("openCreateSwimlaneModal");
        }
    }

    render(parent) {
        if (this.#element && !parent.contains(this.#element)) {
            parent.appendChild(this.#element);
        }
    }

    destroy() {
        if (this.#element) {
            this.#element.remove();
            this.#element = null;
        }
    }
}
