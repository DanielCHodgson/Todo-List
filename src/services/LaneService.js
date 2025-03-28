import SwimLane from "../components/SwimLane/SwimLane";

export default class LaneService {

    #lanes

    constructor(lanes) {
        this.#lanes = lanes;
    }

    addLane(newLane) {
        if (!this.#lanes.some(lane => lane.getStatus() === newLane.getStatus))
            this.#lanes.push(newLane);
    }

    removeLane(status) {
        if (status) {
            console.log(status)
            this.#lanes = this.#lanes.filter(lane => lane.getStatus() !== status);
        }
    }

    updateLane(updatedLane) {
        this.#lanes = this.#lanes.map(lane => {
            return lane.getStatus === updatedLane.getStatus ?
                updatedLane :
                lane;
        });
    }

    getLaneByStatus(status) {
        return this.#lanes.find(lane => lane.getStatus() === status) || null;
    }

    getLanes() {
        return this.#lanes;
    }

    toJSON() {
        return {
            lanes: this.#lanes.map(lane => lane.toJSON()),
        };
    }

    static fromJSON(data) {
        return new LaneService(data.lanes.map(lane => {
            return SwimLane.fromJSON(lane);
        }));
    }
}

