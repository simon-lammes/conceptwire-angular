import { Injectable } from "@angular/core";
import { get, set } from "idb-keyval";

@Injectable({
  providedIn: "root",
})
export class LocalSettingsService {
  readonly localSettingsKey = "local-settings";

  async getLocalSettings() {
    return get(this.localSettingsKey);
  }

  async patchLocalSettings(updates: any) {
    const existingSettings = (await this.getLocalSettings()) ?? {};
    const newSettings = { ...existingSettings, ...updates };
    await set(this.localSettingsKey, newSettings);
  }
}
