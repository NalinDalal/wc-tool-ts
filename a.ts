const fs = require("fs");

interface CountResults {
  wordCount: number;
  lineCount: number;
  charCount: number;
  byteCount: number;
}

function countMetrics(input: string): CountResults {
  const results: CountResults = {
    byteCount: Buffer.byteLength(input, "utf-8"),
    lineCount: 0,
    wordCount: 0,
    charCount: 0,
  };

  const lines = input.split("\n");
  results.lineCount = lines.length;

  for (const line of lines) {
    results.charCount += line.length;
    results.wordCount += line.trim().split(/\s+/).filter(Boolean).length;
  }

  return results;
}

function printResults(
  results: CountResults,
  countBytes: boolean,
  countLines: boolean,
  countWords: boolean,
  countChars: boolean,
  filename: string,
) {
  let output = "";
  if (countLines) output += `${results.lineCount} `;
  if (countWords) output += `${results.wordCount} `;
  if (countBytes) output += `${results.byteCount} `;
  if (countChars) output += `${results.charCount} `;
  console.log(output + (filename ? filename : ""));
}

const args = process.argv.slice(2);
let countBytes = false,
  countLines = false,
  countWords = false,
  countChars = false;
let filename = "";

for (const arg of args) {
  if (arg === "-c") countBytes = true;
  else if (arg === "-l") countLines = true;
  else if (arg === "-w") countWords = true;
  else if (arg === "-m") countChars = true;
  else filename = arg;
}

if (!countBytes && !countLines && !countWords && !countChars) {
  countBytes = countLines = countWords = true;
}

if (filename) {
  fs.readFile(
    filename,
    "utf-8",
    (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        console.error(`Error: Cannot open file ${filename}`);
        process.exit(1);
      }
      const results = countMetrics(data);
      printResults(
        results,
        countBytes,
        countLines,
        countWords,
        countChars,
        filename,
      );
    },
  );
} else {
  let input = "";
  process.stdin.on("data", (chunk) => (input += chunk));
  process.stdin.on("end", () => {
    const results = countMetrics(input);
    printResults(results, countBytes, countLines, countWords, countChars, "");
  });
}
