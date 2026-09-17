#!/usr/bin/env node
/**
 * ==========================================
 * build.js — renders the helpers from projects.json
 * ==========================================
 *
 * projects.json holds the data; src/*.template.js holds the code with
 * __ALIASES__ / __PROJECTS__ placeholders. This script fills the placeholders
 * in and writes the files that jsDelivr actually serves.
 *
 *   node build.js           build helper.js and helper-custom.js
 *   node build.js --check   fail if the committed files differ from a fresh
 *                           build (CI guard against hand-edited artifacts)
 *
 * The built files are committed on purpose: jsDelivr serves repository content
 * at a tag, not release assets, so an unbuilt artifact means a stale CDN.
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DATA = path.join(ROOT, "projects.json");

const TARGETS = [
  { template: "src/helper.template.js", output: "helper.js" },
  { template: "src/helper-custom.template.js", output: "helper-custom.js" },
];

// Fields without which a landing would silently misbehave in production.
const REQUIRED_FIELDS = [
  "game_url",
  "game_url_android",
  "analytics_url",
  "attribution_project",
  "landing_path_code",
  "title",
];

// landing_path_code is read by external services as a path segment, so it must
// stay URL-safe. Several projects sharing one value is normal and expected.
const LANDING_PATH_CODE = /^[a-z0-9][a-z0-9._/-]*$/;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

/** Guards against a config that builds fine but breaks live traffic. */
function validate(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    errors.push("projects.json must be an object");
    return errors;
  }
  const { aliases, projects } = data;
  if (!aliases || typeof aliases !== "object") {
    errors.push("`aliases` is missing or not an object");
  }
  if (!projects || typeof projects !== "object") {
    errors.push("`projects` is missing or not an object");
  }
  if (errors.length) return errors;

  for (const [alias, target] of Object.entries(aliases)) {
    if (!(target in projects)) {
      errors.push(`alias "${alias}" points at unknown project "${target}"`);
    }
  }

  for (const [name, project] of Object.entries(projects)) {
    for (const field of REQUIRED_FIELDS) {
      const value = project[field];
      if (typeof value !== "string" || value.trim() === "") {
        errors.push(`project "${name}" is missing "${field}"`);
      }
    }
    const urlFields = [
      "game_url",
      "game_url_android",
      "game_url_ios",
      "analytics_url",
      "attribution_url",
    ];
    for (const field of urlFields) {
      const value = project[field];
      if (value === undefined) continue;
      let parsed;
      try {
        parsed = new URL(value);
      } catch {
        errors.push(`project "${name}".${field} is not a valid URL: ${value}`);
        continue;
      }
      // new URL() happily accepts any scheme, so "htp:/typo" parses fine.
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        errors.push(
          `project "${name}".${field} must be http(s), got "${parsed.protocol}": ${value}`,
        );
      }
    }
    if (
      typeof project.landing_path_code === "string" &&
      !LANDING_PATH_CODE.test(project.landing_path_code)
    ) {
      errors.push(
        `project "${name}".landing_path_code must be lowercase and URL-safe, got "${project.landing_path_code}"`,
      );
    }

    if (project.icons !== undefined && !Array.isArray(project.icons)) {
      errors.push(`project "${name}".icons must be an array`);
    }
  }

  const unreachable = Object.keys(projects).filter(
    (name) => !Object.values(aliases).includes(name),
  );
  for (const name of unreachable) {
    // Not fatal: a project can be configured ahead of its landing code.
    console.warn(`⚠ project "${name}" has no alias, no landing can select it`);
  }

  return errors;
}

/** JSON block re-indented to sit where the placeholder sat. */
function inject(template, placeholder, value) {
  const line = new RegExp(`^([ \\t]*).*${placeholder}`, "m").exec(template);
  const indent = line ? line[1] : "";
  const rendered = JSON.stringify(value, null, 2)
    .split("\n")
    .map((row, i) => (i === 0 ? row : indent + row))
    .join("\n");
  return template.split(placeholder).join(rendered);
}

function render(templatePath, data) {
  const raw = fs.readFileSync(templatePath, "utf8");
  const crlf = raw.includes("\r\n");
  let out = crlf ? raw.split("\r\n").join("\n") : raw;

  for (const placeholder of ["__ALIASES__", "__PROJECTS__"]) {
    if (!out.includes(placeholder)) {
      fail(`${path.basename(templatePath)}: placeholder ${placeholder} not found`);
    }
  }

  out = inject(out, "__ALIASES__", data.aliases);
  out = inject(out, "__PROJECTS__", data.projects);

  return crlf ? out.split("\n").join("\r\n") : out;
}

function main() {
  const check = process.argv.includes("--check");

  const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
  const errors = validate(data);
  if (errors.length) {
    for (const error of errors) fail(error);
    console.error(`\n${errors.length} problem(s) in projects.json — nothing written`);
    process.exit(1);
  }

  let drifted = false;
  for (const { template, output } of TARGETS) {
    const rendered = render(path.join(ROOT, template), data);
    const outputPath = path.join(ROOT, output);
    const current = fs.existsSync(outputPath)
      ? fs.readFileSync(outputPath, "utf8")
      : null;

    if (check) {
      if (current !== rendered) {
        drifted = true;
        fail(`${output} is out of date — run \`node build.js\` and commit`);
      } else {
        console.log(`✓ ${output} up to date`);
      }
      continue;
    }

    if (current === rendered) {
      console.log(`= ${output} unchanged`);
    } else {
      fs.writeFileSync(outputPath, rendered, "utf8");
      console.log(`✓ ${output} written`);
    }
  }

  if (check && drifted) process.exit(1);
}

main();
