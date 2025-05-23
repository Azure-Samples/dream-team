# Azure Container Apps remote MCP server example

This MCP server uses SSE transport and is authenticated with an API key.

## Running locally

Prerequisites:
* Python 3.11 or later
* [uv](https://docs.astral.sh/uv/getting-started/installation/)

Run the server locally:

```bash
uv venv
uv sync

# linux/macOS
export MCP_SERVER_API_KEY=<AN_API_KEY>
# windows
set MCP_SERVER_API_KEY=<AN_API_KEY>

uv run fastapi dev main.py
```

or

```bash
uv run fastapi dev main.py --port 8333
```

## Deploy to Azure Container Apps
done via AZD
```bash
azd deploy mcp
```


