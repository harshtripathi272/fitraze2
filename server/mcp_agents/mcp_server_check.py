from fastmcp.client import Client
from fastmcp.client.transports import StreamableHttpTransport
import asyncio

async def list_tools():
    transport = StreamableHttpTransport("http://localhost:8004/mcp")
    async with Client(name="fitness-check", transport=transport) as client:
        tools = await client.list_tools()
        tool_names=[t.name for t in tools]
        print("Available tools:", tools)
        print("tool_name:",tool_names[0])


async def test_tool():
    transport = StreamableHttpTransport("http://localhost:8004/mcp")
    async with Client(name="fitness-check", transport=transport) as client:
        params = {"muscle": "chest", "type": "strength", "difficulty": "beginner", "offset": 0}
        result = await client.call_tool("get_excercises", arguments=params)
        print(result.structured_content)

if __name__=="__main__":

    # asyncio.run(test_tool())

    asyncio.run(list_tools())