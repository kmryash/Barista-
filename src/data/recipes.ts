import { Recipe } from '../types';

export const SEEDED_RECIPES: Recipe[] = [
  // --- 5 FREE RECIPES ---
  {
    id: 'free-recipe-1',
    title: 'Classic Golden French Press',
    coffeeType: 'Immersion Filter',
    method: 'French press',
    difficulty: 'Beginner',
    prepTimeMins: 5,
    ingredients: [
      '30g coarse ground medium roast coffee',
      '500g filtered water at 94°C (201°F)',
      'Optional: Splash of whole milk or oat milk'
    ],
    steps: [
      'Preheat your French press beaker with hot water, then discard the rinse water.',
      'Add 30g coarse coffee grounds to the beaker.',
      'Pour all 500g of 94°C water vigorously, ensuring all coffee is evenly saturated.',
      'Place the plunger lid on top without pressing down. Let steep for 4 minutes.',
      'Use a spoon to break the crust on top and skim off floating foam and silty bubbles.',
      'Slowly press the plunger all the way down and decant immediately into warm mugs.'
    ],
    servings: 2,
    tasteProfile: 'Full-bodied, chocolatey sweetness with subtle toasted hazelnut notes',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'free-recipe-2',
    title: 'Everyday Moka Pot Stovetop Espresso',
    coffeeType: 'Stovetop Espresso',
    method: 'moka pot',
    difficulty: 'Beginner',
    prepTimeMins: 7,
    ingredients: [
      '18g medium-fine roast coffee',
      '200g boiling water (for boiler reservoir)',
      'Cold water (for thermal stop bath)'
    ],
    steps: [
      'Pre-boil water and fill the bottom boiler chamber just below the safety valve.',
      'Drop the metal basket into place and fill with freshly ground coffee level to the rim (do not tamp).',
      'Using a towel for grip, screw the top and bottom tightly together.',
      'Place over medium-low heat on the stovetop with the lid propped open.',
      'Watch for rich caramel crema flow. Once it starts sputtering and turns pale blond, quickly remove from heat.',
      'Wrap the base in a cold damp cloth or dip under cold tap water to stop extraction instantly. Serve hot.'
    ],
    servings: 2,
    tasteProfile: 'Bold, syrupy, intense dark cocoa with caramelized cane sugar finish',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'free-recipe-3',
    title: 'Smooth AeroPress Standard Brew',
    coffeeType: 'AeroPress Filter',
    method: 'AeroPress',
    difficulty: 'Beginner',
    prepTimeMins: 3,
    ingredients: [
      '15g medium-fine ground coffee',
      '220g hot water at 88°C (190°F)',
      'Standard circular paper filter'
    ],
    steps: [
      'Rinse the paper filter inside the cap with hot water to remove paper taste.',
      'Assemble the AeroPress in standard position over a sturdy glass server or mug.',
      'Add 15g coffee grounds and shake to level the bed.',
      'Start timer and pour 220g water evenly in 15 seconds.',
      'Stir three times with the paddle, insert plunger 1cm to create a vacuum seal, and steep until 1:15.',
      'Press down smoothly and steadily over 30 seconds until you hear a gentle hiss.'
    ],
    servings: 1,
    tasteProfile: 'Clean, sweet, ultra-smooth with zero bitterness and bright berry acidity',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'free-recipe-4',
    title: 'Clean Cup V60 Single Pour',
    coffeeType: 'Pour Over',
    method: 'V60',
    difficulty: 'Intermediate',
    prepTimeMins: 4,
    ingredients: [
      '15g medium specialty light roast coffee',
      '250g filtered mineral water at 92°C (198°F)',
      'V60 cone paper filter #02'
    ],
    steps: [
      'Fold and rinse the cone filter thoroughly in the ceramic or plastic dripper.',
      'Add 15g coffee grounds, make a small well in the center, and tare the scale.',
      'Pour 45g hot water for the bloom; swirl dripper gently twice. Wait 45 seconds.',
      'Slowly pour remaining water in gentle spiral circles up to 250g by the 1:45 mark.',
      'Give one final gentle swirl and let draw down completely by 2:45 to 3:00.'
    ],
    servings: 1,
    tasteProfile: 'Floral jasmine aroma, crisp green apple acidity, and lingering bergamot',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'free-recipe-5',
    title: 'Traditional Double Shot Espresso',
    coffeeType: 'Espresso',
    method: 'espresso machine',
    difficulty: 'Intermediate',
    prepTimeMins: 2,
    ingredients: [
      '18g fine espresso grind (9 bar pressure)',
      '36g extracted liquid yield',
      'Filtered water with 120-150 ppm mineral balance'
    ],
    steps: [
      'Purge and wipe dry the portafilter basket.',
      'Dose 18.0g freshly ground specialty espresso roast evenly.',
      'Distribute with WDT needle tool, tamp level with 25 lbs firm pressure.',
      'Purge brew group head for 2 seconds, lock in portafilter, and start extraction immediately.',
      'Extract 36g beverage weight in 27 to 30 seconds with tiger-striped golden crema.'
    ],
    servings: 1,
    tasteProfile: 'Dense syrupy mouthfeel, dark stone fruit, roasted almond, and rich molasses',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80'
  },

  // --- 20 PREMIUM RECIPES ---
  {
    id: 'premium-recipe-6',
    title: 'Hoffmann-Style V60 Blooming Champion',
    coffeeType: 'Pour Over',
    method: 'V60',
    difficulty: 'Advanced',
    prepTimeMins: 5,
    ingredients: [
      '30g light-roast washed Ethiopian Yirgacheffe',
      '500g water at 98°C',
      'Tabbed V60 filter papers'
    ],
    steps: [
      'Rinse paper and preheat brewer thoroughly with boiling water.',
      'Add 30g coffee, shake flat. Pour 60g bloom water in concentric circles and swirl gently.',
      'Wait until 0:45. Pour up to 300g by 1:15 in steady spiral.',
      'Pour remaining 200g gently by 1:45, keeping water level consistent.',
      'Stir once clockwise and once counter-clockwise, give a gentle tap to level the bed, and allow drawdown.'
    ],
    servings: 2,
    tasteProfile: 'Bergamot, peach tea, vibrant citrus zest, clean silky finish',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-7',
    title: 'Velvety Microfoam Flat White',
    coffeeType: 'Milk-based',
    method: 'espresso machine',
    difficulty: 'Intermediate',
    prepTimeMins: 4,
    ingredients: [
      '19g double ristretto espresso grind',
      '130ml steamed whole milk or barista oat milk (60°C)',
      'Ceramic tulip cup 160ml'
    ],
    steps: [
      'Pull a short double ristretto (19g dry in to 34g liquid out in 24s).',
      'Purge steam wand, submerge tip 1cm, and incorporate air for 2 seconds with quiet paper-tearing sound.',
      'Drop pitcher to create a fast whirlpool spinning microfoam until pitcher is comfortably warm to touch (60°C).',
      'Tap out any tiny bubbles, swirl the milk pitcher to maintain glossy wet-paint texture.',
      'Pour high to integrate base, then drop spout low to create a sharp contrast white tulip art rosette.'
    ],
    servings: 1,
    tasteProfile: 'Velvety sweet milk emulsion balanced by rich dark chocolate and toasted cashew notes',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-8',
    title: 'Slow-Drip Kyoto Cold Brew via V60',
    coffeeType: 'Cold Brew',
    method: 'V60',
    difficulty: 'Master',
    prepTimeMins: 15,
    ingredients: [
      '40g medium-coarse African Bourbon roast',
      '200g ice cubes + 300g cold filtered water',
      'Circular paper aeropress disc on top of coffee bed'
    ],
    steps: [
      'Place rinsed paper filter in V60 cone.',
      'Add 40g coffee and pre-wet thoroughly with 50g cold water to avoid dry pockets.',
      'Place a small round paper filter on top of the grounds for water dispersion.',
      'Stack ice and cold water in a dripper above, regulating flow to 1 drip every 1.5 seconds.',
      'Collect the cold nectar over 3 to 4 hours in the refrigerator.',
      'Serve over a single crystal-clear ice block.'
    ],
    servings: 3,
    tasteProfile: 'Liqueur-like complexity, sweet black currant, cacao nibs, zero astringency',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-9',
    title: 'Inverted AeroPress Championship Recipe',
    coffeeType: 'AeroPress Filter',
    method: 'AeroPress',
    difficulty: 'Advanced',
    prepTimeMins: 3,
    ingredients: [
      '18g medium-coarse washed Geisha or Gesha roast',
      '160g water at 85°C',
      '60g bypass water at room temperature'
    ],
    steps: [
      'Invert the AeroPress so plunger is at the bottom, pulled to the #4 marker.',
      'Add 18g coffee. Pour 100g water at 85°C quickly in 10 seconds.',
      'Stir vigorously 10 times in 10 seconds. Pour remaining 60g water up to 160g.',
      'Rinse filter cap with dual paper filters and screw cap on securely.',
      'At 1:15, gently expel air, invert onto a decanter, and plunge gently for 30 seconds.',
      'Add 60g bypass water to the finished concentrate, swirl and serve.'
    ],
    servings: 1,
    tasteProfile: 'Silky, tea-like clarity with passionfruit, honeysuckle, and candied lime',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-10',
    title: 'Neapolitan Spiced Moka Crema',
    coffeeType: 'Stovetop Specialty',
    method: 'moka pot',
    difficulty: 'Intermediate',
    prepTimeMins: 8,
    ingredients: [
      '20g dark Italian roast coffee',
      'Pinch of freshly ground organic green cardamom',
      '1 tsp raw demerara sugar',
      'Preheated mineral water'
    ],
    steps: [
      'Fill boiler with preheated water just below the brass release valve.',
      'Mix fine cardamom powder into the ground coffee and level in the funnel.',
      'In a warm ceramic cup, add 1 tsp raw sugar.',
      'As the very first 10ml of dark coffee foam oozes from the Moka spout, spoon it immediately into the sugar.',
      'Vigorously whisk the drops into the sugar with a spoon for 45 seconds until it turns into a pale, glossy cream (cremina).',
      'Pour the remaining hot moka coffee over the cremina and stir gently.'
    ],
    servings: 2,
    tasteProfile: 'Cardamom aroma, thick golden foam cap, dark molten chocolate sweetness',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-11',
    title: 'Heavy Body French Press Cold Steeper',
    coffeeType: 'Cold Immersion',
    method: 'French press',
    difficulty: 'Beginner',
    prepTimeMins: 10,
    ingredients: [
      '60g very coarse dark roast Colombian Supremo',
      '450g chilled mineral water',
      'Ice cubes and fresh mint sprig for serving'
    ],
    steps: [
      'Add coarse ground coffee directly to French press carafe.',
      'Pour chilled water, stir with a wooden paddle to ensure total submersion.',
      'Cover with plunger placed just above the surface to keep grounds submerged.',
      'Place in the refrigerator to steep for 16 to 18 hours.',
      'Gently press the metal filter down.',
      'Pour through a secondary paper filter or fine sieve over ice.'
    ],
    servings: 3,
    tasteProfile: 'Dense chocolate fudge, sweet pipe tobacco notes, ultra-smooth caramel',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-12',
    title: 'Spanish Honey Cortado',
    coffeeType: 'Milk-based',
    method: 'espresso machine',
    difficulty: 'Intermediate',
    prepTimeMins: 4,
    ingredients: [
      '18g espresso roast',
      '1 tsp raw wildflower honey',
      '45ml gently steamed whole milk with light microfoam',
      'Pinch of organic Ceylon cinnamon'
    ],
    steps: [
      'Drizzle 1 tsp pure wildflower honey into the bottom of a 4oz Gibraltar glass.',
      'Extract a 36g double shot espresso directly over the honey.',
      'Stir vigorously with a small barista spoon until honey dissolves into the hot espresso.',
      'Steam 45ml milk to 58°C with just a razor-thin layer of silky microfoam.',
      'Pour milk into the glass in equal 1:1 proportion to the espresso.',
      'Dust lightly with Ceylon cinnamon.'
    ],
    servings: 1,
    tasteProfile: 'Warm honeyed sweetness, cinnamon spice, velvety espresso crema finish',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-13',
    title: 'AeroPress Bypass Americano',
    coffeeType: 'Specialty Americano',
    method: 'AeroPress',
    difficulty: 'Beginner',
    prepTimeMins: 3,
    ingredients: [
      '17g fine-medium roast specialty beans',
      '80g water at 90°C (for extraction)',
      '140g hot water at 90°C (for bypass dilution)'
    ],
    steps: [
      'Rinse double paper filters in the AeroPress cap.',
      'Add 17g fine coffee to the cylinder over a sturdy glass decanter.',
      'Add 80g hot water, stir 20 times to achieve rapid high extraction.',
      'Insert plunger and press down firmly in 25 seconds to yield a dense 65g concentrate.',
      'Pour 140g clean hot water directly into the decanter to bypass the coffee bed.',
      'Swirl and enjoy an Americano with zero over-extracted bitter tannins.'
    ],
    servings: 1,
    tasteProfile: 'Clean, sweet, refreshing with sweet dried dates and milk chocolate notes',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-14',
    title: 'Single Origin Ethiopian Yirgacheffe V60',
    coffeeType: 'Pour Over',
    method: 'V60',
    difficulty: 'Advanced',
    prepTimeMins: 5,
    ingredients: [
      '20g light roast heirloom Ethiopian beans',
      '320g mineralized water (third wave water balance) at 93°C',
      'Bleached paper filter'
    ],
    steps: [
      'Rinse filter paper with 100g water to remove taste; discard rinse.',
      'Grind coffee to medium-fine (resembling kosher salt) and level bed.',
      'Bloom with 60g water for 40 seconds; gentle figure-eight swirl.',
      'Second pour: add 100g water up to 160g at a steady 5g/sec rate.',
      'Third pour: add 80g up to 240g, maintaining water column height.',
      'Final pour: add 80g up to 320g. Let complete drawdown finish at 3:15.'
    ],
    servings: 1,
    tasteProfile: 'Explosive floral jasmine, lemongrass, apricot nectar, and Earl Grey finish',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-15',
    title: 'Cuban Style Whipped Sugar Moka (Café Cubano)',
    coffeeType: 'Stovetop Sweet',
    method: 'moka pot',
    difficulty: 'Intermediate',
    prepTimeMins: 8,
    ingredients: [
      '22g dark roasted Cuban/Latin blend',
      '1.5 tbsp pure cane white sugar',
      'Filtered hot water'
    ],
    steps: [
      'Pack moka funnel firmly without hard tamping.',
      'In a stainless steel creamer jug, place 1.5 tbsp granulated cane sugar.',
      'When the first dark black drips emerge from the moka column, collect 1 teaspoon in the jug.',
      'Beat furiously with a small whisk or spoon for 2 full minutes until an ivory whipped paste forms (espuma).',
      'Once the pot brews completely, pour the steaming coffee into the jug.',
      'Stir gently to bring the thick, frothy espuma to the top and pour into demitasse cups.'
    ],
    servings: 2,
    tasteProfile: 'Syrupy caramel foam cap, smoky dark chocolate, sweet molasses punch',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-16',
    title: 'Vanilla Bean Oat Milk Iced Shakerato',
    coffeeType: 'Iced Specialty',
    method: 'espresso machine',
    difficulty: 'Beginner',
    prepTimeMins: 3,
    ingredients: [
      'Double shot freshly pulled espresso (38g)',
      '1/2 tsp Madagascar vanilla bean paste',
      '60ml barista oat milk',
      '8 large solid ice cubes',
      '1 tsp agave nectar or simple syrup'
    ],
    steps: [
      'Extract a double espresso over the vanilla bean paste and agave.',
      'Fill a cocktail shaker to the top with solid ice cubes.',
      'Pour the hot vanilla espresso and oat milk over the ice.',
      'Seal shaker tightly and shake with maximum power for 15 seconds until frost forms on the metal outside.',
      'Double strain through a cocktail sieve into a chilled coupe glass.',
      'Garnish with a shaved vanilla pod or coffee bean.'
    ],
    servings: 1,
    tasteProfile: 'Creamy, frothy iced texture, toasted oats, natural fragrant vanilla, crisp coffee backbone',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-17',
    title: 'Cardamom & Orange Zest French Press',
    coffeeType: 'Immersion Spiced',
    method: 'French press',
    difficulty: 'Intermediate',
    prepTimeMins: 6,
    ingredients: [
      '28g coarse medium roast Colombian coffee',
      '3 green cardamom pods, lightly cracked open',
      '1 strip fresh orange peel (white pith removed)',
      '480g water at 95°C'
    ],
    steps: [
      'Add coarse coffee grounds and cracked cardamom pods to the French press.',
      'Twist the orange peel to express fragrant citrus oils over the beaker, then drop it in.',
      'Pour 480g hot water in a steady swirl.',
      'Stir gently twice with a wooden spoon and place plunger on top.',
      'Steep undisturbed for 4 minutes 30 seconds.',
      'Skim crust surface and press plunger down gently. Decant immediately into ceramic mugs.'
    ],
    servings: 2,
    tasteProfile: 'Bright aromatic orange blossom, warm herbal cardamom, nutty dark cocoa',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-18',
    title: 'AeroPress Espresso-Style Concentrate',
    coffeeType: 'Concentrate',
    method: 'AeroPress',
    difficulty: 'Intermediate',
    prepTimeMins: 3,
    ingredients: [
      '20g ultra-fine espresso grind',
      '60g water at 86°C',
      'Two paper filters or metal disc filter'
    ],
    steps: [
      'Rinse two paper filters inside the cap to build greater hydraulic resistance.',
      'Assemble AeroPress in standard position over a thick espresso cup.',
      'Add 20g finely ground coffee. Tap sides to level.',
      'Add 60g water at 86°C and stir vigorously for 25 seconds to generate emulsification.',
      'Insert plunger and press down with deliberate, firm weight for 25 seconds.',
      'Yields a dense, textured 45ml concentrate perfect as a latte or tonic base.'
    ],
    servings: 1,
    tasteProfile: 'Super concentrated chocolate, roasted walnuts, thick viscosity, low acidity',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-19',
    title: 'Japanese Flash Chilled Iced V60',
    coffeeType: 'Iced Filter',
    method: 'V60',
    difficulty: 'Advanced',
    prepTimeMins: 5,
    ingredients: [
      '24g medium specialty light roast (Kenyan or Washed Colombian)',
      '240g hot water at 94°C',
      '160g clear ice cubes inside the receiving glass carafe'
    ],
    steps: [
      'Weigh 160g solid ice cubes directly into the glass serving server.',
      'Place rinsed V60 filter and dripper on top of the ice carafe.',
      'Add 24g coffee grounds. Bloom with 60g water for 45 seconds.',
      'Pour remaining 180g water in slow, concentrated pulses up to 2:15.',
      'The hot brew extracts delicate aromatics and flashes immediately over the ice, locking in volatile aromatics.',
      'Swirl until ice dissolves halfway. Serve in a chilled wine glass.'
    ],
    servings: 2,
    tasteProfile: 'Vibrant red currant, blackberry, sparkling malic acidity, refreshing clean finish',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-20',
    title: 'Artisanal Affogato al Caffè',
    coffeeType: 'Dessert Coffee',
    method: 'espresso machine',
    difficulty: 'Beginner',
    prepTimeMins: 2,
    ingredients: [
      '1 scoop high-grade artisanal Fior di Latte or Madagascar vanilla gelato',
      '1 double shot fresh espresso (36g)',
      'Optional: Shaved dark chocolate (70%) or crushed amaretto biscotti'
    ],
    steps: [
      'Chill a dessert glass or coupe in the freezer for 15 minutes.',
      'Place one neat, firm round scoop of vanilla gelato directly in the center.',
      'Pull a hot, concentrated double espresso shot directly into a small ceramic pitcher.',
      'Pour the piping hot espresso immediately over the crown of the cold gelato table-side.',
      'Top with a pinch of dark chocolate shavings and serve immediately with a spoon.'
    ],
    servings: 1,
    tasteProfile: 'Sensory contrast of blistering hot bitter espresso melting into sweet creamy vanilla cream',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1594910074213-9b9356d4faec?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-21',
    title: 'Cacao Infused Rich French Press',
    coffeeType: 'Infused Immersion',
    method: 'French press',
    difficulty: 'Intermediate',
    prepTimeMins: 6,
    ingredients: [
      '26g coarse medium-dark roast coffee',
      '8g organic roasted cacao nibs',
      'Pinch of sea salt flakes',
      '480g water at 93°C'
    ],
    steps: [
      'Crush cacao nibs lightly with a mortar and pestle to release aromatic theobromine fats.',
      'Combine coarse coffee grounds, cacao nibs, and sea salt in the French press carafe.',
      'Pour hot water evenly. Stir 4 times to integrate.',
      'Steep with plunger on top for 5 minutes.',
      'Press plunger smoothly and pour into pre-warmed ceramic mugs.'
    ],
    servings: 2,
    tasteProfile: 'Decadent dark truffle chocolate, toasted nuts, silky body, subtle savory depth',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-22',
    title: 'Caramelized Brown Butter Moka Latte',
    coffeeType: 'Milk-based',
    method: 'moka pot',
    difficulty: 'Intermediate',
    prepTimeMins: 9,
    ingredients: [
      '20g moka ground dark espresso beans',
      '1 tsp grass-fed unsalted butter',
      '1 tsp brown sugar',
      '150ml warmed frothed whole or oat milk'
    ],
    steps: [
      'Brew rich moka pot coffee on low heat.',
      'In a small warm skillet, melt 1 tsp butter with brown sugar on low heat for 1 minute until nut-brown and aromatic.',
      'Pour the browned butter syrup into your latte glass.',
      'Add 60ml freshly brewed moka coffee and stir well.',
      'Top with 150ml velvety frothed hot milk.'
    ],
    servings: 1,
    tasteProfile: 'Browned hazelnut butter aroma, creamy caramel, toasted brioche and espresso harmony',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-23',
    title: 'Low-Acidity Cold AeroPress Extraction',
    coffeeType: 'Cold AeroPress',
    method: 'AeroPress',
    difficulty: 'Intermediate',
    prepTimeMins: 4,
    ingredients: [
      '18g medium-fine smooth Brazil roast',
      '120g ice cold water',
      'Single paper filter'
    ],
    steps: [
      'Assemble AeroPress standard position with rinsed filter.',
      'Add coffee grounds and pour 120g iced water.',
      'Stir continuously for 60 seconds with paddle to maximize low-temperature dissolution.',
      'Insert plunger and press down firmly for 45 seconds.',
      'Serve over ice with a lemon twist or splash of tonic water.'
    ],
    servings: 1,
    tasteProfile: 'Extremely mellow, zero stomach acid burn, creamy peanut butter and cocoa notes',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-24',
    title: 'Precision Geisha V60 Delicate Pour',
    coffeeType: 'Competition Pour Over',
    method: 'V60',
    difficulty: 'Master',
    prepTimeMins: 5,
    ingredients: [
      '16g competition-grade Panama Geisha (light roast)',
      '260g water at 91°C (soft mineral profile)',
      'Hario 01 untreated paper'
    ],
    steps: [
      'Thoroughly rinse paper with boiling water, discard water.',
      'Add 16g coffee with a gentle concavity in the center.',
      'Bloom with 45g water for 50 seconds.',
      'Pour in concentric circles 3cm above bed up to 150g by 1:30.',
      'Final pour up to 260g by 2:10. Maintain gentle laminar stream.',
      'Draw down finishes at 2:50. Serve at 65°C to appreciate developing fruit notes.'
    ],
    servings: 1,
    tasteProfile: 'White peach, elderflower, lemongrass, honeyed citrus, champagne elegance',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'premium-recipe-25',
    title: 'Ristretto Extraction & Silky Macchiato',
    coffeeType: 'Espresso',
    method: 'espresso machine',
    difficulty: 'Intermediate',
    prepTimeMins: 3,
    ingredients: [
      '20g fine specialty espresso grind',
      '25g extracted liquid ristretto',
      '2 tbsp steamed milk microfoam'
    ],
    steps: [
      'Dose 20g finely ground beans into portafilter.',
      'Cut extraction early at 20 seconds, yielding 25g concentrated ristretto.',
      'Steam small jug of cold milk to 60°C until dense velvet foam forms.',
      'Spoon two dollops of shiny white microfoam directly onto the center of the dark crema (macchia).',
      'Serve in a demitasse with sparkling water on the side.'
    ],
    servings: 1,
    tasteProfile: 'Concentrated sweetness, vibrant fruit acidity, softened by creamy milk cloud',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
  }
];
