# `@quatrain/mdm` — Agnostic Master Data Management (MDM) Core Package

The `@quatrain/mdm` package provides an abstract, domain-agnostic Master Data Management (MDM) architecture for physical IoT hardware assets, virtual products (*digital access keychains, tokens, credentials, licenses*), managed services (*airtime passes, connectivity subscriptions, maintenance contracts*), and composite bundles.

---

## 🏛️ Architecture & Sibling Conventions

Following the standard **Quatrain Core** sibling package conventions:
- **Pivot Class `Mdm extends Core`**: Central registry manager providing provider adapter registration (`Mdm.addAdapter()`, `Mdm.getAdapter()`), archetype definition registration (`Mdm.registerObjectType()`, `Mdm.getObjectType()`), and custom model registration (`Mdm.registerModel()`, `Mdm.getModel()`).
- **Abstract Adapter `AbstractMdmAdapter`**: Pluggable provider interface allowing custom MDM backends (`MockMdmAdapter`, DB adapters).
- **`MdmObject extends PersistedBaseObject`**: Core domain model inheriting from `@quatrain/backend`, guaranteeing out-of-the-box compatibility with any Quatrain database adapter (`@quatrain/backend-sqlite`, `@quatrain/backend-postgres`, `@quatrain/backend-firestore`, `@quatrain/backend-supabase`).
- **Subcollections**: Supports attaching $N$ subitems or attributes linked to a parent element via dynamic collection paths (`mdm.objects.<parent_uid>.<subcollection>`).

---

## 📦 Usage

See [`HOWTO.md`](HOWTO.md) for practical examples and registration scenarios.
