# Phonebox: cloud phones for AI agents (Android MCP server)

**A hosted Android MCP server for Claude Code, Codex, Cursor and any MCP client, from Phonebox, the agent-first cloud phone.** Your agent gets a real
Android phone in the cloud. It can read the screen, tap, type, install your APK, hand off to a human, and
park the phone when it's done. You don't need ADB, Android Studio or an emulator.

```bash
claude mcp add --transport http phonebox https://phonebox.dev/mcp \
  --header "Authorization: Bearer $PHONEBOX_API_KEY"
```

▶ **Watch the 3-minute setup:** [Give Claude Code an Android Phone: Android MCP Server Setup](https://www.youtube.com/watch?v=-M4ppnKtPcg) · [transcript](https://phonebox.dev/guides/claude-code-android-mcp-server-setup)
▶ **Watch the 56-second demo:** [Give Claude Code an Android Phone (MCP)](https://www.youtube.com/shorts/DObhJkgfJMU) · [transcript](https://phonebox.dev/guides/give-claude-code-an-android-phone)

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

**Cursor:** add [`examples/cursor-mcp.json`](examples/cursor-mcp.json) to `~/.cursor/mcp.json` or `.cursor/mcp.json`. Guide: [give Cursor an Android phone](https://phonebox.dev/guides/give-cursor-an-android-phone).

**Codex:** add [`examples/codex-config.toml`](examples/codex-config.toml) to `~/.codex/config.toml` and `export PHONEBOX_API_KEY=$(phonebox token)`. Guide: [give Codex an Android phone](https://phonebox.dev/guides/give-codex-an-android-phone).

**Gemini CLI:**

```bash
gemini mcp add --transport http --scope user \
  --header "Authorization: Bearer $PHONEBOX_API_KEY" \
  phonebox https://phonebox.dev/mcp
```

**Windsurf, Cline and VS Code (GitHub Copilot):** setup pages for [Windsurf](https://phonebox.dev/guides/give-windsurf-an-android-phone), [Cline](https://phonebox.dev/guides/give-cline-an-android-phone) and [GitHub Copilot](https://phonebox.dev/guides/give-github-copilot-an-android-phone).

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
- [A phone per customer](examples/phone-per-customer.ts): find or create each customer's phone by your own ID.

## What people use it for

- **Testing the Android app the agent just built.** Build the APK, install it, walk the changed screens, report bugs with the exact screen text. [Guide](https://phonebox.dev/guides/test-android-app-with-ai) · [copy-paste test prompts](https://phonebox.dev/guides/ai-test-prompts-for-android-apps) · [reproduce a bug report with a screen recording](https://phonebox.dev/guides/reproduce-android-bugs-with-ai)
- **Using apps that have no API.** The agent reads the screen and taps through the app like a person, on its own phone, and hands you a live view link for payments and one-time codes. [Guide](https://phonebox.dev/guides/android-automation-with-ai)
- **A phone for each customer of an AI product.** One persistent phone per end user, tagged with your customer ID, parked between tasks so idle customers cost nothing. [Guide](https://phonebox.dev/guides/phones-for-your-ai-product) · [example](examples/phone-per-customer.ts)

## FAQ

**How can I give Claude Code an Android phone?**
Run the `claude mcp add` command at the top with a Phonebox API key. Claude Code gets a cloud Android phone it can read and control, with nothing to install. If you'd rather run everything locally, an emulator plus adb or a local server such as mobile-mcp also works; [every option, compared](https://phonebox.dev/guides/how-to-give-claude-code-an-android-phone).

**Is there a hosted Android MCP server I can use with Claude Code or Cursor?**
Yes, this one: `https://phonebox.dev/mcp`, Streamable HTTP with a bearer API key. The phones run in Phonebox's cloud, so it works from CI runners and cloud sandboxes where no emulator can run.

**How is it different from mobile-mcp or Appium MCP?**
Those run on your machine and drive an emulator or USB device you provide, and they also cover iOS. Phonebox brings the phone, keeps it signed in between sessions, and is Android only. [Comparison](https://phonebox.dev/guides/appium-mcp-vs-hosted-android-mcp).

**How can an AI agent use Android apps that have no API?**
By using the app's screen: the agent reads each screen as a numbered list of elements, taps and types by label, and reads again after every action. Phonebox gives it a phone to do that on, and a live view link when a person must step in.

**What does it cost?**
$0.06 per phone-minute while a phone runs, billed per second with a 1-minute minimum. Parked phones are free. A 10-minute test pass is $0.60. New accounts get $2 of credit, no card.

## What it isn't

Android only (no iOS), and there are no phone numbers, SMS or calls. Phonebox gives your agent the device, not telephony.

## Learn more

- [Cloud phones for AI agents: what they are and how to choose one](https://phonebox.dev/guides/cloud-phones-for-ai-agents)
- [Android MCP server guide](https://phonebox.dev/guides/android-mcp-server)
- [Test your Android app with an AI agent](https://phonebox.dev/guides/test-android-app-with-ai)
- [The best cloud phones for AI agents, compared](https://phonebox.dev/guides/best-cloud-phones-for-ai-agents)
- [Full MCP documentation](https://phonebox.dev/docs/interfaces/mcp)

---

Phonebox ([phonebox.dev](https://phonebox.dev)) is a cloud phone platform for AI agents. It is not a mobile carrier, phone plan or eSIM provider.
