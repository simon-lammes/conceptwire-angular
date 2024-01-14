import { Injectable } from "@angular/core";
import { injectQuery } from "@ngneat/query";
import { supabase } from "../../environments/supabase";

@Injectable({
  providedIn: "root",
})
export class ExerciseService {
  readonly query = injectQuery();

  getExercisesQuery() {
    return this.query({
      queryKey: ["exercises"],
      queryFn: async () =>
        await supabase
          .from("exercises")
          .select()
          .throwOnError()
          .then((x) => x.data),
    });
  }
}
