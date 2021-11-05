## Overview
The goal of this challenge is to test your proficiency as a software engineer or developer in the
stack of your choosing as well as familiarity with the financial market or ability to quickly pick
up skills on the fly.

- Live Link : []()
- GitHub repo : [https://github.com/JoshuaMonyei/trove_test](https://github.com/JoshuaMonyei/trove_test)

### Cloning the Repository

1. Fork this repository https://github.com/JoshuaMonyei/trove_test
2. Open a terminal and clone the repository: `https://github.com/JoshuaMonyei/trove_test.git`

### Installing Dependencies

1. Ensure nodejs and git are installed in your machine `node -v && git --version`
   If they are not installed, you can follow the guide [here](#setting-up-for-windowslinuxmac) to install.
2. Change directory into the new clone. `cd trove_test`
3. Switch to the directory and install all dependencies using
   `yarn install` or `npm install`

### How to Run the App Locally

1. Now to run servers in development mode

- Run server

```
npm run dev   or   yarn run dev
```
```
Open http://127.0.0.1:5050/
```

## Local Development

### Linting

Linting is the automated checking of a source code for programmatic and stylistic errors. This is done by using a lint tool (otherwise known as linter). A lint tool is a basic static code analyzer. Linting is important to reduce errors and improve the overall quality of our code.

For the backend part of this project, the Google code style is used with some minor modifications. A code style is set of conventions (sometimes arbitrary) about how to write code for that project. It is much easier to understand a large codebase when all the code in it is in a consistent style.

### Commit Guide

This plugin uses Commitlint to ensure commits messages follow a particular convention using the conventional config. If you're totally new to this convention, that's totally fine.

> _Commit CheatSheet_
| Type     |                          | Description                                                                                                 |
| -------- | ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| feat     | Features                 | A new feature                                                                                               |
| fix      | Bug Fixes                | A bug fix                                                                                                   |
| docs     | Documentation            | Documentation only changes                                                                                  |
| style    | Styles                   | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)      |
| refactor | Code Refactoring         | A code change that neither fixes a bug nor adds a feature                                                   |
| perf     | Performance Improvements | A code change that improves performance                                                                     |
| test     | Tests                    | Adding missing tests or correcting existing tests                                                           |
| build    | Builds                   | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)         |
| ci       | Continuous Integrations  | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
| chore    | Chores                   | Other changes that don't modify backend, frontend or test files                                             |
| revert   | Reverts                  | Reverts a previous commit                                                                                   |


### Setting Up for Windows/Linux/Mac

- [How to install Git on Windows, Linux and macOS](https://www.digitalocean.com/community/tutorials/how-to-contribute-to-open-source-getting-started-with-git)

#### Windows

- [How to install node.js](https://phoenixnap.com/kb/install-node-js-npm-on-windows)
- Install yarn using `npm install --global yarn`
- Check installed yarn version `yarn --version`

#### macOS

- [How to install node.js on macOS](https://www.webucator.com/article/how-to-install-nodejs-on-a-mac/)
- Install Yarn using `npm install --global yarn` or `brew install yarn` or `curl -o- -L https://yarnpkg.com/install.sh | bash`
- Check installed yarn version `yarn --version`

#### Linux

- [How to install node.js on Linux PC](https://linuxconfig.org/how-to-install-node-js-on-linux)
- Install yarn using `npm install --global yarn`

  or

- Import the GPG key to verify the yarn packages: `curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`

- Enable the Yarn package manager repository: `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`

- Then install the yarn package manager: `sudo apt update && sudo apt install yarn`

- Check the installed yarn version: `yarn --version`

## Troubleshooting

### Possible Errors and Solutions

| Error                                                                                                                              | Probable Cause         | Solution                                                         |
| :--------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------- |
| -bash: git: command not found<br></br>'git' is not recognized as an internal or external command, operable program, or batch file. | Git is not installed.  | Install git. See guide [here.](#setting-up-for-windowslinuxmac)  |
| 'yarn' is not recognized as an internal or external command, operable program or batch file.                                       | yarn is not installed. | Install yarn. See guide [here.](#setting-up-for-windowslinuxmac) |

### Contact
If you have any questions, feel free to contact:
- Owner : [Josh](https://github.com/JoshuaMonyei)
