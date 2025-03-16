import ProjectModel from "../data/models/ProjectModel";
import TaskService from "./TaskService";
import LaneService from "./LaneService";

export default class ProjectService {

    static PROJECT_STORAGE_KEY = "projectData";
    static CURRENT_PROJECT = this.loadProject(localStorage.getItem("currentProject"));

    static saveProject(savedProject) {
        let projects = this.getProjects();
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

        this.setProjects(projects);
    }

    static loadProject(projectName) {
        if (!projectName) return null;
        const storedProjects = this.getProjects();

        const projectData = storedProjects.find(project => project.name === projectName);
        if (!projectData) return null;

        return new ProjectModel(
            projectData.name,
            projectData.type,
            projectData.icon,
            TaskService.fromJSON(projectData.taskService),
            LaneService.fromJSON(projectData.laneService)
        );
    }

    static loadFirstProject() {
        const storedProjects = this.getProjects();
        if (storedProjects.length === 0) return null;

        return this.loadProject(storedProjects[0].name);
    }

    static deleteProject(name) {

        console.log(name)
        let projects = this.getProjects();
        if (!projects.length) return;

        const filteredProjects = projects.filter(project => project.name !== name);
        this.setProjects(filteredProjects);

        if (this.getCurrentProjectName() === name) {
            localStorage.removeItem("currentProject");
        }
    }

    static getProjects() {
        try {
            return JSON.parse(localStorage.getItem(this.PROJECT_STORAGE_KEY)) || [];
        } catch (error) {
            console.error("Failed to parse project data:", error);
            return [];
        }
    }

    static setProjects(projects) {
        localStorage.setItem(this.PROJECT_STORAGE_KEY, JSON.stringify(projects));
    }

    static loadCurrentProject() {
        return this.loadProject(this.getCurrentProjectName());
    }

    static getCurrentProjectName() {
        return localStorage.getItem("currentProject");
    }

    static setCurrentProject(projectName) {
        if (projectName) {
            localStorage.setItem("currentProject", projectName);
            this.CURRENT_PROJECT = this.loadProject(projectName);
        } else {
            const firstProject = this.loadFirstProject();
            if (firstProject) {
                localStorage.setItem("currentProject", firstProject.name);
                this.CURRENT_PROJECT  = firstProject;
            }
        }
    }
}
