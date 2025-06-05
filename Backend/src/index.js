import connectDB from './db/index.js';
import { app } from './app.js';

(async () => {
    try {
        await connectDB()
        app.on("error", (error) => {
            console.log("error not able to listin", error);

        })
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on Port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("moogoDb connenation failed !! ::", error)
        console.log("Error", error)
    }
})()
