import express from "express";
import { AppStrategy, createClient } from "@wix/sdk";
import { appInstances } from "@wix/app-management";

import cors from "cors";
import bodyParser from "body-parser";

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAizV/FzCFnyWj/e/aTkXH
ZAtfngnzFCWtbBpWBpDZzGGnN8nJctxmsqnlId253MYgSgtcpjSKHnDPP3wfhX65
6sAOpgrWLg1hRpTVt6KOpsmt4R7FGpDWK0r4Jae7mfRToYmCezwT0nQDbgCwbuN3
P3Qwvjdhp/BI0Ql8k5Lv3M+mU6wsdFwCIWkd8v+RdkzZWUGqi1dWRkH8ALrvNgL2
uH97Yt8cwdj9wxKDhn2U8HH8VASq2nJX+bQ4r1B48b1+LdRv4gQcrGHgYnch6wv+
1r1mecpyOSEmDMcFHBPx7ELMNrclFkknNgv5XfJLY51kL3Lrch+TrHiwmA17bSxN
JwIDAQAB
-----END PUBLIC KEY-----`;

const APP_ID = "beb320c4-03d1-44c1-9e2a-3982b7ea8bde";

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = createClient({
  auth: AppStrategy({
    appId: APP_ID,
    publicKey: PUBLIC_KEY
  }),
  modules: { appInstances }
});

client.appInstances.onAppInstanceInstalled(event => {
  console.log("onAppInstanceInstalled invoked with data:", event);
  console.log("App instance ID:", event.metadata.instanceId);
  // Add your custom logic here
});
app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.post("/webhook", express.text(), async (req, res) => {
  try {
    await client.webhooks.process(req.body);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send(`Webhook error: ${err instanceof Error ? err.message : err}`);
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));
