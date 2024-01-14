import { createClient } from "@supabase/supabase-js";
import { environment } from "./environment";
import { Database } from "../app/models/database.types";

export const supabase = createClient<Database>(
  environment.supabaseUrl,
  environment.supabaseKey,
);
