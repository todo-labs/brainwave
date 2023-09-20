/**
 * A Prompt Builder for creating prompts for AI functions.
 */
export default class PromptBuilder {
  private content: string[];

  /**
   * Initializes a new instance of the PromptBuilder class.
   */
  constructor() {
    this.content = [];
  }

  /**
   * Sets the context of the prompt.
   *
   * @param context - The context of the prompt. Defaults to a generic teaching experience context.
   * @returns This `PromptBuilder` instance.
   *
   * @example
   * ```typescript
   * const prompt = new PromptBuilder()
   *   .setContext("You are a {subject} teacher with more than 25 years of teaching experience.")
   *   .setInstructions("Review the following comment: {comment}.")
   *   .build();
   * ```
   *
   * @default "You are a {subject} teacher with more than 25 years of teaching experience."
   */
  public setContext(context?: string): this {
    this.content.push(
      `Context: ${
        context ||
        "You are a {subject} teacher with more than 25 years of teaching experience."
      }`
    );
    return this;
  }

  /**
   * Sets the instructions for the prompt.
   *
   * @param instructions - An array of instructions for the prompt.
   * @returns This `PromptBuilder` instance.
   */
  public setInstructions(...instructions: string[]): this {
    this.content.push(
      `Instruction: ${instructions.filter(Boolean).join("\n")}`
    );
    return this;
  }

  /**
   * Sets personalization variables for the prompt.
   *
   * @param personalization - A dictionary of personalization variables and their values.
   * @returns This `PromptBuilder` instance.
   */
  public setPersonalization(personalization: Record<string, string>): this {
    this.content.push(
      `Personalization: ${Object.entries(personalization)
        .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
        .join("\n")}`
    );
    return this;
  }

  /**
   * Sets the relevance of the prompt.
   *
   * @param relevance - An array of relevance descriptions for the prompt.
   * @returns This `PromptBuilder` instance.
   */
  public setRelevance(...relevance: string[]): this {
    this.content.push(`Relevance: ${relevance.filter(Boolean).join("\n")}`);
    return this;
  }

  /**
   * Sets constraints for the prompt.
   *
   * @param constraints - An array of constraints for the prompt.
   * @returns This `PromptBuilder` instance.
   */
  public setConstraints(...constraints: string[]): this {
    this.content.push(`Constraint: ${constraints.filter(Boolean).join("\n")}`);
    return this;
  }

  /**
   * Sets metadata for the prompt.
   *
   * @returns This `PromptBuilder` instance.
   */
  public setMetadata(): this {
    this.content.push(
      `Relevance: Here is some additional metadata: {metadata}`
    );
    return this;
  }

  /**
   * Sets requirements for the prompt.
   *
   * @param requirements - An array of requirements for the prompt.
   * @returns This `PromptBuilder` instance.
   */
  public setRequirements(...requirements: string[]): this {
    this.content.push(
      `Requirement: ${
        requirements?.filter(Boolean).join("\n") ||
        "Please adhere to the following format: {formatInstruction}"
      }`
    );
    return this;
  }

  /**
   * Builds and returns the final prompt as a string.
   *
   * @returns The generated prompt string.
   */
  public build(): string {
    return this.content.join("\n");
  }
}
