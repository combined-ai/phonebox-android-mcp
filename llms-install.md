# Installing the Phonebox Android MCP server (for AI agents)

Phonebox's MCP server is hosted, so you don't need to clone, build or run anything. You only need an API key and one config entry.

## 1. Get an API key

If the user has no key yet, read https://phonebox.dev/setup.md and follow it. It installs the Phonebox CLI and signs the user in from the terminal. New accounts get $2 of free credit and don't need a card. Then put the key in the environment:

```bash
export PHONEBOX_API_KEY=$(phonebox token)
```

Never print the key, paste it into chat, or commit it.

## 2. Add the server

- URL: `https://phonebox.dev/mcp`
- Transport: Streamable HTTP. The server is stateless, takes POST only, and doesn't use OAuth.
- Header: `Authorization: Bearer <PHONEBOX_API_KEY>`

Claude Code:

```bash
claude mcp add --transport http phonebox https://phonebox.dev/mcp --header "Authorization: Bearer $PHONEBOX_API_KEY"
```

Cline (`cline_mcp_settings.json`), Cursor (`~/.cursor/mcp.json`) and other JSON-configured clients:

```json
{
  "mcpServers": {
    "phonebox": {
      "type": "streamableHttp",
      "url": "https://phonebox.dev/mcp",
      "headers": { "Authorization": "Bearer pbx_…" }
    }
  }
}
```

Cursor doesn't need the `type` field. Codex (`~/.codex/config.toml`):

```toml
[mcp_servers.phonebox]
url = "https://phonebox.dev/mcp"
bearer_token_env_var = "PHONEBOX_API_KEY"
```

## 3. Check it works

The server lists 13 tools: `list_phones`, `create_phone`, `get_phone`, `start_phone`, `park_phone`, `observe`, `act`, `reboot_phone`, `list_apps`, `install_app`, `create_app_upload`, `complete_app_upload` and `live_view_url`. A good first call is `list_phones`. It only reads and costs nothing.

## Rules when you use the phone

- `observe` before every `act`, then check the new screen.
- Don't repeat a write action because a response was slow or lost. `observe` first.
- Ask the user before signing in, paying or submitting anything. Use `live_view_url` to hand the phone to a person.
- Call `park_phone` when you finish. Parked phones are free and keep their apps and sign-ins. A running phone costs $0.06 a minute.
