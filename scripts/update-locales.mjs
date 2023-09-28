import fs from "fs";
import path from "path";
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

const stages = {
  // Stage 1: Identify all translatable directories
  identifyTranslatableDirectories: async () => {
    const folderContents = await fs.promises.readdir(FOLDER_PATH);
    const directories = folderContents.filter((item) => {
      const itemPath = path.join(FOLDER_PATH, item);
      return fs.statSync(itemPath).isDirectory();
    });

    const filteredDirectories = directories.filter(
      (directory) => directory !== DEFAULT_LANGUAGE
    );

    console.log(
      chalk.green(
        `✅ Successfully identified ${filteredDirectories.length} translatable directories.`
      )
    );

    if (filteredDirectories.length === 0) {
      throw new Error("No translatable directories found.");
    }

    return filteredDirectories;
  },

  // Stage 2: Load the English translation file
  loadEnglishTranslationFile: async () => {
    const enPath = path.join(FOLDER_PATH, "en", "common.json");
    const enContents = await fs.promises.readFile(enPath, "utf8");
    const enTranslation = JSON.parse(enContents);
    console.log(
      chalk.green(
        `✅ Successfully loaded the default translation file. Total keys: ${
          Object.keys(enTranslation).length
        }\n`
      )
    );
    return enTranslation;
  },

  // Stage 3: Translate the English translation file to each translatable language
  translateEnglishTranslationFile: async (
    /** @type {any} */ enTranslation,
    /** @type {any[]} */ translatableDirectories
  ) => {
    for (let [index, directory] of translatableDirectories.entries()) {
      const outputPath = path.join(FOLDER_PATH, directory, "common.json");

      console.log(
        chalk.green(
          `✅ Translating ${DEFAULT_LANGUAGE} => ${directory}. Directory: ${directory}`
        )
      );

      const fileExists = fs.existsSync(outputPath);

      if (!fileExists) {
        console.error(
          chalk.yellow(`File does not exist: ${outputPath}. Creating...`)
        );
        fs.writeFileSync(outputPath, `{"appName": "Brainwave"}`);
      }

      const translation = JSON.parse(
        await fs.promises.readFile(outputPath, "utf8")
      );

      const keys = Object.keys(translation);
      console.log(
        chalk.green(
          `✅ Successfully loaded the translation file for directory: ${directory}. Total keys: ${keys.length}`
        )
      );

      const missingKeys = [];

      for (const key of Object.keys(enTranslation)) {
        if (!Object.keys(translation).includes(key)) {
          missingKeys.push(key);
        }
      }

      if (missingKeys.length === 0) {
        console.log(
          chalk.green(
            `✅ All keys are present in the translation for directory: ${directory}.`
          )
        );
        continue;
      } else {
        console.log(
          chalk.yellow(
            `⚠️ ${missingKeys.length} missing keys in the translation for directory: ${directory}.`
          )
        );
        console.log(missingKeys.join(", "));
      }

      const _translation = {};
      for (const key of missingKeys) {
        // @ts-ignore
        _translation[key] = enTranslation[key];
      }

      const prompt = `Translate the following json translation file to the following language: ${directory}. MUST RETURN AS JSON STRING!!! \n\n ${JSON.stringify(
        _translation,
        null,
        2
      )} \n\n`;

      console.log(chalk.green(`✅ Generating translation for ${directory}.`));
      const response = await gpt3.call(prompt);
      let parsedResponse;

      try {
        parsedResponse = JSON.parse(response);
      } catch (error) {
        console.error(chalk.red("Error parsing JSON response."));
        console.error(error);
        continue;
      }

      if (!validateTranslation(parsedResponse, _translation)) {
        console.error(
          chalk.red(
            "Validation failed. Retrying translation for directory: ",
            directory
          )
        );
        index--;
        continue;
      }

      console.log(
        chalk.green(
          `✅ Successfully generated missing translations for ${directory}. Total keys: ${
            Object.keys(parsedResponse).length
          }`
        )
      );

      const updatedTranslation = {
        ...translation,
        ...parsedResponse,
      };

      console.log(
        chalk.green(
          `✅ Successfully merged the translated keys with the existing translation file for directory: ${directory}. Total keys: ${
            Object.keys(updatedTranslation).length
          }`
        )
      );

      console.log(chalk.green(`✅ Writing translation file to disk.`));

      const ordered = {};
      Object.keys(updatedTranslation)
        .sort()
        .forEach(function (key) {
          // @ts-ignore
          ordered[key] = updatedTranslation[key];
        });

      await fs.promises.writeFile(outputPath, JSON.stringify(ordered));
      console.log(
        chalk.green(
          `✅ Successfully translated ${DEFAULT_LANGUAGE} => ${directory}.\n\n`
        )
      );
    }
  },

  // Stage 4: Validate all translations
  validateTranslations: async (
    /** @type {any} */ translatableDirectories,
    /** @type {any} */ enTranslation
  ) => {
    for (const directory of translatableDirectories) {
      const outputPath = path.join(FOLDER_PATH, directory, "common.json");
      const translation = await fs.promises.readFile(outputPath, "utf8");
      const parsedTranslation = JSON.parse(translation);

      if (!validateTranslation(parsedTranslation, enTranslation)) {
        throw new Error(
          `Translation validation failed for directory: ${directory}`
        );
      }
    }
  },

  // Stage 5: Log success message and exit
  logSuccessMessageAndExit: async (/** @type {number} */ start) => {
    console.log(chalk.green("Done!"));
    const ms = Date.now() - start;
    const s = Math.floor(ms / 1000);

    if (s < 1) {
      console.log(chalk.green(`Total time: ${ms}ms`));
    } else {
      console.log(chalk.green(`Total time: ${s}s`));
    }
  },
};

/**
 * @param {{ [x: string]: any; }} parsedResponse
 * @param {{ [x: string]: any; }} enTranslation
 */
function validateTranslation(parsedResponse, enTranslation) {
  const enKeys = Object.keys(enTranslation);
  const translatedKeys = Object.keys(parsedResponse);

  if (!enKeys.every((key) => translatedKeys.includes(key))) {
    return false;
  }

  for (const key of enKeys) {
    if (
      typeof enTranslation[key] === "object" &&
      !validateTranslation(parsedResponse[key], enTranslation[key])
    ) {
      return false;
    }
  }

  return true;
}

(async function () {
  const start = Date.now();

  const translatableDirectories =
    await stages.identifyTranslatableDirectories();

  const enTranslation = await stages.loadEnglishTranslationFile();

  await stages.translateEnglishTranslationFile(
    enTranslation,
    translatableDirectories
  );

  await stages.validateTranslations(translatableDirectories, enTranslation);

  await stages.logSuccessMessageAndExit(start);
})().catch((error) => {
  console.error(chalk.red("Error running script."));
  console.error(error);
  process.exit(1);
});
