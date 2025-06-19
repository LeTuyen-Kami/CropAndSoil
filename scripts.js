const fs = require("fs");

const BOTTLE_CODES = ["HTTPS://ST4.CH/Q/U5GBPNASSL0918MPOG2GA0R78YZE4UK5"];

const API_URL =
  "https://trace-open-api-uat.motul.com.sg/customer/mote/open/api/v1/codeQuery";
const BEARER_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJ7XCJlbnRlcnByaXNlVXNlckFjY291bnRcIjpcInVhdF9zeW5jX3Btc1wiLFwiYWNjZXNzS2V5XCI6XCI0NWEyMzU0MzBiOTE0YmU0YTM1NTFlYTYxNGYyYzFhZVwiLFwiZW50ZXJwcmlzZU5vXCI6XCIxMzI1NjY2NzYyMTFcIixcImVudGVycHJpc2VVc2VySWRcIjpcIjE5Mjk0MTc5MzIxNDkyNDM5MDRcIixcImFwcElkXCI6XCIxOTI5NDE4OTIzNjQzMzMwNTYwXCJ9Iiwic3ViIjoiMTkyOTQxODkyMzY0MzMzMDU2MCIsImlzcyI6Inllc25vLmNvbS5jbiIsImV4cCI6MTc1MDI0NzMyNzA4NywiaWF0IjoxNzUwMjE4NTI3MDg3LCJ2ZXJzaW9uIjoiMS4wIiwianRpIjoiOTQyNTdmYzFjMjliNGIzNjk1MmE3ZmI2ZTk1NDBjOTAifQ.uJd8jeuxHjPEP8-DWZ3ZU5IvDWw7dJqK8N4LeqyXy10";

async function fetchBottleData(bottleCode) {
  const requestBody = {
    searchCode: bottleCode,
    queryType: 1,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    return {
      bottleCode,
      request: JSON.stringify(requestBody, null, 2),
      response: JSON.stringify(responseData, null, 2),
      success: response.ok,
    };
  } catch (error) {
    return {
      bottleCode,
      request: JSON.stringify(requestBody, null, 2),
      response: JSON.stringify({ error: error.message }, null, 2),
      success: false,
    };
  }
}

function escapeCSVValue(value) {
  if (typeof value !== "string") {
    value = String(value);
  }

  // Always wrap the value in quotes and preserve newlines
  return `"${value.replace(/"/g, '""')}"`;
}

function createCSV(data) {
  const headers = ["botle code", "request", "response"];
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        escapeCSVValue(row.bottleCode),
        escapeCSVValue(row.request),
        escapeCSVValue(row.response),
      ].join(",")
    ),
  ].join("\n");

  return csvContent;
}

async function main() {
  console.log("Fetching data for bottle codes...");

  const results = [];

  for (let i = 0; i < BOTTLE_CODES.length; i++) {
    const bottleCode = BOTTLE_CODES[i];
    console.log(`Processing ${i + 1}/${BOTTLE_CODES.length}: ${bottleCode}`);

    const result = await fetchBottleData(bottleCode);
    results.push(result);

    if (!result.success) {
      console.warn(`Failed to fetch data for ${bottleCode}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("Creating CSV file...");
  const csvContent = createCSV(results);

  fs.writeFileSync("data.csv", csvContent, "utf8");
  console.log('CSV file "data.csv" has been created successfully!');

  console.log(`\nSummary:`);
  console.log(`Total codes processed: ${results.length}`);
  console.log(
    `Successful requests: ${results.filter((r) => r.success).length}`
  );
  console.log(`Failed requests: ${results.filter((r) => !r.success).length}`);
}

if (require.main === module) {
  main().catch(console.error);
}
