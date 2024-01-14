import { Routes } from "@angular/router";
import { ExercisesPage } from "./exercises.page";
import { ExercisePage } from "./exercise/exercise.page";

const routes: Routes = [
  {
    path: "",
    component: ExercisesPage,
  },
  {
    path: ":id",
    component: ExercisePage,
  },
];

export default routes;
