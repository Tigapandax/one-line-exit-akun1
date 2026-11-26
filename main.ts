import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The resignation letter lives in one-line.txt next to this program.
const here = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(join(here, "one-line.txt"), "utf8");
const letter = raw.endsWith("\n") ? raw.slice(0, -1) : raw;

const problems: string[] = [];
if (letter.trim().length === 0) {
  problems.push("the letter is blank");
}
if (letter.length > 140) {
  problems.push(`the letter runs ${letter.length} characters, past the 140 limit`);
}
if (/[\r\n]/.test(letter)) {
  problems.push("the letter must stay on a single line");
}
if (letter !== letter.trim()) {
  problems.push("the letter has stray space at one of its edges");
}
if (!/[.!?]$/.test(letter)) {
  problems.push("the letter needs closing punctuation");
}
if (!/\b(quit|quitting|resign|resignation|leaving|stepping down)\b/i.test(letter)) {
  problems.push("the letter does not read as a resignation");
}

if (problems.length > 0) {
  for (const problem of problems) {
    console.error("INVALID: " + problem);
  }
  process.exit(1);
}

const target = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(target, { recursive: true });
writeFileSync(join(target, "entry.txt"), letter, "utf8");
console.log(letter);
console.log(`Wrote ${letter.length}/140 characters to entry.txt`);
