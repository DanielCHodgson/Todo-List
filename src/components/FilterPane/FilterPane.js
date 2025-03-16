import "./FilterPane.css";
import DomUtility from "../../utilities/DomUtility.js";
import EventBus from "../../utilities/EventBus.js";
import getIcons from "../../res/icons/icons.js";

export default class FilterPane {
    #element;
    #addSwimlane;
    #searchContainer;
    #addSwimlaneClickHandler;
    #searchClickHandler;

    constructor() {
        this.#element = null;
        this.#element = this.#createElement();
    }

    #createElement() {
        const filterPane = DomUtility.createElement("div", "filter-pane");
        filterPane.appendChild(this.#createSearch());

        this.#addSwimlane = DomUtility.createElement("button", "addSwimlane");
        this.#addSwimlaneClickHandler = () => this.#handleNewSwimlaneClick();
        this.#addSwimlane.addEventListener("click", this.#addSwimlaneClickHandler);
        this.#addSwimlane.appendChild(DomUtility.renderSvg(getIcons().add));

        filterPane.appendChild(this.#addSwimlane);
        return filterPane;
    }

    #createSearch() {
        const searchContainer = DomUtility.createElement("div", "search-container");

        const searchInput = DomUtility.createElement("input", "", "", { id: "search-input", type: "text" });
        searchContainer.appendChild(searchInput);

        this.#searchClickHandler = () => alert("I'm beyond the already bloated scope of this project!");
        searchContainer.addEventListener("click", this.#searchClickHandler);

        const searchIcon = DomUtility.createElement("div", "search-icon");
        searchIcon.append(DomUtility.renderSvg(getIcons().search));
        searchContainer.appendChild(searchIcon);

        this.#searchContainer = searchContainer;
        return searchContainer;
    }

    #handleNewSwimlaneClick() {
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
        if (this.#addSwimlane && this.#addSwimlaneClickHandler) {
            this.#addSwimlane.removeEventListener("click", this.#addSwimlaneClickHandler);
        }

        if (this.#searchContainer && this.#searchClickHandler) {
            this.#searchContainer.removeEventListener("click", this.#searchClickHandler);
        }

        if (this.#element) {
            this.#element.remove();
            this.#element = null;
        }
    }
}
