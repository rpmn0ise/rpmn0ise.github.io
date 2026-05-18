---
title: "Lister les ports ouverts sous Linux"
description: "Commandes ss et nmap pour auditer les ports en écoute sur une machine Linux."
date: 2026-05-18
tags:
  - linux
  - cli
  - réseau
  - tips
draft: false
---

## Avec `ss` (local, rapide)

```bash
ss -tulpn
```

| Flag | Rôle |
|------|------|
| `-t` | TCP |
| `-u` | UDP |
| `-l` | ports en écoute uniquement |
| `-p` | affiche le process associé |
| `-n` | pas de résolution DNS/service |

Filtrer sur un port spécifique :

```bash
ss -tulpn | grep :8080
```

Voir les connexions établies (pas seulement en écoute) :

```bash
ss -tupn
```

---

## Avec `nmap` (local ou réseau)

Scanner sa propre machine :

```bash
sudo nmap -sS -sU -p- localhost
```

Scanner un hôte distant (TCP seulement, ports courants) :

```bash
nmap -sV 192.168.1.1
```

| Flag | Rôle |
|------|------|
| `-sS` | SYN scan (furtif, nécessite root) |
| `-sU` | scan UDP |
| `-sV` | détection de version des services |
| `-p-` | tous les ports (1–65535) |
| `-T4` | timing agressif (plus rapide) |
| `--open` | affiche uniquement les ports ouverts |

Scan rapide sur le réseau local :

```bash
sudo nmap -sn 192.168.1.0/24
```

---

`ss` suffit pour auditer sa propre machine. `nmap` devient utile dès qu'on veut scanner un hôte distant ou détecter les versions de services.
