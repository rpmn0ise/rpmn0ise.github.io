---
title: "Darkweb : ce qu'il y a vraiment sous la surface"
description: "Web profond, darkweb, réseau Tor : démêler le vrai du sensationnalisme, entre usages légitimes, marchés noirs et mythes tenaces."
date: 2026-07-25
domain: systemes
tags:
  - cybersécurité
  - vie privée
  - réseaux
---

# Darkweb : ce qu'il y a vraiment sous la surface

Tapez « dark web » dans un moteur de recherche et l'algorithme vous sert immanquablement la même imagerie : capuche noire, lignes de code vertes qui défilent, avertissement dramatique sur « les dangers cachés d'Internet ». Cette imagerie a la vie dure. Elle vient en grande partie d'une confusion persistante entre deux notions très différentes : le web profond (*deep web*) et le darkweb.

Cette confusion n'est pas un détail. Elle fausse toute la discussion. Le web profond, vous l'utilisez déjà, plusieurs fois par jour, sans y penser : votre boîte mail, votre espace bancaire en ligne, un document partagé sur un cloud privé, l'intranet de votre entreprise. Tout cela est « profond » au sens où aucun moteur de recherche classique ne l'indexe — pas parce que c'est louche, mais parce que c'est privé ou protégé par une authentification. Le web profond représente, et de très loin, la plus grande partie du contenu réellement accessible sur Internet — bien au-delà de ce que Google ou Bing parviennent à indexer.

Le darkweb, lui, est une sous-catégorie beaucoup plus restreinte du web profond. Il désigne les sites et services qui exigent un logiciel ou une configuration réseau particulière pour être atteints — le plus souvent le réseau Tor. Il n'est ni immense, ni magique, ni intrinsèquement criminel. C'est une infrastructure technique, utilisée aussi bien par des journalistes en zone à risque que par des vendeurs de biens illégaux, en passant par des millions d'internautes qui veulent simplement naviguer sans laisser de trace.

Cet article prend le temps de poser les bases techniques, de retracer l'histoire du sujet, et de séparer les usages réels — légitimes et illégaux — des mythes qui circulent depuis quinze ans. Sans mode d'emploi pour accéder à quoi que ce soit d'illégal, et sans grandiloquence inutile.

## Définitions et distinctions techniques

### Surface web, deep web, darkweb : trois couches, pas une hiérarchie du mal

Le terme « web profond » désigne tout contenu numérique qui existe sur Internet sans être indexé par les moteurs de recherche classiques. Ce n'est pas un jugement de valeur, juste une question d'accessibilité. Trois catégories principales :

- **Le web de surface** (*surface web*) : tout ce que Google, Bing ou DuckDuckGo indexent et que vous atteignez par une recherche classique. Articles de presse, sites d'entreprise, réseaux sociaux publics, forums ouverts.
- **Le web profond** (*deep web*) : tout ce qui n'est pas indexé, généralement parce que l'accès est protégé par un identifiant, un paywall, ou parce que le contenu est généré dynamiquement à la demande. Boîtes mail, comptes bancaires, dossiers médicaux en ligne, bases de données d'entreprise, contenus derrière un abonnement. C'est, de loin, la plus grande partie d'Internet.
- **Le darkweb** : une portion du web profond volontairement rendue inaccessible aux navigateurs standards. Il faut un logiciel spécifique — le plus souvent le Tor Browser — pour s'y connecter. C'est cette couche, et uniquement celle-ci, qui mérite le nom de « darkweb ».

Une image utile : si le web de surface est la partie visible d'un port maritime, le web profond correspond à l'ensemble des entrepôts privés, bureaux et zones réglementées du même port — inaccessibles au public, mais pas illégaux pour autant. Le darkweb, dans cette image, est un réseau de tunnels séparés, avec sa propre signalisation et ses propres règles d'accès.

### Comment fonctionne Tor : le routage en oignon

Tor — « The Onion Router » — est de loin le réseau le plus utilisé pour accéder au darkweb. Son principe repose sur le **routage en oignon**, une technique de chiffrement en couches.

Quand on navigue avec le Tor Browser, la connexion ne va pas directement du point A (l'ordinateur de l'utilisateur) au point B (le site visité). Elle passe par trois relais tirés au hasard parmi les milliers de serveurs bénévoles qui composent le réseau :

- Un **nœud d'entrée** (ou *guard*), qui connaît l'adresse IP réelle de l'utilisateur, mais pas sa destination finale.
- Un **nœud intermédiaire**, qui ne connaît ni l'un ni l'autre — seulement le relais précédent et le relais suivant.
- Un **nœud de sortie**, qui connaît la destination finale, mais pas l'identité de l'utilisateur.

Avant de partir, la requête est chiffrée plusieurs fois, une couche par relais traversé — d'où le nom « oignon ». Chaque relais retire une couche de chiffrement pour découvrir seulement l'adresse du relais suivant, jamais l'itinéraire complet. Aucun des trois nœuds ne dispose, à lui seul, de l'information « qui parle à qui ». Cette architecture, plus que n'importe quel algorithme de chiffrement isolé, fait la force de Tor : la sécurité vient de la distribution de la connaissance, pas d'un secret unique détenu par un seul acteur.

Les sites accessibles uniquement depuis ce réseau utilisent des adresses en **.onion** plutôt qu'en .com ou .fr. Une adresse .onion n'est pas enregistrée auprès d'un registraire comme un nom de domaine classique : elle est **auto-certifiante**, générée directement à partir de la clé cryptographique publique du service. Aucune autorité centrale ne délivre ces adresses, et il est structurellement impossible d'usurper l'adresse .onion de quelqu'un d'autre sans posséder sa clé privée. En contrepartie, ces adresses ressemblent à une suite de caractères aléatoires, illisible et impossible à retenir — l'un des freins pratiques à l'usage courant du darkweb.

Un site hébergé de cette façon (un « service onion », ou service caché) est protégé dans les deux sens : ni le nœud d'entrée ni personne d'autre ne connaît l'adresse IP réelle du serveur qui l'héberge. La technologie protège donc à la fois qui consulte et qui publie.

### Les autres réseaux : I2P et Freenet/Hyphanet

Tor domine largement, mais ce n'est pas la seule infrastructure de ce type.

- **I2P** (Invisible Internet Project) fonctionne sur un principe voisin, le « garlic routing » (routage en ail), qui regroupe plusieurs messages dans un même paquet chiffré. Contrairement à Tor, I2P est pensé avant tout pour des services internes au réseau (messagerie, partage de fichiers, sites en .i2p) plutôt que pour naviguer vers le web ordinaire.
- **Freenet**, dont le projet historique a été rebaptisé **Hyphanet** en 2023 lors d'une scission (le nom « Freenet » ayant été repris par un projet distinct, réécrit avec d'autres objectifs), fonctionne différemment : plutôt qu'un réseau de navigation, c'est un espace de stockage distribué et chiffré. Le contenu est fragmenté et réparti entre les machines des utilisateurs, ce qui le rend particulièrement résistant à la censure et à la suppression — mais aussi plus lent et moins adapté à la navigation classique.

Ces deux réseaux restent marginaux comparés à Tor en nombre d'utilisateurs, mais ils rappellent que « réseau anonymisant » ne se résume pas à un seul outil.

## Histoire et origines

### Un projet né dans un laboratoire militaire

Contrairement à l'image d'un outil né dans la marge, Tor est un enfant de l'establishment scientifique américain. Le concept de routage en oignon a été développé au milieu des années 1990 au sein du Naval Research Laboratory, un centre de recherche de la marine américaine, par les chercheurs Paul Syverson, David Goldschlag et Michael Reed. Leur problème de départ : comment un agent de renseignement peut-il communiquer depuis un pays hostile sans que son trafic réseau ne le trahisse ? Le développement s'est poursuivi avec le soutien de la DARPA, l'agence de recherche militaire avancée américaine.

Le paradoxe fondateur de Tor tient en une phrase : un réseau utilisé uniquement par des agents gouvernementaux serait, par définition, inutile pour les protéger — repérer quelqu'un dessus reviendrait à repérer un espion. La solution retenue a été d'ouvrir le réseau au grand public, pour noyer le trafic sensible dans une masse de trafic civil ordinaire. Le code a été publié en licence libre au début des années 2000, et en 2006, une partie de l'équipe fondatrice — dont Roger Dingledine et Nick Mathewson — a créé The Tor Project, une association à but non lucratif chargée depuis de maintenir et développer le logiciel. Aujourd'hui encore, le financement de l'organisation provient en partie de fonds publics américains, aux côtés de fondations privées et de dons individuels — une situation parfois pointée du doigt par ses détracteurs, mais assumée par le projet, dont le code reste ouvert et audité publiquement par des tiers.

### De l'outil de niche à l'usage grand public

Pendant ses premières années, Tor reste un outil de spécialistes : chercheurs en sécurité, militants de la première heure pour la vie privée en ligne. Le tournant vient avec la multiplication des services cachés dans les années 2010 : forums, messageries, et surtout marchés en ligne, qui donnent au grand public une raison très concrète de télécharger le Tor Browser.

### Silk Road, l'affaire qui a façonné l'image du darkweb

Aucune histoire du darkweb ne peut ignorer Silk Road. Lancé début 2011 par Ross Ulbricht, alias « Dread Pirate Roberts », ce marché en ligne accessible uniquement via Tor permettait d'acheter et de vendre des biens et services illégaux — essentiellement des stupéfiants — en réglant en bitcoin. Le site a fonctionné près de trois ans avant d'être fermé par le FBI en octobre 2013, à l'issue d'une enquête combinant analyse de la blockchain, infiltration et erreurs opérationnelles commises par Ulbricht lui-même. Il a été condamné en 2015 à la prison à vie sans possibilité de libération conditionnelle — une peine longtemps jugée disproportionnée par une partie de l'opinion, y compris en dehors des cercles libertariens, avant qu'il ne bénéficie d'une grâce présidentielle américaine en janvier 2025.

Silk Road a ouvert la voie à une succession de marchés similaires — Silk Road 2, AlphaBay, Hansa Market, entre autres — chacun démantelé à son tour par des opérations de police internationales coordonnées, parfois après une infiltration discrète de la plateforme avant l'annonce publique de sa fermeture. Ce jeu du chat et de la souris entre marchés noirs et forces de l'ordre continue aujourd'hui, avec un constat constant : la fermeture d'un marché ne fait jamais disparaître la demande, elle la redistribue simplement vers d'autres plateformes.

C'est cette succession d'affaires très médiatisées qui a façonné, dans l'imaginaire collectif, l'équation « darkweb = criminalité ». Une équation qui, on le verra plus loin, ne correspond pas à la réalité de l'usage du réseau.

## Usages légitimes

### Protéger les sources : journalisme et lanceurs d'alerte

Le cas d'usage le plus documenté et le plus consensuel du darkweb, c'est la protection des sources journalistiques. L'outil de référence ici s'appelle **SecureDrop** : un système de dépôt sécurisé et anonyme, conçu à l'origine par le programmeur et activiste Aaron Swartz avec le journaliste d'investigation Kevin Poulsen, sous le nom de « DeadDrop ». Après la mort de Swartz en 2013, le projet a été repris et développé par la Freedom of the Press Foundation. Concrètement, SecureDrop permet à une source de transmettre des documents à une rédaction en passant exclusivement par le réseau Tor, sans jamais révéler son identité ni son adresse IP — pas même au journaliste qui réceptionne les fichiers. Plusieurs grandes rédactions à travers le monde, dont le New Yorker (premier titre à l'avoir déployé, sous le nom « Strongbox ») et The Guardian, l'ont adopté dans les années qui ont suivi.

### Contourner la censure

Dans les pays où l'accès à Internet est filtré ou surveillé, Tor sert avant tout d'outil de contournement. Certains régimes bloquent ou limitent fortement l'accès direct au réseau, ce qui a poussé le Tor Project à développer des **ponts** (*bridges*) et des « transports enfichables » — des techniques qui déguisent le trafic Tor en trafic ordinaire pour échapper à la détection automatique par les pare-feux nationaux. Plusieurs médias et services occidentaux, dont la BBC ou le moteur de recherche DuckDuckGo, maintiennent d'ailleurs une version .onion de leur site, spécifiquement pour rester accessibles depuis des pays où leur domaine classique est bloqué.

### La vie privée comme droit, pas comme privilège

Au-delà des cas extrêmes, Tor sert aussi simplement à protéger la vie privée d'internautes ordinaires : victimes de violences conjugales qui cherchent des ressources sans laisser de trace consultable par un conjoint, personnes en contexte familial ou national hostile, chercheurs qui étudient des sujets sensibles, ou tout simplement internautes qui refusent d'être profilés en permanence par les régies publicitaires. La vie privée est reconnue comme un droit fondamental par plusieurs textes internationaux, et des organisations de défense des libertés numériques — l'Electronic Frontier Foundation ou, en France, La Quadrature du Net — défendent Tor à ce titre, comme une infrastructure de protection au même titre que le chiffrement de bout en bout des messageries.

### Un outil aussi utilisé par les autorités elles-mêmes

Signe que le réseau n'est pas réservé à une communauté marginale : les forces de l'ordre et les agences de renseignement l'utilisent couramment, pour des enquêtes sous couverture qui nécessitent de masquer l'origine institutionnelle d'une connexion, ou pour des communications sensibles. C'est d'ailleurs cette utilisation gouvernementale historique qui explique en partie pourquoi Tor continue de bénéficier de financements publics américains, malgré son usage aussi par des populations que ces mêmes gouvernements cherchent parfois à surveiller.

## Usages illégaux

Il serait malhonnête de nier l'autre versant : le darkweb héberge aussi une économie illégale bien réelle. Sur les marchés qui ont succédé à Silk Road, on retrouve, selon les enquêtes de police et les rapports d'organismes spécialisés, des catégories de produits et services qui reviennent régulièrement : stupéfiants, données personnelles volées (identifiants bancaires, bases de données piratées), faux documents, ou outils de piratage. Ce n'est pas l'objet de cet article de dresser un inventaire détaillé, ni de donner la moindre indication sur la façon d'y accéder — l'idée est de comprendre le phénomène, pas de le cartographier.

### Une attention médiatique disproportionnée par rapport à la réalité du trafic

Ce qu'il faut comprendre, en revanche, c'est le décalage entre l'attention médiatique portée à ces marchés et leur poids réel dans l'usage global du réseau Tor. Les affaires du type Silk Road font une excellente histoire : anonymat, cryptomonnaie, traque policière, procès spectaculaire. Elles se prêtent bien au récit journalistique et à la fiction. Mais ce récit occulte un fait établi par plusieurs études indépendantes sur le trafic Tor : la très large majorité des connexions au réseau ne servent pas à accéder à des services onion, licites ou non — elles servent à naviguer, de façon anonyme, sur le web ordinaire. Une étude académique de référence sur la mesure du trafic Tor a ainsi montré que l'immense majorité des circuits établis sur le réseau ressortent vers le web classique ; seule une fraction à un chiffre, en pourcentage, du trafic total transite par des services onion — illégaux ou non.

Autrement dit : la personne qui utilise Tor un jour donné ne consulte, la plupart du temps, aucun marché noir. Elle lit la presse, échappe à un pare-feu d'entreprise ou national, ou navigue simplement sans être pistée. Les marchés noirs existent, ils causent un préjudice réel, mais ils ne représentent qu'une fraction marginale d'un trafic très majoritairement banal.

## Mythes vs réalité

Quelques idées reçues méritent d'être démontées une par une.

**« Se rendre sur le darkweb, c'est illégal. »** Faux, dans l'immense majorité des pays occidentaux, dont la France. Installer et utiliser le Tor Browser n'est pas un acte illégal en soi — c'est l'usage qu'on en fait, comme pour n'importe quel outil, qui peut l'être. Consulter un contenu illégal reste illégal, quel que soit le réseau emprunté pour y accéder. Dans certains pays autoritaires, en revanche, l'usage de Tor lui-même est restreint, voire risqué sur le plan pénal — la distinction entre « outil » et « contenu » varie selon les juridictions.

**« On se fait pirater dès qu'on s'y connecte. »** Très exagéré. Le simple fait d'ouvrir le Tor Browser et de naviguer, sans télécharger de fichier ni interagir avec un site malveillant, n'expose pas automatiquement à une compromission. Les vrais risques, détaillés plus bas, viennent de comportements précis — ouvrir un exécutable inconnu, par exemple — pas de la connexion au réseau en tant que telle.

**« Le darkweb est immense, bien plus grand que le web normal. »** L'un des mythes les plus tenaces, et il repose justement sur la confusion évoquée en introduction entre deep web et darkweb. Le web profond — mails, comptes bancaires, bases de données privées — est effectivement gigantesque, sans doute plusieurs fois plus volumineux que le web indexé. Mais le darkweb à proprement parler, la portion accessible uniquement via des réseaux comme Tor, reste d'un ordre de grandeur bien inférieur : selon les méthodes de comptage — les estimations varient sensiblement d'une étude à l'autre, faute de recensement centralisé possible — le nombre d'adresses .onion actives reste marginal comparé aux centaines de millions de sites indexés sur le web classique. Beaucoup de ces adresses, en outre, ne correspondent pas à des « sites » au sens où on l'entend habituellement, mais à des services techniques, souvent éphémères.

**« Tout ce qu'on y trouve est glauque ou criminel. »** Faux, comme vu plus haut : forums de discussion, miroirs de médias, bibliothèques militantes, outils de messagerie chiffrée, versions .onion de services grand public existent aussi, et représentent une part significative des services onion actifs.

## Risques concrets pour un internaute curieux

### Risques techniques

Le darkweb n'a pas de cadenas rassurant ni de certification centralisée du sérieux d'un site. N'importe qui peut créer une copie visuellement identique d'un service connu — une technique de phishing particulièrement efficace ici, puisque les adresses .onion sont illisibles et impossibles à vérifier à l'œil nu. Les faux sites, les arnaques qui encaissent un paiement sans jamais livrer, et les fichiers piégés — des exécutables déguisés en documents — sont des risques bien plus fréquents, au quotidien, que le fantasme du « piratage instantané ».

### Risques légaux

Dans la plupart des démocraties occidentales — France, Union européenne, Amérique du Nord — utiliser Tor et naviguer sur le darkweb n'est pas illégal en tant que tel. Ce qui reste illégal, c'est ce qu'on y fait : acheter un produit prohibé, consulter ou diffuser certains contenus, ou toute activité déjà répréhensible sur le web classique. La nuance est essentielle, et souvent perdue dans les discours anxiogènes.

### Le faux sentiment d'anonymat

C'est sans doute le risque le plus sous-estimé. Tor protège efficacement contre l'analyse du trafic réseau — savoir qui parle à qui — mais il ne protège pas contre les erreurs de configuration ou de comportement de l'utilisateur. Se connecter, via Tor, à son propre compte de messagerie personnel annule une bonne partie de l'anonymat recherché : le service de destination sait alors exactement qui vous êtes, quel que soit le chemin emprunté pour y arriver. Activer JavaScript dans le navigateur, agrandir la fenêtre à une taille inhabituelle, ou installer des extensions tierces créent des signatures techniques — on parle d'**empreinte numérique**, ou *fingerprinting* — qui peuvent, combinées, permettre de distinguer un utilisateur d'un autre, même sans connaître son adresse IP.

Des cas de désanonymisation existent, y compris médiatisés : à l'occasion du démantèlement d'un site pédopornographique en 2015, le FBI a exploité une faille du navigateur pour identifier une partie de ses visiteurs. La preuve que l'anonymat de Tor, bien réel dans son principe, n'est pas absolu face à un adversaire suffisamment déterminé et disposant des moyens techniques adéquats.

> **🔒 À retenir : bonnes pratiques minimales**
>
> - Téléchargez le Tor Browser uniquement depuis le site officiel du Tor Project — jamais depuis un lien tiers.
> - Ne redimensionnez pas la fenêtre du navigateur : la taille par défaut fait partie des protections contre le fingerprinting.
> - Laissez JavaScript désactivé ou en mode restrictif (curseur de sécurité sur « Plus sûr » ou « Le plus sûr » dans les réglages du navigateur).
> - N'ouvrez jamais un fichier téléchargé pendant que vous êtes connecté à Tor, et surtout pas un exécutable.
> - Ne saisissez aucune information permettant de vous identifier : email personnel, identifiants habituels, numéro de téléphone.
> - Gardez le navigateur à jour — les correctifs de sécurité comblent des failles parfois exploitées activement.
> - Pour une exploration occasionnelle, le Tor Browser seul suffit. Pour un usage exigeant en confidentialité, des systèmes comme Tails — un système d'exploitation autonome et amnésique, qui ne laisse aucune trace sur la machine utilisée — offrent une protection plus poussée.

## Comment ça fonctionne concrètement si on veut explorer par curiosité

### Le Tor Browser, en pratique

Techniquement, le Tor Browser est une version modifiée de Firefox, préconfigurée pour acheminer tout le trafic par le réseau Tor et pour limiter au maximum les techniques de pistage. Il se télécharge gratuitement depuis le site officiel du Tor Project, existe pour Windows, macOS, Linux et Android, et ne nécessite aucune compétence technique particulière pour être installé. Une fois lancé, il propose un curseur de sécurité à trois niveaux — Standard, Plus sûr, Le plus sûr — qui désactive progressivement des fonctionnalités (JavaScript, certains formats de police, certaines vidéos) au profit de la sécurité. Pour une simple exploration curieuse, régler ce curseur sur « Plus sûr » est un compromis raisonnable entre confort de navigation et réduction de la surface d'attaque.

### VPN avant Tor : utile, mais pas magique

Certains utilisateurs ajoutent un VPN avant de se connecter à Tor, pour que leur fournisseur d'accès Internet ne puisse même pas voir qu'ils utilisent ce réseau. C'est une précaution légitime dans les pays où l'usage de Tor attire l'attention, mais elle a une contrepartie : elle déplace la question de la confiance vers le fournisseur de VPN, qui devient alors le seul acteur à savoir que vous utilisez Tor. Ce n'est ni indispensable, ni inutile — c'est un arbitrage à faire en fonction de son propre modèle de menace, pas une case à cocher automatiquement.

### Où mettre les pieds : privilégier les points d'entrée reconnus

La grande majorité des annuaires informels de liens .onion — « wikis cachés » et autres listes non vérifiées — mélangent sans distinction contenus légitimes, sites morts depuis des années, et arnaques pures. Pour une découverte raisonnable du sujet, mieux vaut partir de sources publiques et vérifiables : le site officiel du Tor Project, des articles publiés par des rédactions spécialisées en sécurité numérique, ou les versions .onion officiellement annoncées par des organisations reconnues — médias, ONG de défense des libertés numériques. Ces points d'entrée ont l'avantage d'être documentés, stables, et suffisamment ennuyeux pour ne présenter aucun intérêt criminel — ce qui, pour une première exploration, est plutôt une qualité.

Cet article ne fournit volontairement aucun lien direct ni aucune liste de sites .onion : la logique même du réseau veut que ces adresses circulent par des canaux vérifiés, pas via un article de blog.

## Conclusion

Le darkweb n'est ni un enfer numérique ni un eldorado de la liberté absolue. C'est une infrastructure — un ensemble de protocoles et de logiciels — qui hérite de son usage, pas d'une nature intrinsèque. Le même chiffrement en couches qui protège un lanceur d'alerte protège aussi un vendeur de produits illégaux. Cette dualité n'est pas propre à Tor : elle concerne tout outil de chiffrement fort, du protocole HTTPS qui sécurise les achats en ligne à la messagerie chiffrée de bout en bout que beaucoup utilisent déjà sans y penser.

Ce qui rend le sujet intéressant aujourd'hui dépasse largement le folklore des marchés noirs. À mesure que la collecte de données comportementales devient le modèle économique par défaut d'une grande partie d'Internet — ce qu'on appelle parfois le capitalisme de surveillance —, les outils qui redonnent un contrôle, même partiel, sur sa propre trace numérique méritent d'être compris pour ce qu'ils sont, plutôt que caricaturés. Comprendre le darkweb, ce n'est pas se préparer à y faire quoi que ce soit d'illégal. C'est simplement mieux saisir les briques techniques qui, assemblées différemment, façonnent aussi bien la surveillance de masse que les moyens d'y échapper.
