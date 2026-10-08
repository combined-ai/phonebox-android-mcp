# Phonebox Android MCP server

**A hosted Android MCP server for Claude Code, Codex, Cursor and any MCP client, from Phonebox, the agent-first cloud phone.** Your agent gets a real
Android phone in the cloud. It can read the screen, tap, type, install your APK, hand off to a human, and
park the phone when it's done. You don't need ADB, Android Studio or an emulator.

```bash
claude mcp add --transport http phonebox https://phonebox.dev/mcp \
  --header "Authorization: Bearer $PHONEBOX_API_KEY"
```

- **Endpoint:** `https://phonebox.dev/mcp` (Streamable HTTP, bearer API key)
- **Price:** $0.06 per phone-minute, billed per second, 1-minute minimum. Parked phones are free and keep their apps and sign-ins.
- **Start free:** $2 of credit, no card → [phonebox.dev](https://phonebox.dev)

> This repo holds the configs and examples. The server itself is hosted by Phonebox, so there's nothing to run.

## Why agent-first

Most cloud phones were built for social-media dashboards or QA test suites and added an API later. Phonebox was built for the agent: your agent signs you up from the terminal, reads the screen as text, gets errors with a `next` step, and never has a write retried behind its back. Idle phones park themselves for free.

## Why hosted instead of an ADB MCP server?

| | Local ADB MCP server | Phonebox hosted MCP |
|---|---|---|
| Where the phone runs | An emulator or USB phone on your machine | Phonebox's cloud |
| Setup | Android SDK, ADB, a system image | One URL and an API key |
| Works from CI, sandboxes and remote dev boxes | Only with nested virtualization or a device | Yes |
| State between sessions | Whatever your emulator keeps | Apps, files and sign-ins kept while parked |
| Human handoff | Someone at the machine | A live view link in any browser |

## Get an API key

The fastest way is to paste this into your coding agent. It signs you up from the terminal, and you never paste a key into the chat:

```text
Read https://phonebox.dev/setup.md and set me up with Phonebox from here: get me signed in and ready, then find out what I want to use phones for and help me with that.
```

Or create a key in the [console](https://phonebox.dev/app) and `export PHONEBOX_API_KEY=pbx_…`.

## Connect your client

**Claude Code** — run the command at the top, or commit this repo's [`.mcp.json`](.mcp.json). It reads the key from each person's environment:

```json
{
  "mcpServers": {
    "phonebox": {
      "type": "http",
      "url": "https://phonebox.dev/mcp",
      "headers": { "Authorization": "Bearer ${PHONEBOX_API_KEY}" }
    }
  }
}
```

**Cursor:** add [`examples/cursor-mcp.json`](examples/cursor-mcp.json) to `~/.cursor/mcp.json` or `.cursor/mcp.json`.

**Codex:** add [`examples/codex-config.toml`](examples/codex-config.toml) to `~/.codex/config.toml`.

**Any other client:** point it at `https://phonebox.dev/mcp` with an `Authorization: Bearer pbx_…` header. The server is stateless Streamable HTTP and doesn't use OAuth.

## Tools

| Tool | What it does |
|---|---|
| `create_phone` | Creates a cloud Android phone and waits until it's ready |
| `observe` | Reads the screen as a numbered text list, plus a 720px screenshot |
| `act` | Runs up to 20 actions in order: tap, type, swipe, scroll, open an app, wait for an element |
| `install_app` | Installs from the app library or from your own uploaded APK |
| `create_app_upload` / `complete_app_upload` | Uploads your APK with one `curl` command |
| `live_view_url` | A link for a person to watch and control the phone |
| `start_phone` / `park_phone` | Resumes a parked phone, or parks it to stop billing |
| `list_phones` / `get_phone` / `list_apps` / `reboot_phone` | Find phones, wait for them, list apps, restart a stuck phone |

What the agent reads from `observe`:

```text
app com.android.launcher3
screen 1080x2400
[1] EditText "Search apps" #search clickable editable (540,250)
[2] TextView "Chrome" #icon clickable (200,1900)
[3] TextView "Settings" #icon clickable (500,1900)
```

## Examples

- [Test the APK you just built](examples/test-my-apk.md): build, install, explore, and report bugs with the exact screen text.
- [TypeScript SDK agent](examples/agent.ts): create a phone, read the screen, tap, park.

## What it isn't

Android only (no iOS), and there are no phone numbers, SMS or calls. Phonebox gives your agent the device, not telephony.

## Learn more

- [Cloud phones for AI agents: what they are and how to choose one](https://phonebox.dev/guides/cloud-phones-for-ai-agents)
- [Android MCP server guide](https://phonebox.dev/guides/android-mcp-server)
- [Test your Android app with an AI agent](https://phonebox.dev/guides/test-android-app-with-ai)
- [The best cloud phones for AI agents, compared](https://phonebox.dev/guides/best-cloud-phones-for-ai-agents)
- [Full MCP documentation](https://phonebox.dev/docs/interfaces/mcp)
