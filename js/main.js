// alert("JS LOADED");



(function sortArtists() {
    const section = document.querySelector("#musiclinks");
    if (!section) return;

    const artists = [];

    const h3s = section.querySelectorAll("h3");

    h3s.forEach(h3 => {
        const ul = h3.nextElementSibling;
        if (ul && ul.tagName === "UL") {
            artists.push({ h3, ul });
        }
    });

    artists.sort((a, b) => {
        return a.h3.textContent
            .trim()
            .toLowerCase()
            .localeCompare(
                b.h3.textContent.trim().toLowerCase(),
                "en",
                { sensitivity: "base" }
            );
    });

    artists.forEach(({ h3, ul }) => {
        section.appendChild(h3);
        section.appendChild(ul);
    });

    console.log(
        "SORTED:",
        artists.map(a => a.h3.textContent)
    );
})();










// --------------------
// Sidebar dynamique
// --------------------
document.addEventListener("DOMContentLoaded", function() {
    const sidebarList = document.querySelector(".sidebar.left ul");
    const content = document.querySelector(".content");

    if (!sidebarList || !content) return;

    sidebarList.innerHTML = "";

    const h2s = content.querySelectorAll("h2");

    h2s.forEach(h2 => {
        if (!h2.id) {
            h2.id = h2.textContent.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
        }

        const liH2 = document.createElement("li");
        const aH2 = document.createElement("a");
        aH2.href = `#${h2.id}`;
        aH2.textContent = h2.textContent;
        liH2.appendChild(aH2);
        sidebarList.appendChild(liH2);

        let sibling = h2.nextElementSibling;
        while (sibling && sibling.tagName !== "H2") {
            if (sibling.tagName === "H3") {
                if (!sibling.id) {
                    sibling.id = sibling.textContent.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
                }
                const liH3 = document.createElement("li");
                liH3.style.paddingLeft = "1em";
                const aH3 = document.createElement("a");
                aH3.href = `#${sibling.id}`;
                aH3.textContent = sibling.textContent;
                liH3.appendChild(aH3);
                sidebarList.appendChild(liH3);
            }
            sibling = sibling.nextElementSibling;
        }
    });
});

// --------------------
// Collapsible sections (H2 et contenu)
// --------------------
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("main.content h2");

    sections.forEach(h2 => {
        const toggle = document.createElement('span');
        toggle.textContent = '−';
        toggle.style.cursor = 'pointer';
        toggle.style.marginRight = '8px';
        toggle.style.userSelect = 'none';
        h2.prepend(toggle);

        toggle.addEventListener('click', () => {
            let next = h2.nextElementSibling;
            const isCollapsed = toggle.textContent === '+';
            toggle.textContent = isCollapsed ? '−' : '+';

            while(next && next.tagName !== 'H2') {
                if (isCollapsed) {
                    next.style.display = '';
                } else {
                    next.style.display = 'none';
                }
                next = next.nextElementSibling;
            }
        });
    });
});

// --------------------
// Smooth scroll + highlight
// --------------------
document.addEventListener("DOMContentLoaded", () => {
    const sidebarLinks = document.querySelectorAll('.sidebar a[href^="#"]');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetEl = document.getElementById(targetId);

            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                targetEl.classList.add('highlighted');
                setTimeout(() => targetEl.classList.remove('highlighted'), 1500);
            }
        });
    });
});

// --------------------
// Mini-search interne
// --------------------
document.addEventListener("DOMContentLoaded", () => {

    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'search-toggle';
    toggleBtn.innerHTML = '🔍';
    document.body.appendChild(toggleBtn);

    const searchInput = document.createElement('input');
    searchInput.id = 'mini-search';
    searchInput.placeholder = 'Search in page...';
    document.body.appendChild(searchInput);

    toggleBtn.addEventListener('click', () => {
        if (searchInput.style.display === 'none' || searchInput.style.display === '') {
            searchInput.style.display = 'block';
            searchInput.focus();
        } else {
            searchInput.style.display = 'none';
            searchInput.value = '';
            document.querySelectorAll('main.content h2, main.content h3, main.content p').forEach(el => {
                el.style.display = '';
                el.classList.remove('search-match');
            });
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const content = document.querySelectorAll('main.content h2, main.content h3, main.content p');

        content.forEach(el => {
            if (el.textContent.toLowerCase().includes(query) && query !== '') {
                el.classList.add('search-match');
                el.style.display = 'block';
            } else if (query === '') {
                el.classList.remove('search-match');
                el.style.display = '';
            } else {
                el.classList.remove('search-match');
                el.style.display = 'none';
            }
        });
    });
});







