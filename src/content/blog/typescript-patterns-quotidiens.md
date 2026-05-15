---
title: "5 patterns TypeScript que j'utilise tous les jours"
description: "Des patterns TypeScript concrets et immédiatement applicables : discriminated unions, satisfies, template literals types, infer et le pattern Builder."
date: 2024-01-20
tags:
  - post
  - typescript
  - javascript
  - web
featured: true
---

TypeScript devient vraiment puissant quand on dépasse les types basiques. Voici cinq patterns que j'ai intégrés dans ma pratique quotidienne.

## 1. Discriminated Unions

Modéliser des états exclusifs de manière sûre :

```typescript
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

function render<T>(state: RequestState<T>) {
  switch (state.status) {
    case "idle":    return <Idle />;
    case "loading": return <Spinner />;
    case "success": return <Data data={state.data} />; // data est typé T ici
    case "error":   return <Error msg={state.error.message} />;
  }
}
```

Le compilateur garantit l'exhaustivité. Si vous ajoutez un état, TypeScript vous force à le gérer.

## 2. Le mot-clé `satisfies`

Validez un type sans perdre l'inférence :

```typescript
type Config = {
  port: number;
  host: string;
  debug?: boolean;
};

// Sans satisfies : le type est Config, on perd les détails
const config: Config = { port: 3000, host: "localhost" };

// Avec satisfies : TypeScript valide ET infère le type précis
const config = {
  port: 3000,
  host: "localhost",
} satisfies Config;

// config.port est number, pas Config["port"]
// config.debug est undefined, TypeScript le sait
```

Très utile pour les objets de configuration.

## 3. Template Literal Types

Construire des types à partir de chaînes :

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type ApiRoute = "/users" | "/posts" | "/comments";

type Endpoint = `${HttpMethod} ${ApiRoute}`;
// "GET /users" | "GET /posts" | "POST /users" | ...

// Pratique pour les event emitters typés
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<"click">;  // "onClick"
```

## 4. Le mot-clé `infer`

Extraire des types depuis d'autres types :

```typescript
// Extraire le type de retour d'une Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type Result = UnwrapPromise<Promise<string>>; // string
type Same   = UnwrapPromise<number>;          // number

// Extraire les paramètres d'une fonction
type FirstParam<T> = T extends (first: infer F, ...rest: any[]) => any
  ? F
  : never;

type P = FirstParam<(id: number, name: string) => void>; // number
```

## 5. Le pattern Builder typé

Construire des objets complexes avec une API fluide et type-safe :

```typescript
class QueryBuilder<T extends Record<string, unknown>> {
  private query: Partial<T> = {};

  set<K extends keyof T>(key: K, value: T[K]): this {
    this.query[key] = value;
    return this;
  }

  build(): Partial<T> {
    return this.query;
  }
}

type User = { id: number; name: string; email: string };

const user = new QueryBuilder<User>()
  .set("id", 1)
  .set("name", "Alice")
  // .set("invalid", "x") // ❌ Erreur TypeScript
  .build();
```

## Conclusion

Ces patterns ne sont pas des curiosités académiques — ils résolvent des problèmes concrets : modéliser des états, valider des configs, typer des événements, extraire des types et construire des APIs fluides. Intégrez-les progressivement, votre code de demain vous remerciera.
