export default function validator() {


    function isValidTaskData(fields) {

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
            displayErrorMessages(errors);
            return false;
        }

        return true;
    }


    function displayErrorMessages(errors) {
        // To DO - print to UI
        alert(errors.join("\n"));
    }


    return {
        isValidTaskData
    }
}