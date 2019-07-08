import { Deps } from './deps-calculator';
export declare enum ProjectType {
    app = "app",
    e2e = "e2e",
    lib = "lib"
}
export declare type ProjectNode = {
    name: string;
    root: string;
    type: ProjectType;
    tags: string[];
    files: string[];
    architect: {
        [k: string]: any;
    };
    implicitDependencies: string[];
    fileMTimes: {
        [filePath: string]: number;
    };
};
export declare type AffectedFetcher = (projects: ProjectNode[], dependencies: Deps, touchedProjects: string[]) => string[];
export declare function affectedAppNames(projects: ProjectNode[], dependencies: Deps, touchedProjects: string[]): string[];
export declare function affectedLibNames(projects: ProjectNode[], dependencies: Deps, touchedProjects: string[]): string[];
export declare function affectedProjectNames(projects: ProjectNode[], dependencies: Deps, touchedProjects: string[]): string[];
export declare function affectedProjectNamesWithTarget(target: string): AffectedFetcher;
