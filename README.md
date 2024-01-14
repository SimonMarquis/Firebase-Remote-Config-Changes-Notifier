# 🔥 Firebase Remote Config changes notifier

> Notify changes in Firebase Remote Config in real time through Slack Webhooks.  
> 🥷 No more sneaky updates! 

### Requirements

- [Firebase Remote Config](https://firebase.google.com/docs/remote-config)
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions) ([Blaze](https://firebase.google.com/pricing) pricing plan)
- Google Cloud's [Secret Manager](https://cloud.google.com/secret-manager)
- Slack app with [Incoming Webhook](https://api.slack.com/messaging/webhooks)

### Setup

1. Install required npm dependencies:
   ```shell
   npm install
   ```
2. Install [Firebase CLI](https://firebase.google.com/docs/cli)
3. Setup Firebase project:
   ```shell
   firebase use --add
   ```
4. Configure Slack incoming webhook secret:
   ```shell
   firebase functions:secrets:set SLACK_INCOMING_WEBHOOK
   ```
5. Deploy the Firebase function:
   ```shell
   firebase deploy --only functions:remoteConfigUpdate
   ```

### Screenshots

| New Remote Config                                                                                                             | New condition                                                                                                         |
|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| ![](screenshots/new-remote-config-light.png#gh-light-mode-only) ![](screenshots/new-remote-config-dark.png#gh-dark-mode-only) | ![](screenshots/new-condition-light.png#gh-light-mode-only) ![](screenshots/new-condition-dark.png#gh-dark-mode-only) |

| Update Remote Config                                                                                                              | Rollback                                                                                                    |
|-----------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| ![](screenshots/update-rc-condition-light.png#gh-light-mode-only) ![](screenshots/update-rc-condition-dark.png#gh-dark-mode-only) | ![](screenshots/rollback-light.png#gh-light-mode-only) ![](screenshots/rollback-dark.png#gh-dark-mode-only) |

### Credits

- [andreyvit/json-diff](https://github.com/andreyvit/json-diff)
- [firebase/functions-samples/remote-config-diff](https://github.com/firebase/functions-samples/blob/main/Node/remote-config-diff)
- [eBay/firebase-remote-config-monitor](https://github.com/eBay/firebase-remote-config-monitor)
