export default class Task {

    #id
    #project;
    #summary;
    #description;
    #priority;
    #dueDate;
    #status

    constructor(id, project, summary, description, priority, dueDate, status) {
        this.#id = id;
        this.#project = project;
        this.#summary = summary;
        this.#description = description;
        this.#priority = priority;
        this.#dueDate = dueDate;
        this.#status = status;
    }

    getId() {
        return this.#id;
    }

    setId(value) {
        this.#id = value;
    }

    getProject() {
        return this.#project;
    }

    setProject(value) {
        this.#project = value;
    }

    getSummary() {
        return this.#summary;
    }

    setSummary(value) {
        this.#summary = value;
    }

    getDescription() {
        return this.#description;
    }

    setDescription(value) {
        this.#description = value;
    }

    getPriority() {
        return this.#priority;
    }

    setPriority(value) {
        this.#priority = value;
    }

    getDueDate() {
        return this.#dueDate;
    }

    setDueDate(value) {
        this.#dueDate = value;
    }

    getStatus() {
        return this.#status;
    }
    
    setStatus(value) {
        this.#status = value;
    }
}