import type { Brand, BrandKey } from './types'

export const BRANDS: Record<BrandKey, Brand> = {
  sushi: {
    name: 'Ichiban Sushi', red: '#E8321A', orange: '#FF6A1A',
    hero: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&q=85',
    cats: [
      {key:'top',label:'⭐ Хиты'},{key:'rolls',label:'🌀 Роллы'},{key:'hot',label:'🔥 Горячие'},
      {key:'sets',label:'📦 Сеты'},{key:'soups',label:'🍜 Супы'},{key:'salads',label:'🥗 Салаты'},
      {key:'desserts',label:'🍡 Десерты'},{key:'drinks',label:'🥤 Напитки'}
    ],
    menu: [
      { id:1, cat:'rolls', name:'Филадельфия', price:490, weight:'240г', desc:'Нежный норвежский лосось холодного копчения, бархатистый сыр Philadelphia и хрустящий огурец.', tags:['hit'], cal:'320 ккал', img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=85', imgs:['https://storage.yandexcloud.net/ichiban-photos/017eb866-5a08-5b49-984d-aedd45bd7035.jpg','https://yum-yum.md/_next/image?url=https%3A%2F%2Fpub-d6b26f68cf8843dc9536f330d128d249.r2.dev%2F1766774041869-roll-philadelphia-classic.webp&w=1536&q=75','https://storage.yandexcloud.net/ichiban-photos/filadelfiya-s-krevetkoy-dscf2479.webp','https://storage.yandexcloud.net/ichiban-photos/Filasogurcom-1000x560.jpg'] },
      { id:2, cat:'rolls', name:'Калифорния', price:380, weight:'220г', desc:'Сурими из натурального краба, авокадо, огурец, тобико. Классика японской кухни.', tags:['hit'], cal:'280 ккал', img:'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=85', imgs:['https://storage.yandexcloud.net/ichiban-photos/aa58e02b-4e15-5515-925c-117209964586.jpg','https://storage.yandexcloud.net/ichiban-photos/kaliforniya-s-lososem-dscf2462.webp','https://yum-yum.md/_next/image?url=https%3A%2F%2Fpub-d6b26f68cf8843dc9536f330d128d249.r2.dev%2F1766773999639-roll-california-classic.webp&w=1536&q=75','https://storage.yandexcloud.net/ichiban-photos/Kaliforniya-1000x560.jpg'] },
      { id:3, cat:'rolls', name:'Дракон', price:570, weight:'260г', desc:'Хрустящая креветка темпура внутри, слайсы авокадо снаружи. Полит острым майонезом.', tags:['hot','hit'], cal:'410 ккал', img:'https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=85', imgs:['https://storage.yandexcloud.net/ichiban-photos/cd0407b9-c308-5003-83c4-f7192b6dcbeb.png','https://storage.yandexcloud.net/ichiban-photos/cf5b917b-5dc1-5deb-b6a3-3de087c7e596.jpg','https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=85','https://images.unsplash.com/photo-1505253304499-671c55fb57fe?w=600&q=85'] },
      { id:4, cat:'rolls', name:'Радуга', price:640, weight:'280г', desc:'Семь видов рыбы: лосось, тунец, желтохвост, лакедра, угорь, морской окунь и икура.', tags:['new'], cal:'360 ккал', img:'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=85', imgs:['https://storage.yandexcloud.net/ichiban-photos/27ede95a-d631-5142-a66c-4e7bdf166deb.jpg','https://storage.yandexcloud.net/ichiban-photos/b477e5f9-8ae6-59c5-a614-91bc8c7adc60.jpg','https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=85','https://images.unsplash.com/photo-1576577445504-6af96477db52?w=600&q=85'] },
      { id:5, cat:'rolls', name:'Эби темпура', price:450, weight:'250г', desc:'Тигровая креветка в хрустящем кляре темпура, огурец, икра тобико, соус спайси.', tags:['hot'], cal:'390 ккал', img:'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=85', imgs:['https://storage.yandexcloud.net/ichiban-photos/729e3aaf-ca3e-50a1-83e8-3e6312465181.jpg','https://storage.yandexcloud.net/ichiban-photos/8d8cb12c-afa3-51a2-a1b9-9f04bc95d481.jpg','https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=85','https://images.unsplash.com/photo-1505253304499-671c55fb57fe?w=600&q=85'] },
      { id:6, cat:'rolls', name:'Тунец Спайси', price:520, weight:'240г', desc:'Нарезанный тунец с соусом спайси, перец чили, кунжут. Для любителей острого.', tags:['hot','new'], cal:'300 ккал', img:'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=600&q=85', imgs:['https://storage.yandexcloud.net/ichiban-photos/b57bd0a2-93ff-57dd-b015-8f8f687997f2.jpg','https://storage.yandexcloud.net/ichiban-photos/02d90816-f96e-5411-acee-4771b0505139.jpg','https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&q=85','https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=85'] },
      { id:7, cat:'hot', name:'Жареные с лососем', price:520, weight:'280г', desc:'Классические роллы обжаренные в темпурном кляре до золотистой корочки.', tags:['hit','hot'], cal:'450 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/b6c2e235-8441-5048-a170-775f897c4308.png', imgs:['https://storage.yandexcloud.net/ichiban-photos/b6c2e235-8441-5048-a170-775f897c4308.png','https://storage.yandexcloud.net/ichiban-photos/926f2a17-abef-54d1-b821-96243374b1ff.jpg'] },
      { id:8, cat:'hot', name:'Запечённый с сыром', price:490, weight:'260г', desc:'Роллы с крабом запечены со сливочным сыром и икрой масаго.', tags:['hit'], cal:'480 ккал', img:'https://yum-yum.md/_next/image?url=https%3A%2F%2Fpub-d6b26f68cf8843dc9536f330d128d249.r2.dev%2F1766763563518-roll-ebi-tempura.webp&w=1536&q=95', imgs:['https://yum-yum.md/_next/image?url=https%3A%2F%2Fpub-d6b26f68cf8843dc9536f330d128d249.r2.dev%2F1766763563518-roll-ebi-tempura.webp&w=1536&q=95','https://yum-yum.md/_next/image?url=https%3A%2F%2Fpub-d6b26f68cf8843dc9536f330d128d249.r2.dev%2F1766763388033-roll-sake-tempura.webp&w=1536&q=95'] },
      { id:9, cat:'sets', name:'Сет «Для двоих»', price:990, weight:'480г', desc:'32 ролла: Филадельфия ×8, Калифорния ×8, Дракон ×8, Темпура ×8.', tags:['hit'], cal:'1100 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/b551258d-30c0-5a20-9491-6002331df836.jpg', imgs:['https://storage.yandexcloud.net/ichiban-photos/b551258d-30c0-5a20-9491-6002331df836.jpg','https://storage.yandexcloud.net/ichiban-photos/43f94406-a781-5dc3-a3c3-c7f1290943f0.jpg'] },
      { id:10, cat:'sets', name:'Сет «Большой»', price:1490, weight:'920г', desc:'64 ролла всех видов. Для большой компании или настоящего ценителя.', tags:['hit'], cal:'2200 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/d42ec26e-bb34-5fbe-9fb3-c4f6cf27c58a.jpg', imgs:['https://storage.yandexcloud.net/ichiban-photos/d42ec26e-bb34-5fbe-9fb3-c4f6cf27c58a.jpg','https://storage.yandexcloud.net/ichiban-photos/d487e32d-cd73-5034-8534-a84b76daaf27.jpg'] },
      { id:24, cat:'sets', name:'Сет «Острый»', price:870, weight:'640г', desc:'32 острых ролла: Дракон ×8, Тунец Спайси ×8, Эби темпура ×8, Жареные с лососем ×8.', tags:['hot','hit'], cal:'1400 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/61eccb00-c247-596b-8970-8ad578422abf.jpg', imgs:['https://storage.yandexcloud.net/ichiban-photos/61eccb00-c247-596b-8970-8ad578422abf.jpg','https://storage.yandexcloud.net/ichiban-photos/e813279f-b9aa-5bb6-8117-2769fb840bdf.png'] },
      { id:11, cat:'soups', name:'Мисо-суп', price:190, weight:'350мл', desc:'Традиционный японский суп с тофу, водорослями вакамэ и зелёным луком.', tags:[], cal:'85 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-30682814.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-30682814.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-30682816.jpeg'] },
      { id:12, cat:'soups', name:'Рамен с курицей', price:370, weight:'500мл', desc:'Насыщенный куриный бульон, пшеничная лапша, яйцо аджицке, нори.', tags:['hit'], cal:'420 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-1907244.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-1907244.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-2456435.jpeg'] },
      { id:13, cat:'drinks', name:'Матча латте', price:250, weight:'350мл', desc:'Японский зелёный чай маття с нежной молочной пеной.', tags:['new'], cal:'120 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-14704657.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-14704657.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-33143522.jpeg'] },
      { id:14, cat:'drinks', name:'Лимонад юдзу', price:220, weight:'400мл', desc:'Домашний лимонад с японским цитрусом юдзу, мятой и газированной водой.', tags:['hit'], cal:'95 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-26973676.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-26973676.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-26973675.jpeg'] },
    ]
  },
  pizza: {
    name: 'Napoli Pizza', red: '#D62828', orange: '#F77F00',
    hero: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=85',
    cats: [{key:'top',label:'⭐ Хиты'},{key:'classic',label:'🍕 Классика'},{key:'special',label:'✨ Особые'},{key:'sets',label:'📦 Комбо'},{key:'drinks',label:'🥤 Напитки'}],
    menu: [
      { id:1, cat:'classic', name:'Маргарита', price:490, weight:'400г', desc:'Томатный соус, моцарелла, свежий базилик. Классика неаполитанской пиццы.', tags:['hit'], cal:'750 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-29609013.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-29609013.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-32872596.jpeg'] },
      { id:2, cat:'classic', name:'Пепперони', price:590, weight:'420г', desc:'Острая итальянская салями, томатный соус, двойная моцарелла.', tags:['hit','hot'], cal:'820 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-17708242.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-17708242.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-5175567.jpeg'] },
      { id:3, cat:'classic', name:'Четыре сыра', price:650, weight:'410г', desc:'Моцарелла, горгонзола, пармезан и рикотта. Нежный сливочный вкус.', tags:['hit'], cal:'900 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-13214426.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-13214426.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-33194921.jpeg'] },
      { id:4, cat:'special', name:'Гавайская', price:540, weight:'430г', desc:'Ветчина, ананас, моцарелла, томатный соус. Спорная, но любимая.', tags:['new'], cal:'780 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-14334060.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-14334060.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-33592994.jpeg'] },
      { id:5, cat:'special', name:'BBQ Курица', price:610, weight:'450г', desc:'Куриное филе, соус BBQ, красный лук, моцарелла, кинза.', tags:['hit'], cal:'850 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-35609608.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-35609608.jpeg','https://storage.yandexcloud.net/ichiban-photos/pizza-restaurant-dinner-lunch.jpg'] },
      { id:6, cat:'special', name:'Дьябло', price:630, weight:'420г', desc:'Острая салями, халапеньо, перец чили, томатный соус, моцарелла.', tags:['hot','new'], cal:'870 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-34413634.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-34413634.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-6111951.jpeg'] },
      { id:7, cat:'special', name:'Морская', price:690, weight:'440г', desc:'Креветки, кальмары, мидии, соус песто, моцарелла, лимон.', tags:['new'], cal:'760 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-32007632.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-32007632.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-29807157.jpeg'] },
      { id:8, cat:'sets', name:'Комбо 2 пиццы', price:990, weight:'800г', desc:'Любые 2 пиццы классической линейки. Выбирай сам.', tags:['hit'], cal:'1600 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-34425646.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-34425646.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-34425632.jpeg'] },
      { id:9, cat:'drinks', name:'Лимонад', price:180, weight:'400мл', desc:'Домашний лимонад с лимоном, мятой и газированной водой.', tags:[], cal:'90 ккал', img:'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=85' },
      { id:10, cat:'drinks', name:'Тирамису', price:290, weight:'150г', desc:'Классический итальянский десерт с маскарпоне и кофе.', tags:['hit'], cal:'380 ккал', img:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=85' },
    ]
  },
  burger: {
    name: 'Burger Bros', red: '#E76F51', orange: '#F4A261',
    hero: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=85',
    cats: [{key:'top',label:'⭐ Хиты'},{key:'burgers',label:'🍔 Бургеры'},{key:'sides',label:'🍟 Гарниры'},{key:'sets',label:'📦 Комбо'},{key:'drinks',label:'🥤 Напитки'}],
    menu: [
      { id:1, cat:'burgers', name:'Классик', price:390, weight:'250г', desc:'Говяжья котлета, листья салата, томат, огурец, соус тысяча островов.', tags:['hit'], cal:'550 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-10153085.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-10153085.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-15476358.jpeg'] },
      { id:2, cat:'burgers', name:'Чизбургер', price:420, weight:'270г', desc:'Говяжья котлета, двойной чеддер, маринованные огурцы, горчица, кетчуп.', tags:['hit'], cal:'620 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-23910856.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-23910856.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-11264609.jpeg'] },
      { id:3, cat:'burgers', name:'Двойной', price:550, weight:'380г', desc:'Две котлеты, двойной сыр, бекон, лук, соус. Для настоящих мужчин.', tags:['hit'], cal:'850 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-12325124.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-12325124.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-12325122.jpeg'] },
      { id:4, cat:'burgers', name:'Барбекю', price:490, weight:'300г', desc:'Котлета, хрустящий бекон, карамелизованный лук, соус BBQ, чеддер.', tags:['hit','new'], cal:'710 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-31450820.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-31450820.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-1893558.jpeg'] },
      { id:5, cat:'burgers', name:'Острый', price:440, weight:'260г', desc:'Котлета, соус халапеньо, перец чили, маринованные огурцы, чеддер.', tags:['hot'], cal:'640 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-15010286.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-15010286.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-9509204.jpeg'] },
      { id:6, cat:'burgers', name:'Куриный', price:380, weight:'240г', desc:'Хрустящее куриное филе, листья салата, томат, соус ранч.', tags:['hit'], cal:'480 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-18811742.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-18811742.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-13573664.jpeg'] },
      { id:7, cat:'sides', name:'Картошка фри', price:180, weight:'200г', desc:'Хрустящая картошка фри с морской солью.', tags:['hit'], cal:'350 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-1583884.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-1583884.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-5836999.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-29150162.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-5695616.jpeg'] },
      { id:8, cat:'sides', name:'Луковые кольца', price:220, weight:'180г', desc:'Сладкий лук в хрустящем кляре. Идеально к бургеру.', tags:['new'], cal:'320 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-17313960.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-17313960.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-34528321.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-10970330.jpeg'] },
      { id:9, cat:'sets', name:'Комбо бургер+фри', price:520, weight:'450г', desc:'Любой бургер + картошка фри + напиток. Выгодно.', tags:['hit'], cal:'900 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-20117235.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-20117235.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-30446280.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-36869509.jpeg'] },
      { id:10, cat:'drinks', name:'Молочный шейк', price:280, weight:'400мл', desc:'Ванильный, шоколадный или клубничный. Густой и холодный.', tags:['hit'], cal:'420 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/pexels-photo-10066814.jpeg', imgs:['https://storage.yandexcloud.net/ichiban-photos/pexels-photo-10066814.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-14662100.jpeg','https://storage.yandexcloud.net/ichiban-photos/pexels-photo-10117395.jpeg'] },
    ]
  },
  shawarma: {
    name: 'Shawarma King', red: '#606C38', orange: '#DDA15E',
    hero: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=85',
    cats: [{key:'top',label:'⭐ Хиты'},{key:'shawarma',label:'🌯 Шаурма'},{key:'sides',label:'🥙 Дополнения'},{key:'sets',label:'📦 Комбо'},{key:'drinks',label:'🥤 Напитки'}],
    menu: [
      { id:1, cat:'shawarma', name:'Классическая', price:290, weight:'350г', desc:'Курица, капуста, томат, огурец, чеснок, соус, лаваш. Проверенная годами.', tags:['hit'], cal:'580 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/0112_dvojnaya_kurinaya_result.jpg', imgs:['https://storage.yandexcloud.net/ichiban-photos/0112_dvojnaya_kurinaya_result.jpg','https://storage.yandexcloud.net/ichiban-photos/0112_dvojnaya_svinaya_result.jpg'] },
      { id:2, cat:'shawarma', name:'Острая', price:310, weight:'350г', desc:'Курица, острый перец, маринованные огурцы, перечный соус, лаваш.', tags:['hot','hit'], cal:'590 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/0112_ovoshhnaya_result.jpg', imgs:['https://storage.yandexcloud.net/ichiban-photos/0112_ovoshhnaya_result.jpg','https://storage.yandexcloud.net/ichiban-photos/0112_gavajskaya_result.jpg'] },
      { id:3, cat:'shawarma', name:'Сырная', price:340, weight:'380г', desc:'Курица, расплавленный сыр, томат, огурец, сметанный соус.', tags:['new'], cal:'650 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/0112_3_syra_result.jpg', imgs:['https://storage.yandexcloud.net/ichiban-photos/0112_3_syra_result.jpg','https://storage.yandexcloud.net/ichiban-photos/img_7740.jpeg'] },
      { id:4, cat:'shawarma', name:'Двойная', price:420, weight:'500г', desc:'Двойная порция мяса, все начинки, два соуса. Для голодных.', tags:['hit'], cal:'900 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/0112_dvojnaya_svinaya_result.jpg', imgs:['https://storage.yandexcloud.net/ichiban-photos/0112_dvojnaya_svinaya_result.jpg','https://storage.yandexcloud.net/ichiban-photos/0112_standartnaya_kurinaya_result.jpg'] },
      { id:5, cat:'shawarma', name:'С говядиной', price:360, weight:'370г', desc:'Говяжье мясо, капуста, томат, лук, чесночный соус.', tags:['new'], cal:'620 ккал', img:'https://storage.yandexcloud.net/ichiban-photos/firmenaya-scaled.jpg', imgs:['https://storage.yandexcloud.net/ichiban-photos/firmenaya-scaled.jpg','https://storage.yandexcloud.net/ichiban-photos/svinaya.png'] },
      { id:6, cat:'sides', name:'Картошка по-деревенски', price:180, weight:'200г', desc:'Запечённый картофель с розмарином и морской солью.', tags:['hit'], cal:'320 ккал', img:'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=600&q=85' },
      { id:7, cat:'sets', name:'Комбо шаурма+картошка', price:420, weight:'550г', desc:'Классическая шаурма + картошка + напиток.', tags:['hit'], cal:'900 ккал', img:'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=85' },
      { id:8, cat:'drinks', name:'Айран', price:120, weight:'300мл', desc:'Холодный кисломолочный напиток. Освежает.', tags:['hit'], cal:'80 ккал', img:'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=600&q=85' },
    ]
  },
  pasta: {
    name: 'La Pasta', red: '#BC6C25', orange: '#DDA15E',
    hero: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=85',
    cats: [{key:'top',label:'⭐ Хиты'},{key:'pasta',label:'🍝 Паста'},{key:'pizza',label:'🍕 Пицца'},{key:'desserts',label:'🍮 Десерты'},{key:'drinks',label:'🥤 Напитки'}],
    menu: [
      { id:1, cat:'pasta', name:'Карбонара', price:490, weight:'320г', desc:'Паста с беконом, яичным желтком, пармезаном и чёрным перцем. Рим в тарелке.', tags:['hit'], cal:'680 ккал', img:'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=85' },
      { id:2, cat:'pasta', name:'Болоньезе', price:520, weight:'350г', desc:'Домашняя паста с мясным рагу, томатами и пармезаном. Готовится 4 часа.', tags:['hit'], cal:'720 ккал', img:'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=600&q=85' },
      { id:3, cat:'pasta', name:'Альфредо', price:470, weight:'310г', desc:'Фетучини, сливочный соус, пармезан. Нежно и сытно.', tags:['hit'], cal:'750 ккал', img:'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&q=85' },
      { id:4, cat:'pasta', name:'Арабьята', price:440, weight:'300г', desc:'Пенне, томатный соус, перец чили, чеснок. Острая классика.', tags:['hot'], cal:'580 ккал', img:'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=85' },
      { id:5, cat:'pasta', name:'Морская', price:590, weight:'340г', desc:'Лингвине с креветками, мидиями, кальмарами в соусе из белого вина.', tags:['new'], cal:'620 ккал', img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=85' },
      { id:6, cat:'pizza', name:'Маргарита', price:490, weight:'400г', desc:'Томатный соус, моцарелла, базилик. Классика.', tags:['hit'], cal:'750 ккал', img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=85' },
      { id:7, cat:'pizza', name:'Четыре сыра', price:650, weight:'410г', desc:'Моцарелла, горгонзола, пармезан и рикотта.', tags:['hit'], cal:'900 ккал', img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=85' },
      { id:8, cat:'desserts', name:'Тирамису', price:320, weight:'180г', desc:'Классический итальянский десерт с маскарпоне, кофе и савоярди.', tags:['hit'], cal:'380 ккал', img:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=85' },
      { id:9, cat:'drinks', name:'Эспрессо', price:120, weight:'30мл', desc:'Насыщенный итальянский эспрессо из арабики.', tags:[], cal:'10 ккал', img:'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=85' },
      { id:10, cat:'drinks', name:'Лимончелло (б/а)', price:180, weight:'200мл', desc:'Безалкогольный лимонный напиток с мятой и газированной водой.', tags:['new'], cal:'85 ккал', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85' },
    ]
  },
  georgian: {
    name: 'Кавказ', red: '#6B2737', orange: '#C1440E',
    hero: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=85',
    cats: [{key:'top',label:'⭐ Хиты'},{key:'hot',label:'🔥 Горячее'},{key:'grill',label:'🥩 Гриль'},{key:'cold',label:'🥗 Закуски'},{key:'soups',label:'🍲 Супы'},{key:'drinks',label:'🥤 Напитки'}],
    menu: [
      { id:1, cat:'hot', name:'Хачапури по-аджарски', price:490, weight:'380г', desc:'Лодочка из теста с сыром сулугуни, яйцом и сливочным маслом. Горячее.', tags:['hit'], cal:'820 ккал', img:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=85' },
      { id:2, cat:'hot', name:'Хинкали', price:420, weight:'360г', desc:'6 штук. Сочные пельмени с говядиной, свининой, луком и специями.', tags:['hit'], cal:'540 ккал', img:'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=85' },
      { id:3, cat:'grill', name:'Шашлык свиной', price:650, weight:'300г', desc:'Свиная шея на углях, маринованная в луке и специях. С соусом ткемали.', tags:['hit'], cal:'680 ккал', img:'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=85' },
      { id:4, cat:'grill', name:'Люля-кебаб', price:590, weight:'280г', desc:'Рубленая баранина на шампуре со специями. Подаётся с лавашем.', tags:['hot'], cal:'640 ккал', img:'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=85' },
      { id:5, cat:'soups', name:'Харчо', price:380, weight:'450мл', desc:'Наваристый суп из говядины с рисом, грецкими орехами и тклапи.', tags:['hit','hot'], cal:'420 ккал', img:'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600&q=85' },
      { id:6, cat:'cold', name:'Пхали', price:290, weight:'200г', desc:'Три вида: из шпината, свёклы и фасоли с грецкими орехами и зеленью.', tags:['new'], cal:'180 ккал', img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=85' },
      { id:7, cat:'hot', name:'Оджахури', price:590, weight:'350г', desc:'Жареная свинина с картофелем, луком и зеленью на сковороде.', tags:['hit'], cal:'760 ккал', img:'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=600&q=85' },
      { id:8, cat:'hot', name:'Чкмерули', price:620, weight:'400г', desc:'Цыплёнок в молочно-чесночном соусе. Нежнейшее мясо.', tags:['hit','new'], cal:'720 ккал', img:'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&q=85' },
      { id:9, cat:'drinks', name:'Лимонад тархун', price:150, weight:'350мл', desc:'Освежающий напиток с эстрагоном. Классика Кавказа.', tags:['hit'], cal:'95 ккал', img:'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=85' },
      { id:10, cat:'drinks', name:'Компот', price:120, weight:'350мл', desc:'Домашний компот из сухофруктов.', tags:[], cal:'80 ккал', img:'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&q=85' },
    ]
  },
  ramen: {
    name: 'Ramen House', red: '#1B4332', orange: '#52B788',
    hero: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=85',
    cats: [{key:'top',label:'⭐ Хиты'},{key:'ramen',label:'🍜 Рамен'},{key:'hot',label:'🥟 Закуски'},{key:'drinks',label:'🥤 Напитки'}],
    menu: [
      { id:1, cat:'ramen', name:'Тонкоцу', price:490, weight:'500мл', desc:'Насыщенный бульон из свиных костей, рамен, чашу, яйцо аджицке, нори, бамбук.', tags:['hit'], cal:'580 ккал', img:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=85' },
      { id:2, cat:'ramen', name:'Мисо рамен', price:470, weight:'500мл', desc:'Бульон с пастой мисо, кукуруза, масло, мясо чашу, яйцо, нори.', tags:['hit'], cal:'540 ккал', img:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=85' },
      { id:3, cat:'ramen', name:'Спайси рамен', price:510, weight:'500мл', desc:'Острый бульон с кимчи, тофу, кунжутом и зелёным луком.', tags:['hot','new'], cal:'520 ккал', img:'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?w=600&q=85' },
      { id:4, cat:'ramen', name:'Том Ям', price:460, weight:'450мл', desc:'Тайский кислый суп с креветками, грибами и лемонграссом.', tags:['hot','hit'], cal:'480 ккал', img:'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=85' },
      { id:5, cat:'hot', name:'Гёдза', price:320, weight:'200г', desc:'6 штук. Жареные пельмени с свининой и капустой. Соус понзу.', tags:['hit'], cal:'380 ккал', img:'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=85' },
      { id:6, cat:'hot', name:'Удон с курицей', price:440, weight:'400г', desc:'Толстая пшеничная лапша с курицей терияки и овощами.', tags:['hit'], cal:'520 ккал', img:'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=85' },
      { id:7, cat:'hot', name:'Вок с говядиной', price:520, weight:'380г', desc:'Говядина, лапша, болгарский перец, брокколи, соус соевый.', tags:['new'], cal:'560 ккал', img:'https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=85' },
      { id:8, cat:'hot', name:'Dim Sum', price:390, weight:'240г', desc:'8 штук. Паровые пельмени с уткой и грибами шиитаке.', tags:['new'], cal:'340 ккал', img:'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=85' },
      { id:9, cat:'drinks', name:'Матча латте', price:250, weight:'350мл', desc:'Японский зелёный чай маття с молоком.', tags:['hit'], cal:'120 ккал', img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=85' },
      { id:10, cat:'drinks', name:'Японский лимонад', price:190, weight:'400мл', desc:'Газированный лимонад с юдзу и мятой.', tags:[], cal:'80 ккал', img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=85' },
    ]
  },
}

export const BRAND_KEYS: BrandKey[] = ['sushi', 'pizza', 'burger', 'shawarma']

export const BRAND_THUMBS: Record<BrandKey, string> = {
  sushi: 'https://storage.yandexcloud.net/ichiban-photos/brands/rolls.png',
  pizza: 'https://storage.yandexcloud.net/ichiban-photos/brands/pizza.png',
  burger: 'https://storage.yandexcloud.net/ichiban-photos/brands/burger.png',
  shawarma: 'https://storage.yandexcloud.net/ichiban-photos/brands/shawarma.png',
  pasta: 'https://storage.yandexcloud.net/ichiban-photos/brands/pizza.png',
  georgian: 'https://storage.yandexcloud.net/ichiban-photos/brands/shawarma.png',
  ramen: 'https://storage.yandexcloud.net/ichiban-photos/brands/rolls.png',
}

export const BRAND_ICONS: Record<BrandKey, string> = {
  sushi: '🍣',
  pizza: '🍕',
  burger: '🍔',
  shawarma: '🌯',
  pasta: '🍝',
  georgian: '🥩',
  ramen: '🍜',
}
