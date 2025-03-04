import "./ViewTaskModal.css";
import Utility from "../../../utilities/DomUtility";
import validator from "../../../utilities/Validator";

export default function ViewTaskModal(events) {
    const parent = document.querySelector(".app-wrapper");
    let currentTask = null;
    let fields = null;
    let element = null;
    let slug = null;

    const icons = {
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>`
    };

    events.on("viewTask", (task) => launchModal(task));

    function launchModal(task) {
        if (!element) element = createElement();
        currentTask = task;
        cacheFields();
        setData(task);
        render();
    }

    function cacheFields() {
        fields = {
            "summary": element.querySelector("#summary"),
            "description": element.querySelector("#description"),
            "project": element.querySelector("#project"),
            "priority": element.querySelector("#priority"),
            "status": element.querySelector("#status"),
            "date": element.querySelector("#date")
        };

        slug = element.querySelector(".slug");
    }

    function setData(task) {
        if (!task) return;
        slug.textContent = `${task.getProject()}-${task.getId()}`;
        fields.summary.value = task.getSummary();
        fields.description.value = task.getDescription();
        fields.project.value = task.getProject();
        fields.priority.value = task.getPriority();
        fields.status.value = task.getStatus();
        fields.date.value = task.getDueDate();
    }

    function createElement() {
        const modal = Utility.createElement("div", "view-task-modal");
        modal.appendChild(createHeader());
        modal.appendChild(createBody());
        modal.appendChild(createFooter());
        return modal;
    }

    function createHeader() {
        const container = Utility.createElement("div", "view-task-header");
        const upper = Utility.createElement("div", "upper");
        upper.appendChild(Utility.createElement("p", "slug"));

        const iconRow = Utility.createElement("div", "icon-row");
        iconRow.appendChild(Utility.createIconButton("close", icons.close, destroy));
        upper.appendChild(iconRow);

        const lower = Utility.createElement("div", "lower");
        const summary = document.createElement("input");
        summary.id = "summary";
        summary.required = true;
        summary.minLength = 1;
        summary.maxLength = 50;
        lower.appendChild(summary);

        container.appendChild(upper);
        container.appendChild(lower);
        return container;
    }

    function createBody() {
        const container = Utility.createElement("div", "view-task-body");

        const left = Utility.createElement("div", "modal-left");
        left.appendChild(Utility.createTextAreaFormGroup("description", "Description", false, 0, 1000));

        const right = Utility.createElement("div", "modal-right");
        right.appendChild(Utility.createSelectFormGroup("project", "Project", ["SAAS"]));
        right.appendChild(Utility.createSelectFormGroup("priority", "Priority", ["P1", "P2", "P3", "P4", "P5"]));
        right.appendChild(Utility.createSelectFormGroup("status", "Status", ["ready to start", "in progress", "in review", "closed"]));
        right.appendChild(Utility.createInputFormGroup("date", "Due date", true, "8", "10"));

        container.appendChild(left);
        container.appendChild(right);
        return container;
    }

    function updateTask() {

        if (validator().isValidTaskData(fields)) {
            const data = trimFields(fields);
            data.id = slug.textContent.split("-")[1];
            events.emit("updateTask", { "task": currentTask, "newData": data });
            destroy();
        }
    }

    function trimFields(fields) {
        return Object.fromEntries(
            Object.entries(fields).map(([key, element]) => {
                return [key, element.value.trim()];
            })
        );
    }

    function createFooter() {
        const footer = Utility.createElement("div", "view-task-footer");
        const updateBtn = Utility.createElement("button", "update-btn", "Update");
        updateBtn.addEventListener("click", updateTask);

        const cancelBtn = Utility.createElement("button", "cancel-btn", "Cancel");
        cancelBtn.addEventListener("click", destroy);

        footer.appendChild(updateBtn);
        footer.appendChild(cancelBtn);
        return footer;
    }

    function render() {
        if (!parent.contains(element)) {
            parent.appendChild(element);
        }
    }

    function destroy() {
        if (element && parent.contains(element)) {
            parent.removeChild(element);
            element = null;
            fields = null;
            slug = null;
            currentTask = null;
        }
    }
}
