/**
 * Build dictionary of names:
 */
export declare function names(name: string): any;
/**
 * hypenated to UpperCamelCase
 */
export declare function toClassName(str: string): string;
/**
 * Hypenated to lowerCamelCase
 */
export declare function toPropertyName(s: string): string;
/**
 * Upper camelCase to lowercase, hypenated
 */
export declare function toFileName(s: string): string;
/**
 * Determine the parent directory for the ngModule specified
 * in the full-path option 'module'
 */
export declare function findModuleParent(modulePath: any): string;
