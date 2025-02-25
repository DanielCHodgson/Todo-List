import "./swimLane.css"

export default function SwimLane() {

    //const tasks = tasks;

    function render(parent) {

        const swimLane = document.createElement("div");
        swimLane.classList.add("swim-lane");

        parent.appendChild(swimLane);
    }


    return {
        render
    }
}