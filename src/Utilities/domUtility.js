import ProjectService from "../services/ProjectService";

export default class DomUtility {


    static createElement(tag, className, textContent = "", attributes = {}) {
        const element = document.createElement(tag);
        if (className) element.classList.add(className);
        if (textContent) element.textContent = textContent;

        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }

        return element;
    }

    static renderSvg(svgString) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgString;
        return tempDiv.firstChild;
    }

    static createImg(imgSrc, imgClass, width, height) {
        const img = document.createElement("img");
        img.classList.add(imgClass);
        img.src = imgSrc;
        img.style.width = width;
        img.style.height = height;

        return img;
    }

    static createIconButton(className, icon, onClick = null) {
        const btn = this.createElement("div", className);
        btn.appendChild(this.renderSvg(icon));
        if (onClick) btn.addEventListener("click", onClick);
        return btn;
    }

    static createSelectFormGroup(id, labeltext, options) {

        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");

        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.textContent = labeltext;

        const select = document.createElement("select");
        select.id = id;

        options.forEach(o => {
            const option = document.createElement("option");
            option.textContent = o;
            option.value = o;
            select.appendChild(option);
        });

        formGroup.appendChild(label);
        formGroup.appendChild(select);
        return formGroup;
    }


    static createSelect(id, options) {

        const select = document.createElement("select");
        select.id = id;

        options.forEach(o => {
            const option = document.createElement("option");
            option.textContent = o;
            option.value = o;
            select.appendChild(option);
        });

        return select;
    }


    static createProjectSelect() {

        const currProjName = ProjectService.CURRENT_PROJECT.getName();

        const projectSelect = DomUtility.createSelectFormGroup(
            "project",
            "Project",
            ProjectService.loadFromLocalStorage().map(project => project.name)
        );

        const selectElement = projectSelect.querySelector("select");
        if (selectElement) {
            selectElement.value = currProjName;
        }

        return projectSelect;
    }

    static createInputFormGroup(id, labelText, required, minLength, maxLength) {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");

        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.textContent = labelText;

        const input = document.createElement("input");
        input.id = id;
        input.required = required;
        input.minLength = minLength;
        input.maxLength = maxLength;

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        return formGroup;
    }

    static createInputField(id, required, minLength, maxLength) {
        const input = document.createElement("input");
        input.id = id;
        input.required = required;
        input.minLength = minLength;
        input.maxLength = maxLength;
        return input;
    }


    static createDateFormGroup(id, labelText, required) {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");

        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.textContent = labelText;

        const input = document.createElement("input");
        input.type = "date";
        input.id = id;
        input.required = required;

        formGroup.appendChild(label);
        formGroup.appendChild(input);

        return formGroup;
    }

    static createTextAreaFormGroup(id, labelText, required, minLength, maxLength) {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");

        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.textContent = labelText;

        const input = document.createElement("textarea");
        input.id = id;
        input.required = required;
        input.minLength = minLength;
        input.maxLength = maxLength;

        formGroup.appendChild(label);
        formGroup.appendChild(input);

        return formGroup;
    }


    static showAlert(textContent) {
        const alertBox = document.createElement("div");
        alertBox.classList.add("alert");
        alertBox.textContent = textContent;

        document.body.appendChild(alertBox);

        setTimeout(() => {
            alertBox.style.opacity = "0";
            setTimeout(() => alertBox.remove(), 500);
        }, 3000);
    }


    static createToggle(id, isChecked, onChange) {
        const toggle = this.createElement("label", "switch");
    
        const checkbox = document.createElement("input");
        checkbox.id = id;
        checkbox.type = "checkbox";
        checkbox.checked = isChecked;
    
        const slider = document.createElement("span");
        slider.classList.add("slider", "round");
    
        checkbox.addEventListener("change", () => {
            if (onChange) {
                onChange(checkbox.checked);
            }
        });
    
        toggle.appendChild(checkbox);
        toggle.appendChild(slider);
        return toggle;
    }

}