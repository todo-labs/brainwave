import fs from "fs";
import path from "path";
import chalk from "chalk";
import { OpenAI } from "langchain";
import z from "zod";
import chunk from "lodash.chunk";

import "dotenv/config";

const FOLDER_PATH = path.join("public", "locales");
const APP_NAME = "Brainwave";
const DEFAULT_LANGUAGE = "en";
const CHUNK_SIZE = 50;

const envSchema = z.object({
  keys: z.array(z.string()).nullable(),
});

const gpt3 = new OpenAI({
  openAIApiKey: process.env.OPEN_API_KEY || "",
  temperature: 0,
  modelName: "gpt-3.5-turbo",
  maxTokens: -1,
  maxRetries: 3,
  verbose: true,
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
        `\n✅ Successfully identified ${filteredDirectories.length} translatable directories.`
      )
    );

    if (filteredDirectories.length === 0) {
      throw new Error("No translatable directories found.");
    }

    return filteredDirectories;
  },

  // Stage 2: Load the Default translation file
  loadDefaultTranslationFile: async () => {
    const defaultPath = path.join(FOLDER_PATH, DEFAULT_LANGUAGE, "common.json");
    const contents = await fs.promises.readFile(defaultPath, "utf8");
    const translation = JSON.parse(contents);
    console.log(
      chalk.green(
        `✅ Successfully loaded the default translation file. Total keys: ${
          Object.keys(translation).length
        }\n`
      )
    );
    return translation;
  },

  // Stage 3: Translate the Default translation file to each translatable language
  translateDefaultTranslationFile: async (
    /** @type {any} */ enTranslation,
    /** @type {any[]} */ translatableDirectories,
    /** @type {string[]} */ modifiedKeys
  ) => {
    for (let [index, directory] of translatableDirectories.entries()) {
      const outputPath = path.join(FOLDER_PATH, directory, "common.json");

      console.log(
        chalk.green(
          `\n✅ Translating ${DEFAULT_LANGUAGE} => ${directory}. Directory: ${directory}`
        )
      );

      const fileExists = fs.existsSync(outputPath);

      if (!fileExists) {
        console.error(
          chalk.yellow(`File does not exist: ${outputPath}. Creating...`)
        );
        fs.writeFileSync(outputPath, `{"appName": "${APP_NAME}"}`);
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

      const missingKeys = [...modifiedKeys];

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

      const arrayFromObject = Object.entries(_translation).map(
        ([key, value]) => ({
          [key]: value,
        })
      );
      const final = chunk(arrayFromObject, CHUNK_SIZE);

      let parsedResponse = {};
      for (let i = 0; i < final.length; i++) {
        console.log(
          chalk.green(
            `✅ Generating translation for ${directory}. Chunk ${i + 1} of ${
              final.length
            }.`
          )
        );
        // @ts-ignore
        const chunk = Object.assign({}, ...final[i]);
        console.log(
          `✅ Current set contains ${Object.keys(chunk).length} keys.`
        );
        console.log(`✅ Current set: ${Object.keys(chunk).join(", ")}`);
        const prompt = `Translate the following json translation file to the following language: ${directory}. MUST RETURN AS JSON STRING!!! \n\n ${JSON.stringify(
          chunk,
          null,
          2
        )} \n\n`;
        try {
          const response = await gpt3.call(prompt);
          parsedResponse = Object.assign(parsedResponse, JSON.parse(response));
          continue;
        } catch (error) {
          console.error(chalk.red("Error parsing JSON response."));
          console.error(error);
          index--;
          continue;
        }
      }

      if (!validate(parsedResponse, _translation)) {
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

      if (!validate(parsedTranslation, enTranslation)) {
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
function validate(parsedResponse, enTranslation) {
  const enKeys = Object.keys(enTranslation);
  const translatedKeys = Object.keys(parsedResponse);

  if (!enKeys.every((key) => translatedKeys.includes(key))) {
    return false;
  }

  for (const key of enKeys) {
    if (
      typeof enTranslation[key] === "object" &&
      !validate(parsedResponse[key], enTranslation[key])
    ) {
      return false;
    }
  }

  return true;
}

(async function () {
  const start = Date.now();

  const modifiedKeys = process.argv?.slice(2);
  const env = envSchema.parse({ keys: modifiedKeys });

  const translatableDirectories =
    await stages.identifyTranslatableDirectories();

  const defaultTranslation = await stages.loadDefaultTranslationFile();

  if (env.keys && env.keys.length > 0) {
    console.log(
      chalk.green(
        `✅ Successfully identified ${env.keys.length} modified keys.`
      )
    );

    console.log(chalk.yellow(env.keys?.join(", ")));

    const validSubset = env.keys.every((/** @type {string} */ element) => {
      return Object.keys(defaultTranslation).includes(element);
    });

    if (!validSubset) {
      throw new Error(
        "Not all modified keys exist in the default translation file."
      );
    } else {
      console.log(
        chalk.green(
          `✅ All modified keys exist in the default translation file.`
        )
      );
    }
  }

  await stages.translateDefaultTranslationFile(
    defaultTranslation,
    translatableDirectories,
    env.keys || []
  );

  await stages.validateTranslations(
    translatableDirectories,
    defaultTranslation
  );

  await stages.logSuccessMessageAndExit(start);
})().catch((error) => {
  console.error(chalk.red("Error running script."));
  console.error(error);
  process.exit(1);
});
