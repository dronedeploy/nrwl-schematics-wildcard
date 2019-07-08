import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
export interface AppConfig {
    appName: string;
    appModule: string;
}
export interface LibConfig {
    name: string;
    module: string;
    barrel: string;
}
export declare function getAppConfig(): AppConfig;
export declare function getLibConfig(): LibConfig;
export declare const schematicRunner: SchematicTestRunner;
export declare function runSchematic(name: string, options: any, tree: Tree): Promise<UnitTestTree>;
export declare function createEmptyWorkspace(tree: Tree): Tree;
export declare function createApp(tree: Tree, appName: string, routing?: boolean): Tree;
export declare function createLib(tree: Tree, libName: string): Tree;
