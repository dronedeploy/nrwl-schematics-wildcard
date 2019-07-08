import { ImplicitDependencies } from './shared';
import { ProjectNode } from './affected-apps';
export declare function touchedProjects(implicitDependencies: ImplicitDependencies, projects: ProjectNode[], touchedFiles: string[]): string[];
export declare function getTouchedProjects(touchedFiles: string[]): string[];
