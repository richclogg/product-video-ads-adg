import { describe, it, expect } from 'vitest';
import { generateConfig } from '../jsonGenerator';
import { EXAMPLE_DATA } from '../testData';

describe('generateConfig', () => {
  it('generates two ad group configs from example data', () => {
    const { configs, errors } = generateConfig(EXAMPLE_DATA);

    expect(Object.keys(errors)).toHaveLength(0);
    expect(configs).toHaveLength(2);
  });

  it('produces correct top-level fields', () => {
    const { configs } = generateConfig(EXAMPLE_DATA);

    const hamburg = configs.find((c) => c.ad_group === 'Hamburg');
    const berlin = configs.find((c) => c.ad_group === 'Berlin');

    expect(hamburg).toBeDefined();
    expect(hamburg!.template_video).toBe('template.mp4');
    expect(hamburg!.content).toHaveLength(3);

    expect(berlin).toBeDefined();
    expect(berlin!.template_video).toBe('template.mp4');
    expect(berlin!.content).toHaveLength(3);
  });

  it('generates correct timing offsets for Hamburg', () => {
    const { configs } = generateConfig(EXAMPLE_DATA);
    const hamburg = configs.find((c) => c.ad_group === 'Hamburg')!;

    expect(hamburg.content[0]!.offset_s).toBe(11);
    expect(hamburg.content[0]!.duration_s).toBe(4);
    expect(hamburg.content[1]!.offset_s).toBe(15);
    expect(hamburg.content[1]!.duration_s).toBe(5);
    expect(hamburg.content[2]!.offset_s).toBe(20);
    expect(hamburg.content[2]!.duration_s).toBe(4);
  });

  it('each timing has 3 placements (price_text, product_image, title_text)', () => {
    const { configs } = generateConfig(EXAMPLE_DATA);
    const hamburg = configs.find((c) => c.ad_group === 'Hamburg')!;

    for (const timing of hamburg.content) {
      expect(timing.placements).toHaveLength(3);

      const elementIds = timing.placements.map((p) => p['element_id']);
      expect(elementIds).toContain('price_text');
      expect(elementIds).toContain('product_image');
      expect(elementIds).toContain('title_text');
    }
  });

  it('text placements have text_value from offer data', () => {
    const { configs } = generateConfig(EXAMPLE_DATA);
    const hamburg = configs.find((c) => c.ad_group === 'Hamburg')!;

    // First timing uses first offer (Apples)
    const firstTiming = hamburg.content[0]!;
    const priceText = firstTiming.placements.find(
      (p) => p['element_id'] === 'price_text'
    )!;
    expect(priceText['text_value']).toBe('€1.09');

    const titleText = firstTiming.placements.find(
      (p) => p['element_id'] === 'title_text'
    )!;
    expect(titleText['text_value']).toBe('Apples');
  });

  it('image placements have image_url from offer data', () => {
    const { configs } = generateConfig(EXAMPLE_DATA);
    const hamburg = configs.find((c) => c.ad_group === 'Hamburg')!;

    const firstTiming = hamburg.content[0]!;
    const productImage = firstTiming.placements.find(
      (p) => p['element_id'] === 'product_image'
    )!;
    expect(productImage['image_url']).toContain('apples.png');
    expect(productImage['image_width']).toBe(1000);
    expect(productImage['image_height']).toBe(1000);
  });

  it('image placements include zoom settings from offer', () => {
    const { configs } = generateConfig(EXAMPLE_DATA);
    const hamburg = configs.find((c) => c.ad_group === 'Hamburg')!;

    // First offer (Apples) has zoom: in, 1.3
    const firstImage = hamburg.content[0]!.placements.find(
      (p) => p['element_id'] === 'product_image'
    )!;
    expect(firstImage['zoom_effect']).toBe('in');
    expect(firstImage['zoom_amount']).toBe(1.3);

    // Second offer (Bananas) has no zoom
    const secondImage = hamburg.content[1]!.placements.find(
      (p) => p['element_id'] === 'product_image'
    )!;
    expect(secondImage['zoom_effect']).toBeUndefined();
    expect(secondImage['zoom_amount']).toBeUndefined();
  });

  it('returns error when offer count mismatches timing count', () => {
    const data = {
      ...EXAMPLE_DATA,
      offersToAdGroups: [
        // Only 2 offers for Hamburg but 3 timings needed
        { 'Offer ID': '1001', 'Output AdGroup': 'Hamburg' },
        { 'Offer ID': '1002', 'Output AdGroup': 'Hamburg' },
      ],
      adGroups: [EXAMPLE_DATA.adGroups[0]!],
    };

    const { configs, errors } = generateConfig(data);
    expect(errors['Hamburg']).toContain('Offer mismatch');
    expect(configs).toHaveLength(0);
  });

  it('returns error for duplicate offers', () => {
    const data = {
      ...EXAMPLE_DATA,
      offersToAdGroups: [
        { 'Offer ID': '1001', 'Output AdGroup': 'Hamburg' },
        { 'Offer ID': '1001', 'Output AdGroup': 'Hamburg' },
        { 'Offer ID': '1002', 'Output AdGroup': 'Hamburg' },
      ],
      adGroups: [EXAMPLE_DATA.adGroups[0]!],
    };

    const { errors } = generateConfig(data);
    expect(errors['Hamburg']).toContain('Redundant');
  });

  it('snake_case field keys match expected format', () => {
    const { configs } = generateConfig(EXAMPLE_DATA);
    const hamburg = configs[0]!;

    // Top-level keys
    expect('ad_group' in hamburg).toBe(true);
    expect('template_video' in hamburg).toBe(true);
    expect('content' in hamburg).toBe(true);

    // Placement keys
    const placement = hamburg.content[0]!.placements[0]!;
    expect('offset_x' in placement).toBe(true);
    expect('offset_y' in placement).toBe(true);
    expect('element_id' in placement).toBe(true);
  });
});
