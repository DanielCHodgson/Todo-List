import { se } from "date-fns/locale";
import "./FilterPane.css";
import Utility from "../../Utility/utility";

export default function FilterPane() {

    const img = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`;

    function render(parent) {

        const filterPane = document.createElement("div");
        filterPane.classList.add("filter-pane");

        const searchContainer = document.createElement("div");
        searchContainer.classList.add("search-container");

        const searchInput = document.createElement("input");
        searchInput.id ="search-input";
        searchInput.type = "text";
        searchContainer.appendChild(searchInput);

        const searchIcon = document.createElement("div")
        searchIcon.classList.add("search-icon");
        searchIcon.append(Utility.renderSvg(img));
        searchContainer.appendChild(searchIcon);

        filterPane.appendChild(searchContainer);
        parent.appendChild(filterPane);
    }


    return {
        render

    }


}