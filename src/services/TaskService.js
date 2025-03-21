import Task from "../data/models/TaskModel";
import ProjectService from "./ProjectService";

export default class TaskService {

    #tasks;
    #index;

    constructor(tasks, index) {
        this.#tasks = tasks;
        this.#index = index;
    }

    addTask(newTask) {
        const idExists = this.#tasks.some(task => task.getId() === newTask.getId());

        idExists ?
            console.error("Can't add new task as id already in use.") :
            this.#tasks.push(newTask);
    }

    updateTask(updatedTask) {
        const index = this.#tasks.findIndex(task => task.getId() === updatedTask.getId());
        if (index !== -1) {
            this.#tasks[index] = updatedTask;
        }
    }

    removeTask(id) {
        this.#tasks = this.#tasks.filter(task => task.getId() !== id);
    }

    createAndSave(task, project) {
        this.addTask(task);
        if (ProjectService.CURRENT_PROJECT.getName() === project.getName()) {
            this.incrementIndex();
        }
        ProjectService.save(project);
    }

    updateAndSave(task, project) {
        if (ProjectService.CURRENT_PROJECT.getName() === project.getName()) {
            this.updateTask(task);
            ProjectService.save(project);
        } else {
            this.moveAndSave(task, project);
        }
    }

    moveAndSave(task, newProject) {
        this.removeTask(task.getId());
        ProjectService.save(ProjectService.CURRENT_PROJECT);

        newProject.getTaskService().addTask(task);
        ProjectService.save(newProject);
    }

    deleteAndSave(task, project) {
        this.removeTask(task.getId());
        ProjectService.save(project);
    }

    getTaskById(id) {
        return this.#tasks.find(task => task.getId() === id) || null;
    }

    getTasksByStatus(status) {
        return this.#tasks.filter(task => task.getStatus() === status) || null;
    }

    getTasks() {
        return this.#tasks;
    }

    getIndex() {
        return this.#index;
    }

    incrementIndex() {
        this.#index += 1;
    }

    toJSON() {
        return {
            tasks: this.#tasks.map(task => task.toJSON()),
            index: this.#index,
        };
    }

    static fromJSON(data) {
        return new TaskService(data.tasks.map(task => Task.fromJSON(task)), data.index);
    }
}