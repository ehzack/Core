# `@quatrain/mdm` — Agnostic Master Data Management (MDM) Core Package

The `@quatrain/mdm` package provides an abstract, domain-agnostic taxonomy and multi-axis hardware capabilities framework for physical IoT hardware assets, components, and domain realities (*agricultural plots, aquaculture ponds, livestock barns, storage silos*).

---

## 🏛️ Core Features

1. **PersistedBaseObject Integration**: Extends `@quatrain/backend` base persistence objects (`mdm.product_templates`, `mdm.product_variants`, `mdm.boms`, `mdm.physical_units`, `mdm.realities`), making `@quatrain/mdm` compatible out-of-the-box with any Quatrain backend (`@quatrain/backend-sqlite`, `@quatrain/backend-postgres`, `@quatrain/backend-firestore`, `@quatrain/backend-supabase`).
2. **Multi-Axis Hardware Capabilities Matrix**:
   - Communication Radio Axis (`lorawan_terrestrial`, `lorawan_satellite`, `cellular_gsm`, `hybrid_fallback`).
   - Electrical Power Axis (`solar_mppt`, `primary_lithium`, `rechargeable_liion`, `external_mains`).
   - Sensor & Bus Connectivity Axis (`SDI-12`, `RS485_Modbus`, `I2C`, `1-Wire`, `SPI`, pulse counters, analog channels).
3. **State Machine Compatibility**: Built-in compatibility with `@quatrain/state-machine` for managing hardware device and physical reality lifecycle transitions (*Planned, Available, Associated, Maintenance, Ko, Scrapped*).

---

## 📦 Usage

See [`HOWTO.md`](HOWTO.md) for practical examples and common scenarios.
