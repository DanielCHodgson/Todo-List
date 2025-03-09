import "./FilterPane.css";
import Utility from "../../utilities/DomUtility.js";

export default function FilterPane(events) {


    const icons = {
        search: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`,
        add: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>`,
    }
    
    const element = createElement();

    function createElement() {
        const filterPane = Utility.createElement("div", "filter-pane");
        filterPane.appendChild(createSearch());

        const addSwimlane = Utility.createElement("button", "addSwimlane");
        addSwimlane.addEventListener("click", () => events.emit("addSwimlane"));
        addSwimlane.appendChild(Utility.renderSvg(icons.add));

        filterPane.appendChild(addSwimlane);

        return filterPane;
    }


    function createSearch() {
        const searchContainer = Utility.createElement("div", "search-container");

        const searchInput = Utility.createElement("input", "", "", { id: "search-input", type: "text" });
        searchContainer.appendChild(searchInput);

        const searchIcon = Utility.createElement("div", "search-icon");
        searchIcon.append(Utility.renderSvg(icons.search));
        searchContainer.appendChild(searchIcon);

        return searchContainer;
    }


    function render(parent) {
        parent.remove(element);
        if (element) parent.appendChild(element);
    }

    return {
        render
    }
}