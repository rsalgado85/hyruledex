import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, Gamepad2, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';

/* ─── Types ────────────────────────────────────────── */

interface Cheat {
  id: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  category: 'secret' | 'tip' | 'glitch' | 'easter_egg';
}

interface GameCheats {
  game: string;
  gameEs: string;
  year: number;
  console: string;
  cheats: Cheat[];
}

/* ─── Data (newest → oldest) ───────────────────────── */

const CHEATS_DATA: GameCheats[] = [
  {
    game: 'Tears of the Kingdom',
    gameEs: 'Tears of the Kingdom',
    year: 2023,
    console: 'Nintendo Switch',
    cheats: [
      {
        id: 'totk-1',
        title: 'Duplicate Weapons with Octoroks',
        titleEs: 'Duplicar armas con Octoroks',
        description: 'Toss a damaged weapon (excluding legendary weapons) at a Rock Octorok in Eldin. It will suck it in, repair it completely, and sometimes add a random modifier like Attack Up +10 or Durability Up. You can use each Octorok once per Blood Moon — mark their locations on your map!',
        descriptionEs: 'Lanza un arma dañada (excepto armas legendarias) a un Octorok de Roca en Eldin. La absorberá, la reparará por completo y a veces añadirá un modificador como Ataque +10 o Durabilidad extra. Puedes usar cada Octorok una vez por Luna de Sangre — ¡marca sus ubicaciones en tu mapa!',
        category: 'tip',
      },
      {
        id: 'totk-2',
        title: 'Infinite Bomb Flowers with Puffshrooms',
        titleEs: 'Flores bomba infinitas con Puffshrooms',
        description: 'In the Depths, find Poes and trade them at a Bargainer Statue for Bomb Flowers, Muddle Buds, and Puffshrooms. The statue at Lookout Landing has unlimited stock once you\'ve found it. Farm Poes easily by exploring the Depths — they glow blue and are everywhere near cliffs.',
        descriptionEs: 'En las Profundidades, encuentra Poes y cámbialos en una Estatua de Negociador por Flores Bomba, Brotes de Confusión y Puffshrooms. La estatua en Lookout Landing tiene stock ilimitado una vez que la encuentras. Farmea Poes fácilmente explorando las Profundidades — brillan en azul y están por todas partes cerca de acantilados.',
        category: 'tip',
      },
      {
        id: 'totk-3',
        title: 'Fuse Gems to Magic Rods',
        titleEs: 'Fusiona gemas a varitas mágicas',
        description: 'Sapphire rods create massive ice AoE, Ruby rods create fire waves, Topaz rods create electric fields. These are incredibly powerful for crowd control. The Magic Rod and Magic Scepter can be found with Wizzrobes. A Sapphire Rod can freeze an entire group of enemies instantly.',
        descriptionEs: 'Las varitas de Zafiro crean AoE de hielo masivo, las de Rubí crean ondas de fuego, las de Topacio crean campos eléctricos. Son increíblemente poderosas para control de masas. La Varita Mágica y el Cetro Mágico se encuentran con Wizzrobes. Una Varita de Zafiro puede congelar un grupo entero instantáneamente.',
        category: 'tip',
      },
      {
        id: 'totk-4',
        title: 'Recall Falling Debris',
        titleEs: 'Retroceder escombros cayendo',
        description: 'Sky Islands drop debris periodically. Use Recall on them to ride them back up into the sky — a free elevator to any island cluster. You can reach areas that would normally require dozens of Zonai charges and a flying machine.',
        descriptionEs: 'Las Islas Celestiales sueltan escombros periódicamente. Usa Retroceso en ellos para volver a subir al cielo — un ascensor gratuito a cualquier grupo de islas. Puedes alcanzar áreas que normalmente requerirían docenas de cargas Zonai y una máquina voladora.',
        category: 'secret',
      },
      {
        id: 'totk-5',
        title: 'Throw Brightbloom Seeds Instead of Arrows',
        titleEs: 'Lanza semillas Brightbloom en vez de flechas',
        description: 'You don\'t need to waste arrows to light up the Depths. Simply hold R to throw a Brightbloom Seed like a weapon. You can throw them much farther than you can shoot with a bow, and they cost nothing.',
        descriptionEs: 'No necesitas gastar flechas para iluminar las Profundidades. Simplemente mantén R para lanzar una Semilla Brightbloom como un arma. Puedes lanzarlas mucho más lejos que disparar con un arco, y no cuestan nada.',
        category: 'tip',
      },
      {
        id: 'totk-6',
        title: 'The Yiga Clan Hideout Boss Skip',
        titleEs: 'Saltarse el jefe del Escondite Yiga',
        description: 'You can completely skip Master Kohga\'s fight in the Depths by using a Hover Stone and Rocket Shield to fly directly over the arena. However, fighting him is required for the Yiga questline. Each Kohga encounter gives you a Huge Crystallized Charge worth 100 charges!',
        descriptionEs: 'Puedes saltarte completamente la pelea contra Master Kohga en las Profundidades usando una Piedra Flotante y un Escudo Cohete para volar sobre la arena. Sin embargo, luchar contra él es necesario para la misión Yiga. ¡Cada encuentro con Kohga te da 100 cargas cristalizadas!',
        category: 'glitch',
      },
      {
        id: 'totk-7',
        title: 'Satori Cherry Blossom Trees',
        titleEs: 'Árboles de Cerezo Satori',
        description: 'Place an apple at a cherry blossom tree altar (marked by pink leaves) and Satori, the Lord of the Mountain, will appear and reveal ALL cave entrances in the area with beams of light. There are 8 of these trees across Hyrule. Use them to find every Bubbul Frog!',
        descriptionEs: 'Coloca una manzana en un altar de árbol de cerezo (hojas rosas) y Satori, el Señor de la Montaña, aparecerá y revelará TODAS las entradas de cuevas en el área con rayos de luz. Hay 8 de estos árboles en Hyrule. ¡Úsalos para encontrar cada Rana Bubbul!',
        category: 'easter_egg',
      },
      {
        id: 'totk-8',
        title: 'Shield Surf on Minecarts',
        titleEs: 'Surf de escudo en vagonetas',
        description: 'In the Depths and in caves, you can shield surf on minecart rails for fast transportation without a minecart. Equip your shield, jump onto the rail, and press ZL+A. It\'s faster than walking and you can use Bomb Flowers to boost!',
        descriptionEs: 'En las Profundidades y cuevas, puedes hacer surf de escudo sobre raíles de vagoneta para transporte rápido sin vagoneta. Equipa tu escudo, salta al raíl y presiona ZL+A. Es más rápido que caminar y puedes usar Flores Bomba para impulsarte.',
        category: 'tip',
      },
      {
        id: 'totk-9',
        title: 'Korok Mask Location',
        titleEs: 'Ubicación de la Máscara Korok',
        description: 'The Korok Mask (which shakes when a Korok is nearby) is in the Depths under the Lost Woods. Enter the Minshi Woods Chasm and fight a Flux Construct III in the coliseum. The mask is your reward — essential for finding all 1000 Korok seeds.',
        descriptionEs: 'La Máscara Korok (que tiembla cuando un Korok está cerca) está en las Profundidades bajo el Bosque Perdido. Entra en la Sima del Bosque Minshi y lucha contra un Flux Construct III en el coliseo. La máscara es tu recompensa — esencial para encontrar las 1000 semillas Korok.',
        category: 'secret',
      },
      {
        id: 'totk-10',
        title: 'Freeze Meat for Infinite Rupees',
        titleEs: 'Congela carne para rupias infinitas',
        description: 'Hunt large animals (moose, bears) in the Hebra region. Drop 5 pieces of gourmet meat, then drop a Sapphire to freeze them all. The frozen meat blocks sell for huge profits to any merchant. One trip to Hebra can net you 500+ rupees.',
        descriptionEs: 'Caza animales grandes (alces, osos) en la región de Hebra. Deja caer 5 piezas de carne gourmet, luego suelta un Zafiro para congelarlas todas. Los bloques de carne congelada se venden por grandes ganancias a cualquier mercader. Un viaje a Hebra puede darte 500+ rupias.',
        category: 'tip',
      },
    ],
  },
  {
    game: 'Breath of the Wild',
    gameEs: 'Breath of the Wild',
    year: 2017,
    console: 'Nintendo Switch / Wii U',
    cheats: [
      {
        id: 'botw-1',
        title: 'Windbomb (BIL) — Speedrun Glitch',
        titleEs: 'Windbomb (BIL) — Glitch de Speedrun',
        description: 'Drop a spherical bomb mid-air, enter bullet time with your bow, then immediately drop a cube bomb and detonate the spherical one. The physics engine launches Link at incredible speeds. This is the most famous BotW speedrun technique and can cross all of Hyrule in seconds.',
        descriptionEs: 'Suelta una bomba esférica en el aire, entra en tiempo bala con tu arco, luego suelta inmediatamente una bomba cúbica y detona la esférica. El motor físico lanza a Link a velocidades increíbles. Es la técnica de speedrun más famosa de BotW y puede cruzar todo Hyrule en segundos.',
        category: 'glitch',
      },
      {
        id: 'botw-2',
        title: 'Shield Clipping Through Walls',
        titleEs: 'Atravesar paredes con escudo',
        description: 'Find a sloped surface against a wall, shield surf into the corner, and unequip your shield at the right moment. Link\'s model clips through the wall into out-of-bounds areas. Used to skip entire Divine Beasts and shrines in speedruns.',
        descriptionEs: 'Encuentra una superficie inclinada contra una pared, haz shield surf hacia la esquina y desequipa tu escudo en el momento justo. El modelo de Link atraviesa la pared hacia áreas fuera de límites. Se usa para saltarse Bestias Divinas y santuarios enteros en speedruns.',
        category: 'glitch',
      },
      {
        id: 'botw-3',
        title: 'Infinite Guardian Parts',
        titleEs: 'Partes de Guardián infinitas',
        description: 'Ancient arrows one-shot Guardians. Farm Major Test of Strength shrines — each Blood Moon resets the Guardian Scouts inside. Their weapons (Guardian Swords ++, Ancient Battle Axes ++) and Ancient Cores are among the most valuable drops in the game.',
        descriptionEs: 'Las flechas ancestrales matan Guardianes de un golpe. Farmea santuarios de Gran Prueba de Fuerza — cada Luna de Sangre reinicia los Guardianes dentro. Sus armas y Núcleos Ancestrales están entre los objetos más valiosos del juego.',
        category: 'tip',
      },
      {
        id: 'botw-4',
        title: 'The Lord of the Mountain',
        titleEs: 'El Señor de la Montaña',
        description: 'On Satori Mountain, when a green glow appears at night, the Lord of the Mountain spawns — a legendary horse-like creature. It\'s the fastest mount in the game with infinite stamina, but cannot be registered at stables. It disappears if you dismount.',
        descriptionEs: 'En la Montaña Satori, cuando un resplandor verde aparece de noche, aparece el Señor de la Montaña — una criatura legendaria. Es la montura más rápida del juego con resistencia infinita, pero no puede registrarse en establos. Desaparece si desmontas.',
        category: 'easter_egg',
      },
      {
        id: 'botw-5',
        title: 'Thunderstorm Weapon Farming',
        titleEs: 'Farmeo de armas con tormenta',
        description: 'During a thunderstorm, unequip all metal gear. Enemies wielding metal weapons will be struck by lightning! Drop a metal weapon near an enemy camp, wait for the storm, and watch them get zapped. Free weapons and materials without fighting.',
        descriptionEs: 'Durante una tormenta, desequipa todo el equipo metálico. ¡Los enemigos con armas metálicas serán alcanzados por rayos! Deja caer un arma metálica cerca de un campamento enemigo, espera la tormenta y míralos electrocutarse. Armas y materiales gratis sin luchar.',
        category: 'tip',
      },
      {
        id: 'botw-6',
        title: 'Farosh Horn Farming',
        titleEs: 'Farmeo de Cuerno de Farosh',
        description: 'Camp at Riola Spring in Faron. Farosh spawns every morning at 5 AM. Shoot its horn with a long-range bow (Phrenic or Golden Bow) for a shard worth 300 rupees or 30-minute meal duration. You can farm one per minute — the best rupee source in the game.',
        descriptionEs: 'Acampa en el Manantial Riola en Farone. Farosh aparece cada mañana a las 5 AM. Dispara a su cuerno con un arco de largo alcance para un fragmento que vale 300 rupias o 30 minutos de duración en comidas. Puedes farmear uno por minuto — la mejor fuente de rupias del juego.',
        category: 'secret',
      },
      {
        id: 'botw-7',
        title: 'Stasis+ Combat Trick',
        titleEs: 'Truco de combate con Stasis+',
        description: 'Upgrade your Sheikah Slate to Stasis+. It freezes enemies for a few seconds, and any damage dealt during freeze is multiplied! Hit a Lynel with Stasis+, spin with a two-handed weapon, and deal massive damage before it can move.',
        descriptionEs: 'Mejora tu Sheikah Slate a Stasis+. Congela enemigos por unos segundos, ¡y cualquier daño infligido durante la congelación se multiplica! Golpea a un Lynel con Stasis+, gira con un arma de dos manos e inflige daño masivo antes de que pueda moverse.',
        category: 'tip',
      },
      {
        id: 'botw-8',
        title: 'Dragon Parts Don\'t Despawn',
        titleEs: 'Las partes de dragón no desaparecen',
        description: 'When you shoot a dragon, the shard flies off and glows. These shards don\'t despawn until you leave the area or rest at a campfire. You can farm 5-10 shards per dragon spawn and collect them all at once.',
        descriptionEs: 'Cuando disparas a un dragón, el fragmento sale volando y brilla. Estos fragmentos no desaparecen hasta que sales del área o descansas en una fogata. Puedes farmear 5-10 fragmentos por aparición de dragón y recogerlos todos a la vez.',
        category: 'secret',
      },
      {
        id: 'botw-9',
        title: 'Elemental Weapon Aura',
        titleEs: 'Aura de arma elemental',
        description: 'Equipping a Flameblade keeps you warm in cold regions. A Frostblade keeps you cool in the desert. You don\'t need to switch armor — just equip the weapon and your temperature is regulated. Combine with armor for extreme weather immunity.',
        descriptionEs: 'Equipar una Espada de Fuego te mantiene caliente en regiones frías. Una Espada de Hielo te mantiene fresco en el desierto. No necesitas cambiar armadura — solo equipa el arma y tu temperatura se regula. Combínalo con armadura para inmunidad climática extrema.',
        category: 'tip',
      },
      {
        id: 'botw-10',
        title: 'Cucco Revenge Squad',
        titleEs: 'Escuadrón de venganza Cucco',
        description: 'Attack a Cucco repeatedly and it will summon an angry flock that attacks relentlessly. But here\'s the trick — bait enemies near the Cucco first, then trigger the swarm. The Cucco army will fight FOR you, clearing entire enemy camps.',
        descriptionEs: 'Ataca repetidamente a un Cucco y convocará una bandada furiosa que ataca sin descanso. Pero aquí está el truco — atrae enemigos cerca del Cucco primero, luego activa el enjambre. El ejército Cucco luchará POR ti, limpiando campamentos enemigos enteros.',
        category: 'secret',
      },
    ],
  },
  {
    game: 'Skyward Sword',
    gameEs: 'Skyward Sword',
    year: 2011,
    console: 'Wii / Switch',
    cheats: [
      {
        id: 'ss-1',
        title: 'Bamboo Slicing Mini-Game',
        titleEs: 'Mini-juego de cortar bambú',
        description: 'On Bamboo Island, the slicing mini-game rewards insane amounts of rupees. Get 28+ cuts for the Gold Rupee (300 rupees). The trick: slice horizontally, not vertically. Each horizontal swing hits 3-4 bamboo stalks at once.',
        descriptionEs: 'En la Isla Bambú, el mini-juego de cortar recompensa con cantidades increíbles de rupias. Consigue 28+ cortes para la Rupia de Oro (300 rupias). El truco: corta horizontalmente, no verticalmente. Cada golpe horizontal alcanza 3-4 tallos a la vez.',
        category: 'tip',
      },
      {
        id: 'ss-2',
        title: 'Bug Island Infinite Bugs',
        titleEs: 'Insectos infinitos en Isla Insecto',
        description: 'Go to Bug Island at night for the best insect spawns. Use your bug net at night to catch rare insects like Sky Stag Beetles and Bird Feathers. Sleep in a bed to reset spawns — the Bug Island has the highest concentration of rare bugs in the game.',
        descriptionEs: 'Ve a la Isla Insecto de noche para los mejores spawns de insectos. Usa tu red de insectos de noche para atrapar insectos raros como Escarabajos Ciervo Celestiales. Duerme en una cama para reiniciar spawns — Isla Insecto tiene la mayor concentración.',
        category: 'tip',
      },
      {
        id: 'ss-3',
        title: 'Gratitude Crystal Farming',
        titleEs: 'Farmeo de Cristales de Gratitud',
        description: 'Help the toilet hand ghost (Parrow) in Skyloft repeatedly to farm Gratitude Crystals easily. Each request is simple, and you can complete multiple requests per night. Having Gratitude Crystals expands your pouch and wallet significantly.',
        descriptionEs: 'Ayuda al fantasma de mano del baño (Parrow) en Skyloft repetidamente para farmear Cristales de Gratitud fácilmente. Cada petición es simple, y puedes completar múltiples por noche. Tener Cristales expande tu bolsa y billetera significativamente.',
        category: 'tip',
      },
      {
        id: 'ss-4',
        title: 'Shield Durability Glitch',
        titleEs: 'Glitch de durabilidad de escudo',
        description: 'When your shield is about to break, quickly pause and switch to a different shield before the breaking animation completes. The durability counter resets, and your original shield "forgets" it was damaged. Works best with the Hylian Shield for infinite durability.',
        descriptionEs: 'Cuando tu escudo está a punto de romperse, pausa rápidamente y cambia a otro escudo antes de que termine la animación. El contador de durabilidad se reinicia y tu escudo original "olvida" que estaba dañado. Funciona mejor con el Escudo Hylian para durabilidad infinita.',
        category: 'glitch',
      },
      {
        id: 'ss-5',
        title: 'Lanayru Timeshift Stone Puzzles',
        titleEs: 'Puzles de piedra de cambio temporal',
        description: 'Hit Timeshift Stones with your sword to create a bubble where the past and present coexist. Objects from the past can be brought to the present if you carry them out. This lets you solve puzzles by bringing ancient items into the current world.',
        descriptionEs: 'Golpea Piedras de Cambio Temporal con tu espada para crear una burbuja donde pasado y presente coexisten. Objetos del pasado pueden traerse al presente si los cargas fuera. Esto te permite resolver puzles trayendo objetos antiguos al mundo actual.',
        category: 'secret',
      },
      {
        id: 'ss-6',
        title: 'Silent Realm Shortcuts',
        titleEs: 'Atajos del Reino Silencioso',
        description: 'In Silent Realms, you can step on the very edge of waking water without triggering the Guardians. Use this to collect tears in dangerous areas. Also, the Stamina Fruit respawns after collecting a tear — always grab it before making risky runs.',
        descriptionEs: 'En los Reinos Silenciosos, puedes pisar el borde del agua sin activar a los Guardianes. Úsalo para recoger lágrimas en áreas peligrosas. Además, la Fruta de Resistencia reaparece tras recoger una lágrima — siempre agárrala antes de hacer carreras arriesgadas.',
        category: 'tip',
      },
      {
        id: 'ss-7',
        title: 'Maximum Wallet with Batreaux',
        titleEs: 'Billetera máxima con Batreaux',
        description: 'Collect all 80 Gratitude Crystals by completing side quests across Skyloft and the surface. Batreaux transforms into a human at 80 crystals, and you get the Tycoon Wallet (9000 rupee capacity) — more than you\'ll ever need.',
        descriptionEs: 'Recolecta los 80 Cristales de Gratitud completando misiones secundarias en Skyloft y la superficie. Batreaux se transforma en humano a los 80 cristales y obtienes la Billetera Magnate (9000 rupias) — más de lo que necesitarás.',
        category: 'secret',
      },
      {
        id: 'ss-8',
        title: 'Boss Rush Lightning Round',
        titleEs: 'Ronda relámpago de jefes',
        description: 'Talk to the Thunder Dragon Lanayru after the main story. He offers a Boss Rush mode where you fight all bosses sequentially. Beat them all with no healing for the Hylian Shield — the most durable shield in the game, nearly unbreakable.',
        descriptionEs: 'Habla con el Dragón Trueno Lanayru tras la historia principal. Ofrece un modo Boss Rush donde peleas contra todos los jefes secuencialmente. Derrótalos a todos sin curarte para el Escudo Hylian — casi indestructible.',
        category: 'secret',
      },
      {
        id: 'ss-9',
        title: 'Beedle\'s Beetle Upgrades',
        titleEs: 'Mejoras del Escarabajo de Beedle',
        description: 'Buy all Beetle upgrades from Beedle\'s Airshop as early as possible. The Hook Beetle can carry bombs — drop them on enemies from across the map. The Quick Beetle flies faster for time-sensitive puzzles. These trivialize many late-game sections.',
        descriptionEs: 'Compra todas las mejoras del Escarabajo de la Tienda Aérea de Beedle lo antes posible. El Escarabajo Gancho puede cargar bombas — suéltalas en enemigos desde el otro lado del mapa. El Escarabajo Rápido vuela más rápido para puzles cronometrados.',
        category: 'tip',
      },
      {
        id: 'ss-10',
        title: 'Faron Woods Silent Realm Skip',
        titleEs: 'Saltarse Reino Silencioso de Faron',
        description: 'In Faron Woods, you can sequence-break by using the Beetle to collect a tear across a massive gap before entering the Silent Realm proper. This lets you skip one of the hardest Silent Realm challenges entirely.',
        descriptionEs: 'En el Bosque de Farone, puedes romper la secuencia usando el Escarabajo para recoger una lágrima al otro lado de un abismo enorme antes de entrar al Reino Silencioso. Esto te permite saltarte uno de los desafíos más difíciles por completo.',
        category: 'glitch',
      },
    ],
  },
  {
    game: 'Twilight Princess',
    gameEs: 'Twilight Princess',
    year: 2006,
    console: 'GameCube / Wii',
    cheats: [
      {
        id: 'tp-1',
        title: 'Infinite Rupees at Snowpeak',
        titleEs: 'Rupias infinitas en Snowpeak',
        description: 'In the Snowpeak Ruins dungeon, the room with the cannonball puzzle has endlessly respawning rupees that drop from the ceiling. Each batch gives ~100 rupees. Leave and re-enter the room to farm indefinitely.',
        descriptionEs: 'En la mazmorra de las Ruinas de Snowpeak, la sala del puzle de las balas de cañón tiene rupias que reaparecen sin fin del techo. Cada tanda da ~100 rupias. Sal y vuelve a entrar para farmear indefinidamente.',
        category: 'tip',
      },
      {
        id: 'tp-2',
        title: 'Early Master Sword Glitch',
        titleEs: 'Glitch de Espada Maestra temprana',
        description: 'By clipping through a specific wall in Faron Woods using wolf Link\'s digging mechanic, you can access the Sacred Grove before completing the required dungeons. This lets you get the Master Sword very early.',
        descriptionEs: 'Atravesando una pared específica en el Bosque de Farone usando la mecánica de excavar de Link lobo, puedes acceder al Bosque Sagrado antes de completar las mazmorras requeridas. Esto te permite obtener la Espada Maestra muy temprano.',
        category: 'glitch',
      },
      {
        id: 'tp-3',
        title: 'Fishing for the Hylian Loach',
        titleEs: 'Pescando al Loach Hylian',
        description: 'At the Fishing Hole, use the frog lure in summer near the lily pads. The legendary Hylian Loach is the rarest fish — catching it fills your entire fishing journal and earns a piece of heart. Use sinking lures to bypass smaller fish.',
        descriptionEs: 'En el Estanque de Pesca, usa el señuelo de rana en verano cerca de los nenúfares. El legendario Loach Hylian es el pez más raro — atraparlo llena tu diario de pesca completo y gana un corazón. Usa señuelos hundibles para evitar peces pequeños.',
        category: 'easter_egg',
      },
      {
        id: 'tp-4',
        title: 'Magic Armor Infinite Rupee Trick',
        titleEs: 'Truco de rupias infinitas con Armadura Mágica',
        description: 'The Magic Armor drains rupees instead of hearts. But you can exploit this: wear it while farming rupees in the Cave of Ordeals. The armor makes you invincible, and the cave drops more rupees than the armor consumes.',
        descriptionEs: 'La Armadura Mágica drena rupias en vez de corazones. Pero puedes explotarlo: úsala mientras farmeas rupias en la Cueva de Pruebas. La armadura te hace invencible, y la cueva suelta más rupias de las que consume.',
        category: 'tip',
      },
      {
        id: 'tp-5',
        title: 'Howling Stone Secrets',
        titleEs: 'Secretos de las Piedras Aulladoras',
        description: 'Each Howling Stone teaches Wolf Link a new sword technique for human Link. Find all 7 (including the hidden one near Hyrule Castle) to unlock the Great Spin, Mortal Draw, and Jump Strike — all hidden combat techniques.',
        descriptionEs: 'Cada Piedra Aulladora enseña a Link lobo una nueva técnica de espada para Link humano. Encuentra las 7 (incluyendo la oculta cerca del Castillo de Hyrule) para desbloquear el Gran Giro, Tajo Mortal y Golpe en Salto — técnicas de combate ocultas.',
        category: 'secret',
      },
      {
        id: 'tp-6',
        title: 'Agitha\'s Golden Bug Collection',
        titleEs: 'Colección de insectos dorados de Agitha',
        description: 'Find all 24 Golden Bugs scattered across Hyrule and give them to Agitha in Castle Town. In exchange, you get a wallet upgrade to 1000 rupees, then 5000, and finally the Giant Wallet (1000 → 5000 rupees). Check trees and walls at night.',
        descriptionEs: 'Encuentra los 24 Insectos Dorados dispersos por Hyrule y dáselos a Agitha en Ciudad del Castillo. Recibes mejoras de billetera: 1000, luego 5000, y finalmente la Billetera Gigante. Revisa árboles y paredes de noche.',
        category: 'secret',
      },
      {
        id: 'tp-7',
        title: 'Back Slice Infinite Stun Lock',
        titleEs: 'Bloqueo infinito con Tajo Trasero',
        description: 'After learning the Back Slice, you can chain it on most enemies: roll behind them, Back Slice, then immediately roll behind again before they recover. This keeps enemies permanently stun-locked. Works on Dark Nuts and even Ganondorf.',
        descriptionEs: 'Tras aprender el Tajo Trasero, puedes encadenarlo: rueda detrás, Tajo Trasero, luego rueda detrás otra vez antes de que se recuperen. Mantiene enemigos bloqueados permanentemente. Funciona en Dark Nuts y hasta Ganondorf.',
        category: 'tip',
      },
      {
        id: 'tp-8',
        title: 'Poes and Jovani\'s Reward',
        titleEs: 'Poes y la recompensa de Jovani',
        description: 'Collect 60 Poes (glowing orange spirits at night) for Jovani in Castle Town. Every 20 Poes gives you 200 rupees. At 60, you get unlimited rupees — Jovani gives you a bottomless wallet as thanks for breaking his curse.',
        descriptionEs: 'Recolecta 60 Poes (espíritus naranjas brillantes de noche) para Jovani en Ciudad del Castillo. Cada 20 Poes te da 200 rupias. A los 60, obtienes rupias ilimitadas — Jovani te da una billetera sin fondo como agradecimiento.',
        category: 'secret',
      },
      {
        id: 'tp-9',
        title: 'Lakebed Temple Water Flow Trick',
        titleEs: 'Truco de flujo de agua del Templo del Lago',
        description: 'In Lakebed Temple, you can skip the complex rotating staircase by shooting the water flow switch from the central room with the Clawshot. This immediately routes water to the boss door, saving 20+ minutes.',
        descriptionEs: 'En el Templo del Lago, puedes saltarte la compleja escalera giratoria disparando al interruptor de flujo de agua desde la sala central con el Clawshot. Esto dirige el agua a la puerta del jefe instantáneamente, ahorrando 20+ minutos.',
        category: 'glitch',
      },
      {
        id: 'tp-10',
        title: 'Cave of Ordeals Floor 50',
        titleEs: 'Piso 50 de la Cueva de Pruebas',
        description: 'Reach floor 50 of the Cave of Ordeals (Gerudo Desert) and you\'ll face three Dark Nuts simultaneously. The Fairy at the top sends Great Fairies to lakes across Hyrule. Fill your bottles with Great Fairy\'s Tears for full health + attack boost.',
        descriptionEs: 'Llega al piso 50 de la Cueva de Pruebas (Desierto Gerudo) y enfrentarás tres Dark Nuts simultáneamente. El Hada en la cima envía Grandes Hadas a lagos de Hyrule. Llena tus botellas con Lágrimas de Gran Hada para salud completa + boost de ataque.',
        category: 'secret',
      },
    ],
  },
  {
    game: 'The Wind Waker',
    gameEs: 'The Wind Waker',
    year: 2002,
    console: 'GameCube',
    cheats: [
      {
        id: 'ww-1',
        title: 'Tingle Tuner Infinite Rupees',
        titleEs: 'Rupias infinitas con Tingle Tuner',
        description: 'Connect a GBA with the Tingle Tuner. Tingle can drop bombs near enemies from the sky. Kill them with bombs to force red rupee drops (20 rupees each). Farm the submarine enemies around Greatfish Isle for 500+ rupees per run.',
        descriptionEs: 'Conecta una GBA con el Tingle Tuner. Tingle puede soltar bombas del cielo cerca de enemigos. Mátalos con bombas para forzar rupias rojas (20 rupias cada una). Farmea los submarinos enemigos cerca de Isla Greatfish para 500+ rupias.',
        category: 'tip',
      },
      {
        id: 'ww-2',
        title: 'Super Swim Glitch',
        titleEs: 'Glitch de super nado',
        description: 'Hold the control stick diagonally while swimming and mash A rapidly. Link swims 2x faster than normal. Combine with the Swift Sail (HD version) for the fastest ocean traversal possible.',
        descriptionEs: 'Mantén el stick de control diagonalmente mientras nadas y presiona A rápidamente. Link nada 2x más rápido de lo normal. Combínalo con la Vela Veloz (versión HD) para la travesía oceánica más rápida posible.',
        category: 'glitch',
      },
      {
        id: 'ww-3',
        title: 'Beedle\'s membership card',
        titleEs: 'Tarjeta de miembro de Beedle',
        description: 'Visit Beedle\'s shop ships across the ocean. After spending enough rupees, he\'ll offer you the Complementary ID (30 points) and eventually the Membership Card which gives massive discounts on all items.',
        descriptionEs: 'Visita los barcos tienda de Beedle por el océano. Tras gastar suficientes rupias, te ofrecerá la Tarjeta de Miembro con grandes descuentos en todos los artículos.',
        category: 'secret',
      },
      {
        id: 'ww-4',
        title: 'Cabana Deed Reward',
        titleEs: 'Recompensa de la Escritura de la Cabaña',
        description: 'Complete the trading sequence by giving the teachers at Windfall their missing students. You get the Cabana Deed — a private island house with a piece of heart inside and access to the Nintendo Gallery via secret passage.',
        descriptionEs: 'Completa la secuencia de intercambio devolviendo a los estudiantes perdidos a los profesores en Windfall. Obtienes la Escritura de la Cabaña — una casa privada en una isla con un corazón dentro y acceso a la Galería Nintendo.',
        category: 'secret',
      },
      {
        id: 'ww-5',
        title: 'Pictograph Legendary Figure',
        titleEs: 'Pictografía de figura legendaria',
        description: 'Take a pictograph of the postman (the Rito at Dragon Roost) and give it to the figurine shop on Windfall. It takes 30 real-time minutes to craft but activates a secret quest chain for rare figurines.',
        descriptionEs: 'Toma una pictografía del cartero (el Rito en Dragon Roost) y dásela a la tienda de figuritas en Windfall. Tarda 30 minutos reales en fabricarse pero activa una cadena de misiones secretas para figuritas raras.',
        category: 'easter_egg',
      },
      {
        id: 'ww-6',
        title: 'Knuckle\'s 20 Golden Feathers',
        titleEs: '20 Plumas Doradas de Knuckle',
        description: 'Collect 20 Golden Feathers and give them to the Rito guard on the second floor of Dragon Roost. He gives you 200 rupees per feather set, and unlocks a treasure chart leading to a Silver Rupee (200 rupees).',
        descriptionEs: 'Recolecta 20 Plumas Doradas y dáselas al guardia Rito en el segundo piso de Dragon Roost. Te da 200 rupias por juego y desbloquea un mapa del tesoro.',
        category: 'secret',
      },
      {
        id: 'ww-7',
        title: 'The Ghost Ship Chart',
        titleEs: 'El mapa del Barco Fantasma',
        description: 'The Ghost Ship appears on specific moon phases. To enter it, you need the Ghost Ship Chart from Diamond Steppe Island. Inside, defeat the mini-bosses for a Piece of Heart and the rarest treasure chart.',
        descriptionEs: 'El Barco Fantasma aparece en fases lunares específicas. Para entrar necesitas el Mapa del Barco Fantasma de la Isla Diamond Steppe. Dentro, derrota a los mini-jefes para un Corazón y el mapa del tesoro más raro.',
        category: 'secret',
      },
      {
        id: 'ww-8',
        title: 'Wind Waker Glitchless Duplication',
        titleEs: 'Duplicación sin glitch en Wind Waker',
        description: 'Collect 20 Joy Pendants and give them to the teacher on Windfall. You get the Hero\'s Charm which shows enemy HP. While wearing it, defeat enemies near treasure chests and they may drop Joy Pendants again for repeat rewards.',
        descriptionEs: 'Recolecta 20 Joy Pendants y dáselos a la profesora en Windfall. Obtienes el Hero\'s Charm que muestra HP enemigo. Mientras lo llevas, derrota enemigos cerca de cofres y pueden soltar Joy Pendants otra vez.',
        category: 'tip',
      },
      {
        id: 'ww-9',
        title: 'Salvage 49 Treasure Charts',
        titleEs: 'Salvamento de 49 Mapas del Tesoro',
        description: 'There are 49 Treasure Charts across the Great Sea. Every single one leads to a unique reward — Pieces of Heart, Rupees, or Charts for the Triforce Shards. Use the Grappling Hook to salvage every glowing circle you see.',
        descriptionEs: 'Hay 49 Mapas del Tesoro en el Gran Mar. Cada uno lleva a una recompensa única — Corazones, Rupias o Mapas para los Fragmentos de Trifuerza. Usa el Gancho para rescatar cada círculo brillante que veas.',
        category: 'tip',
      },
      {
        id: 'ww-10',
        title: 'Kalle Demos Secret Weakness',
        titleEs: 'Debilidad secreta de Kalle Demos',
        description: 'The Forbidden Woods boss Kalle Demos can be one-shot. Use a Forest Water droplet on the central vine before it grabs Link. The boss instantly withers and dies in a single hit — no battle required.',
        descriptionEs: 'El jefe del Bosque Prohibido Kalle Demos puede morir de un golpe. Usa una gota de Agua del Bosque en la enredadera central antes de que atrape a Link. El jefe se marchita y muere instantáneamente — sin batalla.',
        category: 'easter_egg',
      },
    ],
  },
  {
    game: "Majora's Mask",
    gameEs: "Majora's Mask",
    year: 2000,
    console: 'Nintendo 64',
    cheats: [
      {
        id: 'mm-1',
        title: 'Inverted Song of Time',
        titleEs: 'Canción del Tiempo Invertida',
        description: 'Play the Song of Time backwards (A, Down-C, Right-C, A, Down-C, Right-C). This slows the clock to 1/3 speed — 3 real-time hours per in-game day. Essential for completing dungeons and side quests without rushing.',
        descriptionEs: 'Toca la Canción del Tiempo al revés (A, Abajo-C, Derecha-C, A, Abajo-C, Derecha-C). Esto ralentiza el reloj a 1/3 de velocidad — 3 horas reales por día del juego. Esencial para completar mazmorras sin prisas.',
        category: 'tip',
      },
      {
        id: 'mm-2',
        title: 'Song of Double Time',
        titleEs: 'Canción del Doble Tiempo',
        description: 'Play each note of the Song of Time twice (A, A, Down-C, Down-C, Right-C, Right-C). This skips to the next dawn/dusk. Used to fast-forward to specific event times without waiting.',
        descriptionEs: 'Toca cada nota de la Canción del Tiempo dos veces. Esto salta al siguiente amanecer/atardecer. Se usa para avanzar rápido a eventos específicos sin esperar.',
        category: 'tip',
      },
      {
        id: 'mm-3',
        title: 'Fierce Deity Mask Glitch',
        titleEs: 'Glitch de la Máscara de Deidad Feroz',
        description: 'Collecting all 24 masks lets you get the Fierce Deity Mask for the final boss. But there\'s a glitch: use the mask in Sakon\'s hideout or the fishing pond glitch to use Fierce Deity Link ANYWHERE, not just boss rooms.',
        descriptionEs: 'Recolectando las 24 máscaras obtienes la Máscara de Deidad Feroz para el jefe final. Pero hay un glitch: úsala en el escondite de Sakon o en el estanque de pesca para usar a Link Deidad Feroz en CUALQUIER lugar.',
        category: 'glitch',
      },
      {
        id: 'mm-4',
        title: 'Zora Hall Infinite Rupees',
        titleEs: 'Rupias infinitas en Zora Hall',
        description: 'As Zora Link, play the mini-game with the drummer near Zora Hall entrance. Hit all notes perfectly for 50 rupees per attempt. Once you learn the pattern, you can farm 300+ rupees per in-game hour.',
        descriptionEs: 'Como Link Zora, juega el mini-juego con el baterista cerca de la entrada de Zora Hall. Acierta todas las notas para 50 rupias por intento. Una vez aprendes el patrón, puedes farmear 300+ rupias por hora.',
        category: 'tip',
      },
      {
        id: 'mm-5',
        title: 'Bunny Hood for Speed',
        titleEs: 'Capucha de Conejo para velocidad',
        description: 'Wear the Bunny Hood (from the Cucco Shack on Day 3). It doubles Link\'s running and jumping speed. Combine with Goron rolling for the fastest possible traversal in any 3D Zelda game.',
        descriptionEs: 'Usa la Capucha de Conejo (del Gallinero el Día 3). Duplica la velocidad de carrera y salto de Link. Combínalo con rodar como Goron para el desplazamiento más rápido de cualquier Zelda 3D.',
        category: 'tip',
      },
      {
        id: 'mm-6',
        title: 'Anju & Kafei Quest',
        titleEs: 'La misión de Anju y Kafei',
        description: 'The most complex side quest in Zelda history. Follow the 3-day schedule precisely: get the Room Key on Day 1, meet Kafei on Day 2, and stop Sakon on Day 3. The Couple\'s Mask is the reward — one of 24 required for Fierce Deity.',
        descriptionEs: 'La misión secundaria más compleja de la historia de Zelda. Sigue el horario de 3 días: consigue la Llave de la Habitación el Día 1, encuentra a Kafei el Día 2, y detén a Sakon el Día 3. La Máscara de la Pareja es la recompensa.',
        category: 'secret',
      },
      {
        id: 'mm-7',
        title: 'Stone Tower Temple Upside Down',
        titleEs: 'Templo de la Torre de Piedra al revés',
        description: 'After completing Stone Tower Temple once, shoot the red gem at the entrance with a Light Arrow. The entire temple inverts — you can walk on the ceiling. This reveals entirely new areas, treasure chests, and the path to the boss.',
        descriptionEs: 'Tras completar el Templo de la Torre de Piedra, dispara a la gema roja en la entrada con una Flecha de Luz. El templo entero se invierte — puedes caminar por el techo revelando áreas nuevas, cofres y el camino al jefe.',
        category: 'secret',
      },
      {
        id: 'mm-8',
        title: 'Gold Dust Sword Upgrade',
        titleEs: 'Mejora de espada con Polvo de Oro',
        description: 'Win the Goron Race with a perfect score. You get Gold Dust. Take it to the smith in Mountain Village on Day 1. Return at dawn of Day 2 to get the Razor Sword. Bring Gold Dust again on Day 2 for the Gilded Sword — triple damage!',
        descriptionEs: 'Gana la Carrera Goron con puntuación perfecta. Obtienes Polvo de Oro. Llévaselo al herrero en Mountain Village el Día 1. Vuelve al amanecer del Día 2 para la Espada Afilada. Lleva más Polvo el Día 2 para la Espada Dorada — ¡triple daño!',
        category: 'secret',
      },
      {
        id: 'mm-9',
        title: 'Doggy Racetrack Manipulation',
        titleEs: 'Manipulación del hipódromo de perros',
        description: 'At the Doggy Racetrack, bet on the dog based on its tail wag speed before the race. The fastest wagging tail almost always wins. You can farm 150+ rupees per race reliably.',
        descriptionEs: 'En el Hipódromo de Perros, apuesta basándote en la velocidad de movimiento de la cola del perro antes de la carrera. El que mueve la cola más rápido casi siempre gana. Puedes farmear 150+ rupias por carrera.',
        category: 'tip',
      },
      {
        id: 'mm-10',
        title: 'Fourth Day Glitch (Skull Kid Skip)',
        titleEs: 'Glitch del Cuarto Día (saltarse a Skull Kid)',
        description: 'If you talk to the astronomer at the exact moment the moon crashes (frame-perfect), the game skips the cutscene and loads a "fourth day" where the clock is frozen. You can explore Termina with no time limit.',
        descriptionEs: 'Si hablas con el astrónomo en el momento exacto en que la luna cae (frame-perfect), el juego salta la cinemática y carga un "cuarto día" con el reloj congelado. Puedes explorar Términa sin límite de tiempo.',
        category: 'glitch',
      },
    ],
  },
  {
    game: 'Ocarina of Time',
    gameEs: 'Ocarina of Time',
    year: 1998,
    console: 'Nintendo 64',
    cheats: [
      {
        id: 'oot-1',
        title: 'Unlimited Gold Skulltulas',
        titleEs: 'Gold Skulltulas ilimitadas',
        description: 'Enter the House of Skulltula in Kakariko Village. Use a Bomb near the soft soil outside, then play the Song of Storms. Go inside and use the Boomerang on the Gold Skulltula token — it respawns infinitely. Get all 100 rewards in 30 minutes.',
        descriptionEs: 'Entra en la Casa Skulltula en Kakariko. Usa una Bomba en la tierra blanda afuera, luego toca la Canción de las Tormentas. Entra y usa el Bumerán en la ficha — reaparece infinitamente. Consigue las 100 recompensas en 30 minutos.',
        category: 'glitch',
      },
      {
        id: 'oot-2',
        title: 'Bottle Duplication Glitch',
        titleEs: 'Glitch de duplicación de botellas',
        description: 'Catch a fish in a bottle. Go to a location where you can sell it. Pause, swap the bottle for another item, and unpause — the game sells the fish but the bottle stays. You now have all 4 bottles very early.',
        descriptionEs: 'Atrapa un pez en una botella. Ve a un lugar donde puedas venderlo. Pausa, cambia la botella por otro objeto y despausa — el juego vende el pez pero la botella se queda. Ahora tienes las 4 botellas muy temprano.',
        category: 'glitch',
      },
      {
        id: 'oot-3',
        title: 'Power Crouch Stab',
        titleEs: 'Estocada agachada de poder',
        description: 'Hold R to shield, crouch, and press B to stab repeatedly. This does 2x damage per hit compared to normal sword swings, and attacks at double speed. It melts Stalfos, Iron Knuckles, and even Ganon in seconds.',
        descriptionEs: 'Mantén R para escudo, agáchate y presiona B para apuñalar repetidamente. Inflige 2x daño y ataca al doble de velocidad. Derrite Stalfos, Iron Knuckles e incluso Ganon en segundos.',
        category: 'tip',
      },
      {
        id: 'oot-4',
        title: 'Infinite Sword Glitch (ISG)',
        titleEs: 'Glitch de Espada Infinita (ISG)',
        description: 'Crouch-stab an object, then interrupt the animation by taking damage or interacting with something. The sword\'s hitbox stays active permanently. Walk into enemies to deal constant damage with no animation.',
        descriptionEs: 'Apuñala agachado un objeto e interrumpe la animación tomando daño o interactuando. La hitbox de la espada se mantiene activa permanentemente. Camina hacia enemigos para infligir daño constante sin animación.',
        category: 'glitch',
      },
      {
        id: 'oot-5',
        title: 'Deku Nut Upgrade in Lost Woods',
        titleEs: 'Mejora de Nuez Deku en Bosque Perdido',
        description: 'In Lost Woods, a Deku Scrub near the Deku Theater offers to upgrade your Deku Nut capacity from 20 → 30, then 30 → 40 if you wear the Mask of Truth. Combined with the Deku Stick upgrade, this gives you 40 of each.',
        descriptionEs: 'En el Bosque Perdido, un Deku Scrub cerca del Teatro Deku ofrece mejorar tu capacidad de Nueces Deku de 20 → 30, luego 30 → 40 si llevas la Máscara de la Verdad. Combinado con la mejora de Ramas Deku, tienes 40 de cada uno.',
        category: 'secret',
      },
      {
        id: 'oot-6',
        title: 'Song of Storms Time Paradox',
        titleEs: 'Paradoja temporal de la Canción de las Tormentas',
        description: 'As adult Link, Guru-Guru in the windmill teaches you the Song of Storms. Then as Young Link, you play it in the windmill and make it spin faster, draining the well. This lets you enter the Bottom of the Well dungeon — a closed time loop.',
        descriptionEs: 'Como Link adulto, Guru-Guru en el molino te enseña la Canción de las Tormentas. Luego como Link niño, la tocas en el molino y lo haces girar más rápido, drenando el pozo. Esto te permite entrar a la mazmorra del Fondo del Pozo — un bucle temporal.',
        category: 'easter_egg',
      },
      {
        id: 'oot-7',
        title: 'Hylian Loach Fishing',
        titleEs: 'Pesca del Loach Hylian',
        description: 'At the Fishing Pond (adult), equip the Golden Scale and the sinking lure. The Hylian Loach weighs 35+ lbs and only appears near the center log. It takes 10+ real minutes to spawn. Catch it for the Golden Scale if you haven\'t gotten it yet.',
        descriptionEs: 'En el Estanque de Pesca (adulto), equipa la Escama Dorada y el señuelo hundible. El Loach Hylian pesa 35+ lbs y solo aparece cerca del tronco central. Tarda 10+ minutos reales en aparecer. Atrápalo para la Escama Dorada.',
        category: 'secret',
      },
      {
        id: 'oot-8',
        title: 'Biggoron Sword Early',
        titleEs: 'Espada Biggoron temprano',
        description: 'After getting Epona, start the trading quest: Pocket Egg → Pocket Cucco → Cojiro → Odd Mushroom → Odd Potion → Poacher\'s Saw → Broken Goron Sword → Prescription → Eyeball Frog → World\'s Finest Eye Drops → Biggoron Sword. Get the 2-handed sword that does 2x Master Sword damage.',
        descriptionEs: 'Tras conseguir a Epona, inicia la misión de intercambio para la Espada Biggoron (daño 2x). La secuencia completa de 11 pasos es la misión secundaria más larga del juego.',
        category: 'secret',
      },
      {
        id: 'oot-9',
        title: 'Water Temple Easy Mode',
        titleEs: 'Modo fácil del Templo del Agua',
        description: 'In the 3DS version, colored lines on the walls mark water level change points. In the N64 version, the key is to ALWAYS check under floating platforms first before changing water levels. The small key under the central tower is the one everyone misses.',
        descriptionEs: 'En la versión 3DS, líneas de colores marcan los puntos de cambio de agua. En N64, la clave es SIEMPRE revisar bajo plataformas flotantes antes de cambiar niveles. La llave pequeña bajo la torre central es la que todos se saltan.',
        category: 'tip',
      },
      {
        id: 'oot-10',
        title: 'Nayru\'s Love Magic Spell',
        titleEs: 'Hechizo del Amor de Nayru',
        description: 'Find the spell near the Desert Colossus as Young Link (requires bombing a cracked wall). Nayru\'s Love makes you invincible for a full minute. Combine with the Biggoron Sword to walk through bosses without taking damage.',
        descriptionEs: 'Encuentra el hechizo cerca del Coloso del Desierto como Link niño. El Amor de Nayru te hace invencible por un minuto completo. Combínalo con la Espada Biggoron para atravesar jefes sin recibir daño.',
        category: 'secret',
      },
    ],
  },
  {
    game: 'A Link to the Past',
    gameEs: 'A Link to the Past',
    year: 1991,
    console: 'Super Nintendo',
    cheats: [
      {
        id: 'alttp-1',
        title: 'Cane of Byrna Invincibility',
        titleEs: 'Invencibilidad con la Vara de Byrna',
        description: 'The Cane of Byrna (found on Death Mountain) creates a magic barrier that damages enemies and protects Link. But it drains magic quickly. Trick: equip the Magic Cape, activate it, then switch to the Cane of Byrna. The cape\'s magic cost replaces the cane\'s — making it last 4x longer.',
        descriptionEs: 'La Vara de Byrna crea una barrera mágica que daña enemigos. Equipa la Capa Mágica, actívala y cambia a la Vara. El costo de magia de la capa reemplaza al de la vara — durando 4x más.',
        category: 'glitch',
      },
      {
        id: 'alttp-2',
        title: 'Bomb Jumping Sequence Break',
        titleEs: 'Saltos de secuencia con bombas',
        description: 'By placing a bomb, taking damage at the right frame, and using the knockback to reach ledges, you can access dungeons out of order. You can enter Turtle Rock (dungeon 7) immediately after the first dungeon.',
        descriptionEs: 'Colocando una bomba, recibiendo daño en el frame justo y usando el knockback, puedes acceder a mazmorras fuera de orden. Puedes entrar a Turtle Rock (mazmorra 7) justo después de la primera.',
        category: 'glitch',
      },
      {
        id: 'alttp-3',
        title: 'Quarter Magic with the Bat',
        titleEs: 'Cuarto de magia con el murciélago',
        description: 'After getting the Magic Powder, sprinkle it on the shrine near the Witch\'s Hut. A bat appears and offers to halve your magic costs. Combined with 1/2 magic, this gives you 1/4 magic cost — cast spells almost for free.',
        descriptionEs: 'Tras conseguir el Polvo Mágico, espárcelo en el altar cerca de la Cabaña de la Bruja. Un murciélago ofrece reducir tus costes de magia a la mitad. Combinado con magia 1/2, tienes 1/4 de coste.',
        category: 'secret',
      },
      {
        id: 'alttp-4',
        title: 'Blue Bottle Duplication',
        titleEs: 'Duplicación de botella azul',
        description: 'In Kakariko Village, the bottle merchant sells a bottle. Buy it, save and quit, then load the save. You can buy it AGAIN before leaving the area. Do this 4 times for all four bottles at the start of the game.',
        descriptionEs: 'En Kakariko, el mercader vende una botella. Cómprala, guarda y sal, y carga la partida. Puedes comprarla OTRA VEZ antes de salir del área. Hazlo 4 veces para las cuatro botellas al inicio.',
        category: 'glitch',
      },
      {
        id: 'alttp-5',
        title: 'Good Bee vs Evil Bee',
        titleEs: 'Abeja buena vs Abeja mala',
        description: 'Catch a Good Bee with the Bug Net near the Ice Rod Cave. Release it near enemies — it stuns them for 10+ seconds. But if you catch a Bad Bee and release it near the Good Bee, they fight each other and leave behind a Fairy!',
        descriptionEs: 'Atrapa una Abeja Buena con la Red cerca de la Cueva de la Vara de Hielo. Suéltala cerca de enemigos — los aturde 10+ segundos. Pero si atrapas una Abeja Mala y la sueltas cerca de la Buena, ¡pelean y dejan un Hada!',
        category: 'easter_egg',
      },
      {
        id: 'alttp-6',
        title: 'Chris Houlihan Room',
        titleEs: 'La sala de Chris Houlihan',
        description: 'This legendary secret room appears when you fall into a specific pit in Hyrule Castle during the rain sequence. It was added as a tribute to a Nintendo Power contest winner. Contains 45 rupees. Enter from the Castle Escape at the start of the game.',
        descriptionEs: 'Esta legendaria sala secreta aparece al caer en un foso específico en el Castillo de Hyrule durante la secuencia de lluvia. Es un tributo a un ganador de concurso de Nintendo Power. Contiene 45 rupias.',
        category: 'easter_egg',
      },
      {
        id: 'alttp-7',
        title: 'Tempered Sword Early Access',
        titleEs: 'Acceso temprano a la Espada Templada',
        description: 'You can get the Tempered (level 3) Sword before dungeon 4. Simply save the blacksmith in the Dark World early using the Mirror and Magic Hammer to reach him. This gives you a sword that does 2x more damage for the mid-game dungeons.',
        descriptionEs: 'Puedes conseguir la Espada Templada (nivel 3) antes de la mazmorra 4. Salva al herrero en el Mundo Oscuro usando el Espejo y el Martillo Mágico. Te da una espada con 2x daño para las mazmorras intermedias.',
        category: 'secret',
      },
      {
        id: 'alttp-8',
        title: 'Fairy Fountain Glitch',
        titleEs: 'Glitch de la Fuente de Hadas',
        description: 'In any Fairy Fountain, throw an empty bottle at a Fairy while at full health. The game gets confused and spawns an extra Fairy. Repeatedly throwing bottles can fill the screen with Fairies — infinite healing.',
        descriptionEs: 'En cualquier Fuente de Hadas, lanza una botella vacía a un Hada con la salud llena. El juego se confunde y genera un Hada extra. Lanzando botellas repetidamente puedes llenar la pantalla de Hadas.',
        category: 'glitch',
      },
      {
        id: 'alttp-9',
        title: 'Spin Attack Without Charging',
        titleEs: 'Ataque giratorio sin cargar',
        description: 'Tap the B button rapidly and release — you\'ll spin attack with no charge time. This is frame-perfect but incredibly useful against fast enemies like Stalfos. Masters can spin-attack every 0.5 seconds.',
        descriptionEs: 'Presiona B rápidamente y suelta — harás un ataque giratorio sin tiempo de carga. Es frame-perfect pero increíblemente útil contra enemigos rápidos. Los maestros pueden atacar en giro cada 0.5 segundos.',
        category: 'tip',
      },
      {
        id: 'alttp-10',
        title: 'Golden Sword via Super Bomb',
        titleEs: 'Espada Dorada vía Super Bomba',
        description: 'In the Dark World Pyramid, use the Super Bomb to blow open the cracked wall. Inside, the Great Fairy upgrades your sword to the Golden Sword (level 4). This sword does 4x the damage of the Master Sword and shoots sword beams at full health.',
        descriptionEs: 'En la Pirámide del Mundo Oscuro, usa la Super Bomba en la pared agrietada. Dentro, la Gran Hada mejora tu espada a Espada Dorada (nivel 4). Inflige 4x daño y dispara ondas de espada con salud llena.',
        category: 'secret',
      },
    ],
  },
  {
    game: 'The Legend of Zelda',
    gameEs: 'The Legend of Zelda',
    year: 1986,
    console: 'NES',
    cheats: [
      {
        id: 'loz-1',
        title: 'Second Quest After Beating the Game',
        titleEs: 'Segunda búsqueda tras completar el juego',
        description: 'After beating Ganon, enter your name as "ZELDA" on a new save file. This activates the Second Quest — all dungeons are rearranged, items are in new locations, and enemies are much harder. A completely different game hidden in plain sight.',
        descriptionEs: 'Tras vencer a Ganon, pon tu nombre como "ZELDA" en una nueva partida. Activa la Segunda Búsqueda — todas las mazmorras cambian, objetos en nuevas ubicaciones y enemigos más difíciles. Un juego completamente diferente oculto.',
        category: 'secret',
      },
      {
        id: 'loz-2',
        title: 'Bomb Every Wall',
        titleEs: 'Bombardea cada pared',
        description: 'In the original Zelda, there are no visual clues for bomb-able walls. Literally bomb every rock face and wall section you see. The overworld alone has 10+ hidden bomb-able caves with rupees, heart containers, and shop access.',
        descriptionEs: 'En el Zelda original, no hay pistas visuales para paredes bombardeables. Literalmente bombardea cada cara de roca y pared. Solo el overworld tiene 10+ cuevas ocultas con rupias, corazones y tiendas.',
        category: 'tip',
      },
      {
        id: 'loz-3',
        title: 'Burn the 8th Bush',
        titleEs: 'Quema el octavo arbusto',
        description: 'Specific overworld bushes hide staircases. The most famous: burn the 8th bush from the start screen (or the bush in the top-right of the screen in certain areas) with the Blue Candle to reveal a hidden shop or heart.',
        descriptionEs: 'Arbustos específicos esconden escaleras. El más famoso: quema el 8º arbusto desde la pantalla de inicio (o el arbusto arriba-derecha en ciertas áreas) con la Vela Azul para revelar una tienda o corazón oculto.',
        category: 'secret',
      },
      {
        id: 'loz-4',
        title: 'Blue Ring Early',
        titleEs: 'Anillo Azul temprano',
        description: 'The Blue Ring halves all damage and is available in a hidden shop for 250 rupees. It\'s located one screen north of the starting screen, behind an Armos statue. Don\'t miss this — it makes the first 3 dungeons trivial.',
        descriptionEs: 'El Anillo Azul reduce todo el daño a la mitad y está en una tienda oculta por 250 rupias. Está una pantalla al norte del inicio, detrás de una estatua Armos. No te lo pierdas — hace las primeras 3 mazmorras triviales.',
        category: 'secret',
      },
      {
        id: 'loz-5',
        title: 'The Letter to the Old Woman',
        titleEs: 'La Carta a la Anciana',
        description: 'In one dungeon, an Old Man offers a choice between a Heart Container and a Potion. Take the Heart Container. Buy the Blue Potion separately. Some text read "DID YOU GET THE SWORD FROM THE OLD MAN ON TOP OF THE WATERFALL" — that\'s your hint to explore waterfalls.',
        descriptionEs: 'En una mazmorra, un Anciano ofrece Corazón o Poción. Toma el Corazón. Compra la Poción Azul aparte. Algunos textos leen "¿CONSEGUISTE LA ESPADA DEL ANCIANO EN LA CASCADA?" — es una pista para explorar cascadas.',
        category: 'secret',
      },
      {
        id: 'loz-6',
        title: 'The Lost Hills Pattern',
        titleEs: 'El patrón de las Colinas Perdidas',
        description: 'The Lost Hills area loops infinitely. The pattern to escape is: North, West, South, West. This takes you to the graveyard and eventually Level 6. Remember N-W-S-W as "Never Walk Slow, Walk"!',
        descriptionEs: 'Las Colinas Perdidas se repiten infinitamente. El patrón para escapar: Norte, Oeste, Sur, Oeste. Te lleva al cementerio y al Nivel 6. Recuerda N-O-S-O.',
        category: 'tip',
      },
      {
        id: 'loz-7',
        title: 'The Letter Glitch',
        titleEs: 'El Glitch de la Carta',
        description: 'Pick up the Letter item, then immediately save and quit. When you reload, you keep the Letter permanently displayed in your inventory but you can still buy things from shops that normally sell the Letter. It\'s a permanent inventory glitch.',
        descriptionEs: 'Recoge la Carta, guarda y sal inmediatamente. Al recargar, la Carta se muestra permanentemente en tu inventario pero aún puedes comprar cosas en tiendas. Es un glitch de inventario permanente.',
        category: 'glitch',
      },
      {
        id: 'loz-8',
        title: 'Ganon\'s Invisible Weakness',
        titleEs: 'La debilidad invisible de Ganon',
        description: 'During the final battle, Ganon is invisible. You MUST use the Silver Arrow — but first, hit him with your sword to make him visible and vulnerable. The hitbox is only on his torso. Once visible, ONE Silver Arrow kills him.',
        descriptionEs: 'En la batalla final, Ganon es invisible. DEBES usar la Flecha de Plata — pero primero golpéalo con tu espada para hacerlo visible. La hitbox solo está en su torso. Una vez visible, UNA Flecha de Plata lo mata.',
        category: 'tip',
      },
      {
        id: 'loz-9',
        title: 'Heart Container Without Beating Boss',
        titleEs: 'Corazón sin derrotar al jefe',
        description: 'In some dungeons, you can use the Flute to warp out after grabbing the Triforce piece — before the boss is defeated. The game registers the dungeon as "cleared" but the boss room stays active. You can farm boss rooms for extra bombs and rupees.',
        descriptionEs: 'En algunas mazmorras, puedes usar la Flauta para teletransportarte tras agarrar la Trifuerza — antes de derrotar al jefe. El juego registra la mazmorra como "completada" pero la sala del jefe sigue activa para farmear.',
        category: 'glitch',
      },
      {
        id: 'loz-10',
        title: 'Pols Voice Weakness',
        titleEs: 'Debilidad de Pols Voice',
        description: 'The bunny-like enemies (Pols Voice) are described as "hates loud noises." On the NES, you can kill them with arrows — but on the Famicom (Japan), the controller has a microphone! Yelling into it kills all Pols Voice in the room instantly.',
        descriptionEs: 'Los enemigos tipo conejo (Pols Voice) "odian ruidos fuertes." En NES los matas con flechas — pero en Famicom (Japón), ¡el mando tiene micrófono! Gritar mata todos los Pols Voice en la sala instantáneamente.',
        category: 'easter_egg',
      },
    ],
  },
];

/* ─── Category badge ───────────────────────────────── */

const CATEGORY_CONFIG = {
  tip: { en: 'Tip', es: 'Consejo', color: '#3E6B48', bg: 'rgba(62,107,72,0.15)' },
  secret: { en: 'Secret', es: 'Secreto', color: '#C6A15B', bg: 'rgba(198,161,91,0.15)' },
  glitch: { en: 'Glitch', es: 'Glitch', color: '#8B3A3A', bg: 'rgba(139,58,58,0.15)' },
  easter_egg: { en: 'Easter Egg', es: 'Huevo de Pascua', color: '#5B8A9E', bg: 'rgba(91,138,158,0.15)' },
} as const;

/* ─── Main Component ────────────────────────────────── */

export function CheatsPage() {
  const { language, theme } = useAppStore();
  const isDark = theme === 'dark';
  const [expandedGame, setExpandedGame] = useState<string | null>('totk');
  const [expandedCheats, setExpandedCheats] = useState<Set<string>>(new Set());

  const toggleGame = (game: string) => {
    setExpandedGame((prev) => (prev === game ? null : game));
  };

  const toggleCheat = (id: string) => {
    setExpandedCheats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 sm:space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <Lightbulb size={28} className="text-[#C6A15B] drop-shadow-[0_0_8px_rgba(198,161,91,0.3)]" />
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {language === 'es' ? 'Trucos de Zelda' : 'Zelda Tips & Secrets'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
          {language === 'es'
            ? 'Los 10 mejores trucos, secretos y glitches de cada juego de Zelda — del más nuevo al más viejo'
            : 'Top 10 tips, secrets, and glitches for each Zelda game — newest to oldest'}
        </p>
      </motion.div>

      {/* Games accordion */}
      <div className="space-y-4">
        {CHEATS_DATA.map((gameData, gameIdx) => {
          const isExpanded = expandedGame === gameData.game;
          const gameName = language === 'es' ? gameData.gameEs : gameData.game;

          return (
            <motion.div key={gameData.game}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gameIdx * 0.06 }}>
              {/* Game header */}
              <button onClick={() => toggleGame(gameData.game)}
                className="w-full rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 text-left transition-all"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  borderLeft: `3px solid ${isExpanded ? '#C6A15B' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: isExpanded ? 'rgba(198,161,91,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isExpanded ? 'rgba(198,161,91,0.25)' : 'rgba(255,255,255,0.06)'}` }}>
                  <Gamepad2 size={20} className={isExpanded ? 'text-[#C6A15B]' : ''} style={{ color: isExpanded ? '#C6A15B' : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-base font-bold" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>{gameName}</h2>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                      style={{ backgroundColor: 'rgba(198,161,91,0.12)', color: '#C6A15B' }}>
                      {gameData.year}
                    </span>
                    <span className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>{gameData.console}</span>
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                    {gameData.cheats.length} {language === 'es' ? 'trucos' : 'tips'}
                  </p>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={18} style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
                </motion.div>
              </button>

              {/* Cheats list */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }} className="overflow-hidden">
                    <div className="pt-3 space-y-2 pl-2 sm:pl-4">
                      {gameData.cheats.map((cheat, ci) => {
                        const cat = CATEGORY_CONFIG[cheat.category];
                        const isOpen = expandedCheats.has(cheat.id);
                        return (
                          <motion.div key={cheat.id}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: ci * 0.03 }}
                            className="rounded-xl overflow-hidden cursor-pointer"
                            style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` }}
                            onClick={() => toggleCheat(cheat.id)}>
                            <div className="p-3 sm:p-4 flex items-start gap-3">
                              <span className="text-[10px] font-mono font-bold mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }}>
                                #{ci + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-xs sm:text-sm font-semibold" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>
                                    {language === 'es' ? cheat.titleEs : cheat.title}
                                  </h4>
                                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase"
                                    style={{ backgroundColor: cat.bg, color: cat.color }}>
                                    {language === 'es' ? cat.es : cat.en}
                                  </span>
                                </div>
                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.25 }}
                                      className="text-[10px] sm:text-xs mt-2 leading-relaxed"
                                      style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)' }}>
                                      {language === 'es' ? cheat.descriptionEs : cheat.description}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="mt-0.5">
                                <ChevronDown size={14} style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }} />
                              </motion.div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
