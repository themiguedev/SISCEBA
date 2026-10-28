import fs from "fs";

async function main() {
  const targets = await (await fetch("http://127.0.0.1:9222/json")).json();
  const page = targets.find(t => t.type === "page" && t.url.includes("cba.edu.ve"));
  if (!page) throw new Error("No page found");

  const ws = new WebSocket(page.webSocketDebuggerUrl);

  const data = await new Promise((resolve, reject) => {
    ws.onopen = () => {
      // 1. Remove broken flag img
      ws.send(JSON.stringify({
        id: 1,
        method: "Runtime.evaluate",
        params: {
          expression: "document.querySelectorAll(\"img[src*='flag.php']\").forEach(i => i.remove());"
        }
      }));
    };

    ws.onmessage = (e) => {
      const res = JSON.parse(e.data);
      if (res.id === 1) {
        // 2. Set viewport metrics to 1366x850 so full dashboard is shown
        ws.send(JSON.stringify({
          id: 2,
          method: "Emulation.setDeviceMetricsOverride",
          params: {
            width: 1366,
            height: 850,
            deviceScaleFactor: 1,
            mobile: false
          }
        }));
      } else if (res.id === 2) {
        // 3. Take screenshot
        ws.send(JSON.stringify({
          id: 3,
          method: "Page.captureScreenshot",
          params: { format: "png", quality: 95 }
        }));
      } else if (res.id === 3) {
        // 4. Reset device metrics
        ws.send(JSON.stringify({
          id: 4,
          method: "Emulation.clearDeviceMetricsOverride"
        }));
        ws.close();
        if (res.error) reject(res.error);
        else resolve(res.result.data);
      }
    };

    ws.onerror = reject;
  });

  fs.writeFileSync("public/presentacion/assets/ceo_dashboard_legacy.png", Buffer.from(data, "base64"));
  console.log("FULL DASHBOARD SAVED! Size:", fs.statSync("public/presentacion/assets/ceo_dashboard_legacy.png").size);
}

main().catch(console.error);
