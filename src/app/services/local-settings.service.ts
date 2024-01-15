import { Injectable } from "@angular/core";
import { get, set } from "idb-keyval";
import { LocalSettings } from "../models/local-settings";

@Injectable({
  providedIn: "root",
})
export class LocalSettingsService {
  readonly localSettingsKey = "local-settings";

  async getLocalSettings(): Promise<LocalSettings | undefined> {
    return get(this.localSettingsKey);
  }

  async patchLocalSettings(updates: Partial<LocalSettings>) {
    const existingSettings = (await this.getLocalSettings()) ?? {};
    const newSettings = { ...existingSettings, ...updates };
    await set(this.localSettingsKey, newSettings);
  }
}
