'''
MCP server containing various external tools to provide more context to user queries 
'''
from fastmcp import FastMCP

from typing import Any, Dict, List
from dotenv import load_dotenv
import os
import requests
import asyncio
load_dotenv()

mcp=FastMCP("external_tools_mcp")



#tool for planning workout session for users a/c to their daily habits
EXCERCISE_API_KEY=os.getenv("EXCERCISE_API_KEY")
API_URL="https://api.api-ninjas.com/v1/exercises"
@mcp.tool()
def get_excercises(
    name:str=None,
    type:str=None,
    muscle:str=None,
    difficulty:str=None,
    offset:int=0,
    limit:int=5
)->List[Dict[str,Any]]:
    params={
        "name":name,
        "type":type,
        "muscle":muscle,
        "difficulty":difficulty,
        "offset":offset
    }
    params={k: v for k , v in params.items() if v is not None}
    headers={"X-Api-Key":EXCERCISE_API_KEY}

    try:
        response=requests.get(API_URL,headers=headers,params=params)
        response.raise_for_status()
        data=response.json()
        return data[:limit]
    except requests.exceptions.RequestException as e:
        return {"error":str(e)}
    

if __name__=="__main__":
    print("mpc server is ready")
    asyncio.run(mcp.run_http_async(host="0.0.0.0",port=8004))


