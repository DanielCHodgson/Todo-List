export default class Task {

    #id
    #project;
    #summary;
    #description;
    #priority;
    #dueDate;

    constructor(id, project, summary, description, priority, dueDate) {
        this.#id = id;
        this.#project = project;
        this.#summary = summary;
        this.#description = description;
        this.#priority = priority;
        this.#dueDate = dueDate;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get project() {
        return this.#project;
    }

    set project(value) {
        this.#project = value;
    }

    get summary() {
        return this.#summary;
    }

    set summary(value) {
        this.#summary = value;
    }

    get description() {
        return this.#description;
    }

    set description(value) {
        this.#description = value;
    }

    get priority() {
        return this.#priority;
    }

    set priority(value) {
        this.#priority = value;
    }

    get dueDate() {
        return this.#dueDate;
    }

    set dueDate(value) {
        this.#dueDate = value;
    }
}