/**
 * A Prompt Builder for our AI functions
 */

export default class PromptBuilder {
    private content: string[];
  
    constructor() {
      this.content = [];
    }
  
    public setContext(context?: string): this {
      this.content.push(
        `Context: ${
          context ||
          "You are a {subject} teacher with more than 25 years of teaching experience."
        }`
      );
      return this;
    }
  
    public setInstructions(...instructions: string[]): this {
      this.content.push(
        `Instruction: ${instructions.filter(Boolean).join("\n")}`
      );
      return this;
    }
  
    public setPersonalization(personalization: Record<string, string>): this {
      this.content.push(
        `Personalization: ${Object.entries(personalization)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")}`
      );
      return this;
    }
  
    public setRelevance(...relevance: string[]): this {
      this.content.push(`Relevance: ${relevance.filter(Boolean).join("\n")}`);
      return this;
    }
  
    public setConstraints(...constraints: string[]): this {
      this.content.push(`Constraint: ${constraints.filter(Boolean).join("\n")}`);
      return this;
    }
  
    public setMetadata(): this {
      this.content.push(
        `Relevance: Here is some additional metadata: {metadata}`
      );
      return this;
    }
  
    public setRequirements(...requirements: string[]): this {
      this.content.push(
        `Requirement: ${
          requirements?.filter(Boolean).join("\n") ||
          "Please adhere to the following format: {formatInstruction}"
        }`
      );
      return this;
    }
  
    public build(): string {
      return this.content.join("\n");
    }
  }