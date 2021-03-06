# GSheet2JSON

### Converts rows of a single-worksheet Google Sheets configuration file to JSON representation

## Dependency Info

### This application depends on the presence of valid "Google Application Credentials" derived from a *Service Account* that has the *Sheets API enabled* for access

> The environment variable *GOOGLE_APPLICATION_CREDENTIALS* is checked. If this variable is specified, it should point to a file that defines the credentials

### The simplest way to get a credential for this purpose is to create a Service account key in the Google API Console:
1. Go to the [API Console Credentials](https://console.developers.google.com/project/_/apis/credentials) page
2. From the project drop-down, select your project
3. On the Credentials page, select the Create credentials drop-down, then select Service account key
4. From the Service account drop-down, select an existing service account or create a new one
5. For Key type, select the JSON key option, then select Create. The file automatically downloads to your computer
6. Put the *.json file you just downloaded in a directory of your choosing. This directory must be private (you can't let anyone get access to this), but accessible to your web server code
7. Set the environment variable **GOOGLE_APPLICATION_CREDENTIALS** to the path of the JSON file downloaded

## Usage info

### Open terminal/command prompt from the folder where this project code is cloned or downloaded and install this app using:
    npm install

### Test run **./app/test/readGSheet.js** on terminal/command prompt using:
    node ./app/test/readGSheet.js

### Or, by running this:
    npm test

### Output would show data from the sample GSheets document read using credentials in *env-var* and further CLI usage info for the test script.

### In addition to test and sample (./app/test/quickStart.js), the previous code update enables an API server component that can be spun up using:
    node ./app/server/hapiServer.js

### Or, by running this:
    npm start

### The server starts at 127.0.0.1:55555 and accepts /gSheet2JSON/configurations [GET/POST] and /gSheet2JSON/configurations/{configId} [GET] routes for using the ProcessConfig features.
