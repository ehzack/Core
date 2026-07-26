import { Skills, writeOutput } from './index';

describe('Skills package', () => {
  it('should register package and activate skill correctly', async () => {
    const mockManifest: any = {
      id: 'test-skill',
      name: 'Test Skill',
      description: 'Test Skill Description',
      fields: []
    };

    Skills.registerPackage('test-skill', mockManifest, async () => {
      return {
        manifest: mockManifest,
        name: 'Test Skill',
        description: 'Test Skill Description',
        getTools: () => [],
        execute: async () => ({ ok: true })
      } as any;
    });

    expect(Skills.getCatalog().length).toBeGreaterThan(0);

    const instance = await Skills.activateSkill('test-skill');
    expect(instance.name).toBe('Test Skill');
    expect(Skills.hasSkill('test-skill')).toBe(true);
  });
});
