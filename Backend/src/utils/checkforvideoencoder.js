import axios from "axios";

const encodingServers = [
    process.env.ENCODER1,
    process.env.ENCODER2,
];

async function checkServerAvailability() {
    for (const server of encodingServers) {
        try {
            const response = await axios.get(`${server}/status`);
            //console.log(response.data.MSG)
            if (response.data.MSG === "idle") return server; // Return the first idle server
        } catch (error) {
            // console.log(error)
            console.log(`Server ${server} is unreachable or busy.`);
        }
    }
    // throw new Error("No encoding servers available");
}

export default checkServerAvailability