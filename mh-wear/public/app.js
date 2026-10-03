// MH WEAR — affiche les articles depuis data/produits.json
// et génère un bouton WhatsApp pré-rempli sous chaque article.

const ICONE_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.96-3.48-.23-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.38 9.38 0 0 1 9.43 9.45c0 5.2-4.24 9.43-9.45 9.43m8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.79.7.69 5.8.69 12.06c0 2 .52 3.96 1.52 5.68L.6 23.6l6-1.57a11.33 11.33 0 0 0 5.43 1.38h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.03-1.18-5.89-3.33-8.03"/></svg>';

let tousLesProduits = [];
let site = {};

function nettoyerNumero(num) {
  // wa.me attend le numéro au format international, chiffres uniquement (ex : 221771234567)
  return String(num || "").replace(/\D/g, "");
}

function lienWhatsApp(produit) {
  const numero = nettoyerNumero(site.whatsapp);
  const urlImage = produit.image ? new URL(produit.image, location.origin).href : "";
  const lignes = [
    `Bonjour MH WEAR 👋`,
    `Je souhaite acheter : *${produit.nom}*`,
    produit.prix ? `Prix : ${produit.prix}` : "",
    produit.tailles ? `Taille souhaitée : ` : "",
    urlImage ? `Photo : ${urlImage}` : "",
  ].filter(Boolean);
  return `https://wa.me/${numero}?text=${encodeURIComponent(lignes.join("\n"))}`;
}

function echapper(texte) {
  const div = document.createElement("div");
  div.textContent = texte ?? "";
  return div.innerHTML;
}

function carteProduit(p) {
  const epuise = p.epuise === true;
  const badge = epuise
    ? '<span class="badge epuise">Épuisé</span>'
    : p.nouveau ? '<span class="badge">Nouveau</span>' : "";

  return `
    <article class="card">
      <div class="card-img">
        <img src="${echapper(p.image)}" alt="${echapper(p.nom)}" loading="lazy">
        ${badge}
      </div>
      <div class="card-body">
        <h2 class="card-nom">${echapper(p.nom)}</h2>
        ${p.description ? `<p class="card-desc">${echapper(p.description)}</p>` : ""}
        <div class="card-meta">
          <span class="card-prix">${echapper(p.prix)}</span>
          ${p.tailles ? `<span class="card-tailles">${echapper(p.tailles)}</span>` : ""}
        </div>
        <a class="btn-wa${epuise ? " desactive" : ""}" href="${epuise ? "#" : lienWhatsApp(p)}"
           target="_blank" rel="noopener">
          ${ICONE_WA}<span>${epuise ? "Épuisé" : "Commander sur WhatsApp"}</span>
        </a>
      </div>
    </article>`;
}

function afficher(categorie) {
  const grille = document.getElementById("grille");
  const liste = categorie === "Tout"
    ? tousLesProduits
    : tousLesProduits.filter(p => p.categorie === categorie);

  grille.innerHTML = liste.length
    ? liste.map(carteProduit).join("")
    : '<p class="vide">Aucun article dans cette catégorie pour le moment.</p>';

  document.querySelectorAll("#filtres button").forEach(b =>
    b.classList.toggle("actif", b.dataset.cat === categorie));
}

function construireFiltres() {
  const cats = [...new Set(tousLesProduits.map(p => p.categorie).filter(Boolean))];
  const nav = document.getElementById("filtres");
  if (cats.length < 2) { nav.remove(); return; }
  nav.innerHTML = ["Tout", ...cats]
    .map(c => `<button type="button" data-cat="${echapper(c)}">${echapper(c)}</button>`)
    .join("");
  nav.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (btn) afficher(btn.dataset.cat);
  });
}

async function demarrer() {
  document.getElementById("annee").textContent = new Date().getFullYear();
  try {
    const [rSite, rProduits] = await Promise.all([
      fetch("data/site.json", { cache: "no-cache" }),
      fetch("data/produits.json", { cache: "no-cache" }),
    ]);
    site = await rSite.json();
    tousLesProduits = (await rProduits.json()).filter(p => p && p.nom);

    if (site.slogan) document.getElementById("slogan").textContent = site.slogan;
    document.getElementById("contact-top").href =
      `https://wa.me/${nettoyerNumero(site.whatsapp)}?text=${encodeURIComponent("Bonjour MH WEAR 👋")}`;

    construireFiltres();
    afficher("Tout");
  } catch (err) {
    console.error(err);
    document.getElementById("grille").innerHTML =
      '<p class="vide">Impossible de charger les articles. Réessayez plus tard.</p>';
  }
}

demarrer();
