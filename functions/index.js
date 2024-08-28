const admin = require("firebase-admin");
const jsonDiff = require("json-diff");
const logger = require("firebase-functions/logger");

const {onConfigUpdated} = require("firebase-functions/v2/remoteConfig");
const {defineSecret} = require("firebase-functions/params");
const {getRemoteConfig} = require("firebase-admin/remote-config");

const app = admin.initializeApp({credential: admin.credential.applicationDefault()});

// Register the private Slack incoming webhook secret
const slackIncomingWebhook = defineSecret("SLACK_INCOMING_WEBHOOK");

// Register for Remote Config updates
// @see https://firebase.google.com/docs/reference/functions/2nd-gen/node/firebase-functions.remoteconfig.configupdatedata
exports.remoteConfigUpdate = onConfigUpdated({secrets: [slackIncomingWebhook]}, async (event) => {
  logger.log("onConfigUpdated", event);
  const rc = getRemoteConfig(app);

  try {
    // Fetch Remote Config templates
    // @see https://firebase.google.com/docs/reference/admin/node/firebase-admin.remote-config.remoteconfigtemplate.md#remoteconfigtemplate_interface
    const current = await rc.getTemplateAtVersion(event.data.versionNumber);
    const previous = await rc.getTemplateAtVersion((event.data.versionNumber - 1));

    // Delete `etagInternal` and `version` properties to avoid polluting the final diff
    [previous, current].forEach((template) => {
      delete template.etagInternal;
      delete template.version;
    });

    // Diff Remote Config templates
    const diff = jsonDiff.diffString(previous, current, {maxElisions: 0});
    logger.log("diff", diff);

    // Build Slack payload https://api.slack.com/reference/block-kit/blocks
    const payload = {
      blocks: [
        // Header: image | author | project
        {
          "type": "context",
          "elements": [
            ...(event.data.updateUser?.imageUrl ? [{"type": "image", "image_url": event.data.updateUser?.imageUrl, "alt_text": "author image"}] : []),
            {"type": "mrkdwn", "text": `*Author*: ${event.data.updateUser?.name || event.data.updateUser?.email || "unknown"}`},
            {"type": "mrkdwn", "text": `*Project*: <https://console.firebase.google.com/project/${event.project}/config|${event.project}>`},
          ],
        },
        // Details: type | origin | version
        {
          "type": "context",
          "elements": [
            {"type": "mrkdwn", "text": `*Type*: ${event.data.updateType}`},
            {"type": "mrkdwn", "text": `*Origin*: ${event.data.updateOrigin}`},
            {"type": "mrkdwn", "text": `*Version*: ${event.data.versionNumber}`},
          ],
        },
        // Description
        ...(event.data.description ? [{"type": "context", "elements": [{"type": "mrkdwn", "text": `*Description*: ${event.data.description}`}]}] : []),
        // Diff
        ...(diff ? [{"type": "rich_text", "elements": [{"type": "rich_text_preformatted", "elements": [{"type": "text", "text": diff}]}]}] : []),
      ],
    };
    logger.log("payload", payload);

    // Send Slack message
    const result = await fetch(slackIncomingWebhook.value(), {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {"Content-Type": "application/json"},
    });
    logger.log(result);
  } catch (error) {
    logger.error(error);
  }
});
