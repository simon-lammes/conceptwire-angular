export interface Procedure {
  /**
   * How this procedure could be called in the UI. For example,
   * this could be used as the text of a button triggering the procedure.
   */
  name: string;
  /**
   * The procedure/function itself.
   */
  executor: () => Promise<void>;
  /**
   * The Material Icon that could represent this procedure.
   */
  icon: string;
}
