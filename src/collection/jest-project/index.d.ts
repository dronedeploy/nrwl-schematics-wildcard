import { Rule } from '@angular-devkit/schematics';
export interface JestProjectSchema {
    project: string;
    supportTsx: boolean;
    skipSetupFile: boolean;
    setupFile: 'angular' | 'web-components' | 'none';
    skipSerializers: boolean;
}
export default function (options: JestProjectSchema): Rule;
