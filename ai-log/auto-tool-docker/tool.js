#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import { type } from 'os';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs-extra';

import inquirerPrompt from 'inquirer-autocomplete-prompt';
import fileSelector from 'inquirer-file-selector'
import { confirm, editor, password, input } from '@inquirer/prompts';

import AdmZip from "adm-zip";

inquirer.registerPrompt('autocomplete', inquirerPrompt);

import path from 'path';
import { fileURLToPath } from 'url';
import { exitCode } from 'process';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const program = new Command();
const dataFilePath = path.join(__dirname, 'data.json');

// Function to read data from JSON file
const readData = async () => {
    try {
        const data = await fs.readJson(dataFilePath);
        return data;
    } catch (error) {
        return {}; // Return empty object if file doesn't exist
    }
};

// Function to write data to JSON file
const writeData = async (newData) => {
    await fs.writeJson(dataFilePath, newData, { spaces: 2 });
};

// Function to filter the list based on user input
const searchChoices = (choices) => async (answersSoFar, input) => {
    input = input || ''; // Default to empty string if no input
    return new Promise((resolve) => {
        const filteredChoices = choices.filter((choice) =>
            choice.toLowerCase().includes(input.toLowerCase()) // Filter choices based on user input
        );
        resolve(filteredChoices); // Return filtered choices
    });
};

program
    .version('1.0.0')
    .description('A CLI helper for NTUA ECE SoftEng AI Log Creation')
    .command('create')
    .option('-s, --submit', 'Do Submit the new log')
    .description('Create a new Log Entry')
    .action(async (options) => {
        // Step 0: Get the available data options loaded
        const spinner = ora('Loading data...').start();
        let choices = await readData();
        spinner.stop();
        console.log(chalk.green('Data loaded successfully!'));

        // Step 1: Ask meta data options and save them in a JSON file
        const definiteQuestions = [
            {
                type: 'autocomplete',
                name: 'phase',
                message: 'Choose the phase:',
                source: searchChoices(choices['definite'].phase),
                loop: false,
            },
            {
                type: 'autocomplete',
                name: 'action',
                message: 'Choose the action:',
                source: searchChoices(choices['definite'].action),
                loop: false,
            },
            {
                type: 'autocomplete',
                name: 'scope',
                message: 'Choose the scope:',
                source: searchChoices(choices['definite'].scope),
                loop: false,
            },
            {
                type: 'autocomplete',
                name: 'tool option',
                message: 'Choose the tool option:',
                source: searchChoices(choices['definite']['tool option']),
                loop: false,
            }
        ];

        const numberQustions = choices['numeric'].map((question) => {
            return {
                type: 'number',
                name: question,
                message: `Enter (0-5): ${question}:`,
                validate(input) {
                    return new Promise((resolve, reject) => {
                        if (input >= 0 && input <= 5) {
                            resolve(true);
                        } else {
                            reject(chalk.red('Please enter a valid number.'));
                        }
                    });
                },
            };
        });

        const fillableQuestions = choices['to fill'].map((question) => {
            return {
                type: 'input',
                name: question,
                message: `Enter ${question}:`,
            };
        });

        const otherOptionalQuestions = [
            {
                type: 'autocomplete',
                name: 'language',
                message: 'Choose the language:',
                source: searchChoices(choices['possible other'].language),
                loop: false
            },
            {
                type: 'input',
                name: 'other language',
                message: 'Specify other language:',
                when: function(answers) {
                    return answers['language'] === 'other';
                }
            },
            {
                type: 'autocomplete',
                name: 'aimodel',
                message: 'Choose the aimodel:',
                source: searchChoices(choices['possible other'].aimodel),
                loop: false,
            },
            {
                type: 'input',
                name: 'open source aimodel',
                message: 'Specify the open source ai model:',
                when: function(answers) {
                    return answers['aimodel'] === 'open source';
                }
            }
        ];

        let questions = [...definiteQuestions, ...numberQustions, ...fillableQuestions, ...otherOptionalQuestions];

        questions.sort((a, b) => (choices['order'][a.name] - choices['order'][b.name]));

        let answers = await inquirer.prompt(questions);

        if (answers['other language'] === undefined) {
            answers['other language'] = ''
        }

        if (answers['open source aimodel'] === undefined) {
            answers['open source aimodel'] = ''
        }

        let results = []
        for (let ans in answers) {
            results.push({"name": ans, "res": answers[ans]});
        }

        results.sort((a, b) => (choices['order'][a.name] - choices['order'][b.name]));

        let metadata = results.reduce((acc, curr) => {
            acc.answers[curr.name] = curr.res;
            return acc;
        }, {answers: {}});

        // Step 1b: Persist filled in data
        let dir = './temp/';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        await fs.writeJson('temp/metadata.json', metadata, { spaces: 4 });

        // Step 2: Ask for the AI Log Conversation
        console.log(chalk.green("Now provide the conversation with the AI Tool..."));
        const fileExists = await confirm({ message: 'Do you have a file already?' });

        let filepath = 'temp/conversation.txt';

        if (fileExists) {
            // If it is already present, get it from a path input
            filepath = await fileSelector({
                message: 'Select the file:'
            });
            try {
                await fs.copy(filepath, 'temp/conversation.txt');
            } catch (err) {
                console.error(chalk.red("Problem with File Handling\nExiting..."));
                process.exit(1);
            }
        } else {
            // Otherwise prompt with an editor and save them in a txt file
            const conversation = await editor({
                message: 'Enter the conversation here',
                waitForUseInput: 'false'
            });

            const fileSpinner = ora(`Writing file...`);
            fs.writeFileSync('temp/conversation.txt', conversation, err => {
                if (err) {
                    console.error(err);
                    console.error(chalk.red("Problem with File Handling\nExiting..."));
                    process.exit(1);
                }
            });
            fileSpinner.stop();
        }

        // Step 3: Package the Files in a log-entry zip file
        const date = new Date();
        const day = date.toISOString().split('T')[0];
        const times = date.toISOString().split('T')[1].split(':');
        const time = times[0] + '-' + times[1];
        const formattedDate = day + '-' + time;

        const fileName = '../' + formattedDate + '-' + metadata['answers']['phase'].split(' ')[0] + '.zip';

        const zipSpinner = ora(`Creating archive ${fileName}...`);

        async function zip() {
            const zip = new AdmZip();
            zip.addLocalFolder("./temp");
            zip.writeZip(fileName);
            console.log(chalk.green(`Created ${fileName} successfully`));
        }
        zip();

        zipSpinner.stop();
        // If the user wants to submit the file proceed with submission
        if (options.submit === true) {
            // Step 4: Ask for Username and Password
            const user = await input({ message: 'Enter your username:' });
            const pass = await password({ message: 'Enter your password:', mask: true });

            // Step 5: Send the zip file to the server
            const submissionSpinner = ora(`Submitting...`);

            const sendPostRequest = async () => {
                const form = new FormData();

                form.append('username', user);
                form.append('password', pass);
                form.append('file', fs.createReadStream(fileName));

                try {
                    const response = await axios.post('https://ailog.softlab.ntua.gr/backend/upload', form, {
                        headers: {
                            ...form.getHeaders()
                        }
                    });
                    console.log('Response:', response.data);
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            sendPostRequest();

            submissionSpinner.stop();
        }

        // Step 6: Cleanup
        const cleanupSpinner = ora(`Cleaning up...`);
        fs.rm('./temp', { recursive: true, force: true }, err => {
            if (err) {
                throw err;
            }
        });
        cleanupSpinner.stop();

    });

program
    .command('submit')
    .action(async () => {

        const filepath = await fileSelector({
            message: 'Select the zip file to submit:'
        });

        const user = await input({ message: 'Enter your username:' });
        const pass = await password({ message: 'Enter your password:', mask: true });

        const submissionSpinner = ora(`Submitting...`);

        const sendPostRequest = async () => {
            const form = new FormData();

            form.append('username', user);
            form.append('password', pass);
            form.append('file', fs.createReadStream(filepath));

            try {
                const response = await axios.post('https://ailog.softlab.ntua.gr/backend/upload', form, {
                    headers: {
                        ...form.getHeaders()
                    }
                });
                console.log('Response:', response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        sendPostRequest();

        submissionSpinner.stop();
    });

program.parse(process.argv);
