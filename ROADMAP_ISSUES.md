# 🚀 Roadmap Estratégico - DeFiWise

## Visión General
**De:** Plataforma educativa de Blockchain 101  
**Para:** Plataforma educativa de Finanzas & DeFi (desde conceptos básicos hasta protocolos avanzados)

**Meta:** Convertir DeFiWise en el portal "from zero to DeFi hero" - enseñar finanzas reales AND blockchain aplicado.

---

## 🎯 Fases de Crecimiento

### FASE 0: MVP Funcional (Crítica - Debe hacerse primero)
*Completar lo que está a medio camino*

#### **P0-1: Integración Real de Rewards On-Chain**
**Issue Type:** Feature  
**Descripción:** Actualmente los quizzes se guardan en localStorage. El usuario completa un quiz, pero:
- ❌ No se llama al smart contract
- ❌ No se mintea XP token
- ❌ No se mintea Badge NFT
- ❌ No hay transacción en Stellar

**Qué hacer:**
1. Crear endpoint/función que valide quiz completado (75% threshold)
2. Llamar al XP Token contract para mintear XP al usuario
3. Llamar al Badge NFT contract para mintear badge del módulo
4. Mostrar transacción de Freighter al usuario
5. Guardar tx hash en localStorage/estado local
6. Mostrar confirmación en Stellar Explorer

**Aceptación:**
- [ ] Usuario completa quiz → Se ejecuta tx real en Stellar Testnet
- [ ] XP aparece en wallet del usuario
- [ ] Badge NFT aparece verificable on-chain
- [ ] UI muestra estado: pending → confirmed

---

#### **P0-2: Verificación Real de Badges & Certificados**
**Issue Type:** Feature  
**Descripción:** La página `/dashboard/logros` existe pero está vacía. Los badges/certs no se conectan con el contrato.

**Qué hacer:**
1. Consultar Badge NFT contract por direccion del usuario
2. Traer metadata on-chain (module_id, xp_earned, quiz_score, timestamp)
3. Renderizar NFTs reales con metadata
4. Crear modal para ver detalles completos de cada NFT
5. Link a Stellar Expert para verificar on-chain

**Aceptación:**
- [ ] Usuario ve sus NFTs reales completados
- [ ] Cada NFT muestra: módulo, XP ganado, puntaje, fecha
- [ ] Click en NFT abre link a Stellar Expert

---

#### **P0-3: XP Balance & Historical Tracking**
**Issue Type:** Feature  
**Descripción:** Mostrar XP balance real del usuario desde el contrato, no desde localStorage.

**Qué hacer:**
1. Hook `useStellarProgress` debe consultar XP Token contract en lugar de localStorage
2. Mostrar: balance actual, historical max, progresión en dashboard
3. Usar para "progressive gating" (módulos que requieren mínimo XP)
4. Mostrar en header/navbar el balance actual

**Aceptación:**
- [ ] XP balance viene del contrato, no de localStorage
- [ ] Se actualiza después de completar quiz
- [ ] Se usa para bloquear módulos que requieren XP mínimo

---

### FASE 1: Expandir Contenido a Finanzas (Alta Prioridad)
*Pasar de "Blockchain 101" a educación financiera real*

#### **P1-1: Módulo - Fundamentos de Finanzas**
**Issue Type:** Content  
**Descripción:** Crear base sólida en conceptos financieros que usuarios necesitan para entender DeFi.

**Módulos a crear:**
1. **Dinero & Economía 101** (45 min)
   - ¿Qué es dinero? (función de valor, intercambio, reserva)
   - Inflación, deflación, tasas de interés
   - Economía tradicional vs digital
   - Quiz: 5 preguntas

2. **Riesgo & Rendimiento** (40 min)
   - Relación riesgo-rendimiento
   - Volatilidad, diversificación
   - Risk management en inversión
   - Quiz: 5 preguntas

3. **Mercados Financieros 101** (50 min)
   - Activos: acciones, bonos, commodities
   - Mercados primarios vs secundarios
   - Órdenes, spreads, liquidez
   - Quiz: 5 preguntas

**XP:** 50 XP por módulo = 150 XP total para este curso  
**Certificate:** "Finanzas 101"

---

#### **P1-2: Módulo - Introducción a DeFi Protocols**
**Issue Type:** Content  
**Descripción:** Enseñar protocolos DeFi específicos que existen en Stellar.

**Módulos a crear:**
1. **AMMs & Swaps** (45 min)
   - ¿Qué es un AMM (Automated Market Maker)?
   - Liquidity pools, slippage, impermanent loss
   - Ejemplos: Soroswap (si existe), otros DEX en Stellar
   - Ejercicio: ver pool USDC/native de Stellar
   - Quiz: 4 preguntas

2. **Lending & Borrowing** (50 min)
   - Cómo funcionan los lending protocols
   - Collateral, liquidation, interest rates
   - Aave/Compound style protocols en Stellar
   - Riesgo de liquidación
   - Quiz: 5 preguntas

3. **Staking & Yield** (40 min)
   - Yield farming basics
   - Staking rewards, APY calculations
   - Impermanent loss en LPs
   - Risk in yield strategies
   - Quiz: 4 preguntas

**XP:** 50 XP por módulo = 150 XP total  
**Certificate:** "DeFi Protocols 101"

---

#### **P1-3: Integrar Recursos Externos**
**Issue Type:** Feature  
**Descripción:** Linkar a recursos reales de finanzas.

**Qué hacer:**
1. Agregar sección de recursos por módulo
   - Artículos de CoinDesk, The Block
   - Documentación de Stellar Docs
   - Videos educativos (YouTube)
   - Libros recomendados
2. Crear "Glosario" centralizado de términos DeFi
3. Agregar "Ejercicios prácticos" con links a herramientas reales

---

### FASE 2: Gamificación & Engagement (Media Prioridad)
*Mantener usuarios motivados*

#### **P2-1: Sistema de Streaks & Achievements**
**Issue Type:** Feature  
**Descripción:** Gamificación avanzada.

**Qué hacer:**
1. Tracking de "días consecutivos"
2. Badges especiales por streaks (7 días, 30 días, etc)
3. Logros: "First Quiz", "Speedrun Module", "Perfect Score", etc
4. Mostrar en dashboard

---

#### **P2-2: Leaderboard Social**
**Issue Type:** Feature  
**Descripción:** Competencia sana entre usuarios.

**Qué hacer:**
1. Crear tabla de "Top Learners" por XP
2. Mostrar módulos completados
3. Perfil público con resumen de logros
4. (Opcional) Sistema de "followed" leaderboards

---

#### **P2-3: Reintento de Quizzes**
**Issue Type:** Feature  
**Descripción:** Los usuarios deberían poder reintentar quizzes.

**Qué hacer:**
1. Permitir reintentar quiz después de pasar
2. Registrar mejor puntaje
3. (Opcional) Limitación: reintentar solo 3 veces

---

### FASE 3: Transacciones Prácticas (Futura)
*Que los usuarios hagan transacciones reales durante el aprendizaje*

#### **P3-1: Ejercicios Prácticos con Transacciones**
**Issue Type:** Feature/Content  
**Descripción:** Después de una lección de "Swaps", el usuario hace su primer swap real.

**Qué hacer:**
1. Crear "Exercise" type de lección interactiva
2. Dar al usuario testnet assets (USDC, native)
3. Guiarlos a hacer tx real en Stellar
4. Capturar tx hash y validar
5. Dar NFT "Completed Exercise"

**Ejemplo:**
```
Módulo: "Haz tu primer Swap"
- Lee lección sobre AMMs
- Recibe 100 test USDC
- Haz swap USDC → XLM
- Captura tx hash
- ✓ Completa con NFT
```

---

#### **P3-2: Sandbox DeFi**
**Issue Type:** Feature  
**Descripción:** Ambiente safe para experimentar.

**Qué hacer:**
1. Dar a cada usuario wallet testnet con fondos
2. Permitir practicar swaps, lending, farming
3. Registrar historial
4. Evaluación: "¿Optimizaste tu yield?"

---

### FASE 4: Certificaciones & Credenciales (Futura)
*Que los usuarios puedan demostrar lo aprendido*

#### **P4-1: NFT Certificates On-Chain**
**Issue Type:** Feature  
**Descripción:** Certificados verificables por terceros.

**Qué hacer:**
1. Contract para emitir "Certification NFT" (diferente a badges de módulos)
2. Metadata: usuario, cursos completados, fecha, score
3. URL verificable / QR code
4. Empresas pueden verificar en Stellar Explorer

---

#### **P4-2: Diplomas Visuales**
**Issue Type:** Design/Feature  
**Descripción:** Diplomas hermosos, downloadables como PNG/PDF.

**Qué hacer:**
1. Crear templates hermosos (Figma)
2. Generar dinámicamente con datos del usuario
3. Permitir descargar
4. Compartir en LinkedIn

---

## 📊 Priorización: MVP vs Visión

### 🔴 CRÍTICA (Hacer ya)
```
P0-1: Integración On-Chain de Rewards
P0-2: Verificación Real de NFTs
P0-3: XP Balance On-Chain
```
**Razón:** Sin esto, el proyecto no funciona como DeFi educativo.  
**Esfuerzo:** 2-3 semanas  
**Personas:** 1-2 developers

### 🟠 ALTA (Siguiente sprint)
```
P1-1: Módulo Fundamentos de Finanzas
P1-2: Módulo DeFi Protocols en Stellar
P1-3: Recursos Externos
```
**Razón:** Expandir el currículum de blockchain a finanzas reales.  
**Esfuerzo:** 3-4 semanas (depende research)  
**Personas:** 1-2 content creators + 1 dev

### 🟡 MEDIA (Future)
```
P2-1: Streaks & Achievements
P2-2: Leaderboard Social
P2-3: Reintento Quizzes
```
**Razón:** Engagement & retention.  
**Esfuerzo:** 1-2 semanas  
**Personas:** 1 dev + 1 designer

### 🟢 BAJA (Roadmap largo plazo)
```
P3-1: Ejercicios Prácticos
P3-2: Sandbox DeFi
P4-1: NFT Certificates
P4-2: Diplomas Visuales
```

---

## 🎓 Cómo Pensar la Estructura de Contenido

### Propuesta: 4 Cursos en Total

**Curso 1: Blockchain 101** (ya casi existe)
- Módulo 1: ¿Qué es DeFi?
- Módulo 2: Smart Contracts
- Módulo 3: Wallets & Seguridad
- Módulo 4: Stellar & Soroban
- **Total:** 200 XP, ~3 horas

**Curso 2: Finanzas 101** (NUEVO - P1-1)
- Módulo 1: Dinero & Economía
- Módulo 2: Riesgo & Rendimiento
- Módulo 3: Mercados Financieros
- **Total:** 150 XP, ~2.5 horas

**Curso 3: DeFi Protocols** (NUEVO - P1-2)
- Módulo 1: AMMs & Swaps
- Módulo 2: Lending & Borrowing
- Módulo 3: Staking & Yield
- **Total:** 150 XP, ~2.5 horas

**Curso 4: Trading & Inversión** (FUTURO)
- Módulo 1: Análisis Técnico
- Módulo 2: Fundamental Analysis
- Módulo 3: Portfolio Management
- **Total:** 200 XP, ~3 horas

### Path para Usuarios
```
Blockchain 101 → Finanzas 101 → DeFi Protocols → Trading & Inversión
     (MVP)          (P1-1)         (P1-2)           (Future)
```

---

## 💡 Diferenciadores vs Competencia

| Aspecto | Competitors | DeFiWise (Target) |
|---------|-------------|-------------------|
| **Contenido** | Blockchain only | Finanzas + Blockchain |
| **Verificación** | Certificados PDF | On-chain NFT badges |
| **Interactividad** | Quizzes static | Quizzes + transacciones reales |
| **Red** | Individual | Leaderboard, social |
| **Tokens** | Generic XP | XP + NFTs + futuros rewards |
| **Gamification** | Basic | Streaks, achievements, challenges |

---

## 📈 Métricas de Éxito

- **Month 1:** Integración On-Chain (P0-1, P0-2, P0-3) ✓
- **Month 2:** +3 cursos nuevos (P1-1, P1-2) = 200 min contenido → 600 min
- **Month 3:** Gamificación (P2-1, P2-2) → +50% user retention
- **Month 6:** Ejercicios prácticos (P3-1) → +30% course completion
- **Month 12:** 4+ cursos, 1000+ usuarios, credenciales verificables

---

## 🚢 Template para Crear Issues en GitHub

```markdown
## [P0-1] Integración Real de Rewards On-Chain

**Description:**
El usuario completa un quiz pero NO se ejecuta la transacción en Stellar. 
Necesitamos conectar el quiz con el contrato de XP Token + Badge NFT.

**Current State:**
- Quiz se guarda en localStorage
- No hay llamada a contratos
- XP/Badges no se mintean

**Desired State:**
- Quiz completo → Validación (75% threshold)
- Llamar XP Token contract → mintear XP
- Llamar Badge NFT contract → mintear NFT
- Mostrar Freighter popup para firmar tx
- Guardar tx hash
- Mostrar confirmación

**Technical Steps:**
1. Crear función `submitQuizOnChain()` en `src/lib/stellar.ts`
2. Validar puntaje >= 75%
3. Llamar `xp-token.mint(user, xp_amount)` 
4. Llamar `badge-nft.mint(user, module_id, metadata)`
5. Conectar en `QuizView.tsx` component

**Acceptance Criteria:**
- [ ] User completes quiz → TX submitted to Stellar
- [ ] XP appears in user wallet
- [ ] Badge NFT is on-chain
- [ ] UI shows: pending → confirmed
- [ ] Tests pass for contract calls
- [ ] No errors in browser console

**Resources:**
- XP Token: CATAE4HXRWEIVGI2ZW5NGRXIQDNFWZ4YLAKXUU3Q3FKBDT2MPGJECTL4
- Badge NFT: CDWJE7AM3DFWC6FD2RKBASWP7EITQ2ULJH4FX5JFQRVHXQSXDPJAB3KI
- Stellar Testnet

**Assignee:** Backend Dev
**Effort:** 40 hours (5 days)
**Sprint:** Sprint 1
```

---

## ❓ Preguntas Clave para Responder

1. **¿Quién es tu target user?**
   - Estudiantes? Developers? Traders? Everyone?
   - Nivel de experiencia: principiante, intermedio, avanzado?

2. **¿Cuál es tu estrategia de monetización?**
   - Free access + premium content?
   - Sponsored by Stellar?
   - Freemium model?

3. **¿Quién genera contenido?**
   - Solo vosotros? Community? Freelancers?
   - Presupuesto para contratar content creators?

4. **¿Cuál es el MVP mínimo para lanzar públicamente?**
   - ¿P0 (integración on-chain) + P1-1 (finanzas)?
   - ¿O solo P0 + curso Blockchain?

5. **¿Tiempo para MVP público?**
   - 1 mes? 3 meses? 6 meses?
   - ¿Cuántos devs/content creators puedes asignar?

---

## 🎬 Próximos Pasos

1. **Discute estas prioridades** con tu equipo
2. **Crea issues en GitHub** usando los templates de arriba
3. **Estima esfuerzo** para P0-1, P0-2, P0-3
4. **Asigna recursos** a prioritarios
5. **Define OKRs** mensuales (ej: "Completar P0-1 este mes")
6. **Comunica roadmap** al equipo

---

**Versión:** 1.0  
**Última actualización:** Mayo 2026  
**Autor:** Análisis estratégico de DeFiWise  
