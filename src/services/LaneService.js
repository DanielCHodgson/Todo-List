export default class LaneService {

    #lanes

    constructor(lanes) {
        this.#lanes = lanes;
    }

    addLane(newLane) {
        if (!this.#lanes.some(lane => lane.getStatus() === newLane.getStatus))
            this.#lanes.push(lane);
    }

    removeLane(laneToRemove) {
        this.#lanes = this.#lanes.filter(lane => lane.getStatus() !== laneToRemove.getStatus());
    }

    updateLane(updatedLane) {
        this.#lanes = this.#lanes.map(lane => {
            return lane.getStatus === updatedLane.getStatus ?
                updatedLane :
                lane;
        });
    }

    getLaneByStatus(status) {
        return this.#lanes.find(lane => lane.getStatus() === status);
    }


    getLanes() {
        return this.#lanes;
    }

    toJSON() {
        return {
            tasks: this.#lanes.map(lane => lane.toJSON()),
        };
    }

    static fromJSON(data) {
        console.log(data)
        return new LaneService(data.lanes.map(lane => lane.fromJSON(lane)));
    }
}

