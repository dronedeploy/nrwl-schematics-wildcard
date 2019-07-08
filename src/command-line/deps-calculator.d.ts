import { ProjectNode } from './affected-apps';
export declare type DepGraph = {
    projects: ProjectNode[];
    deps: Deps;
};
export declare type NxDepsJson = {
    dependencies: Deps;
    files: FileDeps;
};
export declare type Deps = {
    [projectName: string]: Dependency[];
};
export declare type FileDeps = {
    [filePath: string]: Dependency[];
};
export declare type Dependency = {
    projectName: string;
    type: DependencyType;
};
export declare enum DependencyType {
    es6Import = "es6Import",
    loadChildren = "loadChildren",
    implicit = "implicit"
}
export declare function readDependencies(npmScope: string, projectNodes: ProjectNode[]): Deps;
/**
 * DO NOT USE
 * Only exported for unit testing
 *
 * USE `readDependencies`
 */
export declare function dependencies(npmScope: string, projects: ProjectNode[], existingDependencies: NxDepsJson | null, fileRead: (s: string) => string): Deps;
/**
 * Class for calculating dependencies between projects by processing files.
 */
export declare class DepsCalculator {
    private npmScope;
    private projects;
    private existingDeps;
    private fileRead;
    readonly incrementalEnabled: boolean;
    private _incremental;
    private deps;
    private readonly scanner;
    constructor(npmScope: string, projects: ProjectNode[], existingDeps: NxDepsJson, fileRead: (s: string) => string);
    /**
     * Write the current state of dependencies to a file
     * @param path Path of file to write to
     */
    commitDeps(path: string): void;
    /**
     * Retrieve the current dependencies
     */
    getDeps(): Deps;
    /**
     * Process a file and update it's dependencies
     */
    processFile(filePath: string): void;
    private isLegacyFormat;
    private shouldIncrementallyRecalculate;
    private initializeDeps;
    private setImplicitDepsFromProjects;
    private processNode;
    private getPropertyAssignmentName;
    private addDepIfNeeded;
    private setDependencyIfNotAlreadySet;
    private getStringLiteralValue;
}
