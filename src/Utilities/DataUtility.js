import ProjectModel from "../data/models/ProjectModel";
import TaskService from "../data/services/TaskService";

export default class DataUtility {

    static PROJECT_STORAGE_KEY = "projectData";

    static saveProject(project) {
        localStorage.setItem(DataUtility.PROJECT_STORAGE_KEY, JSON.stringify(project.toJSON()));
        console.log("project saved!")
        console.log(localStorage.projectData)
    }
    
    static loadProject() {
        const storedProject = localStorage.getItem(DataUtility.PROJECT_STORAGE_KEY);
        if (!storedProject) {
            console.log("No project data")
            return null;
        }
    
        const projectData = JSON.parse(storedProject);

        return new ProjectModel(
            projectData.name,
            projectData.type,
            projectData.icon,
            TaskService.fromJSON(projectData.taskService) 
        );
    }
}
