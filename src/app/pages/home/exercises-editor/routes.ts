import { Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "**",
    loadChildren: () => import("./exercise-editor/exercise-editor.routes"),
  },
];

export default routes;
