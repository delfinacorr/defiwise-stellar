export interface AnswerOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  prompt: string;
  options: AnswerOption[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string; // markdown-like content for the theory
  durationMinutes: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  color: string; // tailwind color class for theming
  lessons: Lesson[];
  quiz: Question[];
  rewardXP: number;
  nftImage: string; // path to the NFT image earned on completion
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  certificateImage: string;
}

export const courses: Course[] = [
  {
    id: "intro-defi",
    title: "Introducción a DeFi",
    description:
      "Aprende los fundamentos de las finanzas descentralizadas, desde conceptos básicos hasta cómo interactuar con protocolos reales.",
    certificateImage: "/certificadoRecon.svg",
    modules: [
      {
        id: "mod-1",
        title: "¿Qué es DeFi?",
        description: "Finanzas descentralizadas: conceptos fundamentales",
        color: "active",
        rewardXP: 50,
        nftImage: "/nft/nft1.svg",
        lessons: [
          {
            id: "les-1-1",
            title: "Finanzas tradicionales vs DeFi",
            description:
              "Entendé las diferencias entre el sistema financiero tradicional y las finanzas descentralizadas.",
            durationMinutes: 10,
            content: `## Finanzas Tradicionales vs DeFi

Las finanzas tradicionales (TradFi) dependen de intermediarios: bancos, brokers, cámaras de compensación. Cada intermediario agrega costos y tiempos de procesamiento.

**DeFi** elimina estos intermediarios usando contratos inteligentes en blockchain. Las transacciones son:
- **Transparentes** — cualquiera puede verificar el código
- **Sin permisos** — no necesitás aprobación de un banco
- **Componibles** — los protocolos se conectan entre sí como piezas de LEGO

### Ejemplos concretos
- En TradFi, una transferencia internacional tarda 2-5 días y cuesta USD 25-50
- En Stellar, la misma transferencia tarda 5 segundos y cuesta menos de USD 0.01`,
          },
          {
            id: "les-1-2",
            title: "Wallets y claves",
            description:
              "Qué es una wallet, cómo funcionan las claves públicas y privadas, y cómo conectarte de forma segura.",
            durationMinutes: 8,
            content: `## Wallets y Claves

Una wallet (billetera) es tu identidad en blockchain. No guarda dinero — guarda las **claves** que te dan acceso a tus fondos.

### Clave pública vs privada
- **Clave pública**: tu dirección, como un CBU o email. La compartís para recibir fondos.
- **Clave privada**: tu contraseña. **Nunca la compartas.** Quien la tiene, controla tus fondos.

### Tipos de wallets
- **Custodial**: un tercero guarda tus claves (ej: exchange). Más simple, menos control.
- **Non-custodial**: vos guardás tus claves (ej: Freighter, MetaMask). Más responsabilidad, control total.

### Freighter
Para este curso usamos **Freighter**, la wallet oficial de Stellar. Es una extensión de navegador que te permite firmar transacciones de forma segura.`,
          },
          {
            id: "les-1-3",
            title: "Blockchain y redes",
            description:
              "Qué es una blockchain, qué son las redes (mainnet vs testnet) y por qué Stellar es ideal para DeFi.",
            durationMinutes: 12,
            content: `## Blockchain y Redes

Una blockchain es un registro distribuido e inmutable de transacciones. Cada bloque contiene un grupo de transacciones y está enlazado al anterior.

### Mainnet vs Testnet
- **Mainnet**: la red principal con valor real. Las transacciones cuestan dinero.
- **Testnet**: red de prueba con tokens sin valor. Ideal para aprender sin riesgo.

### ¿Por qué Stellar?
Stellar fue diseñada para pagos y activos digitales:
- **Velocidad**: transacciones en ~5 segundos
- **Costo**: fees de ~0.00001 XLM (prácticamente gratis)
- **Soroban**: plataforma de smart contracts de Stellar, potente y eficiente
- **Ecosistema**: DEXs, lending, stablecoins, y más

En este curso trabajamos en **Stellar Testnet** para que puedas practicar sin riesgo.`,
          },
        ],
        quiz: [
          {
            id: "q-1-1",
            prompt:
              "¿Cuál es la principal diferencia entre finanzas tradicionales y DeFi?",
            options: [
              {
                text: "DeFi usa intermediarios más rápidos",
                isCorrect: false,
              },
              {
                text: "DeFi elimina intermediarios usando contratos inteligentes",
                isCorrect: true,
              },
              {
                text: "DeFi solo funciona con Bitcoin",
                isCorrect: false,
              },
              {
                text: "No hay diferencia, son lo mismo",
                isCorrect: false,
              },
            ],
          },
          {
            id: "q-1-2",
            prompt: "¿Qué es una clave privada?",
            options: [
              {
                text: "Tu dirección pública para recibir fondos",
                isCorrect: false,
              },
              {
                text: "La contraseña de tu email",
                isCorrect: false,
              },
              {
                text: "La clave que da control total sobre tus fondos — nunca debe compartirse",
                isCorrect: true,
              },
              {
                text: "Un código que te da el banco",
                isCorrect: false,
              },
            ],
          },
          {
            id: "q-1-3",
            prompt: "¿Cuánto tarda una transacción en Stellar aproximadamente?",
            options: [
              { text: "2-5 días", isCorrect: false },
              { text: "10 minutos", isCorrect: false },
              { text: "~5 segundos", isCorrect: true },
              { text: "1 hora", isCorrect: false },
            ],
          },
          {
            id: "q-1-4",
            prompt: "¿Qué es una testnet?",
            options: [
              {
                text: "Una red con tokens reales para testing",
                isCorrect: false,
              },
              {
                text: "Una red de prueba con tokens sin valor real, ideal para aprender",
                isCorrect: true,
              },
              {
                text: "Una red privada solo para empresas",
                isCorrect: false,
              },
              {
                text: "La red principal de producción",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: "mod-2",
        title: "Smart Contracts:",
        description: "Descubrí cómo el código reemplaza a los intermediarios y garantiza la transparencia.",
        color: "pink",
        rewardXP: 150,
        nftImage: "/nft/nft2.svg",
        lessons: [
          {
            id: "les-2-1",
            title: "¿Qué es un Smart Contract?",
            description: "Entendé los fundamentos de los contratos autoejecutables.",
            durationMinutes: 10,
            content: `## ¿Qué es un Smart Contract?
Un contrato inteligente (Smart Contract) es un programa informático que se ejecuta automáticamente cuando se cumplen condiciones predefinidas. En DeFi, estos contratos reemplazan a los intermediarios tradicionales.

**Características principales:**
- **Autoejecutables** — No requieren que una persona "presione un botón" para que funcionen.
- **Digitales** — Viven íntegramente en la blockchain.
- **Sin confianza** — No necesitás confiar en la otra parte, solo en el código.

### ¿Por qué son importantes?
En el sistema financiero tradicional, si querés pedir un préstamo, un banco debe evaluar tu perfil y liberar los fondos. En DeFi, un Smart Contract puede retener tu garantía y entregarte el préstamo al instante, sin preguntas.`,
          },
          {
            id: "les-2-2",
            title: "Propiedades Críticas",
            description: "Inmutabilidad, transparencia y determinismo.",
            durationMinutes: 12,
            content: `## Propiedades Críticas
Para que un Smart Contract sea confiable en un entorno descentralizado, debe cumplir con ciertas propiedades fundamentales.

### Inmutabilidad
Una vez que el código se despliega en la red, **no puede ser modificado**. Esto garantiza que las reglas del juego no cambien a mitad del camino. Si hay un error, se debe desplegar un nuevo contrato.

### Transparencia
Cualquiera puede ver el código fuente del contrato y todas las transacciones que ha realizado. Esto permite auditorías públicas y asegura que el contrato haga exactamente lo que dice que hace.

### Determinismo
Un Smart Contract siempre producirá el mismo resultado para las mismas entradas, sin importar quién lo ejecute o cuándo.`,
          },
          {
            id: "les-2-3",
            title: "Soroban & Stellar",
            description: "La plataforma de smart contracts de próxima generación.",
            durationMinutes: 15,
            content: `## Soroban & Stellar
Soroban es la plataforma de contratos inteligentes de Stellar, diseñada para ser eficiente, segura y escalable.

### ¿Por qué Soroban?
- **Basado en Rust** — Utiliza un lenguaje moderno y seguro que previene muchos errores comunes de programación.
- **Optimizado** — Diseñado específicamente para alto rendimiento y bajas comisiones.
- **Integración nativa** — Se conecta perfectamente con los activos de Stellar (como USDC o XLM).

### El ecosistema Stellar
Stellar ya era excelente para pagos rápidos. Con Soroban, ahora permite crear protocolos complejos como exchanges descentralizados (DEX), sistemas de préstamos y mucho más, manteniendo la velocidad y bajos costos.`,
          },
        ],
        quiz: [
          {
            id: "q-2-1",
            prompt: "¿Qué sucede con un Smart Contract una vez que se despliega en la red?",
            options: [
              {
                text: "Puede ser editado por cualquier usuario",
                isCorrect: false,
              },
              {
                text: "Es inmutable y no puede ser modificado arbitrariamente",
                isCorrect: true,
              },
              {
                text: "Expira automáticamente después de 24 horas",
                isCorrect: false,
              },
              {
                text: "Debe ser aprobado por un banco central",
                isCorrect: false,
              },
            ],
          },
          {
            id: "q-2-2",
            prompt: "¿Quién puede auditar el código de un Smart Contract en DeFi?",
            options: [
              {
                text: "Solo el creador del contrato",
                isCorrect: false,
              },
              {
                text: "Solo agencias gubernamentales",
                isCorrect: false,
              },
              {
                text: "Cualquier persona, ya que el código es transparente y público",
                isCorrect: true,
              },
              {
                text: "Nadie, el código está encriptado y es privado",
                isCorrect: false,
              },
            ],
          },
          {
            id: "q-2-3",
            prompt: "¿Qué lenguaje de programación se utiliza principalmente en Soroban?",
            options: [
              { text: "Solidity", isCorrect: false },
              { text: "Rust", isCorrect: true },
              { text: "JavaScript", isCorrect: false },
              { text: "Python", isCorrect: false },
            ],
          },
          {
            id: "q-2-4",
            prompt: "¿Cuál es el beneficio principal de reemplazar intermediarios con código?",
            options: [
              {
                text: "Hace que los procesos sean más lentos",
                isCorrect: false,
              },
              {
                text: "Aumenta los costos operativos",
                isCorrect: false,
              },
              {
                text: "Garantiza transparencia y reduce el error humano",
                isCorrect: true,
              },
              {
                text: "Requiere más intervención manual",
                isCorrect: false,
              },
            ],
          },
          {
            id: "q-2-5",
            prompt: "¿Cuál es la relación entre Soroban y Stellar?",
            options: [
              { text: "Son redes competidoras sin relación", isCorrect: false },
              {
                text: "Soroban es la plataforma de smart contracts de la red Stellar",
                isCorrect: true,
              },
              { text: "Soroban es una blockchain separada", isCorrect: false },
              { text: "Soroban es simplemente una billetera para Stellar", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
];
