import "./ViewTaskModal.css";
import Utility from "../../../Utilities/domUtility";

export default function ViewTaskModal(events) {

    const parent = document.querySelector(".app-wrapper");

    const icons = {
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>`,
    };

    const container = createElement();
    events.on("viewTask", (task) => showModal(task));

    function showModal(task) {
        destroy();
        createElement();
        setData(task);
        render();
    }

    function setData(task) {
        const summary = container.querySelector("#summary");
        console.log(task.getSummary())
        summary.value = task.getSummary();

        const description = container.querySelector("#view-task-description");
        description.value = task.getDescription();

        const priority = container.querySelector("#priority");
        priority.value = task.getPriority();

        const date = container.querySelector("#date");
        date.value = task.getDueDate();
    }

    function createElement() {
        const container = Utility.createElement("div", "view-task-modal");

        container.appendChild(createHeader());
        container.appendChild(createBody());
        container.appendChild(createFooter());
        return container;
    }

    function createHeader() {
        const container = Utility.createElement("div", "view-task-header");

        const upper = Utility.createElement("div", "upper");
        const iconRow = Utility.createElement("div", "icon-row");
        iconRow.appendChild(Utility.createIconButton("close", icons.close, destroy));
        upper.appendChild(iconRow);

        const lower = Utility.createElement("div", "lower");
        const summary = document.createElement("input");
        summary.id = "summary";
        summary.required = true;
        summary.minLength = 1;
        summary.maxLength = 35;
        lower.appendChild(summary);


        container.appendChild(upper);
        container.appendChild(lower);
        return container;
    }

    function createBody() {
        const container = Utility.createElement("div", "view-task-body");

        const left = Utility.createElement("div", "modal-left");
        left.appendChild(Utility.createTextAreaFormGroup("view-task-description", "Description", false, 0, 1000));

        const right = Utility.createElement("div", "modal-right");
        right.appendChild(Utility.createSelectFormGroup("project", "Project", ["SAAS"]));
        right.appendChild(Utility.createSelectFormGroup("priority", "Priority", ["P1", "P2", "P3", "P4", "P5"]));
        right.appendChild(Utility.createSelectFormGroup("status", "Status", ["ready to start", "in progress", "in review", "closed"]));
        right.appendChild(Utility.createInputFormGroup("date", "Due date", true, "8", "10"));

        container.appendChild(left);
        container.appendChild(right);
        return container;
    }

    function createFooter() {
        const container = Utility.createElement("div", "view-task-footer");

        return container;
    }


    function render() {
        parent.appendChild(container);
    }

    function destroy() {
        if (parent.querySelector(".view-task-modal")) {
            parent.removeChild(container);
        }

    }


}
