import express from "express";
import { AppStrategy, createClient } from "@wix/sdk";
import { appInstances } from "@wix/app-management";

import cors from "cors";
import bodyParser from "body-parser";

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxZRN3AqaIh18z1x6t2tK
CIyemYVLEiLrHxoji0xWoxT9zRKI3a0bMgOdPO2UMWINTTPUHmL/zk+1GdomU2xb
w++d+0zfU8AQU264V7N5YRnVxrVDVUZmD/yKOB1x0OQRxJlwBas3oOzq4NeX8m4I
b/dCjn2cVqxkYLRZGYgbgsWSGQcKzdhzXUDOlaGKKeEsjoOgdlNhucyDL5X2PLGU
LIqBSzE+9VqZ6sGXHVeyxDnLiDlDIrCUBq3eFDHpntWIwPbWr8e72+JE0rc5kRNJ
Sw8Uzmb8/b9j8aTBrousu3mOEGZ8npwW5Z5sJZttC/ByyVeFlOuUBO1sl51+87xo
vwIDAQAB
-----END PUBLIC KEY-----`;

// const APP_ID = "beb320c4-03d1-44c1-9e2a-3982b7ea8bde";
const APP_ID= "5608e46e-7302-4d54-85f6-688d8c1973e5"

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
