const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL ||
"https://finpilot-1-vnma.onrender.com";

/* =========================================
CSV UPLOAD
========================================= */

export async function uploadCSV(file) {
const formData = new FormData();

formData.append("file", file);

const response = await fetch(
`${API_BASE_URL}/api/upload/csv`,
{
method: "POST",
body: formData,
}
);

if (!response.ok) {
let detail;


try {
  detail =
    (await response.json())?.detail;
} catch {
  throw new Error(
    "Could not process the CSV file."
  );
}

/*
  Backend validation response
*/
if (
  typeof detail === "object" &&
  detail !== null
) {
  const validation =
    detail.validation;

  const validationErrors =
    validation?.errors || [];

  const formattedErrors =
    validationErrors.map(
      (item) => ({
        row: item.row,
        field: item.field,
        message: item.message,
      })
    );

  const validationError =
    new Error(
      detail.message ||
        "CSV validation failed."
    );

  validationError.type =
    "CSV_VALIDATION_ERROR";

  validationError.validation = {
    totalRows:
      validation?.total_rows || 0,

    validRows:
      validation?.valid_rows || 0,

    invalidRows:
      validation?.invalid_rows || 0,

    duplicateRows:
      validation?.duplicate_rows || 0,

    errors:
      formattedErrors,
  };

  throw validationError;
}

/*
  Normal backend error
*/
throw new Error(
  detail ||
    "Failed to upload CSV"
);


}

return response.json();
}

/* =========================================
AI INSIGHTS
========================================= */

export async function getInsights(
transactions,
summary
) {
const response = await fetch(
`${API_BASE_URL}/api/insights`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
transactions,
summary,
}),
}
);

if (!response.ok) {
throw new Error(
(await response.json())?.detail ||
"Failed to generate insights"
);
}

return response.json();
}

/* =========================================
FORECAST
========================================= */

export async function getForecast(
transactions
) {
const response = await fetch(
`${API_BASE_URL}/api/forecast`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
transactions,
}),
}
);

if (!response.ok) {
throw new Error(
(await response.json())?.detail ||
"Failed to generate forecast"
);
}

return response.json();
}

/* =========================================
COPILOT
========================================= */

export async function askCopilot(
question,
transactions,
summary
) {
const response = await fetch(
`${API_BASE_URL}/api/copilot`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
question,
transactions,
summary,
}),
}
);

if (!response.ok) {
throw new Error(
(await response.json())?.detail ||
"Failed to get Copilot response"
);
}

return response.json();
}

/* =========================================
EXPECTATIONS
========================================= */

export async function getExpectations(
transactions
) {
const response = await fetch(
`${API_BASE_URL}/api/expectations`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
transactions,
}),
}
);

if (!response.ok) {
throw new Error(
(await response.json())?.detail ||
"Failed to generate expectations"
);
}

return response.json();
}

/* =========================================
ANOMALIES
========================================= */

export async function getAnomalies(
transactions
) {
const response = await fetch(
`${API_BASE_URL}/api/anomalies`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
transactions,
}),
}
);

if (!response.ok) {
throw new Error(
(await response.json())?.detail ||
"Failed to detect unusual spending"
);
}

return response.json();
}
