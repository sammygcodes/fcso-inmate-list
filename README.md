# fcso-inmate-list

## Prerequisites
- Install node.js: https://nodejs.org/en
- Verify that it was successfully installted by running `node -v` on Command Prompt/Powershell (Windows) or Terminal (MacOS)

## Installation
- Click green code button and copy HTTPS link
- In Command Prompt or Terminal run `git clone https://github.com/sammygcodes/fcso-inmate-list.git`
  - Tip: if you want the program folder to be on your desktop, run `cd desktop` before running git clone.
- After git clone is complete, `cd fcso-inmate-list`
- Now you should be in the program's folder. Run `npm install` to download the program dependencies.

## Usage
- In the project folder, run `npm run start`
- Enter the maximum bond amount. If you want all inmates, enter a very large number for now.
  - If an invalid amount is entered, it will prompt you again. 
- The program should start running and create an Excel spreadsheet in the project folder.
