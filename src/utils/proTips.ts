import { BrewMethod } from '../types';

export interface ExpertProTips {
  methodHeadline: string;
  temperature: string;
  grindSetting: string;
  goldenRule: string;
  baristaSecret: string;
  troubleshooting: string;
}

export function getExpertBrewingAdvice(method: BrewMethod, coffeeType: string): ExpertProTips {
  const normalizedType = (coffeeType || '').toLowerCase();
  const isColdBrew = normalizedType.includes('cold') || normalizedType.includes('ice');
  const isMilkDrink =
    normalizedType.includes('latte') ||
    normalizedType.includes('cappuccino') ||
    normalizedType.includes('flat white') ||
    normalizedType.includes('cortado') ||
    normalizedType.includes('macchiato');

  if (isColdBrew) {
    return {
      methodHeadline: 'Cold Immersion & Clarity Dial',
      temperature: '18°C–20°C (64°F–68°F) room temp or chilled filtered water',
      grindSetting: 'Extra-coarse (like rock salt or crushed peppercorns)',
      goldenRule: 'Never steep past 22 hours—prolonged cold soaking breaks down woody cellulose and imparts a bitter, paper-like astringency.',
      baristaSecret: 'Double-filter through both steel mesh and a wet paper V60 filter to strip out dense lipids for a clean, sweet nectar that stays fresh for 14 days in the fridge.',
      troubleshooting: 'If brew tastes watery or hollow, reduce water ratio to 1:7 or extend immersion to 20 hours.',
    };
  }

  if (isMilkDrink && method === 'espresso machine') {
    return {
      methodHeadline: 'Microfoam Physics & Espresso Sweetness Dial',
      temperature: '93°C (200°F) extraction · Steam milk to 60°C–65°C (140°F–150°F)',
      grindSetting: 'Fine, uniform espresso grind (yields 1:2 ratio in 25–28s)',
      goldenRule: 'Steam milk until glossy like wet house paint. Exceeding 68°C denatures milk whey proteins and destroys natural sweetness.',
      baristaSecret: 'Introduce air in the first 3 seconds ("gentle paper-tearing sounds"), then plunge the steam wand tip 1cm lower at a 45° angle to create a rapid whirlpool.',
      troubleshooting: 'Large bubbles in milk? Tap pitcher firmly on the counter once and swirl vigorously before pouring into espresso.',
    };
  }

  switch (method) {
    case 'V60':
      return {
        methodHeadline: 'Concentric Flow & Extraction Uniformity',
        temperature: '92°C – 94°C (198°F – 201°F) · Soft filtered water (~150ppm TDS)',
        grindSetting: 'Medium-fine (table salt consistency, ~22 clicks on Comandante)',
        goldenRule: 'Never pour water directly onto the paper filter walls—pour in steady concentric spiral motions to extract the central coffee bed.',
        baristaSecret: 'Give the dripper a gentle swirl right after pouring the bloom water. This collapses dry channels and guarantees 100% saturation within 5 seconds.',
        troubleshooting: 'Drawdown taking over 3:30 mins or tastes bitter? Coarsen grind by 2 clicks and elevate pouring kettle speed slightly.',
      };

    case 'espresso machine':
      return {
        methodHeadline: 'Puck Prep, Pressure & Flow Rate',
        temperature: '93°C (200°F) at the grouphead · 9 bar peak pressure',
        grindSetting: 'Fine & velvety (powdered sugar texture with soft grit)',
        goldenRule: 'Flawless puck prep: de-clump with needle WDT before a firm, 100% level tamp. Micro-channels ruin top-tier beans.',
        baristaSecret: 'Target a 1:2 to 1:2.2 brew ratio (18g dry in, 36g–40g liquid out) in 26–30s. Cut the shot the exact moment the stream blonds.',
        troubleshooting: 'Shot rushing in under 20s or tasting sour? Grind finer. If choking and dripping bitter drop-by-drop, coarsen grind.',
      };

    case 'French press':
      return {
        methodHeadline: 'Thermal Retention & Hoffmann Clarification',
        temperature: '94°C – 96°C (201°F – 205°F) · Always pre-heat the glass beaker',
        grindSetting: 'Coarse & uniform (like coarse sea salt or breadcrumbs)',
        goldenRule: 'Do not plunge violently to the bottom! Plunging compresses the silt bed and pumps bitter micro-fines into your brew.',
        baristaSecret: 'At minute 4, gently stir the crust to let grounds settle, then skim off the floating white foam and silty bubbles. Decant immediately.',
        troubleshooting: 'Silty texture in cup? Use the two-spoon skim technique and only lower the plunger to the water surface line as a strainer.',
      };

    case 'AeroPress':
      return {
        methodHeadline: 'Inversion Geometry & Gentle Pressure',
        temperature: '85°C – 88°C for medium roasts · 90°C – 92°C for light floral roasts',
        grindSetting: 'Medium-fine to medium (slightly finer than pour over)',
        goldenRule: 'Stop pressing the split second you hear the "hiss" of escaping air. Pushing past the hiss squeezes bitter astringent polyphenols.',
        baristaSecret: 'Try the Inverted Method: brew upside down to steep without any premature leakage, swirl 3 times, then invert and press with gentle elbow weight.',
        troubleshooting: 'Plunger resistant or impossible to press? Don’t force it; pause 10 seconds for grounds to settle or coarsen grind slightly.',
      };

    case 'moka pot':
      return {
        methodHeadline: 'Steam Chamber Physics & Thermal Stop Bath',
        temperature: 'Pre-boiled water in bottom boiler chamber (100°C)',
        grindSetting: 'Medium-fine (coarser than espresso, finer than pour over)',
        goldenRule: 'Never tamp the coffee funnel! Settle grounds with gentle taps on the counter and level flush with the rim using a knife or finger.',
        baristaSecret: 'The Cold Stop Bath: The split second the golden stream turns pale yellow or sputters, immediately run the base under cold tap water to stop cooking.',
        troubleshooting: 'Tastes metallic or burnt? Always start with boiling water so the dry coffee basket doesn’t bake over the flame while heating up.',
      };

    default:
      return {
        methodHeadline: 'Artisanal Specialty Dialing Advice',
        temperature: '92°C – 94°C (198°F – 201°F)',
        grindSetting: 'Dialed to brew method specifications',
        goldenRule: 'Freshly ground specialty beans within 30 days of roast provide 90% of flavor clarity.',
        baristaSecret: 'Weigh your coffee and water on a digital scale (0.1g accuracy) to maintain a golden 1:15 to 1:16 ratio.',
        troubleshooting: 'Sour = under-extracted (grind finer, hotter water). Bitter = over-extracted (grind coarser, cooler water).',
      };
  }
}
