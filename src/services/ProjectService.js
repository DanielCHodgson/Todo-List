import ProjectModel from "../data/models/ProjectModel";
import TaskService from "./TaskService";
import LaneService from "./LaneService";

export default class ProjectService {

    static PROJECTS_KEY = "projectData";
    static CURR_PROJECT_NAME_KEY = "currentProjectName";

    static get CURRENT_PROJECT() {
        return this.load(localStorage.getItem(this.CURR_PROJECT_NAME_KEY));
    }

    static set CURRENT_PROJECT(projectName) {
        if (projectName) {
            localStorage.setItem(this.CURR_PROJECT_NAME_KEY, projectName);
        } else {
            localStorage.removeItem(this.CURR_PROJECT_NAME_KEY);
        }
    }

    static save(savedProject) {
        let projects = this.loadFromLocalStorage();
        let projectExists = false;

        projects = projects.map(project => {
            if (project.name === savedProject.getName()) {
                projectExists = true;
                return savedProject.toJSON();
            }
            return project;
        });

        if (!projectExists) {
            projects.push(savedProject.toJSON());
        }

        this.saveToLocalStorage(projects);
    }

    static load(projectName) {
        if (!projectName)
            return null;

        const projectData = this.loadFromLocalStorage().find(project => project.name === projectName);
        console.log(projectData)

        return projectData === null ?
            null :
            new ProjectModel(
                projectData.name,
                projectData.type,
                projectData.icon,
                TaskService.fromJSON(projectData.taskService),
                LaneService.fromJSON(projectData.laneService)
            );
    }

    static loadFirst() {

        const projects = this.loadFromLocalStorage();

        if (projects.length === 0) {
            return null;
        }

        return this.load(projects[0].name);
    }

    static delete(name) {
        let projects = this.loadFromLocalStorage();

        if (projects.length === 0)
            return;

        this.saveToLocalStorage(projects.filter(project => project.name !== name));

        if (localStorage.getItem(this.CURR_PROJECT_NAME_KEY) === name)
            localStorage.removeItem(this.CURR_PROJECT_NAME_KEY);
    }

    static saveToLocalStorage(projects) {
        localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
    }

    static loadFromLocalStorage() {
        return JSON.parse(localStorage.getItem(this.PROJECTS_KEY)) || [];
    }

    static switchProject(projectName) {
        if (projectName)
            localStorage.setItem(this.CURR_PROJECT_NAME_KEY, projectName);
    }

}
