import fs from "fs";
import path from "path";
import { SingleBar } from "cli-progress";
import chalk from "chalk";
import { OpenAI } from "langchain";

import "dotenv/config";

const FOLDER_PATH = path.join("public", "locales");
const DEFAULT_LANGUAGE = "en";

const gpt3 = new OpenAI({
  openAIApiKey: process.env.OPEN_API_KEY || "",
  temperature: 0,
  modelName: "gpt-3.5-turbo",
  maxTokens: -1,
  maxRetries: 3,
});

async function main() {
  try {
    const start = Date.now();
    const folderContents = fs.readdirSync(FOLDER_PATH);

    const directories = folderContents.filter((item) => {
      const itemPath = path.join(FOLDER_PATH, item);
      return fs.statSync(itemPath).isDirectory();
    });

    const filteredDirectories = directories.filter(
      (directory) => directory !== DEFAULT_LANGUAGE
    );

    if (filteredDirectories.length === 0) {
      console.error(chalk.red("No directories found."));
      process.exit(1);
    }

    console.log(
      chalk.blue(
        `Locales found: [ ${chalk.yellow(filteredDirectories.join(", "))} ]`
      )
    );

    const enPath = path.join(FOLDER_PATH, "en", "common.json");
    const enContents = JSON.parse(fs.readFileSync(enPath, "utf8"));
    const progressBar = new SingleBar({
      format: `Progress |${chalk.green(
        "{bar}"
      )}| {percentage}% || {currentDirectory} || {value}/{total} Directories`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    });

    progressBar.start(filteredDirectories.length, 0, {
      currentDirectory: "",
    });

    for (let [index, directory] of filteredDirectories.entries()) {
      const outputPath = path.join(FOLDER_PATH, directory, "common.json");

      const prompt = `Translate the following json translation file to the following language: ${directory}. MUST RETURN AS JSON STRING!!! \n\n ${JSON.stringify(
        enContents,
        null,
        2
      )} \n\n`;

      progressBar.update(index + 1, {
        currentDirectory: chalk.cyan(directory),
      });

      let response = await gpt3.call(prompt);
      let parsedResponse;

      try {
        parsedResponse = JSON.parse(response);
      } catch (error) {
        console.error(chalk.red("Error parsing JSON response."));
        console.error(error);
        continue;
      }

      if (!validateTranslation(parsedResponse, enContents)) {
        console.error(
          chalk.red(
            "Validation failed. Retrying translation for directory: ",
            directory
          )
        );
        index--;
        continue;
      }

      fs.writeFileSync(outputPath, response);
      console.log(
        chalk.green(
          `✅ Successfully translated ${DEFAULT_LANGUAGE} => ${directory}.`
        )
      );
    }
    progressBar.stop();

    console.log(chalk.green("Done!"));
    console.log(chalk.green(`Time elapsed: ${Date.now() - start}ms`));
    process.exit(0);
  } catch (error) {
    console.error(chalk.red("An error occurred:"), error);
    process.exit(1);
  }
}

/**
 * @param {{ [x: string]: any; }} translated
 * @param {{ [x: string]: any; }} enContents
 */
function validateTranslation(translated, enContents) {
  const enKeys = Object.keys(enContents);
  const translatedKeys = Object.keys(translated);

  if (!enKeys.every((key) => translatedKeys.includes(key))) {
    return false;
  }

  for (const key of enKeys) {
    if (
      typeof enContents[key] === "object" &&
      !validateTranslation(translated[key], enContents[key])
    ) {
      return false;
    }
  }

  return true;
}

(async () => await main())();
