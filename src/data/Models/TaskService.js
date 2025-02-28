import Task from "./TaskModel";
import testData from "../test/dummyTests.json" assert { type: 'json' };

export default class TaskService {

    #tasks;
    #index;

    constructor() {
        this.#tasks = [];
        this.#index = 1;
        testData.tests.forEach(test => {
            this.addTask(Task.fromJSON(test));
        })
    }


    addTask(newTask) {
        const exists = this.#tasks.some(task => task.getId() === newTask.getId());
        if (!exists) {
            this.#tasks.push(newTask);
            this.#index += 1;
        }
    }

    addTasks(tasks) {
        tasks.forEach(task => {
            const exists = this.#tasks.some(task => getId() === task.id);
            if (!exists) {
                this.#tasks.push(task);
                this.#index += 1;
            }
        });
    }

    removeTask(id) {
        this.#tasks = this.#tasks.filter(task => task.getId() !== id);
    }

    getTaskById(id) {
        return this.#tasks.find(task => task.getId() === id);
    }

    getTasksByStatus(status) {
        return this.#tasks.filter(task => task.getStatus() === status);
    }

    getTasks() {
        return this.#tasks;
    }

    getIndex() {
        return this.#index;
    }
}