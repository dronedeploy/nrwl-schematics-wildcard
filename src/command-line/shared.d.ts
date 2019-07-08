import { AffectedFetcher, ProjectNode } from './affected-apps';
import { YargsAffectedOptions } from './affected';
export declare type ImplicitDependencyEntry = {
    [key: string]: '*' | string[];
};
export declare type NormalizedImplicitDependencyEntry = {
    [key: string]: string[];
};
export declare type ImplicitDependencies = {
    files: NormalizedImplicitDependencyEntry;
    projects: NormalizedImplicitDependencyEntry;
};
export interface NxJson {
    implicitDependencies?: ImplicitDependencyEntry;
    npmScope: string;
    projects: {
        [projectName: string]: NxJsonProjectConfig;
    };
}
export interface NxJsonProjectConfig {
    implicitDependencies?: string[];
    tags?: string[];
}
export declare function parseFiles(options: YargsAffectedOptions): {
    files: string[];
};
export declare function getImplicitDependencies(projects: ProjectNode[], angularJson: any, nxJson: NxJson): ImplicitDependencies;
export declare function assertWorkspaceValidity(angularJson: any, nxJson: any): void;
export declare function getProjectNodes(angularJson: any, nxJson: NxJson): ProjectNode[];
export declare function readAngularJson(): any;
export declare function readNxJson(): NxJson;
export declare const getAffected: (affectedNamesFetcher: AffectedFetcher) => (touchedFiles: string[]) => string[];
export declare function getAffectedProjectsWithTarget(target: string): (touchedFiles: string[]) => string[];
export declare const getAffectedApps: (touchedFiles: string[]) => string[];
export declare const getAffectedProjects: (touchedFiles: string[]) => string[];
export declare const getAffectedLibs: (touchedFiles: string[]) => string[];
export declare function getAllAppNames(): string[];
export declare function getAllLibNames(): string[];
export declare function getAllProjectNamesWithTarget(target: string): string[];
export declare function getAllProjectsWithTarget(target: string): string[];
export declare function getProjectNames(predicate?: (projectNode: ProjectNode) => boolean): string[];
export declare function getProjectRoots(projectNames: string[]): string[];
export declare function allFilesInDir(dirName: string): {
    file: string;
    mtime: number;
}[];
export declare function lastModifiedAmongProjectFiles(projects: ProjectNode[]): number;
export declare function getProjectMTime(project: ProjectNode): number;
/**
 * Returns the time when file was last modified
 * Returns -Infinity for a non-existent file
 */
export declare function mtime(filePath: string): number;
export declare function normalizedProjectRoot(p: ProjectNode): string;
