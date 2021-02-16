/**
 *    Date: 16 February 2021
 *    Description: Game API details
 *    Version: 1.0
 *    Author: Vaibhav Ganju
 */
const { sampleData, storage } = require("../../config/config");

module.exports = (app) => {
  app.get("/getTextAndUser", async (req, res) => {
    try {
      const dataLen = sampleData.length;
      const text = sampleData[Math.floor(Math.random() * dataLen)];
      // Store the updated value in storage
      const userName = `User ${storage.participants.length + 1}`;
      storage.participants.push({
        userName: userName,
        time: 0,
      });
      return res.json({ text, userName });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: err.code });
    }
  });

  app.post("/setGameDetails", async (req, res) => {
    const { userName, endTime } = req.body;
    try {
      const arry = storage.participants.map((obj) => {
        if (obj.userName === userName) {
          obj.time = endTime;
        }
        return obj;
      });

      storage.participants = [...arry];
      return res.json({ message: "Saved" });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: err.code });
    }
  });

  app.get("/getWinnerDetails", async (req, res) => {
    const { userName, endTime } = req.body;
    try {
      let participants = storage.participants;
      let countCompleteUser = 0;
      let user = "";
      let minTime = 1000 * 60 * 60 * 24 * 7;
      const userTotal = participants.length;
      participants.forEach(({ time }) => {
        if (time) {
          countCompleteUser++;
        }
      });

      // Checking if the participants has completed the challange
      if (userTotal === countCompleteUser) {
        // set winner
        participants.forEach(({ time, userName }) => {
          if (time < minTime) {
            minTime = time;
            user = userName;
          }
        });
        storage.winner = {
          userName: user,
          time: minTime,
        };
      }
      return res.json({
        userName: user,
        time: minTime,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: err.code });
    }
  });
};
