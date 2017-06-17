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

### Test run **./app/test/readGSheet.js** on node prompt to verify whether data in the input Sheets document is read properly using the credentials
