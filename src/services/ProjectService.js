import ProjectModel from "../data/models/ProjectModel";
import TaskService from "./TaskService";
import LaneService from "./LaneService";

export default class ProjectService {

    static CURR_PROJECT_NAME_STORAGE_KEY = "currentProjectName";
    static PROJECT_STORAGE_KEY = "projectData";

    static get CURRENT_PROJECT() {
        return this.loadProject(localStorage.getItem(this.CURR_PROJECT_NAME_STORAGE_KEY));
    }

    static set CURRENT_PROJECT(projectName) {
        if (projectName) {
            localStorage.setItem(this.CURR_PROJECT_NAME_STORAGE_KEY, projectName);
        } else {
            localStorage.removeItem(this.CURR_PROJECT_NAME_STORAGE_KEY);
        }
    }

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

        this.saveProjectsToLocalStorage(projects);

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

        let projects = this.getProjects();
        if (!projects.length) return;

        const filteredProjects = projects.filter(project => project.name !== name);
        this.saveProjectsToLocalStorage(filteredProjects);

        if (this.CURRENT_PROJECT.getName() === name) {
            localStorage.removeItem(this.CURR_PROJECT_NAME_STORAGE_KEY);
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

    static saveProjectsToLocalStorage(projects) {
        localStorage.setItem(this.PROJECT_STORAGE_KEY, JSON.stringify(projects));
    }

    static loadCurrentProject() {
        return this.loadProject(this.CURRENT_PROJECT.getName());
    }

    static switchProject(projectName) {
        if (projectName) {
            localStorage.setItem(this.CURR_PROJECT_NAME_STORAGE_KEY, projectName);
        } else {
            const firstProject = this.loadFirstProject();
            if (firstProject) {
                localStorage.setItem(this.CURR_PROJECT_NAME_STORAGE_KEY, firstProject.name);
            }
        }
    }
}
