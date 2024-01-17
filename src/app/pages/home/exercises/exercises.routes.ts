import { Routes } from "@angular/router";
import { ExercisesPage } from "./exercises.page";
import { ExerciseDetailPage } from "./exercise-detail/exercise-detail.page";

const routes: Routes = [
  {
    path: "",
    component: ExercisesPage,
  },
  {
    path: ":exerciseId",
    component: ExerciseDetailPage,
  },
];

export default routes;
