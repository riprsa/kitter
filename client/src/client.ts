import { FetchRPC } from "twirp-ts";
import { CatterClientJSON } from "./generated/cat.twirp";

export const client = new CatterClientJSON(FetchRPC({
    baseUrl: "http://localhost:8080/twirp"
}));
