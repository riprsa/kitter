import * as cat from "../codegen/cat";
import { Storage } from "./db";

const storage = new Storage();
// createCat creates a cat.
function createCat(data: cat.CreateCatRequest) {
    storage.insertCat(
        data
    )
}