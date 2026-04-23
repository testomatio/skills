---
name: check-api-client-from-swagger
description: Update API test client from changed fround in swagger.json. Tracks changes in swagger.json file, in case of changes updates api client, attempts to use dto types.
---

# CHECK-UPDATES-API-CLIENT-FROM-SWAGGER SKILL: What I do

Detect and manage duplicate test cases in user project. Provide clear recommendations for cleanup actions.

## When to Use

Triggers to quickly ensure that API client is sound
- when API test is failing
- when implementing new functionality that requires API setup
- user asks to check state of api client

---

## Workflow

1) check `playwirght_config.ts` and `.env` for new api servers. Specifically look for values like <SERVER_NAME>_SWAGGER_URL, SWAGGER_JSON_URL,  etc. <SERVER_NAME> is for cases when there are several backend instances

2) Check every swagger file `./apiClient/servers/<serverName>/swagger.json` if present

3) for every swagger.json without corresponding <SERVER_NAME>_SWAGGER_URL url dectected, notify user that this server apiClient is not refreshed

4) try to fetch <SERVER_NAME>_SWAGGER_JSON_URL and save pretified json in `./apiClient/servers/<serverName>/swagger.json`. If auth error is returned try to use admin:admin, if error persist give user information about problem ask for further instructions.

5) check git changes in the swagger.json files. If no changes detected than you finished give short message that no changes were detected and inline list of servers that have apiClient on them !STOP SKILL EXECTUION!

6) if changes in `<serverName>/swagger.json` files are present give short change list to user and trigger update-api-client-from-swagger skill
