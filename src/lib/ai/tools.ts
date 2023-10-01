import { Calculator } from "langchain/tools/calculator";
import { SerpAPI } from "langchain/tools";

export const tools = [new Calculator(), new SerpAPI()];
