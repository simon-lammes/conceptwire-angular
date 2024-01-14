import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalSettingsService {
  readonly localSettingsKey = "local-settings";

  getLocalSettings() {
    const localSettings = localStorage.getItem(this.localSettingsKey);
    if (!localSettings) return undefined;
    try {
      return JSON.parse(localSettings);
    } catch (e) {
      return undefined;
    }
  }

  patchLocalSettings(updates: any) {
    const existingSettings = this.getLocalSettings() ?? {};
    const newSettings = { ...existingSettings, ...updates };
    localStorage.setItem(this.localSettingsKey, JSON.stringify(newSettings));
  }
}
