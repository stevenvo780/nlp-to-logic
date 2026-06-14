import { PluginInfo, ProfilePlugin } from './types';
export declare class ProfileRegistry {
    private static plugins;
    static register(plugin: ProfilePlugin): void;
    static unregister(name: string): boolean;
    static get(name: string): ProfilePlugin | undefined;
    static list(): PluginInfo[];
    static has(name: string): boolean;
    static size(): number;
    static clear(): void;
}
//# sourceMappingURL=registry.d.ts.map