import fs from 'fs';
import path from 'path';
import { DeviceConfig } from '../data/types';
import { fileURLToPath } from 'url';

export class PresetStore {
  private presetsDir: string;

  constructor() {
    const __dirname = path.resolve(fileURLToPath(import.meta.url));
    this.presetsDir = path.resolve(__dirname, '..', '..', '..', '..', '..', 'presets');
    fs.mkdir(this.presetsDir, { recursive: true }, (err) => { })
  }

  load(tempId: string): Promise<DeviceConfig | null> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.presetsDir, `${tempId}.json`);
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve(null); // Preset not found
          } else {
            reject(err); // Other errors
          }
        } else {
          try {
            const preset: DeviceConfig = JSON.parse(data);
            resolve(preset);
          } catch (parseError) {
            reject(parseError); // JSON parse error
          }
        }
      });
    });
  }

  save(preset: DeviceConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.presetsDir, `${preset.tempId}.json`);
      fs.writeFile(filePath, JSON.stringify(preset, null, 2), (err) => {
        if (err) {
          reject(err); // Error writing file
        } else {
          resolve(); // Successfully saved
        }
      });
    });
  }
}
