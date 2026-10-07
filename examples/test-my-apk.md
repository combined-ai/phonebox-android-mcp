# Prompt: test the Android build you just made

Paste into Claude Code, Codex or Cursor with the Phonebox MCP server connected:

```text
Build the debug APK and install it on a Phonebox phone.
Walk through the onboarding and settings screens I changed in this branch.
Read the screen before every action. Report anything that looks broken,
with the screen text you saw. Park the phone when you finish.
```

Over MCP the agent uses `create_app_upload` → runs the returned `curl` → `complete_app_upload` → `install_app`,
then `observe` / `act` to walk the screens, and `park_phone` at the end.
