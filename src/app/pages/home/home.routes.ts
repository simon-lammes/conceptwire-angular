import { Routes } from "@angular/router";
import { HomePage } from "./home.page";

const routes: Routes = [
  {
    path: "",
    component: HomePage,
    children: [
      {
        path: "exercises",
        loadChildren: () => import("./exercises/exercises.routes"),
      },
    ],
  },
];

export default routes;
