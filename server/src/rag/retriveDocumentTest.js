import { getQueryResults } from "./retriveDocument.js";
async function run() {
    try {
        const query = "Rohit Mugalkhod is a student at Presidency university studying computer science.";
        const documents = await getQueryResults(query);

        documents?.forEach( doc => {
            console.log(doc);
        }); 
    } catch (err) {
        console.log(err.stack);
    }
}
export default run;