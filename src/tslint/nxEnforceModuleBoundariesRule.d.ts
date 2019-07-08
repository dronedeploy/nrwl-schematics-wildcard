import * as Lint from 'tslint';
import { IOptions } from 'tslint';
import * as ts from 'typescript';
import { ProjectNode } from '../command-line/affected-apps';
import { Dependency } from '../command-line/deps-calculator';
export declare class Rule extends Lint.Rules.AbstractRule {
    private readonly projectPath?;
    private readonly npmScope?;
    private readonly projectNodes?;
    private readonly deps?;
    constructor(options: IOptions, projectPath?: string, npmScope?: string, projectNodes?: ProjectNode[], deps?: {
        [projectName: string]: Dependency[];
    });
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
