import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Core } from '@quatrain/core';

export interface SkillField {
   name: string;
   label: string;
   type: 'text' | 'password' | 'number' | 'boolean' | 'select' | 'textarea';
   placeholder?: string;
   description?: string;
   required?: boolean;
   default?: any;
   options?: { label: string; value: string }[];
}

export interface SkillManifest {
   $schema?: string;
   id: string;
   extends?: string;
   version?: string;
   name?: string;
   description?: string;
   icon?: string;
   category?: 'media' | 'knowledge' | 'erp' | 'communication' | 'utility' | 'system';
   kind?: 'skill' | 'ux-component' | 'recipe' | 'adapter' | 'service';
   entrypoint?: string;
   fields: SkillField[];
   capabilities?: {
      mcp?: boolean;
      tools?: string[];
   };
}

export interface ToolParameter {
   type: 'string' | 'number' | 'boolean' | 'array' | 'object';
   description: string;
   required?: boolean;
   items?: { type: string };
}

export interface ToolDefinition {
   name: string;
   description: string;
   parameters: Record<string, ToolParameter>;
}

export abstract class AbstractSkillAdapter {
   abstract readonly manifest: SkillManifest;

   get name(): string {
      return this.manifest.name || this.manifest.id;
   }

   get description(): string {
      return this.manifest.description || '';
   }

   public testConnection?(values: Record<string, any>): Promise<{ success: boolean; message?: string; error?: string }>;
   public updateConfig?(values: Record<string, any>): void;
   abstract getTools(): ToolDefinition[];
   abstract execute(toolName: string, params: any): Promise<any>;
}

export interface SkillRegistration {
   alias: string;
   manifest: SkillManifest;
   factory: (config?: any) => Promise<AbstractSkillAdapter> | AbstractSkillAdapter;
   instance?: AbstractSkillAdapter;
}

/**
 * Base utility container representing Agent skills logic.
 * Extends the Quatrain Core framework functionalities.
 */
export class Skills extends Core {
   static logger = this.addLogger('Skills');
   protected static _registeredPackages = new Map<string, SkillRegistration>();
   protected static _adapters = new Map<string, AbstractSkillAdapter>();

   /**
    * Register a skill package into the available skill catalog without instantiating its adapter.
    */
   public static registerPackage(
      alias: string,
      manifest: SkillManifest,
      factory: (config?: any) => Promise<AbstractSkillAdapter> | AbstractSkillAdapter,
      baseMeta?: { name?: string; version?: string; description?: string }
   ): void {
      const resolvedManifest: SkillManifest = {
         id: manifest.id || baseMeta?.name || alias,
         name: manifest.name || baseMeta?.name || alias,
         version: manifest.version || baseMeta?.version || '1.0.0',
         description: manifest.description || baseMeta?.description || '',
         icon: manifest.icon || '⚡',
         category: manifest.category || 'utility',
         kind: manifest.kind || 'skill',
         extends: manifest.extends,
         fields: manifest.fields || []
      };

      this._registeredPackages.set(alias, { alias, manifest: resolvedManifest, factory });
      this.info(`[Skills] Registered available skill package '${alias}' (${resolvedManifest.name})`);
   }

   /**
    * Register an active skill adapter instance into the active execution registry.
    */
   public static addSkill(alias: string, adapter: AbstractSkillAdapter): void {
      this._adapters.set(alias, adapter);
      if (this._registeredPackages.has(alias)) {
         this._registeredPackages.get(alias)!.instance = adapter;
      }
      this.info(`[Skills] Activated skill adapter '${alias}' (${adapter.name})`);
   }

   /**
    * Dynamically activate and instantiate a skill package by alias.
    */
   public static async activateSkill(alias: string, config?: any): Promise<AbstractSkillAdapter> {
      const reg = this._registeredPackages.get(alias);
      if (!reg) {
         throw new Error(`Skill package '${alias}' is not registered in the catalog.`);
      }

      const instance = await reg.factory(config);
      this.addSkill(alias, instance);
      return instance;
   }

   /**
    * Retrieve an active skill adapter by alias.
    */
   public static getSkill(alias: string): AbstractSkillAdapter | undefined {
      return this._adapters.get(alias);
   }

   /**
    * Check if a skill adapter is active.
    */
   public static hasSkill(alias: string): boolean {
      return this._adapters.has(alias);
   }

   /**
    * Returns all active skill adapters.
    */
   public static getSkills(): Map<string, AbstractSkillAdapter> {
      return this._adapters;
   }

   /**
    * Returns all registered skill package catalogs (manifests + active instances).
    */
   public static getCatalog(): SkillRegistration[] {
      return Array.from(this._registeredPackages.values());
   }

   /**
    * Returns all tool definitions across active skills.
    */
   public static getAllTools(): (ToolDefinition & { skillAlias: string })[] {
      const allTools: (ToolDefinition & { skillAlias: string })[] = [];
      for (const [alias, adapter] of this._adapters.entries()) {
         const tools = adapter.getTools();
         for (const tool of tools) {
            allTools.push({
               ...tool,
               skillAlias: alias
            });
         }
      }
      return allTools;
   }

   /**
    * Dispatches tool execution to the matching registered active skill.
    */
   public static async execute(toolName: string, params: any): Promise<any> {
      for (const [alias, adapter] of this._adapters.entries()) {
         const tools = adapter.getTools();
         if (tools.some(t => t.name === toolName)) {
            this.info(`[Skills] Executing tool '${toolName}' via skill '${alias}'`);
            return await adapter.execute(toolName, params);
         }
      }
      throw new Error(`Tool '${toolName}' not found in any registered skill.`);
   }

   /**
    * Safely writes JSON results to a file, automatically creating parent subfolders.
    */
   static async writeOutput(data: any, filePath: string): Promise<void> {
      try {
         const parentDir = dirname(filePath);
         if (parentDir && parentDir !== '.') {
            await mkdir(parentDir, { recursive: true });
         }
         await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
         this.info(`Success! Data written to: ${filePath}`);
      } catch (err: any) {
         this.error(`Error writing output to ${filePath}: ${err.message}`);
         throw err;
      }
   }
}

export const writeOutput = Skills.writeOutput.bind(Skills);

/**
 * Supported API client protocols/types.
 */
export type ApiClientType = 'rest' | 'xmlrpc';

/**
 * Configuration schema for the API client used by a skill.
 */
export interface SkillApiClientConfig {
   type: ApiClientType;
   endpointUrl: string;
   parameters: Record<string, any>;
}

/**
 * Definition of a remote method exposed or called by the skill.
 */
export interface RemoteMethodDefinition {
   name: string;
   description?: string;
   remoteName: string;
   httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
   parameters?: Record<string, {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object';
      required: boolean;
      description?: string;
   }>;
}

/**
 * Represents a skill that leverages an API client (REST or XML-RPC).
 */
export interface ApiSkillDefinition {
   name: string;
   description: string;
   client: SkillApiClientConfig;
   methods: RemoteMethodDefinition[];
}
