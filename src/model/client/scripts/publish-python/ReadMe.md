### Publish & View Data

### 1. Setup Python Project

The setup to publish data is a 2-step process

1. Run [venv.ps1](./src/venv.ps1) in the `src` folder to create a [Python virtual environment](https://docs.python.org/3/tutorial/venv.html).
2. Run `pip install -r requirements.txt` to install dependent packages.  When doing this make sure the virtual environment is first activated [as seen here](./docs/images/report-publish-python-1.png).

### 2. Run Node Server

If all the packages are installed from running `build-run-local.ps1` from the `<project-root>/scripts` folder then simply run `npm start` from the package folder named `server`.  If not run `build-run-local.ps1` from the `<project-root>/scripts` folder.

### 3. View Data

To view the published data do the following.

1. Navigate to the [data viewer page (`http://localhost:3000/data-viewer`)](http://localhost:3000/data-viewer) and optionally refresh the page if was already up before the data was published.
2. Choose the various datasets to view from the dropdown.  Some data structures are transformed so they can be bound to a data grid.

### Potential Issues

- **Register Azure CLI as Client to API**: If you encounter the following error you *may* have to register the Azure CLI (ID: `04b07795-8ddb-461a-bbee-02f9e1bf7b46`) as part of the app registration as shown [here](./docs/images/report-publish-python-2.png).

  ```
  AADSTS650057: Invalid resource. The client has requested access to a resource which is not listed in the requested permissions in the client's application registration. Client app ID: 04b07795-8ddb-461a-bbee-02f9e1bf7b46 (Microsoft Azure CLI). Resource value from request: api://***. Resource app ID: ***. List of valid resources from app registration: 
  ```

  To test out the configuration attempt to run the following command before running the Python code to observe whether a token is returned.

  ```bash
  > az login
  > az account get-access-token --resource api://5c3f9ed1-652e-4684-b82d-3586ba549308
  
  {
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI1YzNmOWVkMS02NTJlLTQ2ODQtYjgyZC0zNTg2YmE1NDkzMDgiLCJpc3MiOiJodHRwczovL3N0cy53aW5k... <abbreviated>",
    "expiresOn": "2022-11-24 17:06:18.000000",
    "subscription": "...",
    "tenant": "...",
    "tokenType": "Bearer"
  }
  
  ```

  This [blog post](https://www.schaeflein.net/use-a-cli-to-get-an-access-token-for-your-aad-protected-web-api/) is the only information found for this issue.

- [Requests API](https://requests.readthedocs.io/en/latest/api/): Of course the header values need to be set correctly in order for the web server to properly process the request.  [This StackOverflow post](https://stackoverflow.com/questions/47506092/python-requests-get-always-get-404) may be helpful guidance.

