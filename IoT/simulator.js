var fs = require("fs");

function randomIntFromInterval(min, max) {
  return parseFloat((Math.random() * (max - min + 1) + min).toFixed(0));
}

function generateData() {
  setInterval(() => {
  let obj = {
    HeartbeatRate: randomIntFromInterval(60, 120),
    BreathRate: randomIntFromInterval(16, 20),
    VascularPressureRateSystolic: randomIntFromInterval(100, 130),
    VascularPressureRateDiastolic: randomIntFromInterval(60, 90),
    time: new Date(Date.now())
  };
  fs.writeFile("input.json", JSON.stringify(obj), function (err) {
    if (err) throw err;
    console.log("complete");
  });
}, 1000);
}

generateData();