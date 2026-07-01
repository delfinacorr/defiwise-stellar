# 📋 GitHub Issue Templates - DeFiWise

Copia estos templates y úsalos directamente en GitHub para crear issues.

---

## 🔴 CRÍTICA - FASE 0 (Hacer YA)

### Issue Template 1: [P0-1] Integración On-Chain de Quiz Rewards

```markdown
## Title
[P0-1] Integración On-Chain de Quiz Rewards — Mintear XP & NFTs

## Labels
- priority: critical
- type: backend
- area: blockchain-integration
- sprint: MVP

## Milestone
v0.5 — On-Chain Integration

## Assignees
@backend-dev

## Estimated Effort
40 hours (1 dev × 5 days)

## Description

### Problem Statement
Actualmente, cuando un usuario completa un quiz:
- ✓ Se valida en el cliente (localStorage)
- ✓ Se muestra confirmación en UI
- ✗ **No se ejecuta transacción en Stellar**
- ✗ **No se mintea XP Token**
- ✗ **No se mintea Badge NFT**

Esto significa que DeFiWise NO es una plataforma DeFi real, solo simula educación.

### Current Behavior
```javascript
// En QuizView.tsx
if (score >= 75) {
  saveProgressLocally(moduleId);  // ← Solo localStorage
  showSuccessMessage();
  // Nada más sucede
}
```

### Desired Behavior
```javascript
// En QuizView.tsx
if (score >= 75) {
  try {
    const xpReward = module.rewardXP;
    const txHash = await submitQuizOnChain(moduleId, score, xpReward);
    
    // Esperar confirmación
    showFreighterPopup(txHash);
    await waitForConfirmation(txHash);
    
    // Guardar en estado
    saveOnChainData({ moduleId, txHash, xpEarned: xpReward });
    showSuccessWithOnChainData(txHash, xpReward);
  } catch (error) {
    showError(`Failed to mint NFT: ${error.message}`);
  }
}
```

### Technical Requirements

**1. Crear función en `src/lib/stellar.ts`:**
```typescript
async function submitQuizOnChain(
  moduleId: string,
  quizScore: number,
  xpAmount: number
): Promise<string> {
  // 1. Validar score >= 75%
  if (quizScore < 75) throw new Error("Score too low");
  
  // 2. Obtener user wallet desde Freighter
  const { publicKey } = await freighter.getPublicKey();
  
  // 3. Construir y firmar tx para XP Token mint
  const xpTx = await xpToken.mint(publicKey, xpAmount);
  const xpTxHash = await freighter.signAndSubmit(xpTx);
  
  // 4. Construir y firmar tx para Badge NFT mint
  const metadata = {
    moduleId,
    score: quizScore,
    timestamp: Date.now(),
    earnedXP: xpAmount
  };
  const badgeTx = await badgeNFT.mint(publicKey, moduleId, metadata);
  const badgeTxHash = await freighter.signAndSubmit(badgeTx);
  
  // 5. Retornar hash (para verificación posterior)
  return { xpTxHash, badgeTxHash };
}
```

**2. Conectar en `src/app/dashboard/ruta_aprendizaje/components/QuizView.tsx`:**
- Llamar `submitQuizOnChain()` después de validar puntaje
- Mostrar Freighter popup para firmar
- Mostrar "Pending" → "Confirmed" UI feedback
- Guardar tx hashes en estado/localStorage

**3. Actualizar UI feedback:**
- Mostrar: "Submitting to Stellar..."
- Mostrar: "Pending confirmation..."
- Mostrar: "✓ NFT Minted!" + link a Stellar Expert
- Mostrar: "✓ +50 XP earned!" + link a StellarChain

### Contract Addresses (Testnet)
```
XP Token: CATAE4HXRWEIVGI2ZW5NGRXIQDNFWZ4YLAKXUU3Q3FKBDT2MPGJECTL4
Badge NFT: CDWJE7AM3DFWC6FD2RKBASWP7EITQ2ULJH4FX5JFQRVHXQSXDPJAB3KI
Network: Stellar Testnet
```

### Testing Criteria
- [ ] Unit test: `submitQuizOnChain()` con score >= 75% → tx hash
- [ ] Unit test: `submitQuizOnChain()` con score < 75% → error
- [ ] Integration test: E2E quiz → XP minting → NFT minting
- [ ] Manual test: Completa quiz real → verifica en StellarChain
- [ ] Error handling: Network errors, user rejection en Freighter
- [ ] Gas fees: Verificar que sean < $0.01 USD

### Acceptance Criteria
- [x] `submitQuizOnChain()` function implementada
- [x] Llamada después de validar quiz score
- [x] Freighter popup muestra tx para firmar
- [x] TX se submite a Stellar Testnet
- [x] XP aparece en wallet del usuario
- [x] Badge NFT es verificable on-chain
- [x] UI muestra feedback (pending → confirmed)
- [x] TX hash se guarda para auditoria
- [x] Todos los tests pasan
- [x] No hay errores en console

### Definition of Done
- Código mergeado en `main`
- Tests pasando (unit + integration)
- Manual test completado por QA
- Documentación actualizada en README
- Deuda técnica documentada (si existe)

### Related Issues
- Depends on: Freighter integration working (should be done)
- Blocks: P0-2 (NFT rendering in dashboard)
- Blocks: P0-3 (XP balance tracking)

### Resources
- [Stellar.js Docs](https://developers.stellar.org/docs/tools/js-stellar-sdk)
- [Soroban Smart Contracts](https://developers.stellar.org/docs/learn/fundamentals/soroban-overview)
- [Freighter API](https://github.com/stellar/freighter)
- Contract Repo: Look in `/contracts/xp-token` and `/contracts/badge-nft`

### Notes
- Hacer primero un test en testnet para verificar contratos funcionen
- Considerar añadir retry logic para transacciones
- Considerar rate-limiting (1 tx por usuario/día máximo)
- Documentar gas fees para usuario
```

---

### Issue Template 2: [P0-2] Renderizar NFTs Reales en Dashboard

```markdown
## Title
[P0-2] Renderizar NFTs Reales desde Contrato en /dashboard/logros

## Labels
- priority: critical
- type: frontend
- area: blockchain-integration
- sprint: MVP

## Milestone
v0.5

## Assignees
@frontend-dev

## Estimated Effort
24 hours (1 dev × 3 days)

## Description

### Problem Statement
La página `/dashboard/logros` existe pero está vacía. Los badges/certificados ganados NO se muestran porque:
- ✗ No consulta el Badge NFT contract
- ✗ No trae metadata on-chain
- ✗ UI está hardcodeada para datos locales

### Current Behavior
```
/dashboard/logros
├── "Earned Certificates" → vacío
├── "Earned NFTs" → vacío
└── "XP Summary" → vacío
```

### Desired Behavior
```
/dashboard/logros
├── "Earned Certificates" (5)
│  ├── Blockchain 101 ✓ (100 XP, 85% score) - May 20, 2026
│  └── ...
├── "Earned NFTs" (5)
│  ├── Badge: "¿Qué es DeFi?" (50 XP, 90% score)
│  │  └── Click → Modal con metadata + link a Stellar Expert
│  └── ...
└── "XP Summary"
   ├── Current Balance: 250 XP (on-chain)
   ├── Historical Max: 300 XP
   └── Progress: 83%
```

### Technical Requirements

**1. Crear hook `useRealEarnedNFTs()` en `src/hooks/`:**
```typescript
// useRealEarnedNFTs.ts
export function useRealEarnedNFTs(userAddress: string) {
  const [nfts, setNfts] = useState<EarnedNFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userAddress) return;

    (async () => {
      try {
        // 1. Consultar Badge NFT contract por user address
        const userNFTs = await badgeNFT.getNFTsByOwner(userAddress);
        
        // 2. Para cada NFT, obtener metadata
        const enriched = await Promise.all(
          userNFTs.map(async (nft) => ({
            ...nft,
            moduleTitle: modules[nft.moduleId].title,
            moduleImage: modules[nft.moduleId].nftImage,
            earnedAt: new Date(nft.timestamp * 1000)
          }))
        );
        
        // 3. Ordenar por fecha (más reciente primero)
        setNfts(enriched.sort((a, b) => b.earnedAt - a.earnedAt));
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [userAddress]);

  return { nfts, loading };
}
```

**2. Actualizar componente `EarnedNfts.tsx`:**
```typescript
import { useRealEarnedNFTs } from "@/hooks/useRealEarnedNFTs";
import { useStellarWallet } from "@/hooks/useStellarWallet";

export default function EarnedNfts() {
  const { publicKey } = useStellarWallet();
  const { nfts, loading } = useRealEarnedNFTs(publicKey);

  if (loading) return <LoadingSpinner />;
  if (nfts.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.tokenId}
          nft={nft}
          onClickDetail={() => openNFTModal(nft)}
        />
      ))}
    </div>
  );
}
```

**3. Crear Modal de Detalle:**
```typescript
// components/modals/ModalNFTDetail.tsx
export function ModalNFTDetail({ nft, onClose }: Props) {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="p-6">
        <img src={nft.moduleImage} alt={nft.moduleTitle} className="w-full rounded-lg" />
        
        <h2 className="text-2xl font-bold mt-4">{nft.moduleTitle}</h2>
        <p className="text-grey mt-2">Completed on {nft.earnedAt.toDateString()}</p>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Stat label="XP Earned" value={nft.earnedXP} />
          <Stat label="Quiz Score" value={`${nft.quizScore}%`} />
        </div>
        
        <a
          href={`https://stellar.expert/asset/${nft.contractId}`}
          target="_blank"
          className="btn btn-primary mt-6 w-full"
        >
          Verify on Stellar Expert →
        </a>
      </div>
    </Modal>
  );
}
```

### Testing Criteria
- [ ] Hook `useRealEarnedNFTs()` retorna NFTs del contrato
- [ ] NFTs se enriquecen con metadata (módulo, imagen, fecha)
- [ ] Se ordenan por fecha (más reciente primero)
- [ ] Modal muestra detalles correctamente
- [ ] Link a Stellar Expert funciona
- [ ] Empty state si no hay NFTs
- [ ] Loading state mientras se consulta

### Acceptance Criteria
- [x] NFTs reales se consultan desde Badge NFT contract
- [x] Se muestra metadata: XP, score, fecha
- [x] Se renderiza imagen del NFT
- [x] Click abre modal con detalles
- [x] Link a Stellar Expert es verificable
- [x] UI es responsive (mobile, tablet, desktop)
- [x] Error handling para llamadas fallidas
- [x] Tests unitarios pasan
- [x] No hay console errors

### Related Issues
- Depends on: P0-1 (NFTs deben estar minteados on-chain)
- Related: P0-3 (XP Balance)

### Notes
- Considerar cache de NFTs (no consultar cada render)
- Considerar paginación si usuario tiene 100+ NFTs
- Mostrar "Loading..." mientras se consulta contrato
```

---

### Issue Template 3: [P0-3] XP Balance Real Desde Contrato

```markdown
## Title
[P0-3] Usar XP Balance Real del Contrato (No localStorage)

## Labels
- priority: critical
- type: backend
- area: blockchain-integration
- sprint: MVP

## Milestone
v0.5

## Assignees
@backend-dev

## Estimated Effort
20 hours (1 dev × 2.5 days)

## Description

### Problem Statement
Actualmente, el XP balance se guarda en localStorage:
- ✗ No es verificable on-chain
- ✗ Se puede manipular localmente
- ✗ No refleja rewards reales si usuario reset browser

Debe venir del contrato XP Token.

### Current Behavior
```
localStorage: { xpBalance: 250 } ← Local, no verificable
```

### Desired Behavior
```
Stellar XP Token Contract → usuario tiene 250 XP verificable
Mostrado en: header, dashboard, page
```

### Technical Requirements

**1. Hook `useStellarProgress()` (ya existe, actualizar):**
```typescript
// src/hooks/useStellarProgress.ts
export function useStellarProgress() {
  const { publicKey } = useStellarWallet();
  const [balance, setBalance] = useState<number>(0);
  const [historicalMax, setHistoricalMax] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicKey) return;

    (async () => {
      try {
        // Consultar XP Token contract
        setLoading(true);
        
        const current = await xpToken.balanceOf(publicKey);
        const historical = await xpToken.historicalBalance(publicKey);
        
        setBalance(current);
        setHistoricalMax(historical);
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [publicKey]);

  return { balance, historicalMax, loading };
}
```

**2. Usar en Header:**
```typescript
// src/components/Header.tsx
export function Header() {
  const { balance, loading } = useStellarProgress();
  
  return (
    <header>
      <div className="flex items-center gap-2">
        <span className="text-sm text-grey">XP Balance:</span>
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <span className="font-bold text-lg">{balance} XP</span>
        )}
      </div>
    </header>
  );
}
```

**3. Usar en Dashboard Progress:**
```typescript
// src/app/dashboard/progress/Progress.tsx
export default function Progress() {
  const { balance, historicalMax, loading } = useStellarProgress();
  
  const percentage = (balance / historicalMax) * 100;
  
  return (
    <div>
      <h2>Your Progress</h2>
      <ProgressBar 
        current={balance} 
        max={historicalMax} 
        percentage={percentage}
        label="Current XP / Historical Max"
      />
      <p className="text-sm text-grey mt-2">
        {balance} / {historicalMax} XP earned ({percentage.toFixed(0)}%)
      </p>
    </div>
  );
}
```

### Testing Criteria
- [ ] Hook consulta XP Token contract
- [ ] Retorna balance actual + histórico
- [ ] Se actualiza en tiempo real
- [ ] Header muestra balance correcto
- [ ] Dashboard muestra progresión correcta
- [ ] Error handling si contrato no responde

### Acceptance Criteria
- [x] XP balance viene del contrato, no localStorage
- [x] Se muestra en header
- [x] Se muestra en dashboard
- [x] Se actualiza después de completar quiz
- [x] Historical max es inmutable (como debe ser)
- [x] Loading state mientras se consulta
- [x] Error handling

### Related Issues
- Depends on: P0-1 (XP debe estar minteado)
- Related: P0-2 (NFTs tracking)
```

---

## 🟠 ALTA - FASE 1 (Siguiente Sprint)

### Issue Template 4: [P1-1] Crear Módulos de Finanzas 101

```markdown
## Title
[P1-1] Crear Curso "Finanzas 101" — 3 Módulos, 150 XP, 150 min

## Labels
- priority: high
- type: content
- area: curriculum
- sprint: content-expansion

## Milestone
v1.0

## Assignees
@content-creator
@finance-expert (review)

## Estimated Effort
80 hours (2 content creators × 2 weeks)

## Description

### Objective
Expandir de "Blockchain 101" a educación financiera real.
Usuarios aprenden dinero, riesgo, mercados ANTES de aprender DeFi.

### Modules to Create

#### Module 1: Dinero & Economía (45 min, 50 XP)

**Lessons:**
1. ¿Qué es dinero? (12 min)
   - Funciones: medium of exchange, store of value, unit of account
   - Historia: dinero de mercancía → fiat → digital
   - Ejemplos: pesos, dólares, Bitcoin, XLM

2. Inflación, Deflación & Tasas (15 min)
   - Definiciones + ejemplos reales
   - Cómo afecta tu dinero
   - Tasas de interés simple vs compuesto
   - Ejemplo: $100 a 5% anual = ?

3. Economía Tradicional vs Digital (18 min)
   - Cómo funciona economía tradicional
   - Dinero fiat, bancos centrales
   - Qué ofrece dinero digital
   - Por qué importa

**Quiz:** 5 preguntas

#### Module 2: Riesgo & Rendimiento (40 min, 50 XP)

**Lessons:**
1. Relación Riesgo-Rendimiento (15 min)
   - Alto riesgo = alto rendimiento potencial
   - Ejemplos: Letras vs acciones vs cripto
   - Cómo evaluar riesgo

2. Volatilidad & Diversificación (15 min)
   - Qué es volatilidad
   - Cómo medir riesgo (std dev, Sharpe)
   - Por qué diversificar
   - Ejemplo: cartera 60/40

3. Risk Management (10 min)
   - Stop loss, take profit
   - Position sizing
   - Psychological biases

**Quiz:** 5 preguntas

#### Module 3: Mercados Financieros 101 (50 min, 50 XP)

**Lessons:**
1. Activos Financieros (15 min)
   - Acciones, bonos, commodities, divisas
   - Qué representa cada uno
   - Ejemplos en Latinoamérica

2. Cómo Funcionan los Mercados (18 min)
   - Precio = oferta & demanda
   - Órdenes: mercado, límite, stop
   - Spreads & liquidez
   - Intermediarios (brokers, exchanges)

3. Inversión vs Trading (17 min)
   - Diferencias fundamentales
   - Horizonte temporal
   - Estrategias básicas
   - Cuándo usar cada uno

**Quiz:** 5 preguntas

### Content Format
- Markdown-based (como actual)
- Ejemplos con números reales
- Si posible: small embedded videos (YouTube links)
- Glosario de términos
- Resources section con links a artículos

### Acceptance Criteria
- [x] 3 módulos creados (Dinero, Riesgo, Mercados)
- [x] 9 lecciones totales (~145 minutos de contenido)
- [x] 15 quiz preguntas + respuestas
- [x] 150 XP total distribuido
- [x] Español claro y accesible (no tecnicismos)
- [x] Ejemplos con datos reales
- [x] Finance expert ha revisado contenido
- [x] Integrado en `src/data/courses.ts`
- [x] Tests pasan (si existe validación de schema)

### Review Checklist
- [ ] Contenido es preciso económicamente
- [ ] Lenguaje es accesible para principiantes
- [ ] No hay errores de ortografía
- [ ] Ejemplos son relevantes (ej: Argentina, México)
- [ ] Duración es realista
- [ ] Preguntas de quiz son claras y válidas
- [ ] XP está bien balanceado vs DeFi modules

### References
- Libros: "The Alchemy of Finance" (Soros), "A Random Walk Down Wall Street"
- Artículos: CoinDesk, The Block, Bankless
- Docs: IMF, World Bank
```

---

### Issue Template 5: [P1-2] Crear Módulos de DeFi Protocols

```markdown
## Title
[P1-2] Crear Curso "DeFi Protocols" — 3 Módulos, 150 XP, 150 min

## Labels
- priority: high
- type: content
- area: curriculum
- sprint: content-expansion

## Milestone
v1.0

## Assignees
@content-creator
@defi-expert (review)

## Estimated Effort
80 hours (2 content creators × 2 weeks)

## Description

### Objective
Enseñar cómo funcionan los 3 pilares de DeFi: AMMs, Lending, Staking.
Enfoque: Stellar y protocolos locales.

### Modules to Create

#### Module 1: AMMs & Swaps (45 min, 50 XP)

**Lessons:**
1. ¿Qué es un AMM? (15 min)
   - Comparar vs order book exchanges
   - x * y = k formula
   - Liquidity providers & LP tokens
   - Ejemplo visual: Uniswap, Soroswap (si existe)

2. Slippage & Impermanent Loss (15 min)
   - Qué es slippage
   - Cómo afecta tus swaps
   - Impermanent loss: definición + ejemplo
   - Cuándo no provides liquidity es mejor

3. Usando Stellar Swaps (15 min)
   - Cómo swapear en Stellar DEX
   - Fees & gas costs
   - Best practices
   - Ejemplos: USDC ↔ XLM

**Quiz:** 4 preguntas

#### Module 2: Lending & Borrowing (50 min, 50 XP)

**Lessons:**
1. Cómo Funcionan los Lending Protocols (18 min)
   - Depósitas → ganas interés
   - Toman préstamo → pagan interés
   - Collateral requirements
   - Ejemplo: Aave, Compound

2. Liquidaciones & Risk (16 min)
   - Qué es liquidación
   - Health factor
   - Cuándo te liquidan
   - Cómo evitar

3. Lending en Stellar (16 min)
   - Protocolos disponibles
   - Tasas actuales
   - Risk profile
   - Ejemplos: qué prestaría yo

**Quiz:** 5 preguntas

#### Module 3: Staking & Yield (40 min, 50 XP)

**Lessons:**
1. Yield Farming 101 (15 min)
   - Qué es staking
   - Rewards & APY
   - Cómo calcular yield
   - Ejemplo: $100 a 20% APY = ?

2. Impermanent Loss en LPs (15 min)
   - LP vs simple staking
   - Cuándo IL es malo
   - Estrategias para minimizar
   - Es IL realmente pérdida?

3. Estrategias de Yield (10 min)
   - Yield farming vs simple staking
   - Auto-compounder bots
   - Risk-return tradeoff
   - Cuándo es safe

**Quiz:** 4 preguntas

### Content Format
- Markdown con fórmulas (KaTeX)
- Diagramas explicativos
- Calculadores embed (ej: IL calculator)
- Ejemplos con números reales de Stellar
- Security warnings dónde aplique

### Acceptance Criteria
- [x] 3 módulos creados (AMM, Lending, Staking)
- [x] 9 lecciones totales (~150 minutos)
- [x] 13 quiz preguntas + respuestas
- [x] 150 XP total
- [x] Español claro, no tecnicismos sin explicar
- [x] Ejemplos con datos reales
- [x] DeFi expert ha revisado
- [x] Integrado en `src/data/courses.ts`
- [x] Links a Stellar protocols están actualizados

### Research Needed
- [ ] ¿Qué protocolos lending existen en Stellar? (Aqua? Others?)
- [ ] ¿Soroswap existe y es mainstream?
- [ ] ¿Tasas APY actuales?
- [ ] ¿Documentación oficial de cada protocolo?

### References
- Bankless Newsletter (DeFi 101 articles)
- Stellar Docs
- Protocol documentations (Aave docs, Uniswap v3, etc)
- YouTube: DeFi protocol tutorials
```

---

## � DRIPS WAVE - Oportunidades Específicas

### Issue Template 6: [DRIPS-1] Crear Módulo "Money Streaming 101"

```markdown
## Title
[DRIPS-1] Crear Módulo "Money Streaming 101" — Intro a Drips Protocol

## Labels
- priority: high
- type: content
- area: defi-protocols
- sprint: drips-wave
- size: small

## Milestone
v1.1 (Drips Integration)

## Assignees
@content-creator

## Estimated Effort
16 hours (1 content creator × 2 days)

## Description

### Objective
Crear 1 módulo educativo sobre Money Streaming, enfoque en Drips Protocol.
Ideal para capitalizar la ola de Drips (Drips wave) y posicionar DeFiWise como educador.

### Module to Create

**Module: Money Streaming 101** (35 min, 50 XP)

**Lessons:**
1. ¿Qué es Money Streaming? (12 min)
   - Definición: pagos continuos en vez de una suma única
   - Casos de uso: salarios, suscripciones, royalties, rentas
   - Ventajas vs pagos tradicionales
   - Ejemplo: $3000 por mes vs $3000 de una vez

2. Drips Protocol en Stellar (15 min)
   - Cómo funciona Drips en Stellar
   - Crear un stream (sender)
   - Recibir un stream (receiver)
   - Gas fees y costos
   - Uso práctico: ejemplo step-by-step

3. Casos de Uso: DeFiWise + Streaming (8 min)
   - Instructores recibiendo pago por enseñanza (streaming)
   - Estudiantes ganando XP y siendo pagados en tiempo real
   - Futuro: DeFiWise integrado con Drips

**Quiz:** 4 preguntas

### Content Format
- Markdown con ejemplos claros
- Diagrama: money flowing over time
- Link a Drips docs: https://docs.drips.network
- Tabla comparativa: One-time vs Streaming

### Acceptance Criteria
- [x] 1 módulo creado (Money Streaming)
- [x] 3 lecciones (~35 minutos)
- [x] 4 quiz preguntas + respuestas
- [x] 50 XP (mismo que otros módulos)
- [x] Lenguaje accesible, ejemplos locales
- [x] Integrado en `src/data/courses.ts`
- [x] Links a Drips docs están correctos
- [x] No tiene errores

### Reference
- https://www.drips.network
- https://docs.drips.network/docs/
- Stellar Testnet support documentation
```

---

### Issue Template 7: [DRIPS-2] Integración UI: Mostrar Streams en Dashboard

```markdown
## Title
[DRIPS-2] Integración UI: Mostrar Streams del Usuario en Dashboard

## Labels
- priority: medium
- type: frontend
- area: defi-integration
- sprint: drips-wave
- size: medium

## Milestone
v1.1

## Assignees
@frontend-dev

## Estimated Effort
24 hours (1 dev × 3 days)

## Description

### Objective
Mostrar en `/dashboard` los streams activos del usuario (si existen).
Darle visibilidad a su participación en Drips.

### Current Behavior
```
/dashboard/progress
├── XP Balance
├── Modules Completed
└── (No hay nada sobre streams)
```

### Desired Behavior
```
/dashboard/progress
├── XP Balance: 250 XP
├── Modules Completed: 5
└── NEW: Active Streams
   ├── RECEIVING (2)
   │  ├── From Alice: $10/day (USDC)
   │  └── From Bob: €5/day (€)
   └── SENDING (1)
      └── To Charlie: 100 XLM/month
```

### Technical Requirements

**1. Crear hook `useDripsStreams()` en `src/hooks/`:**
```typescript
// useDripsStreams.ts
export function useDripsStreams(userAddress: string) {
  const [streams, setStreams] = useState<{
    receiving: Stream[],
    sending: Stream[]
  }>({
    receiving: [],
    sending: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userAddress) return;

    (async () => {
      try {
        setLoading(true);
        
        // Consultar Drips API/contract para streams del usuario
        const receiving = await dripsClient.getIncomingStreams(userAddress);
        const sending = await dripsClient.getOutgoingStreams(userAddress);
        
        setStreams({ receiving, sending });
      } catch (error) {
        console.error("Error fetching Drips streams:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [userAddress]);

  return { streams, loading };
}
```

**2. Crear componente `StreamsWidget.tsx`:**
```typescript
// src/components/StreamsWidget.tsx
export function StreamsWidget({ userAddress }: Props) {
  const { streams, loading } = useDripsStreams(userAddress);
  
  if (loading) return <LoadingSpinner />;
  
  const totalReceiving = streams.receiving.reduce((sum, s) => sum + s.flowRate, 0);
  const totalSending = streams.sending.reduce((sum, s) => sum + s.flowRate, 0);
  
  return (
    <div className="card bg-white p-6 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-bold mb-4">💧 Drips Streams</h3>
      
      {streams.receiving.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-grey font-semibold">Receiving</p>
          <p className="text-lg font-bold text-green-600">
            +${(totalReceiving * 86400).toFixed(2)}/day
          </p>
          <div className="space-y-2 mt-2">
            {streams.receiving.map((stream) => (
              <StreamItem key={stream.id} stream={stream} type="receiving" />
            ))}
          </div>
        </div>
      )}
      
      {streams.sending.length > 0 && (
        <div>
          <p className="text-sm text-grey font-semibold">Sending</p>
          <p className="text-lg font-bold text-orange-600">
            -${(totalSending * 86400).toFixed(2)}/day
          </p>
          <div className="space-y-2 mt-2">
            {streams.sending.map((stream) => (
              <StreamItem key={stream.id} stream={stream} type="sending" />
            ))}
          </div>
        </div>
      )}
      
      {streams.receiving.length === 0 && streams.sending.length === 0 && (
        <p className="text-grey text-sm">
          No active streams. 
          <a href="https://drips.network" className="link">
            Create one →
          </a>
        </p>
      )}
    </div>
  );
}
```

**3. Integrar en `/dashboard/progress/Progress.tsx`:**
```typescript
import { StreamsWidget } from "@/components/StreamsWidget";

export default function Progress() {
  const { publicKey } = useStellarWallet();
  const { balance } = useStellarProgress();
  
  return (
    <div className="space-y-6">
      <XPWidget balance={balance} />
      <ModulesCompletedWidget />
      <StreamsWidget userAddress={publicKey} />  {/* NEW */}
    </div>
  );
}
```

### Testing Criteria
- [ ] Hook `useDripsStreams()` consulta streams del usuario
- [ ] Muestra streams receiving y sending
- [ ] Calcula flow rates correctamente
- [ ] Empty state si no hay streams
- [ ] Loading state mientras se consulta
- [ ] Link a Drips.network funciona

### Acceptance Criteria
- [x] Widget muestra streams activos
- [x] Calcula dinero/día correcto
- [x] Separated receiving vs sending
- [x] Link a Drips.network visible
- [x] UI es responsive
- [x] Integrado en dashboard
- [x] Tests pasan
- [x] No console errors

### Dependencies
- Drips SDK for Stellar (when available)
- Drips API endpoint (or on-chain query)

### Notes
- Si Drips SDK no está disponible para Stellar, usar HTTP request a Drips API
- Considerar cache: actualizar cada 30 segundos
- Mostrar "connecting..." si aún no hay Freighter wallet conectada
```

---

### Issue Template 8: [DRIPS-3] Crear Landing Page Section: "DeFiWise + Drips"

```markdown
## Title
[DRIPS-3] Landing Page: Sección Educativa "Money Streaming con Drips"

## Labels
- priority: medium
- type: design
- area: marketing
- sprint: drips-wave
- size: small

## Milestone
v1.1

## Assignees
@designer
@marketing

## Estimated Effort
12 hours (1 designer × 1.5 days)

## Description

### Objective
Crear sección en landing page que explique y promocione Money Streaming + educación en DeFiWise.
Aprovechar el momentum de Drips wave.

### Desired Behavior

Agregar a `/app/home/` (o crear nuevo component):

```
┌─────────────────────────────────────────────┐
│  💧 Money Streaming Fundamentals            │
│     Learn DeFi + Earn While You Stream      │
├─────────────────────────────────────────────┤
│                                             │
│  ✓ New Module: Money Streaming 101          │
│  ✓ 35 minutes | 50 XP                       │
│  ✓ Learn Drips Protocol on Stellar          │
│                                             │
│  [Start Learning] [View Drips Docs]         │
│                                             │
│  Why Money Streaming?                       │
│  ├─ 🚀 Instant payments (per second)        │
│  ├─ 💰 Salaries, royalties, subscriptions   │
│  ├─ 🔐 Transparent & trustless              │
│  └─ 💡 The future of DeFi income            │
│                                             │
│  Featured: Join 1000+ learning Drips        │
│                                             │
└─────────────────────────────────────────────┘
```

### Technical Requirements

**1. Crear componente `MoneyStreaming.tsx`:**
```typescript
// src/app/home/MoneyStreaming.tsx
export function MoneyStreaming() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">💧 Money Streaming Fundamentals</h2>
          <p className="text-xl text-grey">
            Learn how Drips Protocol enables continuous payments on Stellar
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Why Money Streaming */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <CheckIcon />
              <div>
                <h3 className="font-bold">Instant Payments</h3>
                <p className="text-grey text-sm">Per-second precision</p>
              </div>
            </div>
            {/* ... more items ... */}
          </div>
          
          {/* Right: CTA */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100">
            <h3 className="text-2xl font-bold mb-2">Money Streaming 101</h3>
            <p className="text-grey mb-4">35 min • 50 XP</p>
            <p className="text-sm mb-6">
              Learn Drips Protocol and how money streaming is revolutionizing DeFi income
            </p>
            <button className="btn btn-primary w-full">Start Learning</button>
            <a href="https://drips.network" className="btn btn-outline w-full mt-2">
              Explore Drips Protocol
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**2. Integrar en `src/app/home/page.tsx` (si es landing):**
```typescript
import { MoneyStreaming } from "./MoneyStreaming";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Advantages />
      <MoneyStreaming />  {/* NEW */}
      <Methodology />
    </>
  );
}
```

### Design Requirements
- Color scheme: Blue/Cyan (dinero, flujo, movimiento)
- Icons: 💧 para streams, 🚀 para velocidad, etc
- Responsive: mobile, tablet, desktop
- Accesible: contrast, readable fonts, semantic HTML

### Acceptance Criteria
- [x] Sección agregada a landing
- [x] Educativa: explica qué es money streaming
- [x] CTAs claros: "Start Learning" y "Explore Drips"
- [x] Responsive design (mobile first)
- [x] Links funcionales
- [x] SEO friendly (keywords: "money streaming", "Drips")
- [x] Integrado en homepage
- [x] No console errors

### Copy (Spanish)
```
Heading: "💧 Money Streaming Fundamentals"
Subheading: "Aprende cómo Drips Protocol habilita pagos continuos en Stellar"

Benefits:
- Pagos Instantáneos: Precisión por segundo
- Múltiples Usos: Salarios, royalties, suscripciones
- Transparencia: Código abierto, sin intermediarios
- Futuro de DeFi: Ingresos continuos y trustless
```

### Related
- Depends on: DRIPS-1 (módulo debe existir)
- Complements: DRIPS-2 (streams widget)
```

---

### Issue Template 9: [DRIPS-4] Marketing Push: Social Media + Announcement

```markdown
## Title
[DRIPS-4] Campaña Marketing: "DeFiWise Meets Drips" — Social + Email

## Labels
- priority: high
- type: marketing
- area: growth
- sprint: drips-wave
- size: small

## Milestone
v1.1

## Assignees
@marketing

## Estimated Effort
8 hours

## Description

### Objective
Lanzar campaña coordinada anunciando integración educativa con Drips Protocol.
Aprovechar Drips wave para conseguir usuarios y traction.

### Deliverables

**1. Twitter/X Thread**
```
Tweet 1:
"💧 Just dropped: Money Streaming 101
Learn how @DripsPL works on Stellar
Learn how to earn while you stream
New module + interactive dashboard widget

[Link to DeFiWise]"

Tweet 2:
"What is Money Streaming?
- Payments per second (not per month)
- Salaries, royalties, subscriptions
- Zero intermediaries
- The future of DeFi income

Learn for free → 50 XP + NFT badge"

Tweet 3:
"Join 1000+ learning #DeFi on Stellar
Complete Money Streaming 101 and:
✓ Earn 50 XP
✓ Mint NFT badge
✓ Understand Drips Protocol
✓ Get ready for opportunities

[Link]"
```

**2. Email Announcement (to existing users)**
```
Subject: 💧 New Module: Money Streaming + Drips Protocol

Hi [User],

We're excited to announce our latest module:
**Money Streaming 101 — Learn Drips on Stellar**

What you'll learn:
- How money streaming works
- Drips Protocol deep dive
- Real-world use cases
- Stellar integration

Earn: 50 XP + NFT Badge
Time: 35 minutes

[Start Learning Button]
```

**3. LinkedIn Post**
```
Caption:
"📚 Excited to launch Money Streaming education on DeFiWise

The future of income is continuous, not discretized.
Drips Protocol on Stellar enables:
- Per-second payments
- Transparent, trustless streams
- Salary payments that flow 24/7
- Royalties for creators

New educational module available now. Earn XP + on-chain credentials.

#DeFi #Education #Stellar #Web3"

[Image: animated GIF of money streaming]
```

### Content Assets Needed
- [ ] Hero image: Money streaming visualization
- [ ] Animated GIF: Money flowing (24 fps, <5MB)
- [ ] Twitter cards: Optimized images for tweets
- [ ] Email template: HTML formatted

### Channels to Post
- [ ] Twitter/X (@DeFiWise account)
- [ ] LinkedIn (DeFiWise Company page)
- [ ] Discord (if community exists)
- [ ] Email list (existing users)
- [ ] Drips community (if applicable)

### Timing
- Post all within same week
- Coordinate with module launch (DRIPS-1)
- Mention Drips Protocol officially (tag @DripsPL)
- Include Stellar hashtags

### Metrics to Track
- Twitter: impressions, likes, RTs, clicks
- Email: open rate, click-through rate
- Web: traffic to `/dashboard/ruta_aprendizaje?course=money-streaming`

### Acceptance Criteria
- [x] Twitter thread posted and scheduled
- [x] Email sent to list
- [x] LinkedIn post published
- [x] Hashtags: #DeFi #Stellar #MoneyStreaming #Drips
- [x] Links are trackable (UTM params)
- [x] Timing coordinated with module launch
```

---

## 🟡 MEDIA - FASE 2 (After v1.0)

### Issue Template 10: [P2-1] Streaks & Achievements System

```markdown
## Title
[P2-1] Gamificación — Streaks & Achievements System

## Labels
- priority: medium
- type: frontend
- area: gamification
- sprint: engagement

## Milestone
v1.2

## Assignees
@frontend-dev

## Estimated Effort
40 hours (1 dev + 1 designer × 1 week)

## Description

### Objective
Gamificación para increase engagement & retention.

### Features to Implement

#### Streak Tracking
- Días consecutivos completando lecciones
- Mostrar en dashboard: "7 Day Streak 🔥"
- Bonificación: +10% XP en día 7, +20% en día 14, etc
- Reset si no completa por 1 día

#### Achievements / Badges
- "First Lesson Completed"
- "Perfect Score: 100% en un quiz"
- "Speedrunner: Completa módulo en <30 min"
- "Collector: Gana 10 badges"
- "Scholar: Completa un curso entero"
- "Influencer: Reach top 10 en leaderboard"

#### Notification System
- Toast cuando gana achievement
- "🎉 Achievement Unlocked: Perfect Score!"
- Show en dashboard

### Acceptance Criteria
- [x] Streak counter en localStorage + contrato (future)
- [x] Achievements renderizadas
- [x] Notificaciones toast funcionan
- [x] XP bonificaciones aplicadas
- [x] Tests pasan

### Related Issues
- Related: P2-2 (Leaderboard)
- Related: P2-3 (Retry quizzes)
```

---

## 📋 Cómo Usar Estos Templates

1. **Copiar el template** que corresponda
2. **En GitHub:**
   - Click en "New Issue"
   - Pega el contenido
   - Llena los detalles: Assignee, Labels, Milestone
3. **Crear issues en orden:**
   - P0-1 → P0-2 → P0-3 (Crítica, 1-2 semanas)
   - P1-1 → P1-2 (Alta, 3-4 semanas)
   - P2-* (Media, future)

## 📊 Resumen de Issues

| Issue | Prioridad | Effort | Sprint | Owner |
|-------|-----------|--------|--------|-------|
| P0-1 | 🔴 Crítica | 40h | MVP | Backend |
| P0-2 | 🔴 Crítica | 24h | MVP | Frontend |
| P0-3 | 🔴 Crítica | 20h | MVP | Backend |
| P1-1 | 🟠 Alta | 80h | Content | Content |
| P1-2 | 🟠 Alta | 80h | Content | Content |
| **DRIPS-1** | **🟠 Alta** | **16h** | **Drips Wave** | **Content** |
| **DRIPS-2** | **🟡 Media** | **24h** | **Drips Wave** | **Frontend** |
| **DRIPS-3** | **🟡 Media** | **12h** | **Drips Wave** | **Design** |
| **DRIPS-4** | **🟠 Alta** | **8h** | **Drips Wave** | **Marketing** |
| P2-1 | 🟡 Media | 40h | v1.2 | Frontend |
| P2-2 | 🟡 Media | 30h | v1.2 | Frontend |
| P2-3 | 🟡 Media | 16h | v1.2 | Frontend |

**Total para MVP:** ~164 horas  
**Total Drips Wave (urgente):** ~60 horas  
**Total para v1.2:** ~300+ horas

### 💧 Drips Wave Priority

```
RECOMENDACIÓN: Hacer primero P0-1,2,3 (Integración On-Chain)
Luego DRIPS-1,2,3,4 en paralelo (Educación + Marketing)
```

**Por qué ahora?**
- Drips Protocol es trending
- Oportunidad de early adoption educativo
- Baja competencia: pocos educadores cubren Money Streaming
- Alto valor: Money Streaming es 🔥 en DeFi 2024-2025

---

**Última actualización:** Mayo 2026
**Versión:** 1.0
