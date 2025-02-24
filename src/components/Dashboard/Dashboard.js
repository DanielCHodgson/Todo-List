import "./Dashboard.css"
import FilterPane from "../FilterPane/FilterPane";

export default function Dashboard() {

    const container = document.querySelector(".content");
    const filterPane = FilterPane();

    function renderTitle(title) {

        const heading = document.createElement("h2");
        heading.classList.add("dashboard-title");
        heading.textContent = title;
        container.appendChild(heading);
    }


    function render() {
        renderTitle("Board")
        filterPane.render(container);
    }


    return {
        render
    }

}