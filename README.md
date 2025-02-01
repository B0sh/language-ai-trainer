# Walden's AI Language Trainer

Hey, I'm Walden and this is my AI language trainer.

In an attempt to leverage LLM technology for listening practice, I created several tools to help practice language comprehension. 

## Table of Contents

-   [Features](#features)
-   [Installation](#installation)
-   [Notes on Language Learning](#notes-on-language-learning)


## Features

-   Select your own AI service providers for LLM and Text to Speech
-   Bring your own API key with Google or Open AI, or run your model locally with Ollama
-   Practice listening to numbers and dates in context with LLM generated sentences in your target language including those numbers
-   Practice listening comprehension with generated comprehension questions

### Target Language Support

-   🇺🇸 English
-   🇯🇵 Japanese

***More language support is planned!***

### Techincal Details

-   Written in Electron for cross platform app deployment
-   Uses React 19 and Typescript for frontend
-   Build pipeline created with Github Actions to automate building on Mac, Windows, and Linux


## Installation

This app has not been certified by the operating systems, so installing the app will require clicking through several prompts. If this is of concern to you, please build from source.

### Windows

Download the setup `.exe` from [this github repo](https://github.com/B0sh/language-trainer/releases/latest). To install you need to click on "More info" and then "Run anyway" on SmartScreen prompt.

### MacOS

Download the `.dmg` from [this github repo](https://github.com/B0sh/language-trainer/releases/latest). On macOS you can run it following [this guide](https://support.apple.com/guide/mac-help/mh40616/mac) to install apps from unknown developers.

### Linux

Linux builds are provided through electron, but no testing has been performed yet with linux.

## Notes on Language Learning

> [!WARNING] 
> **I'm making no argument with this project that this is "useful" to learn languages.** As someone who is at a high level in Japanese, I wanted to create a tool to specifically help me practice listening to numbers and dates which I was having trouble hearing at full speed when I was having conversations. I think there's a lot of potential in AI creating tailor made language learning content, but this project has made me realize that doing so is quite difficult. This app is likely best useful for intermediate to advanced language learners.
