import express from "express";

import BodyParser from "body-parser";

import * as FirebaseService from "./FirebaseService";
import Expo from "expo-server-sdk";
import { address } from "./secrets";
import { CronJob } from "cron";

const app = express();
const port = 8000;

const expo = new Expo();

const jsonParser = BodyParser.json();
const httpParser = BodyParser.urlencoded({ extended: false });

new CronJob(
  "*/60 * * * * *",
  async function () {
    const userId = "0000001";
    const { token } = await FirebaseService.getToken("0000001");
    const samples = await FirebaseService.getSamples(userId);
    const mostRecentSample = samples.previousMoistureLevels.pop()!;
    if (mostRecentSample > 570) {
      expo.sendPushNotificationsAsync([
        {
          to: token,
          title: "Soil Water Level too Low!",
          body: "Water Your Plant",
        },
      ]);
    }
  },
  null,
  true,
  "America/New_York"
);

app.post("/registerPushToken", jsonParser, async (req, res) => {
  const userId = String(req.body.userId);
  const token = String(req.body.token);
  await FirebaseService.saveToken(userId, token);
  res.status(200).send("success");
});

app.post(`/sample`, jsonParser, async (req, res) => {
  const moistureLevel = Number(req.body.moisture);
  const userId = String(req.body.userId);
  FirebaseService.saveSample(moistureLevel, userId);
  res.status(200).send("success");
});

app.get("/analytics", httpParser, async (req, res) => {
  const userId = String(req.query.userId);
  const samples = await FirebaseService.getSamples(userId);
  res.status(200).send(samples);
});

app.listen(port, address, () => console.log(`Running on Port ${port}`));
