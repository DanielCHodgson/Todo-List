export default class Validator {


    static isValidTaskData(fields) {

        const errors = [];

        Object.entries(fields)
            .filter(([key]) => key !== "id" && key !== "description" && key !== "date")
            .forEach(([key, element]) => {
                if (!element.value) {
                    element.classList.add("invalid-field");
                    errors.push(`${key} is a mandatory field.`);
                } else {
                    element.classList.remove("invalid-field");
                }
            });

        if (fields.summary.value.length > 50) {
            errors.push("Summary must be 50 characters or less.");
        }

        const dateRegex = /^([0-2][0-9]|(3)[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
        if (!dateRegex.test(fields.date.value)) {
            errors.push("Date must be in the format DD-MM-YYYY.");
        }

        if (errors.length > 0) {
            this.displayErrorMessages(errors);
            return false;
        }

        return true;
    }

    static isValidProjectData(data) {

        let errors = [];

        if (data.name.length > 5 || data.name.length < 1) {
            errors.push("Name must be between1 and 5 characters.");
        }

        if (data.type.length > 15 || data.type.length < 1) {
            errors.push("Must be between 1 and 15 characters.");
        }

        if (errors.length > 0) {
            this.displayErrorMessages(errors);
            return false;
        }

        return true;
    }

    static isValidSwimLaneStatus(status) {
        let errors = [];
        if (status.length <= 0) {
            errors.push("Status cannot be empty.");
        }

        if (status.length > 20) {
            errors.push("Status must be 20 characters or less.");
        }

        if (errors.length > 0) {
            this.displayErrorMessages(errors);
            return false;
        }

        return true;
    }

    static displayErrorMessages(errors) {
        // To DO - print to UI
        alert(errors.join("\n"));
    }

}