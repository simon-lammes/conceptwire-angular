import { Routes } from "@angular/router";
import { HomePage } from "./home.page";

const routes: Routes = [
  {
    path: "",
    component: HomePage,
    children: [
      {
        path: "exercises-editor",
        loadChildren: () => import("./exercises-editor/routes"),
      },
    ],
  },
];

export default routes;
