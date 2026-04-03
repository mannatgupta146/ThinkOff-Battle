import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, StateGraph, START, END, ReducedValue } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { z } from "zod";
import { cohereModel, mistralModel, geminiModel } from "./ai.service.js";
import { createAgent, providerStrategy } from "langchain";

const STATE = new StateSchema({
  messages: MessagesValue,
  solution_1: new ReducedValue(z.string().default(""),{
    reducer: (current, next) => {
        return next
    }
  }),
  solution_2: new ReducedValue(z.string().default(""),{
    reducer: (current, next) => {        
        return next
    }
  }),
  judge_recommendation: new ReducedValue(z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0)
  }).default({
    solution_1_score: 0,
    solution_2_score: 0,
  }),{
    reducer: (current, next) => {
        return next
    }
  })
});

const solutionNode: GraphNode<typeof STATE> = async (state: typeof STATE.State) => {

    const input = state.messages[0]?.content as string;

    const [mistral_solution, cohere_solution] = await Promise.all([
        mistralModel.invoke(input),
        cohereModel.invoke(input)
    ]);

    return {
        solution_1: mistral_solution.content as string,
        solution_2: cohere_solution.content as string
    };
};

const judgeNode: GraphNode<typeof STATE> = async (state: typeof STATE.State) => {

    const { solution_1, solution_2 } = state;

    const judgeAgent = createAgent({
        model: geminiModel,
        tools: [],
        responseFormat: providerStrategy(
            z.object({
                solution_1_score: z.number().min(0).max(10),
                solution_2_score: z.number().min(0).max(10)
            })
        )
    });

    const judgeResponse = await judgeAgent.invoke({
        messages: [
            new HumanMessage(
                `Judge the following two solutions and give scores (0-10).\n\nSolution 1:\n${solution_1}\n\nSolution 2:\n${solution_2}`
            )
        ]
    });

    const result = judgeResponse.structuredResponse;

    return {
        judge_recommendation: result
    };
};    

const graph = new StateGraph(STATE)
    .addNode("solution", solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge")
    .addEdge("judge", END)
    .compile();

export default async function (input: string) {
    const result = await graph.invoke({
        messages: [new HumanMessage(input)]
    });

    console.log("Graph Result:", result); // 👈 HERE
    
    return result.messages;
}