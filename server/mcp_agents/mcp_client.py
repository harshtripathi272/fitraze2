from fastmcp.client import Client
from fastmcp.client.transports import WSTransport,StreamableHttpTransport

MCP_SERVER_URL = "http://localhost:8004/mcp"  # MCP server URL

async def call_mcp_tool(tool_name: str, **kwargs):
    """
    Call a tool exposed by the MCP server using FastMCP (v2.12.4).
    """
    transport = StreamableHttpTransport(MCP_SERVER_URL)
    
    # Initialize and connect the MCP client
    async with Client(transport=transport, name="fitness-data") as client:
        await client._connect()
        
        # Get the available tools
        tools_response = await client.list_tools()
        available_tools = [t.name for t in tools_response]
        
        if tool_name not in available_tools:
            raise ValueError(f"Tool '{tool_name}' not found. Available: {available_tools}")
        
        # Call the MCP tool with given params
        result = await client.call_tool(tool_name,arguments=kwargs)
        return result

