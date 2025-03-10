import Utility from "../../../utilities/DomUtility.js";
import "./CreateTaskModal.css";
import Validator from "../../../utilities/Validator.js";
import EventBus from "../../../utilities/EventBus.js";
import getIcons from "../../../res/icons/icons.js";

export default function NewTaskModal() {
    const parent = document.querySelector(".app-wrapper");

    let element = null;
    let form = null;
    let fields = {};
    let statuses = null;

    EventBus.on("openNewTaskModal", (laneService) => launchModal(laneService));

    function launchModal(laneService) {

        statuses = laneService
            .getLanes()
            .map(lane => {
                return lane.getStatus();
            })

        if (!element) {
            element = createElement();
            render();
            cacheFields();
        }
    }

    function cacheFields() {
        fields = {
            summary: element.querySelector("#summary"),
            description: element.querySelector("#description"),
            project: element.querySelector("#project"),
            priority: element.querySelector("#priority"),
            status: element.querySelector("#status"),
            date: element.querySelector("#date")
        };
    }

    function createElement() {
        const modal = Utility.createElement("div", "create-task-modal");
        modal.append(createHeader(), createForm(), createFooter());
        return modal;
    }

    function createHeader() {
        const header = Utility.createElement("div", "modal-header");
        header.appendChild(Utility.createElement("h2", "modal-title", "New task"));

        const iconRow = Utility.createElement("div", "icon-row");
        iconRow.appendChild(Utility.createIconButton("expand", getIcons().expand));
        iconRow.appendChild(Utility.createIconButton("close", getIcons().close, destroy));

        header.appendChild(iconRow);
        return header;
    }

    function createForm() {
        form = Utility.createElement("form", null, null, { id: "new-task-form" });

        form.append(
            Utility.createSelectFormGroup("project", "Project", ["SAAS"]),
            Utility.createInputFormGroup("summary", "Summary", true, 1, 35),
            Utility.createTextAreaFormGroup("description", "Description", false, 0, 500),
            Utility.createSelectFormGroup("priority", "Priority", ["P1", "P2", "P3", "P4", "P5"]),
            Utility.createSelectFormGroup("status", "Status", statuses),
            Utility.createDateFormGroup("date", "Due date", false)
        );

        return form;
    }

    function createFooter() {
        const footer = Utility.createElement("div", "modal-footer");

        const createBtn = Utility.createElement("button", "create-btn", "Create", { type: "submit" });
        createBtn.addEventListener("click", submitTaskData);

        const cancelBtn = Utility.createElement("button", "cancel-btn", "Cancel", { type: "button" });
        cancelBtn.addEventListener("click", destroy);

        footer.append(createBtn, cancelBtn);
        return footer;
    }

    function submitTaskData(event) {
        event.preventDefault();

        if (Validator.isValidTaskData(fields)) {
            const data = Object.fromEntries(
                Object.entries(fields).map(([key, element]) => [key, element.value.trim()])
            );
            EventBus.emit("createTask", data);
            destroy();
        }
    }

    function render() {
        parent.appendChild(element);
    }

    function destroy() {
        if (element) {
            form?.removeEventListener("submit", submitTaskData);
            element.remove();
            element = null;
            fields = {};
        }
    }
}
