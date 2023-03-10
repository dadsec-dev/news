const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// An api endpoint that returns a short list of items
app.get("/api/getList", (req, res) => {
  const Ratess = async () => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto("https://abokiforex.app/", {
        waitUntil: "load",
        timeout: 0,
      });

      const textContent = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".overlay-text")).map(
          (x) => x.textContent
        );
      });

      console.log(textContent); /* No Problem Mate */
      browser.close();
      fs.writeFileSync("data.json", JSON.stringify(textContent));
      res.send({ textContent });
      return textContent;
    } catch (error) {
      console.log(error);
    }
  };

  Ratess();

  console.log("Sent list of items");
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log("App is listening on port " + port);
