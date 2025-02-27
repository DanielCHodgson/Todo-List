import "./TaskCard.css"
import Utility from "../../../Utilities/domUtility";

export default class TaskCard {

    #task
    #element

    constructor(task) {
      this.#task = task;
      this.#element = this.createCardElement();
    }

    createHeaderElement() {
        const header = Utility.createElement("div", "task-header");

        const id = Utility.createElement("h3", "task-id", this.#task.getId());
        //const assignee = Utility.createElement("img", "task-assignee", "", { src: this.#task.getAssignee() });
        header.appendChild(id);
        //header.appendChild(assignee);
        return header;
    }

    createBodyElement() {
        const body = Utility.createElement("div", "task-body");
        const summary = Utility.createElement("p", "task-summary", this.#task.getSummary());
    
        body.appendChild(summary);
        return body;
    }

    createFooterElement() {
        const footer = Utility.createElement("div", "task-footer");
        const priority = Utility.createElement("p", "task-priority", this.#task.getPriority());
        const dueDate = Utility.createElement("p", "due-date", this.#task.getDueDate());
    
        footer.appendChild(priority);
        footer.appendChild(dueDate);
    
        return footer;
    }
  
    createCardElement() {
        const card = Utility.createElement("div", "task-card");
        card.appendChild(this.createHeaderElement());
        card.appendChild(this.createBodyElement());
        card.appendChild(this.createFooterElement());
    
        return card;
    }
  
    render(container) {
      container.appendChild(this.element);
    }
  
    update() {
      // TODO implement update method
    }
  
    destroy() {
      this.#element.remove();
    }


    getCard() {
      return this.#element;
    }
  }