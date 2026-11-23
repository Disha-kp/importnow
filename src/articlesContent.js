/* Article body content for the in-app article pages.
 * Block types:
 *   { p: 'text' }                      paragraph  (**bold**, *italic* supported)
 *   { h: 'Heading' }                   H2 (also feeds "In this article")
 *   { ul: ['a','b'] }                  red-dot bullet list
 *   { ol: [{ b: 'Label:', t: 'text' }] } numbered list with red numbers
 *   { note: 'tip'|'warn', label, t }   grey tip box / red warning box
 *   { table: { head: [..], rows: [[..]] } }
 */
export const ARTICLE_CONTENT = {
  'how-to-import-from-china-to-india': [
    { p: 'Importing directly from China is one of the fastest ways for an Indian business to improve margins. Prices can be far lower than buying from local wholesalers. The process has a lot of moving parts, though, and one wrong step can cost weeks. Here is the whole journey, in order.' },
    { h: '1. Get your Import Export Code (IEC)' },
    { p: "Every commercial importer in India needs an **IEC**, issued online by the DGFT and linked to your PAN. It's a one-time registration and is usually approved quickly once your documents are in order. Without an IEC, customs won't clear your goods." },
    { h: '2. Decide exactly what you want to import' },
    { p: 'Be specific: material, size, colour, power rating, packaging, quantity. The clearer your specification, the more accurate your quotes will be. Also check whether your product needs **BIS certification** (many electronics, LED lights and power banks do) or other approvals before it can enter India.' },
    { note: 'tip', label: 'Tip:', t: "find your product's HS code early. It decides your customs duty, and whether special rules or certifications apply." },
    { h: '3. Find and verify suppliers' },
    { p: 'Online platforms are a starting point, but many listings are traders, not factories. Shortlist 3–5 suppliers, ask for their business licence, and compare more than just the price. Check MOQ, lead time, payment terms and sample quality. If you can, have someone visit the factory.' },
    { h: '4. Approve samples and negotiate' },
    { p: 'Never place a bulk order without approving a sample. Agree in writing on specifications, packaging, Incoterms (FOB or EXW are most common), payment milestones and what happens if quality fails.' },
    { h: '5. Production and quality inspection' },
    { p: 'A typical payment pattern is 30% advance and 70% before shipping. Book a **pre-shipment inspection** before paying the balance, so problems are found while the goods are still at the factory.' },
    { h: '6. Shipping: FCL or LCL' },
    { p: "Large orders travel in a full container (FCL). Smaller ones share space with other importers' cargo (LCL). Sea freight from Chinese ports to Nhava Sheva, Chennai or Vizag usually takes 2–4 weeks on the water, plus time at the ports." },
    { h: '7. Customs clearance in India' },
    { p: 'A customs broker files your Bill of Entry with the commercial invoice, packing list and bill of lading. You pay Basic Customs Duty, the Social Welfare Surcharge and IGST. The IGST can usually be claimed back as input tax credit.' },
    { h: '8. Delivery to your door' },
    { p: 'Once cleared, the container is trucked to your warehouse, shop or site and unloaded. Door-to-door, most sea shipments take around 30–40 days from the factory.' },
    { h: '9. Want someone to handle all of this?' },
    { p: "ImportNow manages every step above, from sourcing to delivery, with our own registered company in Shanghai. Tell us what you want to import and we'll come back with suppliers, landed cost and timelines." },
  ],

  'yiwu-vs-guangzhou-vs-foshan': [
    { p: 'One of the most common questions we get is: *"Where in China should I buy from?"* The answer depends entirely on your product. Each region has spent decades specialising.' },
    { h: 'Yiwu: small goods in huge variety' },
    { p: "Yiwu International Trade City is one of the largest small-commodity markets in the world, with tens of thousands of booths. It's ideal for:" },
    { ul: ['Supermarket and general store stock', 'Toys, gifts, stationery and festival items', 'Kitchenware, home and household goods', 'Mixed containers with many product types'] },
    { p: 'Yiwu works well when you want to **fill one container with hundreds of different items**. Our Adilabad supermarket client did exactly this.' },
    { h: 'Guangzhou: fashion, beauty, auto parts and the Canton Fair' },
    { p: "Guangzhou has wholesale markets for garments, leather, cosmetics, electronics accessories and auto parts. It also hosts the **Canton Fair** twice a year, so it's the natural base for a sourcing trip." },
    { h: 'Shenzhen: electronics and technology' },
    { p: "Right next door, Shenzhen is the world's electronics workshop: LED screens, mobile accessories, power banks, smart devices and components. Huaqiangbei market alone can keep you busy for days." },
    { h: 'Foshan: furniture' },
    { p: "Foshan, about an hour from Guangzhou, is China's furniture capital. Showrooms there stretch for kilometres, covering home, office, hotel and outdoor furniture. Most villa and office projects we deliver are sourced here." },
    { h: 'Guzhen: lighting' },
    { p: "Guzhen in Zhongshan is known as China's lighting capital, covering decorative chandeliers, commercial LED fixtures and custom project lighting." },
    {
      table: {
        head: ['Product', 'Best hub'],
        rows: [
          ['General goods, supermarket stock', 'Yiwu'],
          ['Furniture & interiors', 'Foshan'],
          ['Electronics & gadgets', 'Shenzhen'],
          ['Garments, beauty, auto parts', 'Guangzhou'],
          ['Lighting', 'Guzhen'],
        ],
      },
    },
    { p: "Not sure which market fits your idea? Tell us the product and we'll point you to the right hub, or take you there on our next China trip." },
  ],

  'importing-furniture-from-china': [
    { p: 'Ever wondered why furniture in premium interiors looks different? Much of it comes down to design, detailing and finish, and many of those pieces come from China. Importing directly can give you better quality for the same budget.' },
    { h: 'What can you import?' },
    { ul: ['Complete home and villa furniture: sofas, beds, dining sets, wardrobes', 'Office furniture: executive desks, height-adjustable tables, workstations, chairs', 'Hotel, banquet and convention furniture', 'Outdoor furniture and pergolas'] },
    { h: 'Minimum order quantity' },
    { p: "For many furniture items there's effectively **no MOQ**, because showrooms in Foshan sell single pieces. A motorised height-adjustable L-shaped desk, for example, can be imported as just one unit. To keep freight cost per piece down, most clients combine items into a shared (LCL) or full container." },
    { h: 'How is the cost calculated?' },
    { p: 'Your final **landed cost** = product price + packing + freight + insurance + customs duty + IGST + port and delivery charges. Furniture is bulky, so freight is calculated by volume (CBM). Packing smartly makes a real difference.' },
    { note: 'tip', label: 'Example:', t: "we've delivered a height-adjustable executive desk to Hyderabad for around ₹45,000, all-in, in about 30 days." },
    { h: 'What to check before you pay' },
    {
      ol: [
        { b: 'Materials:', t: 'solid wood or MDF/engineered wood, fabric grade, foam density, hardware brand.' },
        { b: 'Finish samples:', t: 'ask for photos and videos under natural light, or swatches.' },
        { b: 'Dimensions:', t: 'confirm everything fits your space and doorways.' },
        { b: 'Packing:', t: 'furniture must be export-packed with corner protectors and moisture protection.' },
        { b: 'Assembly:', t: 'knock-down (flat-pack) items are much cheaper to ship.' },
      ],
    },
    { h: 'How long does it take?' },
    { p: 'Ready stock can ship within a week. Made-to-order pieces usually take 15–30 days to produce. Add 3–4 weeks for sea freight and clearance.' },
  ],

  'ev-scooter-business-ckd-kits': [
    { p: "India's electric two-wheeler market keeps growing, and many new brands start the same way: import scooters from Chinese factories as **CKD (Completely Knocked Down) kits** and assemble them locally." },
    { h: 'Why CKD instead of fully built scooters?' },
    { ul: ['Lower import duty than fully built units (CBU)', 'Far more units fit in one container', 'Local assembly creates your own brand and jobs', 'You can choose local batteries, chargers and tyres'] },
    { h: 'Know the regulations first' },
    { p: "**Low-speed scooters** (top speed under 25 km/h and motor up to 250 W) don't need registration or a driving licence, so they're the simplest to start with. **High-speed models** need type approval (homologation) from a testing agency such as ARAI or ICAT, and their batteries must meet Indian safety standards." },
    { note: 'warn', t: 'Always confirm the current rules for your model with a homologation consultant before you place an order.' },
    { h: 'Battery strategy' },
    { p: 'Many assemblers import the scooter kit without batteries and buy battery packs locally, or import cells and assemble certified packs. This makes compliance easier and can lower shipping complications.' },
    { h: 'Choosing the factory' },
    { p: 'Visit showrooms, test-ride the models, and compare motor brands, controllers, frame quality and spare-part support. Ask how many models they have already exported to India.' },
    { h: 'Costs' },
    { p: 'Base kit prices from Chinese factories can be very low, but your real cost includes duty, assembly, battery, homologation, warranty and marketing. Build a full per-unit cost sheet before deciding your retail price.' },
    { p: 'Comment "EV" on our Instagram, or contact us, for current catalogues and pricing.' },
  ],

  'canton-fair-guide-for-indian-businesses': [
    { p: 'The **China Import and Export Fair**, better known as the Canton Fair, is held in Guangzhou every spring and autumn. Thousands of manufacturers show their products under one roof, which makes it the most efficient way to meet factories in person.' },
    { h: 'When is it held?' },
    { p: 'The fair runs twice a year: **spring (around April–May)** and **autumn (around October–November)**. Each session is split into three phases, each covering different industries:' },
    {
      table: {
        head: ['Phase', 'Main categories (approx.)'],
        rows: [
          ['Phase 1', 'Electronics, machinery, lighting, vehicles & spare parts, hardware'],
          ['Phase 2', 'Home goods, gifts, kitchenware, decorations, building materials, furniture'],
          ['Phase 3', 'Textiles, garments, shoes, office supplies, food, health products'],
        ],
      },
    },
    { p: 'Plan your dates around the phase that matches your product. Phase categories change slightly each year, so check the official schedule.' },
    { h: 'Visa and registration' },
    { p: "Indian citizens need a Chinese business visa. An invitation letter from the fair or an exhibitor helps with the application. You'll also register online for a buyer badge before you travel." },
    { h: 'How to make the most of it' },
    {
      ol: [
        { t: 'Shortlist your categories and halls before you arrive.' },
        { t: 'Carry business cards and a clear list of the products you want.' },
        { t: "Photograph every booth's card next to its products." },
        { t: "Don't commit on the spot. Collect quotes, then compare." },
        { t: 'Keep 2–3 days after the fair to visit the factories you shortlisted.' },
      ],
    },
    { h: 'Travel with ImportNow' },
    { p: 'Our guided trips include visa guidance, hotels near the fair, Indian veg and non-veg food every day, guides and translators, factory visits of your choice, and sightseeing such as Macau and the glass bridge. Many clients tell us it felt more like a personal trip than a business tour.' },
  ],

  'how-to-verify-a-chinese-supplier': [
    { p: 'Finding a supplier in China is easy. Finding the *right* one is not. Before you send an advance payment, run through this checklist.' },
    { h: '1. Check the business licence' },
    { p: "Every legitimate Chinese company has a business licence with a unified social credit code. Ask for a copy, and check that the company name matches the bank account you're paying." },
    { note: 'warn', label: 'Red flag:', t: 'the supplier asks you to pay a personal account, or a company with a different name.' },
    { h: '2. Factory or trading company?' },
    { p: "Traders aren't bad. They can be useful for mixed orders. But you should know who you're dealing with. Look at the licence's business scope, and ask for a live video walk-through of the production floor." },
    { h: '3. Ask for export history' },
    { p: 'Have they shipped to India before? Ask for references or past bills of lading. Suppliers who know Indian requirements (BIS, labelling, documentation) save you a lot of trouble.' },
    { h: '4. Order a sample' },
    { p: 'Pay for a sample and judge it carefully. The bulk order should match the approved sample, so keep it as your reference.' },
    { h: '5. Use safe payment terms' },
    { p: 'A common structure is 30% advance and 70% after inspection. Avoid paying 100% upfront to a new supplier.' },
    { h: '6. Visit or inspect' },
    { p: 'Nothing beats seeing the factory yourself, or having someone you trust on the ground. Because ImportNow has its own registered company and team in China, we can visit, inspect and pay suppliers locally on your behalf.' },
  ],

  'fcl-vs-lcl-shipping': [
    { p: "When your goods are ready, you'll choose between booking a **full container (FCL)** or sharing one with other importers' cargo (**LCL**). The right choice can save you a lot of money." },
    { h: 'Standard container sizes' },
    {
      table: {
        head: ['Container', 'Approx. volume', 'Practical load'],
        rows: [
          ['20 ft', '~33 CBM', '~25–28 CBM'],
          ['40 ft', '~67 CBM', '~55–58 CBM'],
          ['40 ft High Cube', '~76 CBM', '~65–68 CBM'],
        ],
      },
    },
    { h: 'When LCL makes sense' },
    { ul: ['Your shipment is small, roughly under 13–15 CBM', "You're testing a new product", "You're ordering samples or a few furniture pieces"] },
    { p: 'LCL is charged per CBM, but there are extra handling and deconsolidation charges at both ends, and it can take a few days longer.' },
    { h: 'When FCL makes sense' },
    { ul: ['Your cargo is above ~15 CBM, when a 20 ft container often costs about the same as LCL', 'You want faster, safer handling with fewer touches', 'Your goods are fragile or high-value'] },
    { h: 'Weight matters too' },
    { p: "Heavy goods such as machinery, tiles or metal parts may hit the container's weight limit before its volume limit. Always share gross weights with your forwarder." },
    { note: 'tip', label: 'Tip:', t: 'consolidate. Buying from several suppliers? We can collect everything at our warehouse in China and ship it together in one container.' },
  ],

  'landed-cost-customs-duty-india': [
    { p: 'Many first-time importers compare the Chinese factory price with the local market price, and get a surprise later. What matters is your **landed cost**: the total cost of the product sitting in your warehouse.' },
    { h: 'The building blocks' },
    {
      ol: [
        { b: 'Product cost', t: "the supplier's price (usually FOB or EXW)" },
        { b: 'Freight & insurance', t: 'sea or air, to the Indian port' },
        { b: 'Assessable value', t: 'roughly the CIF value, which customs uses to calculate duty' },
        { b: 'Basic Customs Duty (BCD)', t: 'a percentage that depends on the HS code' },
        { b: 'Social Welfare Surcharge', t: '10% of the BCD' },
        { b: 'IGST', t: "charged on assessable value + BCD + SWS, at your product's GST rate" },
        { b: 'Port, CHA and transport charges', t: 'terminal handling, documentation, customs broker fees, trucking' },
      ],
    },
    { note: 'tip', label: 'Good news:', t: "if you're GST-registered, the IGST you pay at import can usually be claimed as input tax credit, so it isn't a final cost for your business." },
    { h: 'Duty rates depend on the HS code' },
    { p: "Two similar-looking products can have very different duty rates. Some items also carry anti-dumping duty when imported from China. That's why classifying your product correctly **before** ordering is so important." },
    { h: 'Charges people forget' },
    { ul: ['Destination terminal handling and container detention if clearance is delayed', 'BIS or other certification costs', 'Testing, labelling and compliance (MRP, importer details)', 'Currency conversion and bank charges'] },
    { p: 'Before every order, ImportNow gives you a full landed-cost estimate, so you know your margin before you commit.' },
  ],

  'private-label-car-led-business': [
    { p: "If you're planning a business in automobile accessories, car LED lighting is worth a close look. Demand isn't going anywhere. Every car owner eventually upgrades or replaces their headlights." },
    { h: 'What you can source' },
    { ul: ['Bulb types from H1 to H7 and more', 'Power from about 35 W up to 250 W', 'Fog lamps, projector lenses and interior lighting'] },
    { h: 'Your own brand, low MOQ' },
    { p: "Manufacturers in Guangzhou offer **OEM/private labelling**: your logo on the product and box, with mixed-model orders starting from around **500 pieces**. That's a manageable first order for a new brand." },
    { h: 'Warranty and quality' },
    { p: 'Good factories offer replacement warranties of 12–18 months. Test samples for brightness, beam pattern, heat management (fan or heat sink) and CANbus compatibility before ordering in bulk.' },
    { note: 'warn', t: 'Check whether your lighting product needs BIS registration before import, and make sure the products are legal for road use.' },
    { h: 'Selling' },
    { p: 'Car LED brands do well through car accessory shops, service centres and online marketplaces. Strong packaging and a clear warranty help you stand out.' },
    { p: 'Comment "LED" on our Instagram, or contact us, for supplier catalogues.' },
  ],
};
