import {Backend} from "@staticbackend/js"

const pubKey = process.env.REACT_APP_SB_PUBLUC_KEY;
const region = process.env.REACT_APP_SB_REGION;

const bkn = new Backend(pubKey || "public key required", region || "dev");

export const backend = bkn;